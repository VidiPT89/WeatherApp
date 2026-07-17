import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { UserPreferences } from "@/types/weather";

export async function GET() {
  return withAuth(async (token) => {
    const data = await backendFetch<UserPreferences>("/api/v1/user/preferences", { token });
    return NextResponse.json(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (token) => {
    const body = (await request.json()) as UserPreferences;
    const data = await backendFetch<UserPreferences>("/api/v1/user/preferences", {
      method: "POST",
      token,
      body,
    });
    return NextResponse.json(data);
  });
}
