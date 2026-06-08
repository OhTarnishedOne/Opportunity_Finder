import type { Lead } from "@prisma/client";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LeadScoreCard } from "@/components/LeadScoreCard";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StageBadge } from "@/components/StageBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { STAGES } from "@/lib/constants";
import { generateAllOutreach } from "@/lib/outreach";
import { formatDate, toDateInputValue } from "@/lib/utils";

type Action = (formData: FormData) => Promise<void>;

export function LeadDetailPanel({ lead, updateAction }: { lead: Lead; updateAction: Action }) {
  const drafts = generateAllOutreach(lead);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{lead.companyName}</CardTitle>
                <CardDescription>{lead.contactName || "No contact name"} {lead.contactTitle ? `- ${lead.contactTitle}` : ""}</CardDescription>
              </div>
              <CategoryBadge category={lead.category} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={lead.priorityLevel} />
              <StageBadge stage={lead.stage} />
            </div>
            <Info label="Website" value={lead.website} />
            <Info label="Location" value={lead.location} />
            <Info label="Email" value={lead.contactEmail} />
            <Info label="Warm intro" value={lead.warmIntroSource} />
            <Info label="Revenue potential" value={lead.monthlyRevenuePotential} />
            <Info label="Last contacted" value={formatDate(lead.lastContactedDate)} />
            <Info label="Follow-up" value={formatDate(lead.followUpDate)} />
          </CardContent>
        </Card>

        <LeadScoreCard lead={lead} />

        <Card>
          <CardHeader>
            <CardTitle>Update stage</CardTitle>
            <CardDescription>Keep the daily follow-up queue accurate.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateAction} className="space-y-4">
              <input name="id" type="hidden" value={lead.id} />
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select defaultValue={lead.stage} id="stage" name="stage">
                  {STAGES.map((stage) => (
                    <option key={stage}>{stage}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextAction">Next action</Label>
                <Input defaultValue={lead.nextAction || ""} id="nextAction" name="nextAction" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lastContactedDate">Last contacted</Label>
                  <Input defaultValue={toDateInputValue(lead.lastContactedDate)} id="lastContactedDate" name="lastContactedDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Follow-up</Label>
                  <Input defaultValue={toDateInputValue(lead.followUpDate)} id="followUpDate" name="followUpDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea defaultValue={lead.notes || ""} id="notes" name="notes" />
              </div>
              <Button type="submit">Update lead</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What to pitch</CardTitle>
            <CardDescription>Offer and angle for a practical, high-value conversation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <div className="text-xs uppercase tracking-wide text-slate-300">Suggested offer</div>
              <div className="mt-1 text-xl font-semibold">{lead.suggestedOffer}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">Personalized angle</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {lead.personalizedAngle || lead.notes || "Add a sharper angle after researching this lead."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outreach drafts</CardTitle>
            <CardDescription>Template-based drafts generated from this lead's fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {drafts.map((draft) => (
              <details className="rounded-2xl border border-slate-200 bg-white p-4" key={draft.type}>
                <summary className="cursor-pointer font-semibold text-slate-950">{draft.type}</summary>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {draft.body}
                </pre>
              </details>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-slate-700">{value || "Not set"}</div>
    </div>
  );
}
