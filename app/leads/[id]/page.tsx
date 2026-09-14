import { notFound } from "next/navigation";
import { updateLeadStageAction } from "@/app/actions";
import { LeadDetailPanel } from "@/components/LeadDetailPanel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Lead detail</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Why this lead, what to pitch, what to say</h1>
      </div>
      <LeadDetailPanel lead={lead} updateAction={updateLeadStageAction} />
    </div>
  );
}
