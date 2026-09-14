import Link from "next/link";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const leads = await prisma.lead.findMany({
    where: {
      OR: [{ verificationStatus: "ERROR" }, { verificationStatus: "UNVERIFIED" }],
    },
    orderBy: [{ checkFailCount: "desc" }, { lastCheckedAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Listing verification</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Manual review queue</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Review unverified listings and checks that failed. Three consecutive failures indicate the listing needs manual
          confirmation before more outreach or follow-up.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs review</CardTitle>
          <CardDescription>{leads.length} opportunities are unverified or failed verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {leads.map((lead) => (
            <Link className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-sky-200" href={`/leads/${lead.id}`} key={lead.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-950">{lead.companyName}</div>
                  <div className="mt-1 break-all text-sm text-slate-500">{lead.canonicalUrl || lead.sourceUrl || lead.website || "No URL"}</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Failures: {lead.checkFailCount} | Last checked: {formatDate(lead.lastCheckedAt)}
                  </div>
                </div>
                <VerificationStatusBadge lastCheckedAt={lead.lastCheckedAt} staleReason={lead.staleReason} status={lead.verificationStatus} />
              </div>
            </Link>
          ))}
          {!leads.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No verification issues right now.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
