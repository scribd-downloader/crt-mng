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

  const settings = await prisma.appSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({
    settings: settings ?? {
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
      offlineGraceDays: 7,
      licenseValidityHours: 168,
    },
  });
}

const settingsSchema = z.object({
  appName: z.string().optional(),
  whatsappNumber: z.string().optional(),
  offlineGraceDays: z.number().min(1).max(30).optional(),
  licenseValidityHours: z.number().min(24).max(720).optional(),
});

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const settings = await prisma.appSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        appName: parsed.data.appName ?? "Certificate Manager",
        whatsappNumber: parsed.data.whatsappNumber ?? "",
        offlineGraceDays: parsed.data.offlineGraceDays ?? 7,
        licenseValidityHours: parsed.data.licenseValidityHours ?? 168,
      },
      update: parsed.data,
    });

    await logAdminAction(auth.user.id, null, "settings.update");

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
