import { redirect } from "next/navigation";

/**
 * /projects route
 * Redirects to /dashboard (Discover page temporarily under redesign)
 */
export default function ProjectsPage() {
  redirect("/dashboard");
}
