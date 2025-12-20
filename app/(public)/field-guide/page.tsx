import type { Metadata } from "next";

import { FieldGuideScreen } from "./FieldGuideScreen";

export const metadata: Metadata = {
  title: "Field Guide • Buffalo Projects",
  description:
    "Curated templates, playbooks, and decision logs for Buffalo builders shipping in public.",
};

export default function FieldGuidePage() {
  return <FieldGuideScreen />;
}
