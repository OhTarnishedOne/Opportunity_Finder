import { LeadTable } from "@/components/LeadTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: [{ fitScore: "desc" }, { createdAt: "desc" }] });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Lead database</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Prioritize the pipeline</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Filter by category, stage, and priority to decide where Rico should spend outreach energy today.
        </p>
      </div>
      <LeadTable leads={leads} />
    </div>
  );
}
