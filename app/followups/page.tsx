import { FollowUpList } from "@/components/FollowUpList";
import { prisma } from "@/lib/prisma";

export default async function FollowUpsPage() {
  const leads = await prisma.lead.findMany({ orderBy: [{ followUpDate: "asc" }, { fitScore: "desc" }] });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Follow-up tracker</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Do not let strong leads go stale</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Review overdue, due-soon, and stale opportunities before starting new outreach.
        </p>
      </div>
      <FollowUpList leads={leads} />
    </div>
  );
}
