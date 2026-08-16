import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { ensureDatabaseSeeded } from "@/lib/db/seed-helper";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().min(1).optional(),
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
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError =
        fieldErrors.password?.[0] ||
        fieldErrors.email?.[0] ||
        fieldErrors.name?.[0] ||
        "Validation failed";

      return NextResponse.json(
        { error: firstError, details: fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
  } catch (error: any) {
    const message = error?.message || String(error) || "Unknown registration error";
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", message },
      { status: 500 }
    );
  }
}
