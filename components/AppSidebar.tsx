"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  DollarSign,
  Home,
  Import,
  Mail,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Table2,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/job-search", label: "Job Search", icon: BriefcaseBusiness },
  { href: "/leads", label: "Leads", icon: Table2 },
  { href: "/leads/new", label: "Add Lead", icon: PlusCircle },
  { href: "/sourcing", label: "Sourcing", icon: Search },
  { href: "/import-export", label: "Import / Export", icon: Import },
  { href: "/scoring", label: "Scoring", icon: SlidersHorizontal },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
  { href: "/outreach", label: "Outreach", icon: Mail },
  { href: "/forecast", label: "Forecast", icon: DollarSign },
  { href: "/followups", label: "Follow-ups", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white/80 p-5 backdrop-blur lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
          OF
        </div>
        <div>
          <div className="font-semibold text-slate-950">{APP_NAME}</div>
          <div className="text-xs text-slate-500">Founder sales OS</div>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                active && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <BarChart3 className="h-4 w-4" />
          Daily question
        </div>
        Who should Rico contact today, why are they a fit, what should he pitch, and what should he say?
      </div>
    </aside>
  );
}
