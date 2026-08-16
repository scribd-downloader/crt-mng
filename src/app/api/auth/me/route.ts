import { NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth/guards";
import { getSubscriptionStatus } from "@/lib/subscription/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth;

    const subscription = await getSubscriptionStatus(auth.user.id);

    return NextResponse.json({
      user: {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        role: auth.user.role,
      },
      subscription,
    });
  } catch (error: any) {
    const message = error?.message || String(error) || "Failed to fetch user session";
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Failed to fetch session", message }, { status: 500 });
  }
}
