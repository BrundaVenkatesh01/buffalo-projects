import { SettingsScreen } from "../../../(studio)/settings/SettingsScreen";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings | Buffalo Projects",
  description: "Manage your account settings and preferences",
};

/**
 * Settings Page
 *
 * User account settings and preferences.
 * Moved from /settings to /dashboard/settings to nest under dashboard hierarchy.
 */
export default function DashboardSettingsPage() {
  return <SettingsScreen />;
}
