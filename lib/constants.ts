export const APP_NAME = "Opportunity Finder OS";

export const CATEGORIES = [
  "Family Office",
  "RIA / Wealth Manager",
  "Fintech Startup",
  "AI Startup",
  "Credit Union",
  "HBCU / Workforce Program",
  "Financial Literacy Organization",
  "Venture Studio",
  "Accelerator",
  "Edtech Company",
  "Prediction Market Company",
  "Investment Platform",
  "Startup Studio",
  "Wealthtech Platform",
  "Economic Research / Market Intelligence",
] as const;

export const STAGES = [
  "Found",
  "Researched",
  "Scored",
  "Outreach Drafted",
  "Sent",
  "Followed Up",
  "Call Booked",
  "Proposal Sent",
  "Won",
  "Lost",
  "Park",
  "Nurture",
] as const;

export const PRIORITIES = [
  "Must Contact",
  "Strong Lead",
  "Worth Testing",
  "Low Priority",
  "Ignore for Now",
] as const;

export const REVENUE_POTENTIALS = [
  "$2K-$5K project",
  "$5K-$10K/month retainer",
  "$10K-$20K/month retainer",
  "$15K-$25K institutional pilot/license",
  "Full-time role",
  "Advisor/equity opportunity",
] as const;

export const OFFERS = [
  "Fractional AI Product Lead",
  "AI Product Strategy Consultant",
  "Family Office Innovation Scout",
  "Decision Intelligence Consultant",
  "Investment Education Platform Consultant",
  "AI Financial Literacy Consultant",
  "Startup Operator-in-Residence",
  "LCS Institutional Pilot",
  "LCS Licensing Conversation",
  "Calibration/Prediction Lab Workshop",
  "AI Workflow Audit",
  "Product Strategy Sprint",
] as const;

export const OUTREACH_TYPES = [
  "Cold Email",
  "Warm Intro Request",
  "LinkedIn DM",
  "Follow-up Email",
  "Second Follow-up Email",
  "Proposal Blurb",
  "Discovery Call Agenda",
  "Referral Ask",
  "Reactivation Note",
] as const;

export const SOURCING_MODES = [
  "General",
  "Family Offices",
  "Startups",
  "Universities / Institutions",
  "Credit Unions / Wealth",
] as const;

export const ATS_PROVIDERS = ["GREENHOUSE", "LEVER", "ASHBY", "WORKDAY", "OTHER", "UNKNOWN"] as const;

export const VERIFICATION_STATUSES = ["UNVERIFIED", "ACTIVE", "STALE", "ERROR"] as const;

export const TERMINAL_STAGES = ["Won", "Lost", "Park"] as const;

export const SCORE_FIELDS = [
  { key: "abilityToPay", label: "Ability to pay" },
  { key: "fitWithMyBackground", label: "Fit with Rico's background" },
  { key: "needForAiProductHelp", label: "Need for AI product help" },
  { key: "relevanceToLcs", label: "Relevance to LCS Engine" },
  { key: "relevanceToDecisionIntelligence", label: "Decision intelligence fit" },
  { key: "familyOfficeOrWealthFit", label: "Family office / wealth fit" },
  { key: "institutionalEducationFit", label: "Institutional education fit" },
  { key: "accessibilityOfDecisionMaker", label: "Decision-maker access" },
  { key: "warmIntroStrength", label: "Warm intro strength" },
  { key: "urgency", label: "Urgency" },
  { key: "remoteOrFractionalFit", label: "Remote / fractional fit" },
] as const;

export const SCORE_WEIGHTS: Record<(typeof SCORE_FIELDS)[number]["key"], number> = {
  abilityToPay: 20,
  fitWithMyBackground: 15,
  needForAiProductHelp: 15,
  relevanceToLcs: 15,
  relevanceToDecisionIntelligence: 0,
  familyOfficeOrWealthFit: 0,
  institutionalEducationFit: 0,
  accessibilityOfDecisionMaker: 10,
  warmIntroStrength: 10,
  urgency: 10,
  remoteOrFractionalFit: 5,
};

export const REVENUE_ASSUMPTIONS = {
  coldLeadToCall: 0.1,
  warmLeadToCall: 0.3,
  callToProposal: 0.25,
  proposalToClose: 0.3,
  averageStarterProject: 3000,
  averageRetainer: 7500,
  premiumRetainer: 15000,
  institutionalPilot: 20000,
};

export const POSITIONING = {
  default:
    "I help fintech, wealth, education, and family office teams turn AI from a vague strategy conversation into shipped decision-intelligence products.",
  familyOffice:
    "I help family offices evaluate and deploy practical AI tools around investment education, decision quality, portfolio learning, and next-gen financial literacy.",
  startup:
    "I help early-stage fintech and AI founders turn product ambiguity into shipped AI workflows, prototypes, and customer-facing features.",
  education:
    "I help institutions teach decision-making under uncertainty using prediction, calibration, and applied AI.",
};
