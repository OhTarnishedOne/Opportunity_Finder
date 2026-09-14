import { DashboardStats } from "@/components/DashboardStats";
import { LeadTable } from "@/components/LeadTable";
import { PipelineBoard } from "@/components/PipelineBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    where: { verificationStatus: { not: "STALE" } },
    orderBy: [{ fitScore: "desc" }, { updatedAt: "desc" }],
  });
  const topLeads = leads.slice(0, 10);
  const recent = [...leads].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Daily command center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Who should Rico contact today?
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Score high-fit consulting, fractional, startup, family office, and institutional leads, then turn the best
            opportunities into practical outreach grounded in shipped LCS Engine proof-of-work.
          </p>
        </div>
      </section>

      <DashboardStats leads={leads} />
      <LeadTable leads={topLeads} compact />
      <PipelineBoard leads={leads} />

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.map((lead) => (
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4" key={lead.id}>
              <div>
                <div className="font-medium text-slate-950">{lead.companyName}</div>
                <div className="text-sm text-slate-500">{lead.stage} - {lead.nextAction || "No next action"}</div>
              </div>
              <div className="text-sm text-slate-500">{formatDate(lead.updatedAt)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
