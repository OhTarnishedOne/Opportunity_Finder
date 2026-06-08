import { OutreachGenerator } from "@/components/OutreachGenerator";
import { prisma } from "@/lib/prisma";

export default async function OutreachPage() {
  const leads = await prisma.lead.findMany({ orderBy: [{ fitScore: "desc" }, { updatedAt: "desc" }] });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Outreach generator</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Say the right thing to the right lead</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Generate cold emails, warm intro requests, LinkedIn DMs, follow-ups, proposal blurbs, and call agendas from
          deterministic templates.
        </p>
      </div>
      <OutreachGenerator leads={leads} />
    </div>
  );
}
