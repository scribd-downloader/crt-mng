import { NextResponse } from "next/server";
import { attachClearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  return attachClearSessionCookie(response);
}
