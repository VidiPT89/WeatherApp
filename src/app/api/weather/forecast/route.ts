import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withOptionalAuth } from "@/lib/route-helpers";
import type { ForecastWeatherResponse } from "@/types/weather";

export async function GET(request: NextRequest) {
  return withOptionalAuth(async (token) => {
    const data = await backendFetch<ForecastWeatherResponse>("/api/v1/weather/forecast", {
      token,
      searchParams: {
        city: request.nextUrl.searchParams.get("city") ?? undefined,
        units: request.nextUrl.searchParams.get("units") ?? undefined,
      },
    });
    return NextResponse.json(data);
  });
}
