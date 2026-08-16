import { NextResponse } from "next/server";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const [
    totalCustomers,
    activeSubscriptions,
    expiredSubscriptions,
    monthlySubscribers,
    yearlySubscribers,
    recentLogs,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.EXPIRED } }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        plan: { interval: "MONTHLY" },
      },
    }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        plan: { interval: "YEARLY" },
      },
    }),
    prisma.adminLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        admin: { select: { email: true } },
        target: { select: { email: true } },
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalCustomers,
      activeSubscriptions,
      expiredSubscriptions,
      monthlySubscribers,
      yearlySubscribers,
    },
    logs: recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      adminEmail: log.admin.email,
      targetEmail: log.target?.email ?? null,
      createdAt: log.createdAt.toISOString(),
    })),
  });
}
