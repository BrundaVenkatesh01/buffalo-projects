import type { Metadata } from "next";

const guidelines = [
  {
    title: "Respect builders and their IP",
    body: "Project artifacts default to All Rights Reserved. Ask before reusing, and credit builders when blueprinting is enabled.",
  },
  {
    title: "Feedback is specific and actionable",
    body: "Use structured notes (Risk, Next, Resource, Bug). Give context, evidence, and suggested next steps.",
  },
  {
    title: "No spam or unsolicited outreach",
    body: "Intro offers are opt-in. Do not scrape contact info or mass-message builders without consent.",
  },
  {
    title: "Keep cohorts psychologically safe",
    body: "Celebrate wins publicly, deliver critical feedback privately. Flag violations to hello@buffaloprojects.com.",
  },
];

export const metadata: Metadata = {
  title: "Code of Conduct • Buffalo Projects",
  description:
    "Community expectations for builders, mentors, and professors using Buffalo Projects.",
};

export default function CodeOfConductPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
          Buffalo Projects
        </p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          Code of Conduct
        </h1>
        <p className="text-sm leading-6 text-neutral-400">
          Buffalo Projects is built on trust. Builders publish credible updates,
          mentors triage responsibly, and professors keep cohorts progressing.
          These guidelines apply to everyone using the platform.
        </p>
      </header>

      <section className="mt-10 grid gap-6">
        {guidelines.map((rule) => (
          <article
            key={rule.title}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.05] transition-colors"
          >
            <h2 className="font-display text-xl text-white">{rule.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              {rule.body}
            </p>
          </article>
        ))}
      </section>

      <footer className="mt-12 text-sm text-neutral-500">
        For urgent issues or to report violations, email{" "}
        <a
          href="mailto:conduct@buffaloprojects.com"
          className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          conduct@buffaloprojects.com
        </a>
        .
      </footer>
    </div>
  );
}
