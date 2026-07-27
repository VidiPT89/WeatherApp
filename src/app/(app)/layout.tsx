import { NavBar } from "@/components/layout/NavBar";
import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { UserResponse } from "@/types/weather";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = await getToken();
  const me = token ? await backendFetch<UserResponse>("/api/v1/user/me", { token }).catch(() => null) : null;

  return (
    <div className="flex flex-1 flex-col">
      <NavBar isAdmin={me?.role === "admin"} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
