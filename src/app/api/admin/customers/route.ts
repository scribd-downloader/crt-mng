import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import {
  activateSubscription,
  extendSubscription,
  updateSubscriptionAction,
} from "@/lib/subscription/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      subscription: { include: { plan: true } },
      licenses: { where: { isActive: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      email: c.email,
      name: c.name,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      subscription: c.subscription
        ? {
            id: c.subscription.id,
            status: c.subscription.status,
            plan: c.subscription.plan.name,
            planSlug: c.subscription.plan.slug,
            startDate: c.subscription.startDate?.toISOString() ?? null,
            expiryDate: c.subscription.expiryDate?.toISOString() ?? null,
            deviceLimit: c.subscription.deviceLimit,
            notes: c.subscription.notes,
          }
        : null,
      activeDevices: c.licenses.length,
    })),
  });
}

const activateSchema = z.object({
  email: z.string().email(),
  planId: z.string(),
  startDate: z.string().optional(),
  durationMonths: z.number().optional(),
  deviceLimit: z.number().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = activateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = await activateSubscription({
      adminId: auth.user.id,
      user,
      planId: parsed.data.planId,
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : undefined,
      durationMonths: parsed.data.durationMonths,
      deviceLimit: parsed.data.deviceLimit,
      notes: parsed.data.notes,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        status: subscription.status,
        expiryDate: subscription.expiryDate?.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Activation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const actionSchema = z.object({
  userId: z.string(),
  action: z.enum(["suspend", "cancel", "reset", "extend"]),
  months: z.number().optional(),
  years: z.number().optional(),
});

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { userId, action, months, years } = parsed.data;

    if (action === "extend") {
      const updated = await extendSubscription({
        adminId: auth.user.id,
        userId,
        months,
        years,
      });
      return NextResponse.json({
        success: true,
        expiryDate: updated.expiryDate?.toISOString(),
      });
    }

    if (action === "reset") {
      await prisma.license.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    }

    const updated = await updateSubscriptionAction({
      adminId: auth.user.id,
      userId,
      action,
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
