import { DashboardScreen } from "../../(studio)/profile/DashboardScreen";

// Force dynamic rendering - this page must not be statically generated
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Buffalo Projects",
  description: "Manage your projects and discover the Buffalo community",
};

/**
 * Dashboard Page
 *
 * Primary authenticated landing page - shows user's projects by default.
 * Replaces the old /profile route as the main hub for logged-in users.
 */
export default function DashboardPage() {
  return <DashboardScreen />;
}
