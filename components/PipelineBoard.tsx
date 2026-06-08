import Link from "next/link";
import type { Lead } from "@prisma/client";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StageBadge } from "@/components/StageBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGES } from "@/lib/constants";

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  const activeStages = STAGES.filter((stage) => leads.some((lead) => lead.stage === stage));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline by stage</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {activeStages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage).sort((a, b) => b.fitScore - a.fitScore);
          return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={stage}>
              <div className="mb-3 flex items-center justify-between">
                <StageBadge stage={stage} />
                <span className="text-xs font-medium text-slate-500">{stageLeads.length}</span>
              </div>
              <div className="space-y-2">
                {stageLeads.slice(0, 4).map((lead) => (
                  <Link
                    className="block rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-sky-200 hover:shadow"
                    href={`/leads/${lead.id}`}
                    key={lead.id}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-950">{lead.companyName}</div>
                        <div className="text-xs text-slate-500">{lead.suggestedOffer}</div>
                      </div>
                      <div className="font-semibold text-slate-950">{lead.fitScore}</div>
                    </div>
                    <div className="mt-2">
                      <PriorityBadge priority={lead.priorityLevel} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
