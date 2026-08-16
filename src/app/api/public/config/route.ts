import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      interval: true,
      price: true,
      currency: true,
      features: true,
      deviceLimit: true,
    },
  });

  const formattedPlans = plans.map((p) => ({
    ...p,
    features: typeof p.features === "string" ? JSON.parse(p.features || "[]") : p.features,
  }));

  const settings = await prisma.appSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({
    plans: formattedPlans,
    appName: settings?.appName ?? process.env.NEXT_PUBLIC_APP_NAME ?? "Certificate Manager",
    whatsappNumber:
      settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  });
}
