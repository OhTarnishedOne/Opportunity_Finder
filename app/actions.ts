"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { enrichLeadScores } from "@/lib/scoring";
import { leadFormSchema, stageUpdateSchema } from "@/lib/validations";

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
