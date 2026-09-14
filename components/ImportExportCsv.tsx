"use client";

import Link from "next/link";
import { useActionState } from "react";
import { importCsvAction, type CsvImportActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { importableCsvHeaders } from "@/lib/csv";

const initialState: CsvImportActionState = {
  imported: [],
  errors: [],
};

export function ImportExportCsv() {
  const [state, action, pending] = useActionState(importCsvAction, initialState);
  const headers = importableCsvHeaders();

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Import leads from CSV</CardTitle>
          <CardDescription>
            Upload or paste CSV rows. Imported leads are scored, prioritized, and assigned suggested offers immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">CSV file</Label>
              <Input accept=".csv,text/csv" id="csvFile" name="csvFile" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="csvText">Or paste CSV text</Label>
              <Textarea
                id="csvText"
                name="csvText"
                placeholder={`${headers.slice(0, 8).join(",")},...\nExample Company,Fintech Startup,https://example.com,Remote,Avery Founder,CEO,contact@example.com,...`}
                rows={8}
              />
            </div>
            <Button disabled={pending} type="submit">
              {pending ? "Importing..." : "Import and score leads"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Export current database</CardTitle>
            <CardDescription>Download your complete local lead database with scores and source metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              href="/api/leads/export"
            >
              Export CSV
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import template</CardTitle>
            <CardDescription>Use snake_case headers. Scores are 1-5. Missing score fields default conservatively.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-50">
              {headers.join(",")}
            </pre>
          </CardContent>
        </Card>

        {state.message ? (
          <Card>
            <CardHeader>
              <CardTitle>Import results</CardTitle>
              <CardDescription>{state.message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.imported.map((lead) => (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4" key={lead.id}>
                  <div className="font-semibold text-emerald-950">{lead.companyName}</div>
                  <Link className="mt-2 inline-flex text-sm font-semibold text-emerald-800" href={`/leads/${lead.id}`}>
                    Review imported lead
                  </Link>
                </div>
              ))}
              {state.errors.map((error) => (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4" key={`${error.row}-${error.error}`}>
                  <div className="font-semibold text-rose-950">Row {error.row}</div>
                  <div className="mt-1 text-sm text-rose-800">{error.error}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
