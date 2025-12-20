
import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { Input } from "@/components/unified";
import { Search } from "@/icons";

export const metadata = {
  title: "Search • Buffalo Projects",
  description:
    "Find Buffalo projects, mentors, and groups with fuzzy search and tag boosts.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Buffalo projects, mentors, groups…"
          className="h-12 rounded-full pl-12"
          aria-label="Search Buffalo projects, mentors, groups"
        />
      </div>
      <PagePlaceholder
        title="Search results coming online"
        description="We’re wiring the ranking function and fuzzy search API now. You’ll soon see project cards that blend freshness, proof, mentor notes, and update streak signals."
      />
    </div>
  );
}
