import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "cm_session";

const protectedRoutes = [
  "/dashboard",
  "/certificates",
  "/documents",
  "/templates",
  "/settings",
  "/subscription",
  "/help",
];

const adminRoutes = ["/admin"];

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "dev-secret-key-min-32-characters-long";
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected && !isAdmin) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      const session = await verifyToken(token);
      if (session) {
        const dest =
          session.role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyToken(token);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  if (isAdmin && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/certificates/:path*",
    "/documents/:path*",
    "/templates/:path*",
    "/settings/:path*",
    "/subscription/:path*",
    "/help/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
