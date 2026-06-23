import { JobSearchOperator } from "@/components/JobSearchOperator";

export default function JobSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Job search operator</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Senior AI and fintech role search system
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          A reusable prompt and operating checklist for sourcing senior IC, product, GTM/solutions, innovation, and
          leadership opportunities without drifting into pure quant-research branding.
        </p>
      </div>
      <JobSearchOperator />
    </div>
  );
}
