import { redirect } from "next/navigation";
import { AdminView } from "@/components/admin/AdminView";
import { backendFetch, getCurrentUser } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { UserResponse } from "@/types/weather";

export default async function AdminPage() {
  const token = await getToken();
  if (!token) redirect("/login");

  const me = await getCurrentUser(token);
  if (!me || me.role !== "admin") redirect("/dashboard");

  let users: UserResponse[] = [];
  let loadError = false;
  try {
    users = await backendFetch<UserResponse[]>("/api/v1/admin/users", { token });
  } catch {
    loadError = true;
  }

  return <AdminView initialUsers={users} currentUserId={me.id} initialLoadError={loadError} />;
}
