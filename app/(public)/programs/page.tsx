import type { Metadata } from "next";

import { ProgramsScreen } from "./ProgramsScreen";

export const metadata: Metadata = {
  title: "Programs • Buffalo Projects",
  description:
    "Seasonal rituals, reviews, and mentor programming for Buffalo builders.",
};

export default function ProgramsPage() {
  return <ProgramsScreen />;
}
