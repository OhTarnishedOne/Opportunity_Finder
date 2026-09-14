import { scoreBreakdown, type ScorableLead } from "@/lib/scoring";

export function ScoreBreakdown({ lead }: { lead: ScorableLead }) {
  const rows = scoreBreakdown(lead);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.key} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{row.label}</span>
            <span className="text-slate-500">
              {row.score}/5 - {row.weight}% weight
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${(row.score / 5) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
