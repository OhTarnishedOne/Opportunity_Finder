import {
  SCORE_FIELDS,
  SCORE_WEIGHTS,
  type CATEGORIES,
  type PRIORITIES,
} from "@/lib/constants";
import { clampScore } from "@/lib/utils";

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type ScorableLead = Record<(typeof SCORE_FIELDS)[number]["key"], number>;

export function calculateFitScore(lead: ScorableLead) {
  const weighted = SCORE_FIELDS.reduce((total, field) => {
    const value = clampScore(Number(lead[field.key] ?? 1));
    return total + (value / 5) * SCORE_WEIGHTS[field.key];
  }, 0);

  return Math.round(weighted);
}

export function categorizePriority(score: number): Priority {
  if (score >= 85) return "Must Contact";
  if (score >= 70) return "Strong Lead";
  if (score >= 55) return "Worth Testing";
  if (score >= 40) return "Low Priority";
  return "Ignore for Now";
}

export function scoreBreakdown(lead: ScorableLead) {
  return SCORE_FIELDS.map((field) => {
    const score = clampScore(Number(lead[field.key] ?? 1));
    const weight = SCORE_WEIGHTS[field.key];
    const contribution = Math.round((score / 5) * weight);

    return {
      key: field.key,
      label: field.label,
      score,
      weight,
      contribution,
    };
  });
}

export function recommendOffer(category: string, fitScore: number) {
  const normalized = category.toLowerCase();

  if (normalized.includes("family office")) {
    return fitScore >= 82 ? "Family Office Innovation Scout" : "AI Workflow Audit";
  }

  if (normalized.includes("ria") || normalized.includes("wealth manager")) {
    return fitScore >= 78
      ? "Investment Education Platform Consultant"
      : "AI Financial Literacy Consultant";
  }

  if (normalized.includes("fintech")) {
    return fitScore >= 78 ? "Fractional AI Product Lead" : "AI Product Strategy Consultant";
  }

  if (normalized.includes("ai startup")) {
    return fitScore >= 78 ? "Fractional AI Product Lead" : "AI Product Strategy Consultant";
  }

  if (normalized.includes("hbcu") || normalized.includes("workforce")) {
    return fitScore >= 75 ? "LCS Institutional Pilot" : "Calibration/Prediction Lab Workshop";
  }

  if (normalized.includes("credit union")) {
    return fitScore >= 78 ? "LCS Institutional Pilot" : "AI Financial Literacy Consultant";
  }

  if (normalized.includes("edtech")) {
    return fitScore >= 75 ? "Decision Intelligence Consultant" : "Product Strategy Sprint";
  }

  if (normalized.includes("prediction")) {
    return fitScore >= 75
      ? "Decision Intelligence Consultant"
      : "Calibration/Prediction Lab Workshop";
  }

  if (normalized.includes("venture") || normalized.includes("accelerator") || normalized.includes("studio")) {
    return fitScore >= 76 ? "Startup Operator-in-Residence" : "Product Strategy Sprint";
  }

  if (normalized.includes("investment platform") || normalized.includes("wealthtech")) {
    return fitScore >= 76
      ? "Investment Education Platform Consultant"
      : "AI Product Strategy Consultant";
  }

  return fitScore >= 75 ? "AI Product Strategy Consultant" : "Product Strategy Sprint";
}

export function recommendRevenuePotential(category: string, fitScore: number) {
  const normalized = category.toLowerCase();

  if (normalized.includes("hbcu") || normalized.includes("credit union") || normalized.includes("education")) {
    return "$15K-$25K institutional pilot/license";
  }

  if (normalized.includes("family office")) {
    return fitScore >= 80 ? "$10K-$20K/month retainer" : "$5K-$10K/month retainer";
  }

  if (normalized.includes("startup") || normalized.includes("venture") || normalized.includes("accelerator")) {
    return fitScore >= 82 ? "$10K-$20K/month retainer" : "Advisor/equity opportunity";
  }

  if (normalized.includes("ria") || normalized.includes("wealth") || normalized.includes("investment")) {
    return fitScore >= 75 ? "$5K-$10K/month retainer" : "$2K-$5K project";
  }

  return fitScore >= 80 ? "$10K-$20K/month retainer" : "$2K-$5K project";
}

export function enrichLeadScores<T extends ScorableLead & { category: string; monthlyRevenuePotential?: string | null }>(
  lead: T,
) {
  const fitScore = calculateFitScore(lead);
  return {
    fitScore,
    priorityLevel: categorizePriority(fitScore),
    suggestedOffer: recommendOffer(lead.category, fitScore),
    monthlyRevenuePotential:
      lead.monthlyRevenuePotential || recommendRevenuePotential(lead.category, fitScore),
  };
}

export function applyAvailabilityCap<T extends { fitScore: number; priorityLevel: string }>(scoring: T, atsProvider?: string) {
  if (atsProvider && atsProvider !== "UNKNOWN" && atsProvider !== "OTHER") return scoring;

  const fitScore = Math.min(scoring.fitScore, 69);
  return {
    ...scoring,
    fitScore,
    priorityLevel: categorizePriority(fitScore),
  };
}
