import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withOptionalAuth } from "@/lib/route-helpers";
import type { GeocodingSearchResponse } from "@/types/weather";

export async function GET(request: NextRequest) {
  return withOptionalAuth(async (token) => {
    const data = await backendFetch<GeocodingSearchResponse>("/api/v1/geocoding", {
      token,
      searchParams: {
        query: request.nextUrl.searchParams.get("query") ?? undefined,
        limit: request.nextUrl.searchParams.get("limit") ?? undefined,
      },
    });
    return NextResponse.json(data);
  });
}
