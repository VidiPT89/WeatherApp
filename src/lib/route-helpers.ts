import { NextRequest, NextResponse } from "next/server";
import { BackendApiError } from "@/lib/backend-client";
import { getToken } from "@/lib/session";

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof BackendApiError) {
    return NextResponse.json({ message: error.message, errorCode: error.errorCode }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ message: "Unexpected error", errorCode: "INTERNAL_ERROR" }, { status: 500 });
}

export async function withAuth(
  handler: (token: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    return await handler(token);
  } catch (error) {
    return errorResponse(error);
  }
}

export function searchParamsOf(request: NextRequest): URLSearchParams {
  return request.nextUrl.searchParams;
}
