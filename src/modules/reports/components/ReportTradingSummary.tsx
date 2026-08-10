import { IconChartLine, IconCoins, IconDatabaseOff, IconUsers } from "@tabler/icons-react";
import type { BusinessDataStatus } from "@/types";
import { formatReportingMxn } from "@/services/financial/money";
import type { ReportTradingStats } from "../trading-stats";

interface ReportTradingSummaryProps {
  dataStatus: BusinessDataStatus;
  stats: ReportTradingStats;
}

function formatMoney(value: number | null) {
  return formatReportingMxn(value) ?? "—";
}

export function ReportTradingSummary({ dataStatus, stats }: ReportTradingSummaryProps) {
  const items = [
    { icon: IconUsers, label: "Clientes", value: stats.clientCount },
    { icon: IconCoins, label: "Compras", value: formatMoney(stats.buyAmount) },
    { icon: IconCoins, label: "Ventas", value: formatMoney(stats.sellAmount) },
    { icon: IconChartLine, label: "Posiciones actuales", value: stats.currentPositionCount },
    { icon: IconChartLine, label: "P/G realizado", value: formatMoney(stats.realizedProfitLoss) },
    { icon: IconChartLine, label: "P/G no realizado", value: formatMoney(stats.unrealizedProfitLoss) },
  ] as const;

  return (
    <section aria-label="Estadísticas operativas de trading" className="grid grid-cols-6 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.label}
            className="relative flex h-[88px] min-w-0 items-center overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[linear-gradient(145deg,#17191c,#111316)] px-3 shadow-[0_16px_36px_rgba(0,0,0,0.24)]"
          >
            <span className="absolute inset-y-0 left-0 w-[2px] bg-[var(--pi-color-brand)]" aria-hidden="true" />
            <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.24)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
              <Icon size={15} stroke={1.55} aria-hidden="true" />
            </span>
            <div className="ml-2 min-w-0">
              <p className="truncate text-[8px] font-medium text-[var(--pi-color-text-muted)]">{item.label}</p>
              <p className="mt-1 truncate font-mono text-[13px] font-semibold tracking-[-0.03em] text-[var(--pi-color-text)]">
                {item.value ?? "—"}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[6px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
                {dataStatus === "ready" ? "LECTURA LOCAL" : <><IconDatabaseOff size={9} stroke={1.5} aria-hidden="true" /> SIN FUENTE</>}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
