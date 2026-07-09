import { detectAts } from "@/lib/verification/canonicalize";
import type { VerifiableOpportunity, VerificationResult } from "@/lib/verification/types";

const USER_AGENT = "OpportunityFinderBot/1.0 (+rico@lcsengine.com)";
const REMOVED_TEXT = [
  "job removed",
  "no longer accepting applications",
  "position has been filled",
  "this job is no longer available",
  "posting has closed",
];

export async function verify(opp: VerifiableOpportunity): Promise<VerificationResult> {
  const provider = opp.atsProvider || "UNKNOWN";

  try {
    if (provider === "GREENHOUSE") return verifyGreenhouse(opp);
    if (provider === "LEVER") return verifyLever(opp);
    if (provider === "ASHBY") return verifyAshby(opp);
    return verifyHtmlFallback(opp);
  } catch (error) {
    return {
      status: "ERROR",
      detail: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

async function verifyGreenhouse(opp: VerifiableOpportunity): Promise<VerificationResult> {
  if (opp.atsBoardToken && opp.atsExternalId) {
    const response = await fetchWithTimeout(
      `https://boards-api.greenhouse.io/v1/boards/${opp.atsBoardToken}/jobs/${opp.atsExternalId}`,
    );

    if (response.status === 200) return { status: "ACTIVE", checkedUrl: response.url };
    if (response.status === 404) return { status: "STALE", staleReason: "api_not_found", checkedUrl: response.url };
    return errorForStatus(response.status, response.url);
  }

  return verifyGreenhouseUrlFallback(opp);
}

async function verifyGreenhouseUrlFallback(opp: VerifiableOpportunity): Promise<VerificationResult> {
  const url = opp.canonicalUrl || opp.sourceUrl;
  if (!url) return { status: "ERROR", detail: "No URL to verify" };

  const response = await fetchWithTimeout(url, { redirect: "manual" });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get("location") || "";
    if (!/\/jobs\/[^/?#]+/i.test(location)) {
      return { status: "STALE", staleReason: "board_redirect", checkedUrl: url };
    }
  }

  if (response.status === 404 || response.status === 410) return { status: "STALE", staleReason: "http_404", checkedUrl: url };
  if (response.status >= 500 || response.status === 429) return errorForStatus(response.status, url);

  const finalUrl = response.url || url;
  if (!/\/jobs\/[^/?#]+/i.test(finalUrl) || finalUrl.includes("error=true")) {
    return { status: "STALE", staleReason: "board_redirect", checkedUrl: finalUrl };
  }

  return { status: "ACTIVE", checkedUrl: finalUrl };
}

async function verifyLever(opp: VerifiableOpportunity): Promise<VerificationResult> {
  if (!opp.atsBoardToken || !opp.atsExternalId) return verifyHtmlFallback(opp);
  const response = await fetchWithTimeout(`https://api.lever.co/v0/postings/${opp.atsBoardToken}/${opp.atsExternalId}`);

  if (response.status === 200) return { status: "ACTIVE", checkedUrl: response.url };
  if (response.status === 404) return { status: "STALE", staleReason: "api_not_found", checkedUrl: response.url };
  return errorForStatus(response.status, response.url);
}

async function verifyAshby(opp: VerifiableOpportunity): Promise<VerificationResult> {
  if (!opp.atsBoardToken || !opp.atsExternalId) {
    return { status: "ERROR", detail: "Ashby verification requires org and job id" };
  }

  const response = await fetchWithTimeout(`https://api.ashbyhq.com/posting-api/job-board/${opp.atsBoardToken}`, {
    method: "POST",
  });

  if (response.status === 404) return { status: "STALE", staleReason: "api_not_found", checkedUrl: response.url };
  if (!response.ok) return errorForStatus(response.status, response.url);

  const json = (await response.json()) as { jobs?: Array<{ id?: string; jobId?: string; externalId?: string }> };
  const found = (json.jobs || []).some((job) =>
    [job.id, job.jobId, job.externalId].filter(Boolean).some((id) => String(id) === opp.atsExternalId),
  );

  return found
    ? { status: "ACTIVE", checkedUrl: response.url }
    : { status: "STALE", staleReason: "api_not_found", checkedUrl: response.url };
}

async function verifyHtmlFallback(opp: VerifiableOpportunity): Promise<VerificationResult> {
  const url = opp.canonicalUrl || opp.sourceUrl;
  if (!url) return { status: "ERROR", detail: "No URL to verify" };

  const response = await fetchWithTimeout(url, { redirect: "follow" });

  if (response.status === 404 || response.status === 410) return { status: "STALE", staleReason: "http_404", checkedUrl: url };
  if (response.status >= 500 || response.status === 429) return errorForStatus(response.status, url);

  const finalUrl = response.url || url;
  const detected = detectAts(finalUrl);
  if (finalUrl !== url && detected.atsProvider === "UNKNOWN" && /careers|jobs|boards?/i.test(finalUrl)) {
    return { status: "STALE", staleReason: "board_redirect", checkedUrl: finalUrl };
  }

  const body = await response.text();
  const normalized = body.toLowerCase();
  const marker = REMOVED_TEXT.find((text) => normalized.includes(text));
  if (marker) return { status: "STALE", staleReason: "removed_text", checkedUrl: finalUrl, detail: marker };

  if (containsFuzzyTitle(body, opp.companyName)) return { status: "ACTIVE", checkedUrl: finalUrl };

  return {
    status: "ERROR",
    checkedUrl: finalUrl,
    detail: "Fetched page did not contain enough matching title/company tokens; manual review needed.",
  };
}

function containsFuzzyTitle(body: string, title: string) {
  const tokens = title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
  if (!tokens.length) return true;

  const normalized = body.toLowerCase();
  const matches = tokens.filter((token) => normalized.includes(token)).length;
  return matches / tokens.length >= 0.8;
}

function errorForStatus(status: number, checkedUrl: string): VerificationResult {
  if (status === 429 || status >= 500) return { status: "ERROR", checkedUrl, detail: `HTTP ${status}` };
  return { status: "ERROR", checkedUrl, detail: `Unexpected HTTP ${status}` };
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = windowlessSetTimeout(() => controller.abort(), 10_000);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json,text/html",
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function windowlessSetTimeout(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}
