import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { GeocodingSearchResponse } from "@/types/weather";

export async function GET(request: NextRequest) {
  return withAuth(async (token) => {
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
