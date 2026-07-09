import type { Metadata } from "next";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Local-first opportunity pipeline for consulting, fractional, family office, and startup leads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen lg:flex">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
              <div className="flex items-center justify-between">
                <Link href="/" className="font-semibold text-slate-950">
                  {APP_NAME}
                </Link>
                <Link className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white" href="/leads/new">
                  Add lead
                </Link>
              </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
