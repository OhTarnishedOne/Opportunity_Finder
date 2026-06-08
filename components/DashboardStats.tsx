"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildRevenueForecast } from "@/lib/revenue";
import type { LeadRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

const COLORS = ["#0f172a", "#0284c7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

export function DashboardStats({ leads }: { leads: LeadRecord[] }) {
  const forecast = buildRevenueForecast(leads);
  const callsBooked = leads.filter((lead) => lead.stage === "Call Booked").length;
  const proposalsSent = leads.filter((lead) => lead.stage === "Proposal Sent").length;
  const won = leads.filter((lead) => lead.stage === "Won").length;
  const premiumOpportunities = leads.filter((lead) => lead.monthlyRevenuePotential === "$10K-$20K/month retainer");

  const categoryData = toChartData(leads, "category");
  const stageData = toChartData(leads, "stage");
  const priorityData = toChartData(leads, "priorityLevel");
  const revenueByCategory = Object.entries(forecast.categoryTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={leads.length.toString()} />
        <StatCard label="Realistic pipeline" value={formatCurrency(forecast.realistic)} />
        <StatCard label="Best-case pipeline" value={formatCurrency(forecast.bestCase)} />
        <StatCard label="Won opportunities" value={won.toString()} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Calls booked" value={callsBooked.toString()} description="Discovery calls currently in motion" />
        <StatCard label="Proposals sent" value={proposalsSent.toString()} description="Opportunities closest to close" />
        <StatCard
          label="$10K-$20K targets"
          value={premiumOpportunities.length.toString()}
          description="Premium retainer opportunities"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Leads by category" data={categoryData} />
        <ChartCard title="Pipeline by stage" data={stageData} />
        <ChartCard title="Revenue potential by category" data={revenueByCategory} money />
        <PieCard title="Priority distribution" data={priorityData} />
      </div>
    </div>
  );
}

function StatCard({ label, value, description }: { label: string; value: string; description?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      {description ? <CardContent className="text-sm text-slate-500">{description}</CardContent> : null}
    </Card>
  );
}

function ChartCard({ title, data, money = false }: { title: string; data: { name: string; value: number }[]; money?: boolean }) {
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
      <CardContent className="h-72 min-w-0">
        {mounted ? (
          <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickFormatter={(value) => (money ? `$${Number(value) / 1000}K` : String(value))} />
              <Tooltip formatter={(value) => (money ? formatCurrency(Number(value)) : value)} />
              <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartPlaceholder />
        )}
      </CardContent>
    </Card>
  );
}

function PieCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
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
      <CardContent className="h-72 min-w-0">
        {mounted ? (
          <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} nameKey="name" outerRadius={90} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell fill={COLORS[index % COLORS.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ChartPlaceholder />
        )}
      </CardContent>
    </Card>
  );
}

function ChartPlaceholder() {
  return <div className="h-full rounded-xl bg-slate-100" />;
}

function toChartData(leads: LeadRecord[], key: keyof LeadRecord) {
  const counts = leads.reduce<Record<string, number>>((acc, lead) => {
    const name = String(lead[key] ?? "Unknown");
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
