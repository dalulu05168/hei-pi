import {
  IconCalculator,
  IconChartCandle,
  IconHash,
  IconPercentage,
  IconSearch,
} from "@tabler/icons-react";
import type {
  TradableStock,
  TradeMarket,
  TradeMode,
  TradeStockType,
  TradingDataStatus,
} from "../types";

interface StockSelectorProps {
  discount: string;
  estimatedAmount: number | null;
  market: TradeMarket;
  marketDataStatus: TradingDataStatus;
  mode: TradeMode;
  onDiscountChange: (value: string) => void;
  onMarketChange: (market: TradeMarket) => void;
  onQuantityChange: (value: string) => void;
  onStockTypeChange: (stockType: TradeStockType) => void;
  onTickerChange: (value: string) => void;
  quantity: string;
  selectedStock: TradableStock | null;
  stockOptions: readonly TradableStock[];
  stockType: TradeStockType;
  ticker: string;
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

export function StockSelector({
  discount,
  estimatedAmount,
  market,
  marketDataStatus,
  mode,
  onDiscountChange,
  onMarketChange,
  onQuantityChange,
  onStockTypeChange,
  onTickerChange,
  quantity,
  selectedStock,
  stockOptions,
  stockType,
  ticker,
}: StockSelectorProps) {
  const quantityLabel = mode === "buy" ? "买入数量" : "卖出数量";
  const currency = selectedStock?.currency ?? (market === "US" ? "USD" : "MXN");

  return (
    <section
      aria-labelledby="trade-configuration"
      className="overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="flex h-9 items-center justify-between border-b border-[var(--pi-color-border)] px-3.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-0.5 rounded-full bg-[var(--pi-color-brand)]" aria-hidden="true" />
          <h2 id="trade-configuration" className="text-[11px] font-semibold text-[var(--pi-color-text)]">
            {mode === "buy" ? "买入设置" : "卖出设置"}
          </h2>
        </div>
        <span className="font-mono text-[8px] tracking-[0.15em] text-[var(--pi-color-text-faint)]">
          01 / 交易设置
        </span>
      </div>

      <div className="grid grid-cols-[1.12fr_1fr_1.45fr_1.15fr_.72fr_.9fr_1fr] gap-2.5 p-3">
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            市场
          </legend>
          <div className="grid h-9 grid-cols-2 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] p-0.5">
            {(["US", "MX"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={market === item}
                onClick={() => onMarketChange(item)}
                className={`rounded-md text-[10px] font-semibold ${
                  market === item
                    ? "border border-[rgba(244,196,48,0.32)] bg-[var(--pi-color-brand-soft)] text-[#edcc77]"
                    : "text-[var(--pi-color-text-muted)]"
                }`}
              >
                {item === "US" ? "美股" : "墨股"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            票种
          </legend>
          <div className="grid h-9 grid-cols-2 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] p-0.5">
            {(["vip", "normal"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={stockType === item}
                onClick={() => onStockTypeChange(item)}
                className={`rounded-md text-[10px] font-semibold ${
                  stockType === item
                    ? "border border-[rgba(244,196,48,0.32)] bg-[var(--pi-color-brand-soft)] text-[#edcc77]"
                    : "text-[var(--pi-color-text-muted)]"
                }`}
              >
                {item === "vip" ? "VIP票" : "普通票"}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            股票代码
          </span>
          <span className="flex h-9 items-center gap-2 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5 focus-within:border-[rgba(244,196,48,0.45)]">
            <IconSearch size={14} stroke={1.7} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
            <input
              type="search"
              list="trading-stock-options"
              autoComplete="off"
              value={ticker}
              onChange={(event) => onTickerChange(event.target.value.toUpperCase())}
              placeholder="输入股票代码"
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase text-[var(--pi-color-text)] outline-none placeholder:normal-case placeholder:text-[var(--pi-color-text-faint)]"
            />
          </span>
          <datalist id="trading-stock-options">
            {stockOptions.map((stock) => (
              <option key={`${stock.market}-${stock.ticker}`} value={stock.ticker}>
                {stock.name}
              </option>
            ))}
          </datalist>
        </label>

        <div className="min-w-0">
          <p className="mb-1.5 text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            股票信息
          </p>
          <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5">
            <IconChartCandle size={14} stroke={1.6} className="text-[#f4c430]" aria-hidden="true" />
            <span className="min-w-0">
              <strong className="block truncate text-[10px] font-medium text-[var(--pi-color-text)]">
                {selectedStock?.name ?? "—"}
              </strong>
              <small className="block text-[8px] text-[var(--pi-color-text-faint)]">
                {selectedStock ? (selectedStock.market === "US" ? "美股" : "墨股") : "市场 —"}
              </small>
            </span>
          </div>
        </div>

        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            折扣比例
          </span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5 focus-within:border-[rgba(244,196,48,0.45)]">
            <IconPercentage size={13} stroke={1.7} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
            <input
              type="number"
              min="0"
              max={mode === "sell" ? "20" : "99"}
              step="0.01"
              inputMode="decimal"
              value={discount}
              onChange={(event) => onDiscountChange(event.target.value)}
              placeholder="—"
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[var(--pi-color-text)] outline-none placeholder:text-[var(--pi-color-text-faint)]"
            />
          </span>
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block truncate text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            {quantityLabel.toUpperCase()}
          </span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5 focus-within:border-[rgba(244,196,48,0.45)]">
            <IconHash size={13} stroke={1.7} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
            <input
              type="number"
              min="1"
              step={mode === "buy" ? "1" : "any"}
              inputMode="numeric"
              value={quantity}
              onChange={(event) => onQuantityChange(event.target.value)}
              placeholder="—"
              className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[var(--pi-color-text)] outline-none placeholder:text-[var(--pi-color-text-faint)]"
            />
          </span>
        </label>

        <div className="min-w-0">
          <p className="mb-1.5 text-[8px] font-semibold tracking-[0.12em] text-[var(--pi-color-text-faint)]">
            预计金额
          </p>
          <div className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] px-2.5">
            <IconCalculator size={14} stroke={1.6} className="text-[#f4c430]" aria-hidden="true" />
            <strong className="truncate font-mono text-[10px] font-medium text-[#edcc77]">
              {formatMoney(estimatedAmount, currency)}
            </strong>
          </div>
        </div>
      </div>

      <footer className="flex h-7 items-center justify-between border-t border-[var(--pi-color-border)] bg-[#08121d] px-3.5 text-[8px] text-[var(--pi-color-text-faint)]">
        <span>股票名称、价格和市场均从已连接的行情数据源校验。</span>
        <span className="font-mono tracking-[0.12em] text-[#d9a817]">
          {marketDataStatus === "ready" ? "行情数据已连接" : "行情数据未连接"}
        </span>
      </footer>
    </section>
  );
}
