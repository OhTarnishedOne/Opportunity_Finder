import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyVerificationResult, resetVerification } from "@/lib/verification/applyVerification";
import { verify } from "@/lib/verification/verifyOpportunity";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);

  if (url.searchParams.get("reset") === "true") {
    const lead = await resetVerification(id);
    return NextResponse.json({ status: lead.verificationStatus });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  if (lead.lastCheckedAt && Date.now() - lead.lastCheckedAt.getTime() < 60_000) {
    return NextResponse.json(
      {
        error: "Verification was checked less than 60 seconds ago.",
        status: lead.verificationStatus,
        staleReason: lead.staleReason,
        lastCheckedAt: lead.lastCheckedAt,
      },
      { status: 429 },
    );
  }

  const result = await verify(lead);
  const updated = await applyVerificationResult(id, result);

  return NextResponse.json({
    status: updated.verificationStatus,
    staleReason: updated.staleReason,
    lastCheckedAt: updated.lastCheckedAt,
    checkFailCount: updated.checkFailCount,
  });
}
