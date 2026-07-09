import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIORITIES, SCORE_FIELDS, SCORE_WEIGHTS } from "@/lib/constants";

export default function ScoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Scoring engine</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">How Opportunity Finder ranks leads</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Each opportunity uses 1-5 inputs. Core weighted factors produce a 0-100 fit score, while additional context
          fields help explain why a lead may fit Rico&apos;s LCS Engine proof-of-work.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Weighted factors</CardTitle>
            <CardDescription>Prompt-aligned score weights. Fields at 0% are captured for context and outreach logic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SCORE_FIELDS.map((field) => (
              <div className="rounded-2xl border border-slate-100 p-4" key={field.key}>
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium text-slate-950">{field.label}</div>
                  <div className="font-semibold text-slate-950">{SCORE_WEIGHTS[field.key]}%</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${SCORE_WEIGHTS[field.key]}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <PriorityRow label={PRIORITIES[0]} range="85-100" />
              <PriorityRow label={PRIORITIES[1]} range="70-84" />
              <PriorityRow label={PRIORITIES[2]} range="55-69" />
              <PriorityRow label={PRIORITIES[3]} range="40-54" />
              <PriorityRow label={PRIORITIES[4]} range="Below 40" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily decision rule</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-slate-600">
              Contact Must Contact and Strong Lead opportunities first, especially when they have decision-maker access,
              a warm intro path, and a clear offer fit around AI product strategy, family office innovation, financial
              literacy, or decision intelligence.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PriorityRow({ label, range }: { label: string; range: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{range}</span>
    </div>
  );
}
