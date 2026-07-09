"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ChartSize = {
  width: number;
  height: number;
};

export function MeasuredChart({
  children,
  className,
  placeholder,
}: {
  children: (size: ChartSize) => ReactNode;
  className?: string;
  placeholder?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ChartSize | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const nextSize = {
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      };

      if (nextSize.width > 0 && nextSize.height > 0) {
        setSize((current) =>
          current?.width === nextSize.width && current.height === nextSize.height ? current : nextSize,
        );
      }
    };

    frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    });

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={cn("h-full min-h-0 min-w-0", className)} ref={ref}>
      {size ? children(size) : placeholder || <div className="h-full rounded-xl bg-slate-100" />}
    </div>
  );
}
