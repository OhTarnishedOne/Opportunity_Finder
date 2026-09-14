import { ImportExportCsv } from "@/components/ImportExportCsv";

export default function ImportExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Import / Export CSV</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Move leads in and out of the local OS</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Bulk import researched leads from spreadsheets, score them automatically, and export the current database when
          you want a portable backup or offline review.
        </p>
      </div>
      <ImportExportCsv />
    </div>
  );
}
