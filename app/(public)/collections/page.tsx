import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Button } from "@/components/unified";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/unified";

export const metadata: Metadata = {
  title: "Collections • Buffalo Projects",
  description:
    "Curated collections of Buffalo Projects to help mentors and cohorts discover standout work.",
};

type CollectionMeta = {
  slug: string;
  title: string;
  description: string;
  count?: number;
};

// Lightweight, static starter set. If Firestore is enabled later we can hydrate from DB.
const featuredCollections: CollectionMeta[] = [
  {
    slug: "cohort-highlights",
    title: "Cohort Highlights",
    description:
      "Hand-picked student projects showcasing traction and crisp asks.",
    count: 8,
  },
  {
    slug: "customer-discovery-wins",
    title: "Customer Discovery Wins",
    description:
      "Evidence-backed projects demonstrating validated problem-solution fit.",
    count: 12,
  },
  {
    slug: "mentor-picks",
    title: "Mentor Picks",
    description: "Curated by mentors across Buffalo’s startup ecosystem.",
    count: 6,
  },
];

export default function CollectionsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <Badge
          variant="secondary"
          className="rounded-full text-xs uppercase tracking-[0.24em]"
        >
          Collections
        </Badge>
        <h1 className="font-display text-4xl text-foreground">Curated Sets</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore curated groups of Buffalo Projects. These sets make it faster
          for mentors and cohorts to find credible projects aligned to their
          interests.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCollections.map((c) => (
          <Card key={c.slug} className="border-white/10 bg-white/[0.05]">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                <Link
                  className="hover:underline"
                  href={`/collections/${c.slug}`}
                >
                  {c.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <div className="flex items-center justify-between">
                {typeof c.count === "number" ? (
                  <span className="text-xs text-muted-foreground">
                    ~{c.count} projects
                  </span>
                ) : (
                  <span />
                )}
                <Link href={`/collections/${c.slug}`} className="inline-flex">
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
