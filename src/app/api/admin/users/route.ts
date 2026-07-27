import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import type { UserResponse } from "@/types/weather";

export async function GET() {
  return withAuth(async (token) => {
    const data = await backendFetch<UserResponse[]>("/api/v1/admin/users", { token });
    return NextResponse.json(data);
  });
}
