"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { csvRecordToLead, parseCsvText } from "@/lib/csv";
import { discoverCandidates } from "@/lib/discovery";
import { scrapeLeadFromUrl } from "@/lib/scraper";
import { applyAvailabilityCap, enrichLeadScores } from "@/lib/scoring";
import { discoverySchema, leadFormSchema, sourcingSchema, stageUpdateSchema } from "@/lib/validations";
import { canonicalize } from "@/lib/verification/canonicalize";

function dateOrNull(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

async function canonicalDataFor(url?: string | null) {
  const canonicalized = await canonicalize(url);
  return {
    canonicalUrl: canonicalized.canonicalUrl,
    sourceUrl: canonicalized.sourceUrl,
    atsProvider: canonicalized.atsProvider,
    atsExternalId: canonicalized.atsExternalId,
    atsBoardToken: canonicalized.atsBoardToken,
  };
}

export async function createLeadAction(formData: FormData) {
  const parsed = leadFormSchema.parse(Object.fromEntries(formData.entries()));
  const canonical = await canonicalDataFor(parsed.canonicalUrl || parsed.website);
  const scoring = applyAvailabilityCap(enrichLeadScores(parsed), canonical.atsProvider);

  const lead = await prisma.lead.create({
    data: {
      ...parsed,
      ...canonical,
      lastContactedDate: dateOrNull(parsed.lastContactedDate),
      followUpDate: dateOrNull(parsed.followUpDate),
      monthlyRevenuePotential: parsed.monthlyRevenuePotential || scoring.monthlyRevenuePotential,
      fitScore: scoring.fitScore,
      priorityLevel: scoring.priorityLevel,
      suggestedOffer: scoring.suggestedOffer,
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLeadStageAction(formData: FormData) {
  const parsed = stageUpdateSchema.parse(Object.fromEntries(formData.entries()));

  await prisma.lead.update({
    where: { id: parsed.id },
    data: {
      stage: parsed.stage,
      nextAction: parsed.nextAction,
      followUpDate: dateOrNull(parsed.followUpDate),
      lastContactedDate: dateOrNull(parsed.lastContactedDate),
      ...(parsed.notes !== undefined ? { notes: parsed.notes } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath(`/leads/${parsed.id}`);
}

export type SourcingActionState = {
  message?: string;
  created: Array<{
    id: string;
    companyName: string;
    sourceUrl: string;
    warnings: string[];
  }>;
  errors: Array<{
    url: string;
    error: string;
    warnings: string[];
  }>;
};

export type CsvImportActionState = {
  message?: string;
  imported: Array<{
    id: string;
    companyName: string;
  }>;
  errors: Array<{
    row: number;
    error: string;
  }>;
};

export type DiscoveryActionState = SourcingActionState & {
  skipped: Array<{
    companyName: string;
    url: string;
    reason: string;
  }>;
};

function domainFor(rawUrl?: string | null) {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function discoverLeadsAction(
  _previousState: DiscoveryActionState,
  formData: FormData,
): Promise<DiscoveryActionState> {
  const parsed = discoverySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message || "Could not start discovery.",
      created: [],
      errors: [],
      skipped: [],
    };
  }

  const state: DiscoveryActionState = { created: [], errors: [], skipped: [] };

  try {
    const candidates = await discoverCandidates(parsed.data);
    const existingLeads = await prisma.lead.findMany({
      select: { companyName: true, website: true, sourceUrl: true },
    });
    const knownDomains = new Set(
      existingLeads.flatMap((lead) => [domainFor(lead.website), domainFor(lead.sourceUrl)]).filter(Boolean),
    );

    for (const candidate of candidates) {
      const candidateDomain = domainFor(candidate.url);
      if (candidateDomain && knownDomains.has(candidateDomain)) {
        state.skipped.push({
          companyName: candidate.title,
          url: candidate.url,
          reason: "A lead from this domain already exists.",
        });
        continue;
      }

      const result = await scrapeLeadFromUrl(candidate.url, { sourcingMode: parsed.data.sourcingMode });
      if (!result.ok) {
        state.errors.push({ url: result.url, error: result.error, warnings: result.warnings });
        continue;
      }

      const canonical = await canonicalDataFor(result.draft.sourceUrl || result.draft.website);
      const scoring = applyAvailabilityCap(enrichLeadScores(result.draft), canonical.atsProvider);
      const lead = await prisma.lead.create({
        data: {
          ...result.draft,
          ...scoring,
          ...canonical,
          notes: [
            `Discovery query: ${candidate.query}`,
            candidate.description ? `Search evidence: ${candidate.description}` : "",
            result.draft.notes,
          ].filter(Boolean).join("\n"),
          sourceType: `${parsed.data.sourcingMode} autonomous web discovery`,
          sourceLastScrapedAt: new Date(),
        },
      });

      if (candidateDomain) knownDomains.add(candidateDomain);
      state.created.push({
        id: lead.id,
        companyName: lead.companyName,
        sourceUrl: result.draft.sourceUrl,
        warnings: result.warnings,
      });
    }

    revalidatePath("/");
    revalidatePath("/leads");
    revalidatePath("/sourcing");

    state.message = `Discovered ${candidates.length} candidate${candidates.length === 1 ? "" : "s"}; created ${state.created.length}, skipped ${state.skipped.length}, and failed ${state.errors.length}.`;
    return state;
  } catch (error) {
    return {
      ...state,
      message: error instanceof Error ? error.message : "Autonomous discovery failed.",
    };
  }
}

export async function scrapeLeadsAction(
  _previousState: SourcingActionState,
  formData: FormData,
): Promise<SourcingActionState> {
  const parsed = sourcingSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message || "Could not parse URLs.",
      created: [],
      errors: [],
    };
  }

  const state: SourcingActionState = {
    created: [],
    errors: [],
  };

  for (const url of parsed.data.urls) {
    const result = await scrapeLeadFromUrl(url, { sourcingMode: parsed.data.sourcingMode });

    if (!result.ok) {
      state.errors.push({
        url: result.url,
        error: result.error,
        warnings: result.warnings,
      });
      continue;
    }

    const canonical = await canonicalDataFor(result.draft.sourceUrl || result.draft.website);
    const scoring = applyAvailabilityCap(enrichLeadScores(result.draft), canonical.atsProvider);
    const lead = await prisma.lead.create({
      data: {
        ...result.draft,
        ...scoring,
        ...canonical,
        sourceLastScrapedAt: new Date(),
      },
    });

    state.created.push({
      id: lead.id,
      companyName: lead.companyName,
      sourceUrl: result.draft.sourceUrl,
      warnings: result.warnings,
    });
  }

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/sourcing");

  return {
    ...state,
    message: `Created ${state.created.length} ${parsed.data.sourcingMode.toLowerCase()} lead${state.created.length === 1 ? "" : "s"} from ${parsed.data.urls.length} URL${parsed.data.urls.length === 1 ? "" : "s"}.`,
  };
}

export async function importCsvAction(
  _previousState: CsvImportActionState,
  formData: FormData,
): Promise<CsvImportActionState> {
  const file = formData.get("csvFile");
  const pasted = String(formData.get("csvText") || "").trim();
  let csvText = pasted;

  if (file instanceof File && file.size > 0) {
    csvText = await file.text();
  }

  if (!csvText.trim()) {
    return {
      message: "Upload a CSV file or paste CSV text.",
      imported: [],
      errors: [],
    };
  }

  const records = parseCsvText(csvText);
  const state: CsvImportActionState = {
    imported: [],
    errors: [],
  };

  for (const [index, record] of records.entries()) {
    try {
      const leadInput = csvRecordToLead(record);

      if (!leadInput.companyName || leadInput.companyName === "Untitled imported lead") {
        throw new Error("Missing company_name");
      }

      const canonical = await canonicalDataFor(leadInput.canonicalUrl || leadInput.sourceUrl || leadInput.website);
      const scoring = applyAvailabilityCap(enrichLeadScores(leadInput), canonical.atsProvider);
      const lead = await prisma.lead.create({
        data: {
          ...leadInput,
          ...scoring,
          ...canonical,
        },
      });

      state.imported.push({
        id: lead.id,
        companyName: lead.companyName,
      });
    } catch (error) {
      state.errors.push({
        row: index + 2,
        error: error instanceof Error ? error.message : "Could not import row",
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/import-export");

  return {
    ...state,
    message: `Imported ${state.imported.length} lead${state.imported.length === 1 ? "" : "s"} from ${records.length} row${records.length === 1 ? "" : "s"}.`,
  };
}
