import { prisma } from "@/lib/prisma";
import type { VerificationResult } from "@/lib/verification/types";

export function verificationUpdateForResult(result: VerificationResult, currentFailCount: number) {
  const now = new Date();

  if (result.status === "ACTIVE") {
    return {
      verificationStatus: "ACTIVE",
      lastCheckedAt: now,
      lastVerifiedAt: now,
      staleDetectedAt: null,
      staleReason: null,
      checkFailCount: 0,
    };
  }

  if (result.status === "STALE") {
    return {
      verificationStatus: "STALE",
      lastCheckedAt: now,
      staleDetectedAt: now,
      staleReason: result.staleReason || "unknown",
      checkFailCount: 0,
      followUpDate: null,
      stage: "Park",
    };
  }

  return {
    verificationStatus: "ERROR",
    lastCheckedAt: now,
    staleReason: result.detail || null,
    checkFailCount: currentFailCount + 1,
  };
}

export async function applyVerificationResult(leadId: string, result: VerificationResult) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const update = verificationUpdateForResult(result, lead.checkFailCount);
  const staleNote =
    result.status === "STALE"
      ? `Auto-parked: listing verified stale on ${new Date().toISOString()} - ${result.staleReason || "unknown"}`
      : undefined;

  return prisma.lead.update({
    where: { id: leadId },
    data: {
      ...update,
      ...(staleNote
        ? {
            notes: [lead.notes, staleNote].filter(Boolean).join("\n\n"),
          }
        : {}),
    },
  });
}

export async function resetVerification(leadId: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: {
      verificationStatus: "UNVERIFIED",
      staleDetectedAt: null,
      staleReason: null,
      checkFailCount: 0,
    },
  });
}
