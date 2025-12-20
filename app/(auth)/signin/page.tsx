import type { Metadata } from "next";

import { SignInScreen } from "./screen";

export const metadata: Metadata = {
  title: "Sign in • Buffalo Projects",
  description: "Access your Buffalo Projects workspace and continue building.",
};

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return <SignInScreen />;
}
