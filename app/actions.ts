"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { scrapeLeadFromUrl } from "@/lib/scraper";
import { enrichLeadScores } from "@/lib/scoring";
import { leadFormSchema, sourcingSchema, stageUpdateSchema } from "@/lib/validations";

function dateOrNull(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export async function createLeadAction(formData: FormData) {
  const parsed = leadFormSchema.parse(Object.fromEntries(formData.entries()));
  const scoring = enrichLeadScores(parsed);

  const lead = await prisma.lead.create({
    data: {
      ...parsed,
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

    const scoring = enrichLeadScores(result.draft);
    const lead = await prisma.lead.create({
      data: {
        ...result.draft,
        ...scoring,
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
