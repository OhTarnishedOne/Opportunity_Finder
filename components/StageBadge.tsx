import { Badge } from "@/components/ui/badge";

const variants = {
  Found: "secondary",
  Researched: "outline",
  Scored: "info",
  "Outreach Drafted": "info",
  Sent: "warning",
  "Followed Up": "warning",
  "Call Booked": "success",
  "Proposal Sent": "success",
  Won: "success",
  Lost: "danger",
  Nurture: "secondary",
} as const;

export function StageBadge({ stage }: { stage: string }) {
  return <Badge variant={variants[stage as keyof typeof variants] ?? "secondary"}>{stage}</Badge>;
}
