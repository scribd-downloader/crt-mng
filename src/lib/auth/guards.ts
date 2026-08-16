import { NextResponse } from "next/server";
import { User, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession, SessionPayload } from "@/lib/auth/session";

export type AuthContext = {
  session: SessionPayload;
  user: User;
};

export function isAuthError(
  result: AuthContext | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}

export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { session, user };
}

export async function requireAdmin(): Promise<AuthContext | NextResponse> {
  const result = await requireAuth();
  if (isAuthError(result)) return result;

  if (result.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return result;
}
