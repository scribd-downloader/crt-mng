import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { ensureDatabaseSeeded } from "@/lib/db/seed-helper";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || (process.env.VERCEL && dbUrl.includes("localhost"))) {
      return NextResponse.json(
        {
          error: "Database configuration error",
          message:
            "DATABASE_URL is missing or set to localhost on Vercel. Please configure your PostgreSQL connection string in Vercel Settings -> Environment Variables.",
        },
        { status: 500 }
      );
    }

    await ensureDatabaseSeeded();

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

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    const message = error?.message || String(error) || "Unknown login error";
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed", message },
      { status: 500 }
    );
  }
}
