import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(async (token) => {
    await backendFetch<void>(`/api/v1/admin/users/${id}`, { method: "DELETE", token });
    return new NextResponse(null, { status: 204 });
  });
}
