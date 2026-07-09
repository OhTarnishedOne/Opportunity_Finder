import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TERMINAL_STAGES } from "@/lib/constants";
import { applyVerificationResult } from "@/lib/verification/applyVerification";
import { verify } from "@/lib/verification/verifyOpportunity";

const MAX_CHECKS = 50;
const CONCURRENCY = 3;

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!expected || authorization !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await prisma.lead.findMany({
    where: {
      stage: { notIn: [...TERMINAL_STAGES] },
      verificationStatus: { in: ["UNVERIFIED", "ACTIVE", "ERROR"] },
    },
    orderBy: [{ lastCheckedAt: "asc" }, { createdAt: "asc" }],
    take: 200,
  });

  const due = candidates.filter(isDueForBatch).slice(0, MAX_CHECKS);
  const results: Array<{ id: string; status: string; staleReason?: string | null }> = [];

  await runWithConcurrency(due, CONCURRENCY, async (lead) => {
    const result = await verify(lead);
    const updated = await applyVerificationResult(lead.id, result);
    results.push({ id: lead.id, status: updated.verificationStatus, staleReason: updated.staleReason });
  });

  return NextResponse.json({
    checked: results.length,
    results,
  });
}

function isDueForBatch(lead: { verificationStatus: string; lastCheckedAt: Date | null; checkFailCount: number }) {
  if (lead.verificationStatus === "UNVERIFIED") return true;
  if (!lead.lastCheckedAt) return true;

  const ageMs = Date.now() - lead.lastCheckedAt.getTime();

  if (lead.verificationStatus === "ACTIVE") {
    return ageMs >= 3 * 24 * 60 * 60 * 1000;
  }

  if (lead.verificationStatus === "ERROR") {
    const backoffHours = Math.pow(2, Math.min(lead.checkFailCount, 8));
    return ageMs >= backoffHours * 60 * 60 * 1000;
  }

  return false;
}

async function runWithConcurrency<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>) {
  let index = 0;

  async function next() {
    const current = index;
    index += 1;
    if (current >= items.length) return;

    await worker(items[current]);
    await delay(500);
    await next();
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
