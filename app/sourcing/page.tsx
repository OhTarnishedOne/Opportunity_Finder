import { SourcingScraper } from "@/components/SourcingScraper";

export default function SourcingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Sourcing automation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Turn public research pages into draft leads</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Paste public URLs for university programs, accelerators, venture studios, credit unions, wealth platforms, and
          company pages. Opportunity Finder will extract lead clues, score the draft, and save source evidence for review.
        </p>
      </div>
      <SourcingScraper />
    </div>
  );
}
