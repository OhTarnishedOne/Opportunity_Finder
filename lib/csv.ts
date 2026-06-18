export const CSV_HEADERS = [
  "id",
  "company_name",
  "category",
  "website",
  "location",
  "contact_name",
  "contact_title",
  "contact_email",
  "linkedin_url",
  "warm_intro_source",
  "notes",
  "estimated_budget",
  "urgency",
  "remote_friendly",
  "ability_to_pay",
  "fit_with_my_background",
  "need_for_ai_product_help",
  "relevance_to_lcs",
  "relevance_to_decision_intelligence",
  "family_office_or_wealth_fit",
  "institutional_education_fit",
  "accessibility_of_decision_maker",
  "warm_intro_strength",
  "remote_or_fractional_fit",
  "fit_score",
  "stage",
  "next_action",
  "last_contacted_date",
  "follow_up_date",
  "suggested_offer",
  "personalized_angle",
  "monthly_revenue_potential",
  "objection_risk",
  "confidence_level",
  "source_url",
  "source_type",
  "source_last_scraped_at",
  "source_confidence",
  "priority_level",
  "created_at",
  "updated_at",
];

type CsvLead = {
  [key: string]: unknown;
};

const FIELD_MAP: Record<string, string> = {
  company_name: "companyName",
  contact_name: "contactName",
  contact_title: "contactTitle",
  contact_email: "contactEmail",
  linkedin_url: "linkedinUrl",
  warm_intro_source: "warmIntroSource",
  estimated_budget: "estimatedBudget",
  remote_friendly: "remoteFriendly",
  ability_to_pay: "abilityToPay",
  fit_with_my_background: "fitWithMyBackground",
  need_for_ai_product_help: "needForAiProductHelp",
  relevance_to_lcs: "relevanceToLcs",
  relevance_to_decision_intelligence: "relevanceToDecisionIntelligence",
  family_office_or_wealth_fit: "familyOfficeOrWealthFit",
  institutional_education_fit: "institutionalEducationFit",
  accessibility_of_decision_maker: "accessibilityOfDecisionMaker",
  warm_intro_strength: "warmIntroStrength",
  remote_or_fractional_fit: "remoteOrFractionalFit",
  fit_score: "fitScore",
  next_action: "nextAction",
  last_contacted_date: "lastContactedDate",
  follow_up_date: "followUpDate",
  suggested_offer: "suggestedOffer",
  personalized_angle: "personalizedAngle",
  monthly_revenue_potential: "monthlyRevenuePotential",
  objection_risk: "objectionRisk",
  confidence_level: "confidenceLevel",
  source_url: "sourceUrl",
  source_type: "sourceType",
  source_last_scraped_at: "sourceLastScrapedAt",
  source_confidence: "sourceConfidence",
  priority_level: "priorityLevel",
  created_at: "createdAt",
  updated_at: "updatedAt",
};

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return "";
  const normalized = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }
  return normalized;
}

export function leadsToCsv(leads: CsvLead[]) {
  const rows = leads.map((lead) =>
    CSV_HEADERS.map((header) => {
      const key = FIELD_MAP[header] ?? header;
      return escapeCsv(lead[key]);
    }).join(","),
  );

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}
