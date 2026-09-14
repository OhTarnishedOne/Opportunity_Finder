import * as cheerio from "cheerio";
import type { AtsProvider, CanonicalizationResult } from "@/lib/verification/types";

const ATS_PATTERNS = {
  GREENHOUSE: [
    /https?:\/\/job-boards\.greenhouse\.io\/([^/?#]+)\/jobs\/([^/?#]+)/i,
    /https?:\/\/boards\.greenhouse\.io\/([^/?#]+)\/jobs\/([^/?#]+)/i,
  ],
  LEVER: [/https?:\/\/jobs\.lever\.co\/([^/?#]+)\/([^/?#]+)/i],
  ASHBY: [/https?:\/\/jobs\.ashbyhq\.com\/([^/?#]+)\/([^/?#]+)/i],
  WORKDAY: [/https?:\/\/([^/?#]+\.wd\d+\.myworkdayjobs\.com)\/(.+)/i],
};

const AGGREGATOR_HOST_PATTERNS = [/builtin/i, /wellfound/i, /remote-?rocketship/i, /jobgether/i, /indeed/i, /linkedin/i];

export async function canonicalize(rawUrl?: string | null): Promise<CanonicalizationResult> {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return { atsProvider: "UNKNOWN", warning: "No URL provided." };

  const finalUrl = await followRedirects(normalized);
  const direct = detectAts(finalUrl);

  if (direct.atsProvider !== "UNKNOWN") {
    return { ...direct, canonicalUrl: finalUrl, sourceUrl: normalized };
  }

  if (isLikelyAggregator(finalUrl)) {
    const extracted = await extractAtsFromAggregator(finalUrl);
    if (extracted) {
      return {
        ...extracted,
        sourceUrl: normalized,
      };
    }
  }

  return {
    canonicalUrl: finalUrl,
    sourceUrl: normalized,
    atsProvider: detectWorkdayOrOther(finalUrl),
    warning: "No direct ATS link found. Verification will be less reliable.",
  };
}

export function detectAts(url: string): Omit<CanonicalizationResult, "sourceUrl"> {
  for (const pattern of ATS_PATTERNS.GREENHOUSE) {
    const match = url.match(pattern);
    if (match) return { canonicalUrl: url, atsProvider: "GREENHOUSE", atsBoardToken: match[1], atsExternalId: match[2] };
  }

  const lever = url.match(ATS_PATTERNS.LEVER[0]);
  if (lever) return { canonicalUrl: url, atsProvider: "LEVER", atsBoardToken: lever[1], atsExternalId: lever[2] };

  const ashby = url.match(ATS_PATTERNS.ASHBY[0]);
  if (ashby) return { canonicalUrl: url, atsProvider: "ASHBY", atsBoardToken: ashby[1], atsExternalId: ashby[2] };

  const workday = url.match(ATS_PATTERNS.WORKDAY[0]);
  if (workday) return { canonicalUrl: url, atsProvider: "WORKDAY" };

  return { canonicalUrl: url, atsProvider: "UNKNOWN" };
}

function normalizeUrl(rawUrl?: string | null) {
  const value = rawUrl?.trim();
  if (!value) return undefined;

  try {
    const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(url).toString();
  } catch {
    return undefined;
  }
}

async function followRedirects(url: string) {
  let current = url;

  for (let index = 0; index < 5; index += 1) {
    const response = await fetch(current, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": "OpportunityFinderBot/1.0 (+rico@lcsengine.com)" },
    }).catch(() => null);

    if (!response || ![301, 302, 303, 307, 308].includes(response.status)) return current;

    const location = response.headers.get("location");
    if (!location) return current;
    current = new URL(location, current).toString();
  }

  return current;
}

function isLikelyAggregator(url: string) {
  const hostname = new URL(url).hostname;
  return AGGREGATOR_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

async function extractAtsFromAggregator(url: string): Promise<CanonicalizationResult | null> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "OpportunityFinderBot/1.0 (+rico@lcsengine.com)",
      Accept: "text/html",
    },
  }).catch(() => null);

  if (!response?.ok) return null;

  const html = await response.text();
  const $ = cheerio.load(html);
  const candidates = new Set<string>();

  $("script[type='application/ld+json']").each((_, element) => {
    const raw = $(element).text();
    try {
      const parsed = JSON.parse(raw);
      collectUrls(parsed, candidates);
    } catch {
      // Ignore malformed JSON-LD.
    }
  });

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (href) candidates.add(new URL(href, url).toString());
  });

  for (const candidate of candidates) {
    const detected = detectAts(candidate);
    if (detected.atsProvider !== "UNKNOWN") return detected;
  }

  return null;
}

function collectUrls(value: unknown, urls: Set<string>) {
  if (!value) return;
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) urls.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, urls));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectUrls(item, urls));
  }
}

function detectWorkdayOrOther(url: string): AtsProvider {
  return ATS_PATTERNS.WORKDAY[0].test(url) ? "WORKDAY" : "OTHER";
}
