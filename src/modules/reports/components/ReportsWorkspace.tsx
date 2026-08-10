"use client";

import { useMemo, useState } from "react";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { clients } from "@/modules/clients";
import type { ReportCenterSnapshot } from "@/services/reports";
import { buildReportTradingStats } from "../trading-stats";
import { ReportActions } from "./ReportActions";
import {
  ReportFilter,
  type ReportCategoryFilter,
  type ReportDateRange,
  type ReportStatusFilter,
} from "./ReportFilter";
import { ReportPreview } from "./ReportPreview";
import { ReportSummary } from "./ReportSummary";
import { ReportTable } from "./ReportTable";
import { ReportTradingSummary } from "./ReportTradingSummary";

interface ReportsWorkspaceProps {
  snapshot: ReportCenterSnapshot;
}

function isWithinRange(value: string | null, range: ReportDateRange) {
  if (range === "all") return true;
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;
  const now = Date.now();
  if (range === "year") return new Date(timestamp).getFullYear() === new Date(now).getFullYear();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return timestamp >= now - days * 24 * 60 * 60 * 1000;
}

export function ReportsWorkspace({ snapshot }: ReportsWorkspaceProps) {
  const localTrading = useLocalTradingSnapshot();
  const tradingStats = useMemo(
    () => buildReportTradingStats(localTrading, clients.length),
    [localTrading],
  );
  const [category, setCategory] = useState<ReportCategoryFilter>("all");
  const [dateRange, setDateRange] = useState<ReportDateRange>("all");
  const [query, setQuery] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [status, setStatus] = useState<ReportStatusFilter>("all");

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
    return snapshot.reports.filter((report) => {
      const matchesCategory = category === "all" || report.category === category;
      const matchesStatus = status === "all" || report.status === status;
      const matchesRange = isWithinRange(report.updatedAt ?? report.generatedAt, dateRange);
      const matchesQuery = !normalizedQuery || report.name.toLocaleLowerCase("es-MX").includes(normalizedQuery);
      return matchesCategory && matchesStatus && matchesRange && matchesQuery;
    });
  }, [category, dateRange, query, snapshot.reports, status]);

  const selectedReport = useMemo(
    () => snapshot.reports.find((report) => report.id === selectedReportId) ?? null,
    [selectedReportId, snapshot.reports],
  );

  const clearSelection = () => setSelectedReportId(null);

  return (
    <div className="grid h-full min-h-0 grid-rows-[88px_88px_62px_minmax(0,1fr)_62px] gap-3 overflow-hidden text-[var(--pi-color-text)]">
      <ReportSummary data={snapshot.summary} dataStatus={snapshot.dataStatus} />
      <ReportTradingSummary dataStatus={localTrading.dataStatus} stats={tradingStats} />
      <ReportFilter
        activeCategory={category}
        dataStatus={snapshot.dataStatus}
        dateRange={dateRange}
        onCategoryChange={(nextCategory) => { setCategory(nextCategory); clearSelection(); }}
        onDateRangeChange={(nextRange) => { setDateRange(nextRange); clearSelection(); }}
        onQueryChange={(nextQuery) => { setQuery(nextQuery); clearSelection(); }}
        onStatusChange={(nextStatus) => { setStatus(nextStatus); clearSelection(); }}
        query={query}
        status={status}
      />

      <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_420px] gap-3">
        <ReportTable
          dataStatus={snapshot.dataStatus}
          hasActiveFilters={category !== "all" || dateRange !== "all" || status !== "all" || query.length > 0}
          onSelect={setSelectedReportId}
          reports={filteredReports}
          selectedReportId={selectedReportId}
        />
        <ReportPreview dataStatus={snapshot.dataStatus} report={selectedReport} />
      </div>

      <ReportActions report={selectedReport} />
    </div>
  );
}
