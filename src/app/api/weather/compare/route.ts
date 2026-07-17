import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { CompareResponse } from "@/types/weather";

export async function GET(request: NextRequest) {
  return withAuth(async (token) => {
    const data = await backendFetch<CompareResponse>("/api/v1/weather/compare", {
      token,
      searchParams: {
        city: request.nextUrl.searchParams.get("city") ?? undefined,
        units: request.nextUrl.searchParams.get("units") ?? undefined,
      },
    });
    return NextResponse.json(data);
  });
}
