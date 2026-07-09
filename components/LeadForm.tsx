import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, REVENUE_POTENTIALS, SCORE_FIELDS, STAGES } from "@/lib/constants";

type Action = (formData: FormData) => Promise<void>;

export function LeadForm({ action }: { action: Action }) {
  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead basics</CardTitle>
          <CardDescription>Capture enough context to decide if this opportunity can become real revenue.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" name="companyName" required />
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" required>
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Select>
          </div>
          <Field label="Website" name="website" placeholder="https://example.com" />
          <Field label="Canonical ATS / job URL" name="canonicalUrl" placeholder="https://job-boards.greenhouse.io/company/jobs/123" />
          <Field label="Location" name="location" placeholder="Remote, NYC, Atlanta..." />
          <Field label="Contact name" name="contactName" />
          <Field label="Contact title" name="contactTitle" />
          <Field label="Contact email" name="contactEmail" type="email" placeholder="contact@example.com" />
          <Field label="LinkedIn URL" name="linkedinUrl" />
          <Field label="Warm intro source" name="warmIntroSource" />
          <Field label="Estimated budget" name="estimatedBudget" placeholder="$10K/month, pilot budget..." />
          <div className="space-y-2">
            <Label htmlFor="remoteFriendly">Remote friendly</Label>
            <Select id="remoteFriendly" name="remoteFriendly" defaultValue="true">
              <option value="true">Yes</option>
              <option value="false">No / unclear</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenuePotential">Revenue potential</Label>
            <Select id="monthlyRevenuePotential" name="monthlyRevenuePotential" defaultValue="">
              <option value="">Auto-recommend</option>
              {REVENUE_POTENTIALS.map((potential) => (
                <option key={potential}>{potential}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="personalizedAngle">Personalized angle</Label>
            <Textarea
              id="personalizedAngle"
              name="personalizedAngle"
              placeholder="Why this company is a fit for Rico's LCS Engine proof-of-work..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Research notes, buyer signals, possible warm paths..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring factors</CardTitle>
          <CardDescription>Use a simple 1-5 scale. The app converts the weighted result to a fit score.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {SCORE_FIELDS.map((field) => (
            <div className="space-y-2" key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input defaultValue={field.key === "warmIntroStrength" ? 1 : 3} id={field.key} max={5} min={1} name={field.key} type="number" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline tracking</CardTitle>
          <CardDescription>Set the next action so the lead lands in the right daily workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select id="stage" name="stage" defaultValue="Found">
              {STAGES.map((stage) => (
                <option key={stage}>{stage}</option>
              ))}
            </Select>
          </div>
          <Field label="Next action" name="nextAction" placeholder="Research buyer, send cold email, ask for intro..." />
          <Field label="Last contacted" name="lastContactedDate" type="date" />
          <Field label="Follow-up date" name="followUpDate" type="date" />
          <Field label="Objection risk" name="objectionRisk" placeholder="Budget unclear, low AI urgency..." />
          <Field label="Confidence level" name="confidenceLevel" placeholder="High, medium, low..." />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" type="submit">
          Save and score lead
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} placeholder={placeholder} required={required} type={type} />
    </div>
  );
}
