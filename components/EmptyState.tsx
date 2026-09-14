import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-sky-50 px-4 py-3 text-2xl">OS</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
        </div>
        {href && action ? (
          <Link className={cn(buttonVariants())} href={href}>
            {action}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
