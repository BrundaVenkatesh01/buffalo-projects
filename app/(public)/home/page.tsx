import { redirect } from "next/navigation";

export const metadata = {
  title: "Buffalo Projects - Build in Public, Together",
  description:
    "The entrepreneurial nerve center for Buffalo builders. Free workspace tools to develop your business model, share progress, and connect with mentors who can help you win.",
  openGraph: {
    title: "Buffalo Projects - Build in Public, Together",
    description:
      "Join Buffalo's builders documenting their journey in public. Get feedback, find mentors, and ship alongside the community.",
    type: "website",
  },
};

export default function HomePage() {
  redirect("/");
}
