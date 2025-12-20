import { redirect } from "next/navigation";

/**
 * About page redirects to homepage
 */
export default function AboutPage() {
  redirect("/");
}
