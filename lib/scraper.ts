import * as cheerio from "cheerio";
import { CATEGORIES, SCORE_FIELDS } from "@/lib/constants";

const USER_AGENT = "OpportunityFinderOS/1.0 (+local-first lead research; respects public pages)";
const MAX_HTML_BYTES = 1_500_000;

type ScoreKey = (typeof SCORE_FIELDS)[number]["key"];

export type ScrapedLeadDraft = Record<ScoreKey, number> & {
  companyName: string;
  category: string;
  website: string;
  location?: string;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  notes: string;
  personalizedAngle: string;
  estimatedBudget?: string;
  stage: string;
  nextAction: string;
  sourceUrl: string;
  sourceType: string;
  sourceConfidence: number;
  remoteFriendly: boolean;
  objectionRisk: string;
  confidenceLevel: string;
};

type ScrapeResult =
  | {
      ok: true;
      draft: ScrapedLeadDraft;
      warnings: string[];
    }
  | {
      ok: false;
      url: string;
      error: string;
      warnings: string[];
    };

const TITLE_PATTERNS =
  /(director|program director|executive director|head of|vp|vice president|chief|ceo|founder|co-founder|partner|principal|managing partner|dean|professor|chair|innovation|entrepreneurship|financial wellness|community impact|product|strategy)/i;

export async function scrapeLeadFromUrl(rawUrl: string): Promise<ScrapeResult> {
  const warnings: string[] = [];
  const url = normalizeUrl(rawUrl);

  if (!url) {
    return { ok: false, url: rawUrl, error: "Invalid URL", warnings };
  }

  if (isBlockedHost(url)) {
    return {
      ok: false,
      url: url.toString(),
      error: "This host is intentionally blocked. Use public organization pages, not LinkedIn or logged-in directories.",
      warnings,
    };
  }

  const robots = await canFetchByRobots(url);
  if (!robots.allowed) {
    return {
      ok: false,
      url: url.toString(),
      error: "robots.txt appears to disallow fetching this path.",
      warnings: [...warnings, robots.reason],
    };
  }

  if (robots.reason) warnings.push(robots.reason);

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    return {
      ok: false,
      url: url.toString(),
      error: `Fetch failed with HTTP ${response.status}`,
      warnings,
    };
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return {
      ok: false,
      url: url.toString(),
      error: "URL did not return an HTML page.",
      warnings,
    };
  }

  const html = await readLimitedText(response, MAX_HTML_BYTES);
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, iframe").remove();

  const title = cleanText(
    $('meta[property="og:title"]').attr("content") ||
      $("title").first().text() ||
      $("h1").first().text() ||
      url.hostname,
  );
  const description = cleanText(
    $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "",
  );
  const siteName = cleanText($('meta[property="og:site_name"]').attr("content") || "");
  const pageText = cleanText($("body").text());
  const lines = textLines(pageText);

  const companyName = inferCompanyName({ title, siteName, hostname: url.hostname });
  const category = inferCategory(`${title} ${description} ${pageText} ${url.hostname}`);
  const email = extractEmail(pageText);
  const linkedinUrl = extractLinkedInUrl($);
  const contact = extractContact(lines);
  const location = extractLocation(lines);
  const sourceConfidence = calculateSourceConfidence({ contactName: contact.name, contactTitle: contact.title, email, description });

  if (!contact.name) warnings.push("No obvious public contact name was found; review the page manually.");
  if (!email) warnings.push("No public email was found; use an official contact form or warm intro path.");

  const notes = [
    `Source: ${url.toString()}`,
    `Scraped evidence: ${description || firstUsefulLine(lines) || title}`,
    contact.name || contact.title ? `Possible decision-maker: ${[contact.name, contact.title].filter(Boolean).join(" - ")}` : "",
    email ? `Public email found on page: ${email}` : "No public email found; do not guess private emails.",
    linkedinUrl ? `Public LinkedIn link found on page: ${linkedinUrl}` : "",
    "Review before outreach. This scraper extracts public-page clues and may need manual correction.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ok: true,
    warnings,
    draft: {
      companyName,
      category,
      website: originFromUrl(url),
      location,
      contactName: contact.name,
      contactTitle: contact.title,
      contactEmail: email,
      linkedinUrl,
      notes,
      personalizedAngle: personalizedAngleFor(category, companyName),
      estimatedBudget: estimatedBudgetFor(category),
      stage: "Found",
      nextAction: "Review scraped lead, verify decision-maker, and identify warm intro path",
      sourceUrl: url.toString(),
      sourceType: "Public web page",
      sourceConfidence,
      remoteFriendly: true,
      objectionRisk: "Scraped lead requires manual verification before outreach.",
      confidenceLevel: sourceConfidence >= 4 ? "Medium-high after manual review" : "Low until reviewed",
      ...scoresFor(category, sourceConfidence),
    },
  };
}

function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

function isBlockedHost(url: URL) {
  const host = url.hostname.toLowerCase();
  return ["linkedin.com", "www.linkedin.com", "facebook.com", "x.com", "twitter.com"].some(
    (blocked) => host === blocked || host.endsWith(`.${blocked}`),
  );
}

async function canFetchByRobots(url: URL) {
  try {
    const robotsUrl = new URL("/robots.txt", url.origin);
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      return { allowed: true, reason: "robots.txt not available; fetched only the provided URL." };
    }

    const robots = await response.text();
    const disallowed = disallowedPathsForStarUserAgent(robots);
    const blockedPath = disallowed.find((path) => path !== "" && url.pathname.startsWith(path));

    if (blockedPath) {
      return { allowed: false, reason: `robots.txt disallows ${blockedPath}` };
    }

    return { allowed: true, reason: "" };
  } catch {
    return { allowed: true, reason: "Could not read robots.txt; fetched only the provided URL." };
  }
}

function disallowedPathsForStarUserAgent(robots: string) {
  const paths: string[] = [];
  let applies = false;

  for (const rawLine of robots.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;

    const [fieldRaw, ...valueParts] = line.split(":");
    const field = fieldRaw?.trim().toLowerCase();
    const value = valueParts.join(":").trim();

    if (field === "user-agent") {
      applies = value === "*";
    } else if (applies && field === "disallow") {
      paths.push(value);
    } else if (field === "allow" && applies) {
      // Keep the parser intentionally conservative and simple for an MVP.
    }
  }

  return paths;
}

async function readLimitedText(response: Response, maxBytes: number) {
  const text = await response.text();
  return text.length > maxBytes ? text.slice(0, maxBytes) : text;
}

function cleanText(value?: string | null) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function textLines(value: string) {
  return value
    .split(/(?<=[.!?])\s+|\n+/)
    .map(cleanText)
    .filter((line) => line.length >= 8 && line.length <= 220);
}

function inferCompanyName({ title, siteName, hostname }: { title: string; siteName: string; hostname: string }) {
  const candidate = siteName || title.split("|")[0].split("-")[0].trim();
  if (candidate && candidate.length >= 3 && candidate.length <= 80) return candidate;
  return hostname.replace(/^www\./, "").split(".")[0].replaceAll("-", " ");
}

function inferCategory(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("family office")) return "Family Office";
  if (normalized.includes("credit union")) return "Credit Union";
  if (normalized.includes("business school") || normalized.includes("university") || normalized.includes("workforce")) {
    return "HBCU / Workforce Program";
  }
  if (normalized.includes("wealthtech")) return "Wealthtech Platform";
  if (normalized.includes("wealth manager") || normalized.includes("ria")) return "RIA / Wealth Manager";
  if (normalized.includes("prediction market")) return "Prediction Market Company";
  if (normalized.includes("venture studio")) return "Venture Studio";
  if (normalized.includes("accelerator")) return "Accelerator";
  if (normalized.includes("edtech") || normalized.includes("education technology")) return "Edtech Company";
  if (normalized.includes("fintech")) return "Fintech Startup";
  if (normalized.includes("artificial intelligence") || normalized.includes(" ai ")) return "AI Startup";
  if (normalized.includes("investment platform")) return "Investment Platform";

  return CATEGORIES.includes("Financial Literacy Organization") ? "Financial Literacy Organization" : CATEGORIES[0];
}

function extractEmail(text: string) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0];
}

function extractLinkedInUrl($: cheerio.CheerioAPI) {
  const href = $("a")
    .map((_, element) => $(element).attr("href") || "")
    .get()
    .find((link) => /linkedin\.com\/(in|company)\//i.test(link));

  return href;
}

function extractContact(lines: string[]) {
  for (const line of lines) {
    if (!TITLE_PATTERNS.test(line)) continue;

    const compact = line.replace(/\s+/g, " ").trim();
    const dashParts = compact.split(/\s[-–|]\s/).map(cleanText);
    const commaParts = compact.split(",").map(cleanText);
    const parts = dashParts.length > 1 ? dashParts : commaParts;

    const namePart = parts.find((part) => looksLikePersonName(part));
    const titlePart = parts.find((part) => TITLE_PATTERNS.test(part) && !looksLikePersonName(part));

    if (namePart || titlePart) {
      return {
        name: namePart,
        title: titlePart || compact.slice(0, 120),
      };
    }
  }

  return {};
}

function looksLikePersonName(value: string) {
  const words = value.split(/\s+/);
  return (
    words.length >= 2 &&
    words.length <= 4 &&
    words.every((word) => /^[A-Z][a-z'.-]+$/.test(word)) &&
    !TITLE_PATTERNS.test(value)
  );
}

function extractLocation(lines: string[]) {
  const line = lines.find((item) => /\b(NY|MA|CA|GA|DC|TX|IL|FL|PA|WA|Boston|New York|Atlanta|Chicago|Remote)\b/.test(item));
  return line?.slice(0, 80);
}

function calculateSourceConfidence({
  contactName,
  contactTitle,
  email,
  description,
}: {
  contactName?: string;
  contactTitle?: string;
  email?: string;
  description: string;
}) {
  let score = 2;
  if (description) score += 1;
  if (contactName) score += 1;
  if (contactTitle) score += 1;
  if (email) score += 1;
  return Math.min(5, score);
}

function personalizedAngleFor(category: string, companyName: string) {
  if (category === "HBCU / Workforce Program" || category === "Financial Literacy Organization" || category === "Edtech Company") {
    return `${companyName} may be a fit for a decision-intelligence workshop or institutional pilot that teaches prediction, calibration, and applied AI for financial and business decision-making.`;
  }

  if (category === "Family Office" || category === "RIA / Wealth Manager" || category === "Wealthtech Platform") {
    return `${companyName} may be a fit for practical AI tools around investment education, decision quality, portfolio learning, and next-gen financial literacy.`;
  }

  return `${companyName} may be a fit for turning AI/product ambiguity into shipped workflows, prototypes, or customer-facing decision-intelligence features.`;
}

function estimatedBudgetFor(category: string) {
  if (category === "HBCU / Workforce Program" || category === "Credit Union") return "$15K-$25K institutional pilot/license";
  if (category === "Family Office" || category === "Fintech Startup" || category === "Wealthtech Platform") return "$10K-$20K/month";
  return "$5K-$10K/month";
}

function scoresFor(category: string, sourceConfidence: number): Record<ScoreKey, number> {
  const institutional = ["HBCU / Workforce Program", "Financial Literacy Organization", "Edtech Company", "Credit Union"].includes(category);
  const wealth = ["Family Office", "RIA / Wealth Manager", "Wealthtech Platform", "Investment Platform"].includes(category);
  const startup = ["Fintech Startup", "AI Startup", "Venture Studio", "Accelerator"].includes(category);

  return {
    abilityToPay: institutional || wealth ? 4 : 3,
    fitWithMyBackground: 5,
    needForAiProductHelp: startup ? 5 : 4,
    relevanceToLcs: institutional || wealth ? 5 : 4,
    relevanceToDecisionIntelligence: 5,
    familyOfficeOrWealthFit: wealth ? 5 : 2,
    institutionalEducationFit: institutional ? 5 : 2,
    accessibilityOfDecisionMaker: Math.min(4, Math.max(2, sourceConfidence)),
    warmIntroStrength: 1,
    urgency: 3,
    remoteOrFractionalFit: 4,
  };
}

function firstUsefulLine(lines: string[]) {
  return lines.find((line) => /innovation|entrepreneur|financial|education|AI|invest|program|product/i.test(line));
}

function originFromUrl(url: URL) {
  return `${url.protocol}//${url.hostname}`;
}
