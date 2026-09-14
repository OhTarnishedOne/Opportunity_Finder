import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { REVENUE_ASSUMPTIONS, SCORE_FIELDS, SCORE_WEIGHTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Scoring and revenue assumptions</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          MVP assumptions are static constants for now. Edit <code>lib/constants.ts</code> when you want to tune them.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scoring weights</CardTitle>
            <CardDescription>Each factor uses a 1-5 input scale and contributes to a 0-100 score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SCORE_FIELDS.map((field) => (
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3" key={field.key}>
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <span className="font-semibold text-slate-950">{SCORE_WEIGHTS[field.key]}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue assumptions</CardTitle>
            <CardDescription>Used for the forecast page and dashboard pipeline values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <Assumption label="Cold leads become calls" value={`${REVENUE_ASSUMPTIONS.coldLeadToCall * 100}%`} />
            <Assumption label="Warm leads become calls" value={`${REVENUE_ASSUMPTIONS.warmLeadToCall * 100}%`} />
            <Assumption label="Calls become proposals" value={`${REVENUE_ASSUMPTIONS.callToProposal * 100}%`} />
            <Assumption label="Proposals close" value={`${REVENUE_ASSUMPTIONS.proposalToClose * 100}%`} />
            <Assumption label="Average starter project" value={formatCurrency(REVENUE_ASSUMPTIONS.averageStarterProject)} />
            <Assumption label="Average retainer" value={`${formatCurrency(REVENUE_ASSUMPTIONS.averageRetainer)}/month`} />
            <Assumption label="Premium retainer" value={`${formatCurrency(REVENUE_ASSUMPTIONS.premiumRetainer)}/month`} />
            <Assumption label="Institutional pilot/license" value={formatCurrency(REVENUE_ASSUMPTIONS.institutionalPilot)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Assumption({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}
