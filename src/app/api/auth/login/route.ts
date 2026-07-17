import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { setAuthCookie } from "@/lib/auth-cookie";
import { errorResponse } from "@/lib/route-helpers";
import type { AuthResponse, LoginRequest } from "@/types/weather";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginRequest;

  try {
    const auth = await backendFetch<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body,
    });

    const response = NextResponse.json({ email: body.email });
    setAuthCookie(response, auth);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
