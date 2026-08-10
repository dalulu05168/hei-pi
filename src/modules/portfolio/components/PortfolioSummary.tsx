import {
  IconBriefcase,
  IconCash,
  IconPercentage,
  IconTrendingUp,
  IconWallet,
  type TablerIcon,
} from "@tabler/icons-react";
import type { BusinessDataStatus } from "@/types";
import type { PortfolioSummaryData } from "../types";

interface PortfolioSummaryProps {
  dataStatus: BusinessDataStatus;
  summary: PortfolioSummaryData;
}

interface SummaryCardProps {
  dataStatus: BusinessDataStatus;
  format?: "money" | "percent";
  icon: TablerIcon;
  label: string;
  value: number | null;
}

function formatValue(value: number | null, format: "money" | "percent") {
  if (value === null) {
    return "—";
  }

  if (format === "percent") {
    return `${new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value)}%`;
  }

  return new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function SummaryCard({
  dataStatus,
  format = "money",
  icon: Icon,
  label,
  value,
}: SummaryCardProps) {
  const negative = value !== null && value < 0;

  return (
    <article className="flex min-h-[88px] flex-col justify-between rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] p-3.5 shadow-[0_14px_36px_rgba(0,0,0,0.17)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] font-semibold tracking-[0.13em] text-[var(--pi-color-text-faint)]">
            POSICIÓN CONSOLIDADA
          </p>
          <h3 className="mt-1.5 text-[10px] font-medium text-[var(--pi-color-text-muted)]">
            {label}
          </h3>
        </div>
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]">
          <Icon size={15} stroke={1.55} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3 border-t border-[var(--pi-color-border)] pt-2">
        <strong className={`truncate font-mono text-[13px] font-medium ${negative ? "text-[#ef6666]" : "text-[var(--pi-color-text)]"}`}>
          {formatValue(value, format)}
        </strong>
        <span className="text-[7px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">
          {dataStatus === "ready" ? "CONSOLIDADO" : "SIN FUENTE"}
        </span>
      </div>
    </article>
  );
}

export function PortfolioSummary({ dataStatus, summary }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      <SummaryCard dataStatus={dataStatus} icon={IconWallet} label="Activos totales" value={summary.totalAssets} />
      <SummaryCard dataStatus={dataStatus} icon={IconCash} label="Fondos disponibles" value={summary.availableFunds} />
      <SummaryCard dataStatus={dataStatus} icon={IconBriefcase} label="Valor de posiciones" value={summary.positionValue} />
      <SummaryCard dataStatus={dataStatus} icon={IconTrendingUp} label="P/G total" value={summary.totalProfitLoss} />
      <SummaryCard dataStatus={dataStatus} format="percent" icon={IconPercentage} label="Ratio P/G" value={summary.profitLossRatio} />
    </div>
  );
}
