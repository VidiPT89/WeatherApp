import { SettingsForm } from "@/components/settings/SettingsForm";
import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { UserPreferences } from "@/types/weather";

export default async function SettingsPage() {
  const token = await getToken();
  const preferences = token
    ? await backendFetch<UserPreferences>("/api/v1/user/preferences", { token }).catch(() => ({
        units: "metric" as const,
      }))
    : { units: "metric" as const };

  return <SettingsForm initialUnits={preferences.units} />;
}
