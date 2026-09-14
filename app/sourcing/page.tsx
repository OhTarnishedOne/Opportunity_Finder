import { AutonomousDiscovery, SourcingScraper } from "@/components/SourcingScraper";

export default function SourcingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Company discovery</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Find and qualify companies</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Let Opportunity Finder discover new companies, or paste URLs you already know. Every result becomes a draft for
          your review before outreach.
        </p>
      </div>
      <AutonomousDiscovery />
      <SourcingScraper />
    </div>
  );
}
