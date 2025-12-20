import type { Metadata } from "next";

import { SignUpScreen } from "./screen";

export const metadata: Metadata = {
  title: "Join • Buffalo Projects",
  description:
    "Join Buffalo Projects and share your project with Buffalo's builder community.",
};

export const dynamic = "force-dynamic";

export default function JoinPage() {
  return <SignUpScreen />;
}
