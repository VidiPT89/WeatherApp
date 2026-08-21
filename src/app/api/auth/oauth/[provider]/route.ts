import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { setAuthCookie } from "@/lib/auth-cookie";
import { errorResponse } from "@/lib/route-helpers";
import type { AuthResponse } from "@/types/weather";

/**
 * One dynamic route for all three providers -- the client already obtained the ID token
 * natively (Google Identity Services / Sign in with Apple JS / MSAL.js), this only forwards it
 * to the backend for verification and sets the same session cookies `login`/`register` do.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider } = await params;
    const body = (await request.json()) as { idToken: string };

    const auth = await backendFetch<AuthResponse>(`/api/v1/auth/oauth/${provider}`, {
      method: "POST",
      body,
    });

    const response = NextResponse.json({ ok: true });
    setAuthCookie(response, auth);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
