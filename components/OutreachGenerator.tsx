"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { OUTREACH_TYPES } from "@/lib/constants";
import { generateOutreach, type OutreachType } from "@/lib/outreach";
import type { LeadRecord } from "@/lib/types";

export function OutreachGenerator({ leads }: { leads: LeadRecord[] }) {
  const [leadId, setLeadId] = useState(leads[0]?.id ?? "");
  const [type, setType] = useState<OutreachType>("Cold Email");
  const selectedLead = leads.find((lead) => lead.id === leadId) ?? leads[0];

  const draft = useMemo(() => {
    if (!selectedLead) return "";
    return generateOutreach(selectedLead, type);
  }, [selectedLead, type]);

  if (!leads.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No outreach to generate yet</CardTitle>
          <CardDescription>Add and score a lead first, then generate deterministic outreach drafts.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Outreach generator</CardTitle>
          <CardDescription>
            Template-based copy using lead context, LCS Engine proof-of-work, and Rico&apos;s founder/operator positioning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="leadId">
              Lead
            </label>
            <Select id="leadId" value={leadId} onChange={(event) => setLeadId(event.target.value)}>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.companyName} - {lead.fitScore}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="type">
              Draft type
            </label>
            <Select id="type" value={type} onChange={(event) => setType(event.target.value as OutreachType)}>
              {OUTREACH_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-950">{selectedLead.companyName}</div>
            <div>{selectedLead.suggestedOffer}</div>
            <div>{selectedLead.personalizedAngle || selectedLead.notes || "No personalized angle yet."}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>{type}</CardTitle>
            <CardDescription>Copy this into email, LinkedIn, or your CRM manually.</CardDescription>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(draft);
            }}
          >
            Copy
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="min-h-96 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm leading-6 text-slate-50">
            {draft}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
