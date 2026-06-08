import Link from "next/link";
import type { Lead } from "@prisma/client";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StageBadge } from "@/components/StageBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function FollowUpList({ leads }: { leads: Lead[] }) {
  const now = new Date();
  const oneWeek = new Date(now);
  oneWeek.setDate(now.getDate() + 7);

  const due = leads
    .filter((lead) => lead.followUpDate && new Date(lead.followUpDate) <= oneWeek && !["Won", "Lost"].includes(lead.stage))
    .sort((a, b) => new Date(a.followUpDate || 0).getTime() - new Date(b.followUpDate || 0).getTime());

  const stale = leads.filter((lead) => {
    if (!lead.lastContactedDate || ["Won", "Lost", "Nurture"].includes(lead.stage)) return false;
    const last = new Date(lead.lastContactedDate);
    const days = (now.getTime() - last.getTime()) / 86_400_000;
    return days >= 10;
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <FollowUpCard title="Due soon or overdue" description="Leads with follow-up dates within the next week." leads={due} />
      <FollowUpCard title="Stale leads" description="Contacted leads with no recent movement in 10+ days." leads={stale} />
    </div>
  );
}

function FollowUpCard({ title, description, leads }: { title: string; description: string; leads: Lead[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {leads.length ? (
          leads.map((lead) => (
            <Link className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-sky-200" href={`/leads/${lead.id}`} key={lead.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-950">{lead.companyName}</div>
                  <div className="text-sm text-slate-500">{lead.nextAction || "Define next action"}</div>
                </div>
                <div className="text-right text-sm text-slate-500">{formatDate(lead.followUpDate)}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PriorityBadge priority={lead.priorityLevel} />
                <StageBadge stage={lead.stage} />
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Nothing due in this bucket.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
