import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import {
  signLicense,
  getLicenseValidityHours,
} from "@/lib/license/server";
import { getSubscriptionStatus } from "@/lib/subscription/service";
import { SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const validateSchema = z.object({
  deviceId: z.string().uuid(),
  deviceName: z.string().optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const status = await getSubscriptionStatus(auth.user.id);
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const { deviceId, deviceName } = parsed.data;
    const status = await getSubscriptionStatus(auth.user.id);

    if (!status.active || status.status !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        {
          error: "Subscription inactive or expired",
          active: false,
          status: status.status,
          plan: status.plan,
          expiresAt: status.expiresAt,
          daysRemaining: status.daysRemaining,
          reason: "SUBSCRIPTION_INACTIVE",
        },
        { status: 403 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: auth.user.id },
      include: { plan: true },
    });

    if (!subscription?.expiryDate) {
      return NextResponse.json(
        { error: "No subscription record found", active: false, status: "PENDING", reason: "NO_SUBSCRIPTION" },
        { status: 403 }
      );
    }

    const existingLicenses = await prisma.license.findMany({
      where: { userId: auth.user.id, isActive: true },
    });

    const deviceExists = existingLicenses.some((l) => l.deviceId === deviceId);

    if (!deviceExists && existingLicenses.length >= subscription.deviceLimit) {
      return NextResponse.json(
        {
          error: "Device limit reached for this account. Contact administrator to reset device licenses.",
          active: false,
          status: "DEVICE_LIMIT_REACHED",
          reason: "DEVICE_LIMIT_EXCEEDED",
          plan: subscription.plan.slug,
          expiresAt: subscription.expiryDate.toISOString(),
          daysRemaining: status.daysRemaining,
        },
        { status: 403 }
      );
    }

    await prisma.license.upsert({
      where: {
        userId_deviceId: { userId: auth.user.id, deviceId },
      },
      create: {
        userId: auth.user.id,
        deviceId,
        deviceName: deviceName ?? null,
        lastValidated: new Date(),
      },
      update: {
        deviceName: deviceName ?? undefined,
        lastValidated: new Date(),
        isActive: true,
      },
    });

    const validityHours = getLicenseValidityHours();
    const licenseExpiry = new Date();
    licenseExpiry.setHours(licenseExpiry.getHours() + validityHours);

    const token = await signLicense({
      userId: auth.user.id,
      plan: subscription.plan.slug,
      subscriptionExpiry: subscription.expiryDate.toISOString(),
      licenseExpiry: licenseExpiry.toISOString(),
      deviceId,
      issuedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      token,
      active: true,
      plan: subscription.plan.slug,
      expiresAt: subscription.expiryDate.toISOString(),
      daysRemaining: status.daysRemaining,
      status: status.status,
      offlineGraceDays: status.offlineGraceDays,
      licenseExpiry: licenseExpiry.toISOString(),
    });
  } catch (error) {
    console.error("License validation error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ error: "License validation failed" }, { status: 500 });
  }
}
