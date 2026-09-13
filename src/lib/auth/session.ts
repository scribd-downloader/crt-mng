import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";

const AUTH_COOKIE = "cm_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
}

function getSecret(): Uint8Array {
  const rawSecret = process.env.AUTH_SECRET?.replace(/^["']|["']$/g, "").trim();
  if (!rawSecret || rawSecret.length < 32) {
    return new TextEncoder().encode("default-fallback-auth-secret-min-32-chars-key");
  }
  return new TextEncoder().encode(rawSecret);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });
  } catch {
    // Bypassed if headers are immutable in route handler
  }
}

export function attachSessionCookie(response: any, token: string): any {
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
  return response;
}

export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
  } catch {
    // Bypassed if headers are immutable
  }
}

export function attachClearSessionCookie(response: any): any {
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { AUTH_COOKIE };
