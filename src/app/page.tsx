import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { getToken } from "@/lib/session";

export default async function RootPage() {
  const token = await getToken();
  if (token) {
    redirect("/dashboard");
  }
  return <LandingPage />;
}
