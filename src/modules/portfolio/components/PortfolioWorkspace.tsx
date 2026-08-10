"use client";

import { useMemo, useState } from "react";
import { IconBriefcase, IconChartPie } from "@tabler/icons-react";
import { Modal } from "@/components";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { formatReportingMxn } from "@/services/financial/money";
import { HoldingFilter } from "./HoldingFilter";
import { HoldingTable } from "./HoldingTable";
import { PortfolioAnalysis } from "./PortfolioAnalysis";
import { PortfolioSummary } from "./PortfolioSummary";
import { buildPortfolioViewModel } from "../data";
import type {
  HoldingFilterState,
  PortfolioPosition,
} from "../types";

const initialFilters: HoldingFilterState = {
  market: "all",
  profit: "all",
  query: "",
};

function SectionHeading({ code, id, title }: { code: string; id: string; title: string }) {
  return (
    <div className="mb-2 flex h-5 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-3.5 w-0.5 rounded-full bg-[var(--pi-color-brand)]" aria-hidden="true" />
        <h2 id={id} className="truncate text-[11px] font-semibold text-[var(--pi-color-text)]">{title}</h2>
      </div>
      <span className="font-mono text-[7px] tracking-[0.15em] text-[var(--pi-color-text-faint)]">{code}</span>
    </div>
  );
}

function displayValue(value: number | null) {
  return value === null
    ? "—"
    : new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);
}

export function PortfolioWorkspace() {
  const localTrading = useLocalTradingSnapshot();
  const portfolio = useMemo(
    () =>
      buildPortfolioViewModel({
        dataStatus: localTrading.dataStatus,
        positions: localTrading.positions,
      }),
    [localTrading],
  );
  const { dataStatus, positions: initialPositions, summary } = portfolio;
  const [filters, setFilters] = useState<HoldingFilterState>(initialFilters);
  const [selectedPosition, setSelectedPosition] = useState<PortfolioPosition | null>(null);

  const filteredPositions = useMemo(() => {
    const query = filters.query.trim().toUpperCase();

    return initialPositions.filter((position) => {
      const marketMatch = filters.market === "all" || position.market === filters.market;
      const queryMatch = !query || position.ticker.toUpperCase().includes(query);
      const profitMatch =
        filters.profit === "all" ||
        (filters.profit === "gain" && position.profitLoss !== null && position.profitLoss > 0) ||
        (filters.profit === "loss" && position.profitLoss !== null && position.profitLoss < 0) ||
        (filters.profit === "flat" && position.profitLoss === 0);

      return marketMatch && queryMatch && profitMatch;
    });
  }, [filters, initialPositions]);

  const hasActiveFilters =
    filters.market !== "all" || filters.profit !== "all" || filters.query.length > 0;

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(154px,0.74fr)_minmax(330px,1.8fr)] gap-3 overflow-hidden">
      <section aria-labelledby="portfolio-summary">
        <SectionHeading code="01 / ASSET POSITION" id="portfolio-summary" title="Resumen de activos" />
        <PortfolioSummary dataStatus={dataStatus} summary={summary} />
      </section>

      <section aria-labelledby="portfolio-analysis" className="flex min-h-0 flex-col">
        <SectionHeading code="02 / PORTFOLIO ANALYSIS" id="portfolio-analysis" title="Análisis de posiciones" />
        <PortfolioAnalysis dataStatus={dataStatus} />
      </section>

      <section aria-labelledby="portfolio-holdings" className="flex min-h-0 flex-col">
        <SectionHeading code="03 / HOLDING DIRECTORY" id="portfolio-holdings" title="Directorio de posiciones" />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_18px_46px_rgba(0,0,0,0.2)]">
          <HoldingFilter
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
          <HoldingTable
            dataStatus={dataStatus}
            hasActiveFilters={hasActiveFilters}
            onViewDetails={setSelectedPosition}
            positions={filteredPositions}
          />
          <footer className="flex h-8 flex-none items-center justify-between border-t border-[var(--pi-color-border)] bg-[#08121d] px-3.5">
            <span className="text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">
              {dataStatus === "disconnected"
                ? "FUENTE DE POSICIONES SIN CONECTAR"
                : `${filteredPositions.length} POSICIONES CONSOLIDADAS`}
            </span>
            <span className="font-mono text-[8px] text-[var(--pi-color-text-muted)]">
              {dataStatus === "disconnected" ? "REGISTROS —" : `REGISTROS ${filteredPositions.length}`}
            </span>
          </footer>
        </div>
      </section>

      <Modal
        isOpen={selectedPosition !== null}
        onClose={() => setSelectedPosition(null)}
        title="Detalle de posición"
      >
        {selectedPosition ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--pi-color-border)] bg-[#08121d] p-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]">
                <IconBriefcase size={20} stroke={1.5} aria-hidden="true" />
              </span>
              <div>
                <strong className="font-mono text-[13px] text-[var(--pi-color-text)]">{selectedPosition.ticker}</strong>
                <p className="mt-1 text-[9px] text-[var(--pi-color-text-muted)]">{selectedPosition.name}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-border)]">
              {[
                ["Cantidad", displayValue(selectedPosition.quantity)],
                ["Titulares", displayValue(selectedPosition.ownerCount)],
                ["P/G", formatReportingMxn(selectedPosition.profitLoss) ?? "—"],
                ["Ratio P/G", selectedPosition.profitLossRatio === null ? "—" : `${displayValue(selectedPosition.profitLossRatio)}%`],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#08121d] p-3">
                  <dt className="text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">{label}</dt>
                  <dd className="mt-1 font-mono text-[10px] text-[var(--pi-color-text)]">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="flex items-start gap-2 text-[9px] leading-4 text-[var(--pi-color-text-faint)]">
              <IconChartPie size={14} stroke={1.55} className="mt-0.5 flex-none text-[#f4c430]" aria-hidden="true" />
              El detalle conserva el vínculo con clientes y registros de posición. Venta vuelve a validar cada titular antes de ejecutar.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
