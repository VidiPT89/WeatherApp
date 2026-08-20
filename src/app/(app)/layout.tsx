import { NavBar } from "@/components/layout/NavBar";
import { getCurrentUser } from "@/lib/backend-client";
import { getToken } from "@/lib/session";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = await getToken();
  const me = token ? await getCurrentUser(token) : null;

  return (
    <div className="flex flex-1 flex-col">
      <NavBar isAdmin={me?.role === "admin"} isLoggedIn={Boolean(token)} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
