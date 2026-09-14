import { SOURCING_MODES } from "@/lib/constants";
import type { SourcingMode } from "@/lib/scraper";

const BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";

export type DiscoveryCandidate = {
  url: string;
  title: string;
  description: string;
  query: string;
};

export type DiscoveryInput = {
  sourcingMode: SourcingMode;
  focus?: string;
  location?: string;
  maxResults?: number;
};

type BraveSearchResponse = {
  web?: {
    results?: Array<{
      title?: string;
      url?: string;
      description?: string;
    }>;
  };
};

const BLOCKED_HOSTS = new Set([
  "linkedin.com",
  "www.linkedin.com",
  "facebook.com",
  "www.facebook.com",
  "x.com",
  "twitter.com",
  "www.twitter.com",
  "instagram.com",
  "www.instagram.com",
  "youtube.com",
  "www.youtube.com",
  "crunchbase.com",
  "www.crunchbase.com",
  "pitchbook.com",
  "www.pitchbook.com",
  "bloomberg.com",
  "www.bloomberg.com",
  "forbes.com",
  "www.forbes.com",
  "wikipedia.org",
  "www.wikipedia.org",
]);

const MODE_QUERIES: Record<(typeof SOURCING_MODES)[number], string[]> = {
  General: [
    'B2B company "AI" operations "about us"',
    'professional services firm automation workflow "about"',
    'investment firm technology innovation team "about"',
  ],
  "Family Offices": [
    '"family office" investment team innovation -conference -jobs',
    '"multi-family office" wealth management technology -conference -jobs',
    '"family office" "next generation" wealth education -conference',
    '"family office" AI automation investment operations -conference',
  ],
  Startups: [
    'fintech startup "Series A" "about us" -jobs -news',
    'B2B SaaS startup "Series B" operations "about" -jobs -news',
    'applied AI startup enterprise "about us" -jobs -news',
    'wealthtech startup "about us" -jobs -news',
  ],
  "Universities / Institutions": [
    'university entrepreneurship center applied AI program',
    'university financial wellness innovation program',
    'university executive education AI strategy program',
  ],
  "Credit Unions / Wealth": [
    'credit union innovation digital strategy member experience',
    'RIA wealth management technology innovation firm',
    'wealth management firm AI client experience "about us"',
    'wealthtech platform financial education "about us"',
  ],
};

export async function discoverCandidates(input: DiscoveryInput): Promise<DiscoveryCandidate[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error("BRAVE_SEARCH_API_KEY is not configured. Add it to .env.local before running autonomous discovery.");
  }

  const maxResults = Math.min(Math.max(input.maxResults ?? 10, 1), 20);
  const queries = buildQueries(input);
  const perQuery = Math.min(10, Math.max(4, Math.ceil(maxResults / Math.max(queries.length, 1)) + 2));
  const candidates: DiscoveryCandidate[] = [];
  const seenDomains = new Set<string>();

  for (const query of queries) {
    const url = new URL(BRAVE_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("country", "US");
    url.searchParams.set("search_lang", "en");
    url.searchParams.set("count", String(perQuery));

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Brave Search request failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as BraveSearchResponse;

    for (const result of payload.web?.results ?? []) {
      if (!result.url) continue;
      const normalized = normalizeCandidate(result.url);
      if (!normalized) continue;
      if (seenDomains.has(normalized.domain)) continue;

      seenDomains.add(normalized.domain);
      candidates.push({
        url: normalized.url,
        title: result.title?.trim() || normalized.domain,
        description: result.description?.trim() || "",
        query,
      });

      if (candidates.length >= maxResults) return candidates;
    }
  }

  return candidates;
}

function buildQueries(input: DiscoveryInput) {
  const baseQueries = input.focus?.trim() ? [input.focus.trim()] : MODE_QUERIES[input.sourcingMode];
  const location = input.location?.trim();

  return baseQueries.map((query) => {
    const geographic = location ? ` "${location}"` : "";
    return `${query}${geographic} -linkedin -facebook -instagram -youtube -wikipedia`;
  });
}

function normalizeCandidate(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;

    const hostname = parsed.hostname.toLowerCase();
    if ([...BLOCKED_HOSTS].some((blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`))) {
      return null;
    }

    const domain = hostname.replace(/^www\./, "");
    return {
      domain,
      url: parsed.toString(),
    };
  } catch {
    return null;
  }
}
