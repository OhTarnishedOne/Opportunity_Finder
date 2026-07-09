import { OUTREACH_TYPES, POSITIONING } from "@/lib/constants";

export type OutreachType = (typeof OUTREACH_TYPES)[number];

export type OutreachLead = {
  companyName: string;
  category: string;
  contactName?: string | null;
  contactTitle?: string | null;
  warmIntroSource?: string | null;
  notes?: string | null;
  suggestedOffer?: string | null;
  personalizedAngle?: string | null;
};

function firstName(name?: string | null) {
  return name?.split(" ")[0] || "there";
}

function positioningFor(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("family office")) return POSITIONING.familyOffice;
  if (normalized.includes("startup") || normalized.includes("fintech") || normalized.includes("ai startup")) {
    return POSITIONING.startup;
  }
  if (normalized.includes("hbcu") || normalized.includes("workforce") || normalized.includes("education")) {
    return POSITIONING.education;
  }
  return POSITIONING.default;
}

function angle(lead: OutreachLead) {
  return (
    lead.personalizedAngle ||
    lead.notes ||
    `your work in ${lead.category.toLowerCase()} and the opportunity to turn AI interest into a practical shipped product motion`
  );
}

function offer(lead: OutreachLead) {
  return lead.suggestedOffer || "AI Product Strategy Consultant";
}

export function generateOutreach(lead: OutreachLead, type: OutreachType) {
  const name = firstName(lead.contactName);
  const company = lead.companyName;
  const chosenOffer = offer(lead);
  const chosenAngle = angle(lead);
  const positioning = positioningFor(lead.category);

  switch (type) {
    case "Cold Email":
      return `Subject: Practical AI product help for ${company}

Hi ${name},

I came across ${company} and thought there may be a fit around ${chosenAngle}.

${positioning}

The reason I am reaching out is that I independently built and deployed LCS Engine, a decision intelligence platform for investing education. It includes a live frontend, backend, auth, billing, analytics, prediction workflows, calibration scoring, AI tutoring, paper trading, and institutional demo flows.

I am exploring a focused ${chosenOffer} conversation with teams that want practical AI product execution without turning it into a vague strategy exercise.

Would it be worth a short conversation to compare notes on where AI could create a useful shipped workflow for ${company}?`;

    case "Warm Intro Request":
      return `Hi ${lead.warmIntroSource || "there"},

Would you be open to introducing me to ${lead.contactName || `someone on the ${company} team`}?

I think there may be a relevant fit because ${chosenAngle}.

Short context you can forward:

Rico is a founder/operator and AI product builder who independently shipped LCS Engine, a decision intelligence platform for investing education. He helps fintech, wealth, education, and family office teams turn AI from a vague strategy conversation into shipped decision-intelligence products.

I would keep the ask lightweight: a short conversation about whether ${chosenOffer} could be useful for ${company}.`;

    case "LinkedIn DM":
      return `Hi ${name} - I saw ${company}'s work around ${lead.category.toLowerCase()} and thought there may be a practical AI/product fit.

I am a founder/operator who independently built and deployed LCS Engine, a decision intelligence platform for investing education.

${positioning}

Open to a quick conversation about whether a ${chosenOffer} sprint or pilot could be useful?`;

    case "Follow-up Email":
      return `Subject: Re: Practical AI product help for ${company}

Hi ${name},

Quick follow-up in case this got buried.

The specific angle I had in mind for ${company}: ${chosenAngle}.

I am not pitching generic AI advice. I have already shipped a full decision-intelligence product with auth, billing, analytics, market/economic data integrations, AI tutoring, and institutional demo flows.

If useful, I can share a concise view of what a ${chosenOffer} engagement could look like.`;

    case "Second Follow-up Email":
      return `Subject: Closing the loop

Hi ${name},

Closing the loop here.

I reached out because ${company} looks like the kind of team where practical AI product execution could matter, especially around ${chosenAngle}.

If this is not a priority now, no worries. If it is on the roadmap, I would be glad to compare notes and share what I learned building and shipping LCS Engine end to end.`;

    case "Proposal Blurb":
      return `${chosenOffer}: A focused engagement to help ${company} turn ${chosenAngle} into a practical AI-enabled workflow, pilot, or product plan. Rico brings founder/operator experience from independently building and deploying LCS Engine, a shipped decision intelligence platform for investing education with prediction, calibration, AI tutoring, billing, analytics, and institutional demo flows.`;

    case "Discovery Call Agenda":
      return `Discovery call agenda for ${company}

1. Current product, growth, or education priorities
2. Where AI is currently a vague conversation versus a practical workflow
3. Decision-maker, user, and buyer constraints
4. Relevance of LCS Engine proof-of-work to ${company}
5. Best-fit offer: ${chosenOffer}
6. Success criteria for a small pilot, sprint, or retainer
7. Next step and owner`;

    case "Referral Ask":
      return `Hi ${name},

I am looking for introductions to fintech, wealth, education, family office, and startup teams that want practical AI product help.

The best fit is a team trying to turn AI interest into shipped workflows, prototypes, decision-intelligence products, or institutional pilots.

If anyone comes to mind, I would be grateful for an intro. Short positioning: ${POSITIONING.default}`;

    case "Reactivation Note":
      return `Hi ${name},

Hope you have been well. I am reaching back out because my work has become more focused around practical AI product execution and decision intelligence.

Since we last connected, I independently built and deployed LCS Engine, an investing education platform that helps users make predictions about real economic events and measure how well their confidence matches outcomes.

I thought of ${company} because ${chosenAngle}. If this is relevant, I would be glad to reconnect and share what I am seeing.`;
  }
}

export function generateAllOutreach(lead: OutreachLead) {
  return OUTREACH_TYPES.map((type) => ({
    type,
    body: generateOutreach(lead, type),
  }));
}
