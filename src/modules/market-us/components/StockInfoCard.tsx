import {
  IconChartCandle,
  IconDatabaseOff,
} from "@tabler/icons-react";
import type {
  MarketDataStatus,
  StockQuote,
} from "@/services/market";

interface StockInfoCardProps {
  dataStatus: MarketDataStatus;
  quote: StockQuote | null;
}

function formatMoney(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("es-MX", {
    currency: "USD",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function formatCompact(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
}

export function StockInfoCard({ dataStatus, quote }: StockInfoCardProps) {
  const negative = quote?.changePercent !== null && quote?.changePercent !== undefined && quote.changePercent < 0;
  const metrics = [
    ["APERTURA", formatMoney(quote?.openPrice ?? null)],
    ["MÁXIMO", formatMoney(quote?.dayHigh ?? null)],
    ["MÍNIMO", formatMoney(quote?.dayLow ?? null)],
    ["VOLUMEN", formatCompact(quote?.volume ?? null)],
    ["CAPITALIZACIÓN", formatCompact(quote?.marketCap ?? null)],
  ];

  return (
    <section
      aria-labelledby="us-stock-information"
      className="overflow-hidden rounded-xl border border-[rgba(91,141,198,0.17)] bg-[#08121d]"
    >
      <header className="flex h-[46px] items-center justify-between border-b border-[rgba(91,141,198,0.13)] px-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(91,141,198,0.18)] bg-[rgba(54,103,156,0.12)] text-[#6f9ed0]">
            <IconChartCandle size={14} stroke={1.6} aria-hidden="true" />
          </span>
          <div>
            <h2 id="us-stock-information" className="text-[10px] font-semibold text-[#e8eef7]">Información de la acción</h2>
            <p className="mt-0.5 text-[7px] tracking-[0.09em] text-[#536477]">COTIZACIÓN INDIVIDUAL</p>
          </div>
        </div>
        <span className="font-mono text-[7px] tracking-[0.12em] text-[#536477]">03 / STOCK DETAIL</span>
      </header>

      <div className="grid h-[128px] grid-cols-[minmax(230px,0.9fr)_minmax(0,1.7fr)]">
        <div className="flex items-center gap-3 border-r border-[rgba(91,141,198,0.13)] px-4">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[rgba(91,141,198,0.18)] bg-[#102131] text-[#6f9ed0]">
            {quote ? <IconChartCandle size={21} stroke={1.5} aria-hidden="true" /> : <IconDatabaseOff size={20} stroke={1.5} aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <strong className="font-mono text-[18px] font-semibold text-[#e8eef7]">{quote?.ticker ?? "—"}</strong>
              <span className="text-[8px] text-[#607286]">{quote?.market ?? "MERCADO —"}</span>
            </div>
            <p className="mt-1 truncate text-[10px] text-[#8ca0b6]">{quote?.companyName ?? "Instrumento sin seleccionar"}</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="font-mono text-[18px] font-medium text-[#dbe6f2]">{formatMoney(quote?.currentPrice ?? null)}</span>
              <span className={`pb-0.5 font-mono text-[9px] ${negative ? "text-[#ef6a78]" : quote?.changePercent === null || quote?.changePercent === undefined ? "text-[#536477]" : "text-[#4fc98a]"}`}>
                {quote?.changePercent === null || quote?.changePercent === undefined
                  ? "—"
                  : `${quote.changePercent > 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-5 divide-x divide-[rgba(91,141,198,0.11)]">
          {metrics.map(([label, value]) => (
            <div key={label} className="flex min-w-0 flex-col justify-center px-3">
              <dt className="truncate text-[7px] font-semibold tracking-[0.11em] text-[#536477]">{label}</dt>
              <dd className="mt-2 truncate font-mono text-[10px] tabular-nums text-[#b8c7d8]">{value}</dd>
              <span className="mt-2 text-[7px] tracking-[0.1em] text-[#465568]">
                {dataStatus === "disconnected" ? "SIN FUENTE" : "USD"}
              </span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
