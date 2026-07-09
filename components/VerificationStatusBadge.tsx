import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const labels: Record<string, string> = {
  ACTIVE: "Active",
  STALE: "Stale",
  UNVERIFIED: "Unverified",
  ERROR: "Check failed",
};

const variants = {
  ACTIVE: "success",
  STALE: "secondary",
  UNVERIFIED: "warning",
  ERROR: "danger",
} as const;

export function VerificationStatusBadge({
  status,
  lastCheckedAt,
  staleReason,
}: {
  status: string;
  lastCheckedAt?: Date | string | null;
  staleReason?: string | null;
}) {
  const title =
    status === "ACTIVE"
      ? `Verified ${formatDate(lastCheckedAt)}`
      : status === "STALE"
        ? `${staleReason || "stale"} - ${formatDate(lastCheckedAt)}`
        : status === "ERROR"
          ? `Needs manual review - ${staleReason || "check failed"}`
          : "Never checked";

  return (
    <Badge title={title} variant={variants[status as keyof typeof variants] ?? "outline"}>
      {labels[status] || status}
    </Badge>
  );
}
