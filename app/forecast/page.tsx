import { RevenueForecast } from "@/components/RevenueForecast";
import { prisma } from "@/lib/prisma";

export default async function ForecastPage() {
  const leads = await prisma.lead.findMany({ orderBy: [{ fitScore: "desc" }] });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Revenue forecast</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Track the path to $10K-$20K/month</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Estimate conservative, realistic, and best-case revenue from the current opportunity pipeline using simple
          local assumptions.
        </p>
      </div>
      <RevenueForecast leads={leads} />
    </div>
  );
}
