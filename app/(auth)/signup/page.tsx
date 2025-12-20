import { redirect } from "next/navigation";

/**
 * Legacy route: /signup
 * Redirects to: /join
 *
 * This maintains backward compatibility for bookmarks and shared links.
 */
export default function SignupRedirect() {
  redirect("/join");
}
