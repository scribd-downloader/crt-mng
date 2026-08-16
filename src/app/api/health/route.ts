import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ensureDatabaseSeeded } from "@/lib/db/seed-helper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const dbUrlConfigured = !!process.env.DATABASE_URL;

  if (!dbUrlConfigured) {
    return NextResponse.json(
      {
        status: "error",
        error: "DATABASE_URL environment variable is missing",
        instructions:
          "Please add DATABASE_URL (PostgreSQL connection string) to your Vercel Project Settings under Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  try {
    // Attempt database query
    const userCount = await prisma.user.count();

    // Trigger seed if missing
    await ensureDatabaseSeeded();

    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { email: true, createdAt: true },
    });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      totalUsers: userCount,
      adminConfigured: !!adminUser,
      adminEmail: adminUser?.email || process.env.ADMIN_EMAIL || "admin@certificatemanager.local",
      message: "Database and Auth system are fully operational.",
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isTableMissing = errorMsg.includes("does not exist") || error?.code === "P2021";

    return NextResponse.json(
      {
        status: "error",
        error: "Database Connection / Migration Issue",
        details: errorMsg,
        instructions: isTableMissing
          ? "Database tables have not been created yet in PostgreSQL. Redeploying on Vercel with the updated build command will automatically create tables via 'prisma db push'."
          : "Please check your DATABASE_URL in Vercel settings and ensure SSL mode is enabled (e.g. ?sslmode=require).",
      },
      { status: 500 }
    );
  }
}
