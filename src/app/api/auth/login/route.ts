import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, sanitizeErrorMessage } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, attachSessionCookie } from "@/lib/auth/session";
import { ensureDatabaseSeeded } from "@/lib/db/seed-helper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function POST(request: NextRequest) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    const isCloudServerless = !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_EXECUTION_ENV);
    if (!dbUrl || (isCloudServerless && (dbUrl.includes("localhost") || dbUrl.startsWith("file:")))) {
      return NextResponse.json(
        {
          error: "Database configuration error",
          message:
            "DATABASE_URL is missing or set to localhost/file on Vercel/Netlify. Please configure your PostgreSQL connection string in your platform Settings -> Environment Variables.",
        },
        { status: 500 }
      );
    }

    try {
      await ensureDatabaseSeeded();
    } catch (seedErr) {
      console.warn("Auto-seed notice during login:", seedErr);
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    return attachSessionCookie(response, token);
  } catch (error: any) {
    const message = sanitizeErrorMessage(error);
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed", message },
      { status: 500 }
    );
  }
}

