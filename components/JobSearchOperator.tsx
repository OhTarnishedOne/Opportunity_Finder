"use client";

import { useState } from "react";
import {
  JOB_SEARCH_ASSET_CHECKLIST,
  JOB_SEARCH_CONTEXT_CHECKLIST,
  JOB_SEARCH_DEPRIORITIZED,
  JOB_SEARCH_PROMPT,
  JOB_SEARCH_TARGETS,
  JOB_SEARCH_WEEKLY_PLAN,
} from "@/lib/job-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function JobSearchOperator() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(JOB_SEARCH_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Operating objective</CardTitle>
            <CardDescription>Use this mode for job search and application strategy, not generic lead outreach.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Position Rico as a founder, product builder, startup advisor, and AI/fintech operator with markets and
              trading-systems exposure.
            </p>
            <p>
              Optimize for consistent near-term income while still considering strategic upside, leadership scope, and
              long-term optionality.
            </p>
          </CardContent>
        </Card>

        <ChecklistCard title="Gather before acting" items={JOB_SEARCH_CONTEXT_CHECKLIST} />
        <ChecklistCard title="De-prioritize" items={JOB_SEARCH_DEPRIORITIZED} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Reusable job search system prompt</CardTitle>
              <CardDescription>Copy this into a chat when working on roles, companies, outreach, or application assets.</CardDescription>
            </div>
            <Button onClick={copyPrompt} type="button" variant="outline">
              {copied ? "Copied" : "Copy"}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-50">
              {JOB_SEARCH_PROMPT}
            </pre>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChecklistCard title="Target role patterns" items={JOB_SEARCH_TARGETS} />
          <ChecklistCard title="Application asset checklist" items={JOB_SEARCH_ASSET_CHECKLIST} />
        </div>

        <ChecklistCard title="Default next 7 days plan" items={JOB_SEARCH_WEEKLY_PLAN} />
      </div>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {items.map((item) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
