import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconChartCandle,
  IconDatabaseOff,
  IconShieldCheck,
} from "@tabler/icons-react";
import type { Position } from "@/types";
import type {
  TradableStock,
  TradeMarket,
  TradeMode,
  TradeTotals,
} from "../types";

interface TradeSummaryProps {
  canConfirm: boolean;
  discount: number | null;
  discountedPrice: number | null;
  estimatedAmount: number | null;
  market: TradeMarket;
  mode: TradeMode;
  onConfirm: () => void;
  position: Position | null;
  selectedStock: TradableStock | null;
  sellQuantity: number | null;
  ticker: string;
  totals: TradeTotals;
}

function formatMoney(value: number | null, currency: "MXN" | "USD") {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-MX", {
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function formatCount(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);
}

export function TradeSummary({
  canConfirm,
  discount,
  discountedPrice,
  estimatedAmount,
  market,
  mode,
  onConfirm,
  position,
  selectedStock,
  sellQuantity,
  ticker,
  totals,
}: TradeSummaryProps) {
  const currency = position?.currency ?? selectedStock?.currency ?? (market === "US" ? "USD" : "MXN");
  const ActionIcon = mode === "buy" ? IconArrowUpRight : IconArrowDownRight;

  const buyRows = [
    ["股票代码", selectedStock?.ticker ?? (ticker || "—")],
    ["股票名称", selectedStock?.name ?? "—"],
    ["市场", selectedStock ? (selectedStock.market === "US" ? "美股" : "墨股") : "—"],
    ["折扣比例", discount === null ? "—" : `${discount.toFixed(2)}%`],
    ["折后价格", formatMoney(discountedPrice, currency)],
    ["预计成交金额", formatMoney(estimatedAmount, currency)],
  ];
  const sellRows = [
    ["股票代码", position?.ticker ?? (ticker || "—")],
    ["市场", position ? (position.market === "US" ? "美股" : "墨股") : "—"],
    ["客户", position?.clientId ?? "—"],
    ["持仓编号", position?.positionId ?? "—"],
    ["持仓数量", formatCount(position?.quantity ?? null)],
    ["可卖数量", formatCount(position?.status === "OPEN" ? position.quantity : null)],
    ["卖出数量", formatCount(sellQuantity)],
    ["成本价格", formatMoney(position?.costPrice ?? null, currency)],
    ["预计卖出价格", formatMoney(discountedPrice, currency)],
    ["预计成交金额", formatMoney(estimatedAmount, currency)],
  ];
  const rows = mode === "sell" ? sellRows : buyRows;

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgba(244,196,48,0.18)] bg-[var(--pi-color-surface)] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <div className="flex h-[54px] items-center justify-between border-b border-[var(--pi-color-border)] px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]">
            <IconShieldCheck size={15} stroke={1.6} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[12px] font-semibold text-[var(--pi-color-text)]">交易摘要</h2>
            <p className="mt-0.5 text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">
              {mode === "buy" ? "买入" : "卖出"} / 执行前确认
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--pi-color-border)] p-4">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--pi-color-border)] bg-[#0a0d11] p-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]">
            <IconChartCandle size={23} stroke={1.45} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <strong className="block truncate font-mono text-[15px] font-semibold text-[var(--pi-color-text)]">
              {position?.ticker ?? selectedStock?.ticker ?? (ticker || "—")}
            </strong>
            <span className="mt-1 block truncate text-[10px] text-[var(--pi-color-text-muted)]">
              {position?.stockName ?? selectedStock?.name ?? "尚未选择股票"}
            </span>
          </div>
        </div>
      </div>

      <dl className="px-4 py-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex min-h-[42px] items-center justify-between gap-3 border-b border-[var(--pi-color-border)] last:border-b-0">
            <dt className="text-[9px] text-[var(--pi-color-text-muted)]">{label}</dt>
            <dd className={`truncate text-right font-mono text-[10px] ${label === "预计成交金额" ? "text-[#f4c430]" : "text-[var(--pi-color-text)]"}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mx-4 mt-1 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--pi-color-border)] bg-[var(--pi-color-border)]">
        <div className="bg-[#08121d] p-3">
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">参与人数</small>
          <strong className="mt-1 block font-mono text-[12px] text-[var(--pi-color-text)]">{formatCount(totals.selectedCount)}</strong>
        </div>
        <div className="bg-[#08121d] p-3">
          <small className="block text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">预计股数</small>
          <strong className="mt-1 block font-mono text-[12px] text-[var(--pi-color-text)]">{formatCount(totals.estimatedShares)}</strong>
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--pi-color-border)] bg-[#08121d] p-4">
        {!canConfirm ? (
          <p className="mb-3 flex items-start gap-2 text-[8px] leading-4 text-[var(--pi-color-text-faint)]">
            <IconDatabaseOff size={13} stroke={1.6} className="mt-0.5 flex-none text-[#f4c430]" aria-hidden="true" />
            请先完成市场、客户及持仓信息校验，再执行确认。
          </p>
        ) : null}
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[rgba(244,196,48,0.42)] bg-[#f4c430] text-[11px] font-semibold text-[#08090b] shadow-[0_8px_24px_rgba(185,139,40,0.18)] disabled:cursor-not-allowed disabled:border-[var(--pi-color-border)] disabled:bg-[#102131] disabled:text-[var(--pi-color-text-faint)] disabled:shadow-none"
        >
          <ActionIcon size={16} stroke={1.9} aria-hidden="true" />
          {mode === "buy" ? "确认执行买入" : "确认执行卖出"}
        </button>
      </div>
    </aside>
  );
}
