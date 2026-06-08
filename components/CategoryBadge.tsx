import { Badge } from "@/components/ui/badge";

export function CategoryBadge({ category }: { category: string }) {
  return <Badge variant="outline">{category}</Badge>;
}
