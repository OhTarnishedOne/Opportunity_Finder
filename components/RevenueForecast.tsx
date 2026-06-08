"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildRevenueForecast } from "@/lib/revenue";
import type { LeadRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export function RevenueForecast({ leads }: { leads: LeadRecord[] }) {
  const forecast = buildRevenueForecast(leads);
  const byCategory = Object.entries(forecast.categoryTotals).map(([name, value]) => ({ name, value }));
  const byStage = Object.entries(forecast.stageTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ForecastCard label="Conservative" value={forecast.conservative} />
        <ForecastCard label="Realistic" value={forecast.realistic} />
        <ForecastCard label="Best case" value={forecast.bestCase} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversation targets</CardTitle>
            <CardDescription>Based on the default close-rate assumptions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">To reach $10K/month</div>
              <div className="mt-2 text-4xl font-bold text-slate-950">{forecast.activeConversationsFor10k}</div>
              <div className="text-sm text-slate-500">active conversations</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">To reach $20K/month</div>
              <div className="mt-2 text-4xl font-bold text-slate-950">{forecast.activeConversationsFor20k}</div>
              <div className="text-sm text-slate-500">active conversations</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simple assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <div>10% of cold leads become calls</div>
            <div>30% of warm leads become calls</div>
            <div>25% of calls become proposals</div>
            <div>30% of proposals close</div>
            <div>Average starter project: $3,000</div>
            <div>Average retainer: $7,500/month</div>
            <div>Premium retainer: $15,000/month</div>
            <div>Institutional pilot/license: $20,000</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Chart title="Pipeline value by category" data={byCategory} />
        <Chart title="Pipeline value by stage" data={byStage} />
      </div>
    </div>
  );
}

function ForecastCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label} monthly revenue</CardDescription>
        <CardTitle className="text-4xl">{formatCurrency(value)}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function Chart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80 min-w-0">
        {mounted ? (
          <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}K`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-xl bg-slate-100" />
        )}
      </CardContent>
    </Card>
  );
}
