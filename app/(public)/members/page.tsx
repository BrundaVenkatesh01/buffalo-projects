import type { Metadata } from "next";

import { MembersScreen } from "./MembersScreen";

export const metadata: Metadata = {
  title: "Members • Buffalo Projects",
  description:
    "Profiles of Buffalo builders, their projects, and how to reach them for thoughtful feedback.",
};

export default function MembersPage() {
  return <MembersScreen />;
}
