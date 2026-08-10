import {
  IconCash,
  IconChartBar,
  IconRefresh,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import type { TradeTotals } from "../types";

interface TradeActionBarProps {
  onRestoreRejected: () => void;
  totals: TradeTotals;
}

function displayCount(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("es-MX").format(value);
}

function displayMoney(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

const metricClassName = "flex min-w-0 items-center gap-2 border-r border-[var(--pi-color-border)] pr-4";

export function TradeActionBar({ onRestoreRejected, totals }: TradeActionBarProps) {
  return (
    <footer className="flex min-h-[58px] items-center rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] px-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
      <div className={`${metricClassName} min-w-[132px]`}>
        <IconUsers size={16} stroke={1.55} className="text-[#f4c430]" aria-hidden="true" />
        <span>
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">已选择人数</small>
          <strong className="mt-0.5 block font-mono text-[11px] text-[var(--pi-color-text)]">{displayCount(totals.selectedCount)}</strong>
        </span>
      </div>
      <div className={`${metricClassName} ml-4 min-w-[148px]`}>
        <IconUserCheck size={16} stroke={1.55} className="text-[#4fc98a]" aria-hidden="true" />
        <span>
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">实际交易人数</small>
          <strong className="mt-0.5 block font-mono text-[11px] text-[var(--pi-color-text)]">{displayCount(totals.actualCount)}</strong>
        </span>
      </div>
      <div className={`${metricClassName} ml-4 min-w-[210px]`}>
        <IconCash size={16} stroke={1.55} className="text-[#f4c430]" aria-hidden="true" />
        <span className="min-w-0">
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">预计总资金</small>
          <strong className="mt-0.5 block truncate font-mono text-[11px] text-[#e5c36e]">{displayMoney(totals.estimatedFunds)}</strong>
        </span>
      </div>
      <div className="ml-4 flex min-w-[142px] items-center gap-2">
        <IconChartBar size={16} stroke={1.55} className="text-[#f4c430]" aria-hidden="true" />
        <span>
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">预计总股数</small>
          <strong className="mt-0.5 block font-mono text-[11px] text-[var(--pi-color-text)]">{displayCount(totals.estimatedShares)}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={onRestoreRejected}
        disabled={!totals.rejectedCount}
        className="ml-auto flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(224,76,76,0.24)] px-2.5 text-[9px] font-medium text-[#ef6666] disabled:cursor-not-allowed disabled:border-[var(--pi-color-border)] disabled:text-[var(--pi-color-text-faint)]"
      >
        <IconRefresh size={13} stroke={1.7} aria-hidden="true" />
        恢复已拒绝人员
        <span className="font-mono">{totals.rejectedCount ?? "—"}</span>
      </button>
    </footer>
  );
}
