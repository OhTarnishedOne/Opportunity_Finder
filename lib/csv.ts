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

const REVERSE_FIELD_MAP = Object.fromEntries(Object.entries(FIELD_MAP).map(([csvKey, appKey]) => [appKey, csvKey]));

export type CsvImportLead = {
  companyName: string;
  category: string;
  website?: string;
  location?: string;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  warmIntroSource?: string;
  notes?: string;
  estimatedBudget?: string;
  urgency: number;
  remoteFriendly: boolean;
  abilityToPay: number;
  fitWithMyBackground: number;
  needForAiProductHelp: number;
  relevanceToLcs: number;
  relevanceToDecisionIntelligence: number;
  familyOfficeOrWealthFit: number;
  institutionalEducationFit: number;
  accessibilityOfDecisionMaker: number;
  warmIntroStrength: number;
  remoteOrFractionalFit: number;
  stage: string;
  nextAction?: string;
  lastContactedDate?: Date;
  followUpDate?: Date;
  personalizedAngle?: string;
  monthlyRevenuePotential?: string;
  objectionRisk?: string;
  confidenceLevel?: string;
  sourceUrl?: string;
  sourceType?: string;
  sourceLastScrapedAt?: Date;
  sourceConfidence: number;
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

export function parseCsvText(csvText: string): Array<Record<string, string>> {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  const records: Array<Record<string, string>> = [];

  for (const row of rows.slice(1)) {
    if (!row.some((cell) => cell.trim().length > 0)) continue;

    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      const appKey = FIELD_MAP[header] ?? header;
      record[appKey] = row[index]?.trim() ?? "";
    });

    records.push(record);
  }

  return records;
}

export function csvRecordToLead(record: Record<string, string>): CsvImportLead {
  const lead = {
    companyName: getText(record, "companyName") || "Untitled imported lead",
    category: getText(record, "category") || "Financial Literacy Organization",
    website: getText(record, "website"),
    location: getText(record, "location"),
    contactName: getText(record, "contactName"),
    contactTitle: getText(record, "contactTitle"),
    contactEmail: getText(record, "contactEmail"),
    linkedinUrl: getText(record, "linkedinUrl"),
    warmIntroSource: getText(record, "warmIntroSource"),
    notes: getText(record, "notes"),
    estimatedBudget: getText(record, "estimatedBudget"),
    urgency: getScore(record, "urgency", 3),
    remoteFriendly: getBoolean(record, "remoteFriendly", true),
    abilityToPay: getScore(record, "abilityToPay", 3),
    fitWithMyBackground: getScore(record, "fitWithMyBackground", 3),
    needForAiProductHelp: getScore(record, "needForAiProductHelp", 3),
    relevanceToLcs: getScore(record, "relevanceToLcs", 3),
    relevanceToDecisionIntelligence: getScore(record, "relevanceToDecisionIntelligence", 3),
    familyOfficeOrWealthFit: getScore(record, "familyOfficeOrWealthFit", 3),
    institutionalEducationFit: getScore(record, "institutionalEducationFit", 3),
    accessibilityOfDecisionMaker: getScore(record, "accessibilityOfDecisionMaker", 3),
    warmIntroStrength: getScore(record, "warmIntroStrength", 1),
    remoteOrFractionalFit: getScore(record, "remoteOrFractionalFit", 3),
    stage: getText(record, "stage") || "Found",
    nextAction: getText(record, "nextAction"),
    lastContactedDate: getDate(record, "lastContactedDate"),
    followUpDate: getDate(record, "followUpDate"),
    personalizedAngle: getText(record, "personalizedAngle"),
    monthlyRevenuePotential: getText(record, "monthlyRevenuePotential"),
    objectionRisk: getText(record, "objectionRisk"),
    confidenceLevel: getText(record, "confidenceLevel"),
    sourceUrl: getText(record, "sourceUrl"),
    sourceType: getText(record, "sourceType") || "CSV import",
    sourceLastScrapedAt: getDate(record, "sourceLastScrapedAt"),
    sourceConfidence: getScore(record, "sourceConfidence", 1),
  };

  return lead;
}

export function csvHeaderForAppField(appField: string) {
  return REVERSE_FIELD_MAP[appField] ?? appField;
}

function parseCsvRows(csvText: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows;
}

function getText(record: Record<string, string>, key: string) {
  const value = record[key] ?? record[csvHeaderForAppField(key)] ?? "";
  return value.trim() || undefined;
}

function getScore(record: Record<string, string>, key: string, fallback: number) {
  const value = Number(getText(record, key));
  if (!Number.isFinite(value)) return fallback;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function getBoolean(record: Record<string, string>, key: string, fallback: boolean) {
  const value = getText(record, key);
  if (!value) return fallback;
  return ["true", "yes", "1", "y"].includes(value.toLowerCase());
}

function getDate(record: Record<string, string>, key: string) {
  const value = getText(record, key);
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function importableCsvHeaders() {
  return CSV_HEADERS.filter((header) => !["id", "fit_score", "suggested_offer", "priority_level", "created_at", "updated_at"].includes(header));
}
