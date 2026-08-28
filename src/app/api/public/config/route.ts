import { NextResponse } from "next/server";
import { prisma, sanitizeErrorMessage } from "@/lib/db/prisma";

export async function GET() {
  try {
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
  } catch (error) {
    console.error("Public config error:", error);
    return NextResponse.json({
      plans: [
        {
          id: "monthly-default",
          name: "Monthly Plan",
          slug: "monthly",
          interval: "MONTHLY",
          price: 2000,
          currency: "PKR",
          features: ["All certificate types", "PDF & JPG export", "Print support"],
          deviceLimit: 1,
        },
        {
          id: "yearly-default",
          name: "Yearly Plan",
          slug: "yearly",
          interval: "YEARLY",
          price: 20000,
          currency: "PKR",
          features: ["All certificate types", "PDF & JPG export", "Print support", "2 devices"],
          deviceLimit: 2,
        },
      ],
      appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Certificate Manager",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
      warning: sanitizeErrorMessage(error),
    });
  }
}

