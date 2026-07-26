import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { WeatherResponse } from "@/types/weather";

export async function GET(request: NextRequest) {
  return withAuth(async (token) => {
    const data = await backendFetch<WeatherResponse>("/api/v1/weather/nearby", {
      token,
      searchParams: {
        lat: request.nextUrl.searchParams.get("lat") ?? undefined,
        lon: request.nextUrl.searchParams.get("lon") ?? undefined,
        units: request.nextUrl.searchParams.get("units") ?? undefined,
      },
    });
    return NextResponse.json(data);
  });
}
