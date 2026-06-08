"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StageBadge } from "@/components/StageBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORIES, PRIORITIES, STAGES } from "@/lib/constants";
import type { LeadRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function LeadTable({ leads, compact = false }: { leads: LeadRecord[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("score");

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return leads
      .filter((lead) => {
        const searchable = [lead.companyName, lead.category, lead.contactName, lead.personalizedAngle, lead.notes]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          searchable.includes(normalizedQuery) &&
          (category === "All" || lead.category === category) &&
          (stage === "All" || lead.stage === stage) &&
          (priority === "All" || lead.priorityLevel === priority)
        );
      })
      .sort((a, b) => {
        if (sort === "company") return a.companyName.localeCompare(b.companyName);
        if (sort === "followUp") {
          return new Date(a.followUpDate || "2999-01-01").getTime() - new Date(b.followUpDate || "2999-01-01").getTime();
        }
        return b.fitScore - a.fitScore;
      });
  }, [category, leads, priority, query, sort, stage]);

  if (!leads.length) {
    return (
      <EmptyState
        action="Add the first lead"
        description="Start by adding a family office, fintech startup, credit union, or institutional lead."
        href="/leads/new"
        title="No leads yet"
      />
    );
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{compact ? "Top scored leads" : "Lead database"}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button">
              <Link href="/api/leads/export">Export CSV</Link>
            </Button>
            <Button size="sm" type="button">
              <Link href="/leads/new">Add lead</Link>
            </Button>
          </div>
        </div>
        {!compact ? (
          <div className="grid gap-3 md:grid-cols-5">
            <Input placeholder="Search leads..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All</option>
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={stage} onChange={(event) => setStage(event.target.value)}>
              <option>All</option>
              {STAGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>All</option>
              {PRIORITIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="score">Sort by score</option>
              <option value="company">Sort by company</option>
              <option value="followUp">Sort by follow-up</option>
            </Select>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Next action</TableHead>
              <TableHead>Follow-up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link className="font-medium text-slate-950 hover:text-sky-700" href={`/leads/${lead.id}`}>
                    {lead.companyName}
                  </Link>
                  <div className="text-xs text-slate-500">{lead.contactName || lead.contactTitle || "No contact yet"}</div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={lead.category} />
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-950">{lead.fitScore}</span>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={lead.priorityLevel} />
                </TableCell>
                <TableCell>
                  <StageBadge stage={lead.stage} />
                </TableCell>
                <TableCell className="max-w-xs text-slate-600">{lead.nextAction || "Define next action"}</TableCell>
                <TableCell className="text-slate-600">{formatDate(lead.followUpDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
