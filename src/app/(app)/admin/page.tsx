import { redirect } from "next/navigation";
import { AdminView } from "@/components/admin/AdminView";
import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { UserResponse } from "@/types/weather";

export default async function AdminPage() {
  const token = await getToken();
  if (!token) redirect("/login");

  const me = await backendFetch<UserResponse>("/api/v1/user/me", { token }).catch(() => null);
  if (!me || me.role !== "admin") redirect("/dashboard");

  const users = await backendFetch<UserResponse[]>("/api/v1/admin/users", { token }).catch(() => []);

  return <AdminView initialUsers={users} currentUserId={me.id} />;
}
