import { createLeadAction } from "@/app/actions";
import { LeadForm } from "@/components/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">New lead</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Add and score an opportunity</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Capture the buyer, fit, urgency, warm path, and likely revenue path. The app will calculate score, priority,
          suggested offer, and revenue potential.
        </p>
      </div>
      <LeadForm action={createLeadAction} />
    </div>
  );
}
