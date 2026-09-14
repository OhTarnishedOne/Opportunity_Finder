"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  discoverLeadsAction,
  scrapeLeadsAction,
  type DiscoveryActionState,
  type SourcingActionState,
} from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SOURCING_MODES } from "@/lib/constants";

const initialState: SourcingActionState = {
  created: [],
  errors: [],
};

const initialDiscoveryState: DiscoveryActionState = {
  created: [],
  errors: [],
  skipped: [],
};

export function AutonomousDiscovery() {
  const [state, action, pending] = useActionState(discoverLeadsAction, initialDiscoveryState);

  return (
    <Card className="border-sky-200 bg-sky-50/40">
      <CardHeader>
        <CardTitle>Discover companies autonomously</CardTitle>
        <CardDescription>
          Search the public web, remove domains already in your pipeline, analyze each candidate, and save reviewable
          Found leads. Nothing is contacted automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={action} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="discoverySourcingMode">Target market</Label>
            <Select defaultValue="Startups" id="discoverySourcingMode" name="sourcingMode">
              {SOURCING_MODES.map((mode) => <option key={mode}>{mode}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input id="location" name="location" placeholder="New York or United States" />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="focus">Search focus (optional)</Label>
            <Input
              id="focus"
              name="focus"
              placeholder='e.g. Series A fintech companies hiring operations analysts'
            />
            <p className="text-xs leading-5 text-slate-500">
              Leave blank to use the saved searches for the selected target market.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxResults">Maximum candidates</Label>
            <Select defaultValue="10" id="maxResults" name="maxResults">
              {[5, 10, 15, 20].map((count) => <option key={count} value={count}>{count}</option>)}
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" disabled={pending} type="submit">
              {pending ? "Discovering and analyzing..." : "Discover new companies"}
            </Button>
          </div>
        </form>

        {state.message ? (
          <div className="space-y-4 border-t border-sky-100 pt-5">
            <p className="text-sm font-semibold text-slate-950">{state.message}</p>
            {state.created.map((lead) => (
              <div className="rounded-xl border border-emerald-100 bg-white p-4" key={lead.id}>
                <div className="font-semibold text-emerald-950">{lead.companyName}</div>
                <div className="mt-1 break-all text-xs text-slate-500">{lead.sourceUrl}</div>
                <Link className="mt-2 inline-flex text-sm font-semibold text-emerald-800" href={`/leads/${lead.id}`}>
                  Review lead
                </Link>
              </div>
            ))}
            {state.skipped.map((item) => (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4" key={item.url}>
                <div className="font-semibold text-amber-950">Skipped {item.companyName}</div>
                <div className="mt-1 text-sm text-amber-800">{item.reason}</div>
              </div>
            ))}
            {state.errors.map((item) => (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4" key={item.url}>
                <div className="font-semibold text-rose-950">Could not analyze candidate</div>
                <div className="mt-1 break-all text-xs text-rose-700">{item.url}</div>
                <div className="mt-2 text-sm text-rose-800">{item.error}</div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SourcingScraper() {
  const [state, action, pending] = useActionState(scrapeLeadsAction, initialState);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Scrape public lead pages</CardTitle>
          <CardDescription>
            Paste public organization, program, team, portfolio, or directory pages. The scraper creates draft leads for
            manual review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourcingMode">Sourcing mode</Label>
              <Select defaultValue="General" id="sourcingMode" name="sourcingMode">
                {SOURCING_MODES.map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </Select>
              <p className="text-xs leading-5 text-slate-500">
                Choose Family Offices when sourcing smaller or mid-size offices so draft leads are scored and positioned
                correctly.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urls">Public URLs</Label>
              <Textarea
                id="urls"
                name="urls"
                placeholder={`https://business.columbia.edu/...\nhttps://www.tufts.edu/...`}
                rows={10}
              />
              <p className="text-xs leading-5 text-slate-500">
                Limit 10 URLs at a time. Do not paste LinkedIn, logged-in sites, private directories, or pages that forbid
                automated access.
              </p>
            </div>
            <Button disabled={pending} type="submit">
              {pending ? "Scraping..." : "Create draft leads"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Safe sourcing rules</CardTitle>
            <CardDescription>Keep this useful without turning it into spam or a compliance risk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Use public pages from universities, company websites, accelerators, portfolios, and official program pages.</p>
            <p>No LinkedIn scraping, no login bypassing, no guessed private emails, and no bulk crawling beyond pasted URLs.</p>
            <p>
              Every scraped lead is a draft. Review the source, correct names/titles, find a warm path, then send outreach
              manually.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family office sourcing playbook</CardTitle>
            <CardDescription>Smaller and mid-size family offices are often discreet, so look for public signals and warm paths.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
            <div>
              <div className="font-semibold text-slate-950">Best public pages to paste</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>family office websites with team or investment philosophy pages</li>
                <li>multi-family office and boutique wealth advisory pages</li>
                <li>next-gen wealth education, philanthropy, or family governance pages</li>
                <li>conference speaker bios mentioning family office principals, CIOs, COOs, or innovation leads</li>
                <li>RIA pages serving ultra-high-net-worth families or family offices</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-950">Search queries to collect URLs</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-50">{`"single family office" "next generation" education
"family office" "investment education" principal
"multi-family office" "innovation" "wealth"
"family office" "AI" investment education
"family office" "financial literacy" next gen
"family governance" "next generation" "investment education"
"family office services" "portfolio learning"`}</pre>
            </div>
            <div>
              <div className="font-semibold text-slate-950">Pitch angle</div>
              <p className="mt-2">
                Lead with practical AI workflows, next-gen investment education, decision quality, portfolio learning, and
                family financial literacy. Avoid sounding like a generic software vendor.
              </p>
            </div>
          </CardContent>
        </Card>

        {state.message ? (
          <Card>
            <CardHeader>
              <CardTitle>Scrape results</CardTitle>
              <CardDescription>{state.message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.created.map((lead) => (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4" key={lead.id}>
                  <div className="font-semibold text-emerald-950">{lead.companyName}</div>
                  <div className="mt-1 break-all text-xs text-emerald-700">{lead.sourceUrl}</div>
                  {lead.warnings.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800">
                      {lead.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  ) : null}
                  <Link className="mt-3 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950" href={`/leads/${lead.id}`}>
                    Review lead
                  </Link>
                </div>
              ))}

              {state.errors.map((error) => (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4" key={error.url}>
                  <div className="font-semibold text-rose-950">Could not scrape URL</div>
                  <div className="mt-1 break-all text-xs text-rose-700">{error.url}</div>
                  <div className="mt-2 text-sm text-rose-800">{error.error}</div>
                  {error.warnings.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800">
                      {error.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
