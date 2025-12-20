import type { Metadata } from "next";

import { ResourcesScreen } from "./ResourcesScreen";

export const metadata: Metadata = {
  title: "Resources • Buffalo Projects",
  description:
    "Curated Buffalo programs, mentors, and spaces for founders at every stage.",
};

export default function ResourcesPage() {
  return <ResourcesScreen />;
}
