import type { ATS_PROVIDERS, VERIFICATION_STATUSES } from "@/lib/constants";

export type AtsProvider = (typeof ATS_PROVIDERS)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export type CanonicalizationResult = {
  canonicalUrl?: string;
  sourceUrl?: string;
  atsProvider: AtsProvider;
  atsBoardToken?: string;
  atsExternalId?: string;
  warning?: string;
};

export type VerifiableOpportunity = {
  id: string;
  companyName: string;
  canonicalUrl: string | null;
  sourceUrl: string | null;
  atsProvider: string;
  atsExternalId: string | null;
  atsBoardToken: string | null;
};

export type VerificationResult = {
  status: VerificationStatus;
  staleReason?: string;
  checkedUrl?: string;
  detail?: string;
};
