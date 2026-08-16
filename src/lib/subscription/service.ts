import {
  PlanInterval,
  SubscriptionStatus,
  User,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  getOfflineGraceDays,
} from "@/lib/license/server";

export interface SubscriptionStatusResult {
  active: boolean;
  plan: string;
  expiresAt: string | null;
  daysRemaining: number;
  status: SubscriptionStatus;
  offlineGraceDays: number;
}

export function calculateExpiry(
  startDate: Date,
  interval: PlanInterval,
  options?: { months?: number; years?: number }
): Date {
  const expiry = new Date(startDate);

  if (options?.months) {
    expiry.setMonth(expiry.getMonth() + options.months);
  } else if (options?.years) {
    expiry.setFullYear(expiry.getFullYear() + options.years);
  } else if (interval === PlanInterval.MONTHLY) {
    expiry.setMonth(expiry.getMonth() + 1);
  } else {
    expiry.setFullYear(expiry.getFullYear() + 1);
  }

  // Ensure subscription covers the entire final day (23:59:59.999 UTC)
  expiry.setUTCHours(23, 59, 59, 999);
  return expiry;
}

function computeDaysRemaining(expiryDate: Date | null | undefined): number {
  if (!expiryDate) return 0;
  const diff = expiryDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function resolveEffectiveStatus(
  status: SubscriptionStatus,
  expiryDate: Date | null | undefined
): SubscriptionStatus {
  if (
    status === SubscriptionStatus.ACTIVE &&
    expiryDate &&
    expiryDate.getTime() < Date.now()
  ) {
    return SubscriptionStatus.EXPIRED;
  }
  return status;
}

export async function getSubscriptionStatus(
  userId: string
): Promise<SubscriptionStatusResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

  const offlineGraceDays = getOfflineGraceDays();

  if (!subscription) {
    return {
      active: false,
      plan: "",
      expiresAt: null,
      daysRemaining: 0,
      status: SubscriptionStatus.PENDING,
      offlineGraceDays,
    };
  }

  const effectiveStatus = resolveEffectiveStatus(
    subscription.status,
    subscription.expiryDate
  );
  const active = effectiveStatus === SubscriptionStatus.ACTIVE;

  return {
    active,
    plan: subscription.plan.slug,
    expiresAt: subscription.expiryDate?.toISOString() ?? null,
    daysRemaining: computeDaysRemaining(subscription.expiryDate),
    status: effectiveStatus,
    offlineGraceDays,
  };
}

export const getEffectiveSubscription = getSubscriptionStatus;

export async function logAdminAction(
  adminId: string,
  targetId: string | null,
  action: string,
  details?: string
): Promise<void> {
  await prisma.adminLog.create({
    data: { adminId, targetId, action, details },
  });
}

export async function activateSubscription(params: {
  adminId: string;
  user: User;
  planId: string;
  startDate?: Date;
  durationMonths?: number;
  deviceLimit?: number;
  notes?: string;
}) {
  const plan = await prisma.plan.findUnique({
    where: { id: params.planId },
  });

  if (!plan || !plan.isActive) {
    throw new Error("Plan not found or inactive");
  }

  const startDate = params.startDate ?? new Date();
  const expiryDate = calculateExpiry(startDate, plan.interval, {
    months: params.durationMonths,
  });

  const subscription = await prisma.subscription.upsert({
    where: { userId: params.user.id },
    create: {
      userId: params.user.id,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      expiryDate,
      deviceLimit: params.deviceLimit ?? plan.deviceLimit,
      notes: params.notes,
    },
    update: {
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      expiryDate,
      deviceLimit: params.deviceLimit ?? plan.deviceLimit,
      notes: params.notes,
    },
    include: { plan: true },
  });

  await logAdminAction(
    params.adminId,
    params.user.id,
    "subscription.activate",
    JSON.stringify({ planId: plan.id, expiryDate: expiryDate.toISOString() })
  );

  // Post-write verification query from database
  const verified = await prisma.subscription.findUnique({
    where: { userId: params.user.id },
    include: { plan: true },
  });

  if (!verified || verified.status !== SubscriptionStatus.ACTIVE) {
    throw new Error("Failed to verify subscription write to persistent database");
  }

  return verified;
}

export async function extendSubscription(params: {
  adminId: string;
  userId: string;
  months?: number;
  years?: number;
}) {
  if (!params.months && !params.years) {
    throw new Error("Either months or years must be provided");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: params.userId },
    include: { plan: true },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const baseDate =
    subscription.expiryDate && subscription.expiryDate > new Date()
      ? subscription.expiryDate
      : new Date();

  const expiryDate = calculateExpiry(baseDate, subscription.plan.interval, {
    months: params.months,
    years: params.years,
  });

  const updated = await prisma.subscription.update({
    where: { userId: params.userId },
    data: {
      expiryDate,
      status: SubscriptionStatus.ACTIVE,
    },
    include: { plan: true },
  });

  await logAdminAction(
    params.adminId,
    params.userId,
    "subscription.extend",
    JSON.stringify({ expiryDate: expiryDate.toISOString() })
  );

  return updated;
}

export async function updateSubscriptionAction(params: {
  adminId: string;
  userId: string;
  action: "suspend" | "cancel" | "reset";
}) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: params.userId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  let data: {
    status: SubscriptionStatus;
    startDate?: Date | null;
    expiryDate?: Date | null;
  };

  switch (params.action) {
    case "suspend":
      data = { status: SubscriptionStatus.SUSPENDED };
      break;
    case "cancel":
      data = { status: SubscriptionStatus.CANCELLED };
      break;
    case "reset":
      data = {
        status: SubscriptionStatus.PENDING,
        startDate: null,
        expiryDate: null,
      };
      break;
  }

  const updated = await prisma.subscription.update({
    where: { userId: params.userId },
    data,
    include: { plan: true },
  });

  await logAdminAction(
    params.adminId,
    params.userId,
    `subscription.${params.action}`,
    JSON.stringify({ status: data.status })
  );

  return updated;
}
