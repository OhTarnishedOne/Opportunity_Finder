import { Badge } from "@/components/ui/badge";

const variants = {
  "Must Contact": "success",
  "Strong Lead": "info",
  "Worth Testing": "warning",
  "Low Priority": "secondary",
  "Ignore for Now": "danger",
} as const;

export function PriorityBadge({ priority }: { priority: string }) {
  return <Badge variant={variants[priority as keyof typeof variants] ?? "secondary"}>{priority}</Badge>;
}
