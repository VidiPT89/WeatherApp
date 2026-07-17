import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { SearchHistoryResponse } from "@/types/weather";

export async function GET() {
  return withAuth(async (token) => {
    const data = await backendFetch<SearchHistoryResponse[]>("/api/v1/weather/history", { token });
    return NextResponse.json(data);
  });
}
