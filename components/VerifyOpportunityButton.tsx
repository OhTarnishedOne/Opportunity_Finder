"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function VerifyOpportunityButton({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function verifyNow(reset = false) {
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/opportunities/${leadId}/verify${reset ? "?reset=true" : ""}`, {
        method: "POST",
      });
      const json = (await response.json()) as { status?: string; staleReason?: string; error?: string };

      if (!response.ok) {
        setMessage(json.error || "Verification failed.");
      } else {
        setMessage(reset ? "Reset to unverified." : `Verification result: ${json.status}${json.staleReason ? ` (${json.staleReason})` : ""}`);
        router.refresh();
      }
    } catch {
      setMessage("Verification request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} onClick={() => void verifyNow(false)} type="button">
          {pending ? "Checking..." : "Verify now"}
        </Button>
        {status === "STALE" ? (
          <Button disabled={pending} onClick={() => void verifyNow(true)} type="button" variant="outline">
            Manual revive
          </Button>
        ) : null}
      </div>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
