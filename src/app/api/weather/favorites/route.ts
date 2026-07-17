import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { FavoriteRequest, FavoriteResponse } from "@/types/weather";

export async function GET() {
  return withAuth(async (token) => {
    const data = await backendFetch<FavoriteResponse[]>("/api/v1/weather/favorites", { token });
    return NextResponse.json(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (token) => {
    const body = (await request.json()) as FavoriteRequest;
    const data = await backendFetch<FavoriteResponse>("/api/v1/weather/favorites", {
      method: "POST",
      token,
      body,
    });
    return NextResponse.json(data, { status: 201 });
  });
}
