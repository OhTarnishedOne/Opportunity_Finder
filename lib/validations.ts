import { z } from "zod";
import { CATEGORIES, REVENUE_POTENTIALS, STAGES } from "@/lib/constants";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : undefined))
  .optional();

const scoreInput = z.coerce.number().int().min(1).max(5);

export const leadFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  category: z.enum(CATEGORIES),
  website: optionalText,
  location: optionalText,
  contactName: optionalText,
  contactTitle: optionalText,
  contactEmail: z
    .string()
    .trim()
    .email("Use a valid email address")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  linkedinUrl: optionalText,
  warmIntroSource: optionalText,
  notes: optionalText,
  estimatedBudget: optionalText,
  urgency: scoreInput,
  remoteFriendly: z.preprocess((value) => value === true || value === "true", z.boolean()).default(true),
  abilityToPay: scoreInput,
  fitWithMyBackground: scoreInput,
  needForAiProductHelp: scoreInput,
  relevanceToLcs: scoreInput,
  relevanceToDecisionIntelligence: scoreInput,
  familyOfficeOrWealthFit: scoreInput,
  institutionalEducationFit: scoreInput,
  accessibilityOfDecisionMaker: scoreInput,
  warmIntroStrength: scoreInput,
  remoteOrFractionalFit: scoreInput,
  stage: z.enum(STAGES).default("Found"),
  nextAction: optionalText,
  lastContactedDate: optionalText,
  followUpDate: optionalText,
  personalizedAngle: optionalText,
  monthlyRevenuePotential: z.enum(REVENUE_POTENTIALS).optional().or(z.literal("")),
  objectionRisk: optionalText,
  confidenceLevel: optionalText,
});

export const stageUpdateSchema = z.object({
  id: z.string().min(1),
  stage: z.enum(STAGES),
  nextAction: optionalText,
  followUpDate: optionalText,
  lastContactedDate: optionalText,
  notes: optionalText,
});

export const sourcingSchema = z.object({
  urls: z
    .string()
    .trim()
    .min(1, "Paste at least one public URL")
    .transform((value) =>
      value
        .split(/\n|,/)
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, 10),
    ),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
