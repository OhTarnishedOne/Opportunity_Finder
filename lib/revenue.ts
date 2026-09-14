import { REVENUE_ASSUMPTIONS, STAGES } from "@/lib/constants";

export type RevenueLead = {
  category: string;
  stage: string;
  fitScore: number;
  warmIntroStrength: number;
  monthlyRevenuePotential?: string | null;
};

export function revenueValue(potential?: string | null) {
  switch (potential) {
    case "$2K-$5K project":
      return REVENUE_ASSUMPTIONS.averageStarterProject;
    case "$5K-$10K/month retainer":
      return REVENUE_ASSUMPTIONS.averageRetainer;
    case "$10K-$20K/month retainer":
      return REVENUE_ASSUMPTIONS.premiumRetainer;
    case "$15K-$25K institutional pilot/license":
      return REVENUE_ASSUMPTIONS.institutionalPilot;
    case "Full-time role":
      return 0;
    case "Advisor/equity opportunity":
      return 2500;
    default:
      return REVENUE_ASSUMPTIONS.averageStarterProject;
  }
}

function stageCloseProbability(stage: string, warmIntroStrength: number) {
  const warmCallRate =
    warmIntroStrength >= 3
      ? REVENUE_ASSUMPTIONS.warmLeadToCall
      : REVENUE_ASSUMPTIONS.coldLeadToCall;

  if (stage === "Won") return 1;
  if (stage === "Lost") return 0;
  if (stage === "Proposal Sent") return REVENUE_ASSUMPTIONS.proposalToClose;
  if (stage === "Call Booked") {
    return REVENUE_ASSUMPTIONS.callToProposal * REVENUE_ASSUMPTIONS.proposalToClose;
  }
  if (["Sent", "Followed Up", "Outreach Drafted"].includes(stage)) {
    return warmCallRate * REVENUE_ASSUMPTIONS.callToProposal * REVENUE_ASSUMPTIONS.proposalToClose;
  }

  return warmCallRate * REVENUE_ASSUMPTIONS.callToProposal * REVENUE_ASSUMPTIONS.proposalToClose;
}

export function forecastLeadValue(lead: RevenueLead) {
  const value = revenueValue(lead.monthlyRevenuePotential);
  const probability = stageCloseProbability(lead.stage, lead.warmIntroStrength);
  const qualityMultiplier = Math.max(0.5, lead.fitScore / 100);

  return {
    bestCase: value,
    realistic: Math.round(value * probability * qualityMultiplier),
    conservative: Math.round(value * probability * 0.5),
  };
}

export function buildRevenueForecast(leads: RevenueLead[]) {
  const totals = leads.reduce(
    (acc, lead) => {
      const value = forecastLeadValue(lead);
      acc.bestCase += value.bestCase;
      acc.realistic += value.realistic;
      acc.conservative += value.conservative;
      return acc;
    },
    { bestCase: 0, realistic: 0, conservative: 0 },
  );

  const activeConversationValue =
    REVENUE_ASSUMPTIONS.callToProposal *
    REVENUE_ASSUMPTIONS.proposalToClose *
    REVENUE_ASSUMPTIONS.averageRetainer;

  const categoryTotals = aggregateBy(leads, "category");
  const stageTotals = aggregateBy(leads, "stage");

  return {
    ...totals,
    activeConversationsFor10k: Math.ceil(10000 / activeConversationValue),
    activeConversationsFor20k: Math.ceil(20000 / activeConversationValue),
    categoryTotals,
    stageTotals,
  };
}

function aggregateBy(leads: RevenueLead[], key: "category" | "stage") {
  return leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead[key]] = (acc[lead[key]] ?? 0) + revenueValue(lead.monthlyRevenuePotential);
    return acc;
  }, {});
}

export function emptyStageTotals() {
  return STAGES.reduce<Record<string, number>>((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {});
}
