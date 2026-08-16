import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { logAdminAction } from "@/lib/subscription/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const formattedPlans = plans.map((p) => ({
    ...p,
    features: typeof p.features === "string" ? JSON.parse(p.features || "[]") : p.features,
  }));

  return NextResponse.json({ plans: formattedPlans });
}

const planSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  interval: z.enum(["MONTHLY", "YEARLY"]),
  price: z.number().min(0),
  currency: z.string().default("PKR"),
  deviceLimit: z.number().min(1).default(1),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = planSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const planData = {
      ...parsed.data,
      features: JSON.stringify(parsed.data.features || []),
    };

    const plan = await prisma.plan.create({ data: planData });

    await logAdminAction(auth.user.id, null, "plan.create", plan.id);

    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create plan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const updateSchema = planSchema.partial().extend({ id: z.string() });

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { id, features, ...data } = parsed.data;
    const updateData = {
      ...data,
      ...(features ? { features: JSON.stringify(features) } : {}),
    };
    const plan = await prisma.plan.update({ where: { id }, data: updateData });

    await logAdminAction(auth.user.id, null, "plan.update", plan.id);

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update plan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
