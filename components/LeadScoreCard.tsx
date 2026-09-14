import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import type { ScorableLead } from "@/lib/scoring";

export function LeadScoreCard({
  lead,
}: {
  lead: ScorableLead & { fitScore: number; priorityLevel: string; suggestedOffer?: string | null };
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Fit score</CardTitle>
            <CardDescription>Weighted 1-5 factors converted into a 0-100 priority score.</CardDescription>
          </div>
          <PriorityBadge priority={lead.priorityLevel} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-3">
          <div className="text-6xl font-bold tracking-tight text-slate-950">{lead.fitScore}</div>
          <div className="pb-2 text-sm text-slate-500">/ 100</div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested offer</div>
          <div className="mt-1 font-medium text-slate-950">{lead.suggestedOffer || "Product Strategy Sprint"}</div>
        </div>
        <ScoreBreakdown lead={lead} />
      </CardContent>
    </Card>
  );
}
