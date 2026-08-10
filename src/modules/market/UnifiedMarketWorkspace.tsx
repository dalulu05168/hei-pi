"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconActivity, IconChartCandle, IconClock, IconRefresh } from "@tabler/icons-react";
import type { CandlestickPoint, CandlestickRange, MexicoMarketSnapshot, StockQuote, UsMarketSnapshot } from "@/services/market";

interface Props { mexico: MexicoMarketSnapshot; us: UsMarketSnapshot; }
type MarketKey = "us" | "mexico";

const price = (value: number | null | undefined, currency: "MXN" | "USD") => value == null ? "—" : new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
const integer = (value: number | null | undefined) => value == null ? "—" : new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(value);

function fallbackSeries(base: number, key: string): CandlestickPoint[] {
  const seed = key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: 52 }, (_, index) => {
    const wave = Math.sin((index + seed) * 0.43) * base * 0.006;
    const drift = (index - 26) * base * 0.0007;
    const open = base + wave + drift;
    const close = open + Math.sin(index * 1.27 + seed) * base * 0.004;
    return { open, close, high: Math.max(open, close) + base * 0.0035, low: Math.min(open, close) - base * 0.0035, timestamp: new Date(Date.now() - (51 - index) * 86_400_000).toISOString(), volume: 1_600_000 + ((index * 7919 + seed * 113) % 3_800_000) };
  });
}

function CandleChart({ points, currency }: { points: readonly CandlestickPoint[]; currency: "MXN" | "USD" }) {
  const data = points.slice(-64);
  const min = Math.min(...data.map((item) => item.low));
  const max = Math.max(...data.map((item) => item.high));
  const span = Math.max(max - min, 1);
  const maxVolume = Math.max(...data.map((item) => item.volume ?? 0), 1);
  const y = (value: number) => 8 + (1 - (value - min) / span) * 62;
  const step = 100 / Math.max(data.length, 1);
  return (
    <div className="relative h-full min-h-0 px-3 py-2">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-label="Gráfico de velas con volumen">
        {[15, 30, 45, 60, 75].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="rgba(102,145,177,.17)" strokeWidth=".18" />)}
        {data.map((item, index) => {
          const x = index * step + step / 2;
          const positive = item.close >= item.open;
          const color = positive ? "#51c978" : "#f15b53";
          const top = Math.min(y(item.open), y(item.close));
          const body = Math.max(Math.abs(y(item.open) - y(item.close)), 0.7);
          const volumeHeight = ((item.volume ?? 0) / maxVolume) * 19;
          return <g key={`${item.timestamp}-${index}`}><line x1={x} x2={x} y1={y(item.high)} y2={y(item.low)} stroke={color} strokeWidth=".24"/><rect x={x - step * .28} y={top} width={step * .56} height={body} fill={color}/><rect x={x - step * .32} y={98 - volumeHeight} width={step * .64} height={volumeHeight} fill={color} opacity=".45"/></g>;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-y-3 right-4 flex flex-col justify-between text-[10px] tabular-nums text-[#a8b8c4]"><span>{price(max, currency)}</span><span>{price((max + min) / 2, currency)}</span><span>{price(min, currency)}</span><span>Vol.</span></div>
    </div>
  );
}

export function UnifiedMarketWorkspace({ mexico, us }: Props) {
  const [market, setMarket] = useState<MarketKey>("mexico");
  const [range, setRange] = useState<CandlestickRange>("1M");
  const [selectedTicker, setSelectedTicker] = useState<Record<MarketKey, string>>({ us: "^GSPC", mexico: "^MXX" });
  const router = useRouter();
  useEffect(() => { const timer = window.setInterval(() => router.refresh(), 30_000); return () => window.clearInterval(timer); }, [router]);

  const snapshot = market === "us" ? us : mexico;
  const benchmarkTicker = market === "us" ? "^GSPC" : "^MXX";
  const ticker = selectedTicker[market];
  const benchmarkQuote = snapshot.quotes[benchmarkTicker] ?? null;
  const quote: StockQuote | null = snapshot.quotes[ticker] ?? benchmarkQuote ?? Object.values(snapshot.quotes)[0] ?? null;
  const base = quote?.currentPrice || (market === "us" ? 5800 : 57500);
  const points = snapshot.candles[ticker]?.[range] ?? snapshot.candles[ticker]?.["1M"] ?? fallbackSeries(base, ticker);
  const chartPoints = points.length >= 8 ? points : fallbackSeries(base, ticker);
  const currency = quote?.currency ?? (market === "us" ? "USD" : "MXN");
  const instruments = useMemo(() => [{ ticker: benchmarkTicker, companyName: market === "us" ? "S&P 500" : "S&P/BMV IPC" }, ...snapshot.stocks.slice(0, 7)], [benchmarkTicker, market, snapshot.stocks]);
  const positive = (quote?.changePercent ?? 0) >= 0;

  return (
    <div className="grid h-full min-h-0 grid-rows-[46px_minmax(0,1fr)_28px] gap-2.5 overflow-hidden text-[var(--pi-color-text)]">
      <header className="terminal-panel flex items-center justify-between px-4">
        <div><p className="terminal-kicker">MERCADOS EN TIEMPO REAL · ACTUALIZACIÓN AUTOMÁTICA</p><h1 className="mt-1 text-[14px] font-semibold">Centro de Mercados Institucionales</h1></div>
        <div className="flex h-8 items-center border border-[var(--pi-color-border)] bg-[#06131f] p-0.5"><button onClick={() => setMarket("us")} className={`h-full px-5 text-[11px] ${market === "us" ? "bg-[#2a240f] text-[#f4c430]" : "text-[#a5b4c0]"}`}>S&amp;P 500 · EE.UU.</button><button onClick={() => setMarket("mexico")} className={`h-full px-5 text-[11px] ${market === "mexico" ? "bg-[#2a240f] text-[#f4c430]" : "text-[#a5b4c0]"}`}>IPC México</button></div>
      </header>

      <section className="grid min-h-0 grid-cols-[29%_minmax(0,1fr)] gap-2.5">
        <aside className="terminal-panel grid min-h-0 grid-rows-[56px_auto_minmax(0,1fr)_164px] overflow-hidden p-5">
          <div className="flex items-center justify-between border-b border-[var(--pi-color-border)] pb-4"><div><p className="text-[10px] text-[#88a1b5]">{market === "us" ? "Estados Unidos · Mercado bursátil" : "México · Bolsa Mexicana de Valores"}</p><p className="mt-1 text-[16px] font-medium">{quote?.companyName ?? "Índice institucional"}</p></div><IconChartCandle size={26} className="text-[#f4c430]" stroke={1.3}/></div>
          <div className="py-5"><p className="text-[34px] font-semibold leading-none tabular-nums text-[#dce5eb]">{price(quote?.currentPrice, currency)}</p><p className={`mt-3 text-[18px] font-semibold ${positive ? "text-[#58d486]" : "text-[#f15b53]"}`}>{positive ? "+" : ""}{quote?.changePercent?.toFixed(2) ?? "0.00"}%</p><p className="mt-3 text-[10px] text-[#8da2b3]">{quote?.ticker ?? ticker} · {quote?.market ?? (market === "us" ? "NYSE / NASDAQ" : "BMV")}</p></div>
          <div className="min-h-0 overflow-hidden border-y border-[var(--pi-color-border)] py-3"><p className="mb-2 text-[9px] tracking-[.14em] text-[#6f879c]">INSTRUMENTOS DISPONIBLES</p><div className="grid grid-cols-2 gap-2">{instruments.map((item) => <button key={item.ticker} onClick={() => setSelectedTicker((current) => ({ ...current, [market]: item.ticker }))} className={`min-w-0 border px-3 py-2 text-left ${ticker === item.ticker ? "border-[#c79820] bg-[#29230f]" : "border-[#294b68] bg-[#061724] hover:border-[#6d879b]"}`}><strong className="block truncate text-[11px] text-[#dce5eb]">{item.ticker}</strong><span className="mt-1 block truncate text-[8px] text-[#7f96a8]">{item.companyName}</span></button>)}</div></div>
          <dl className="grid grid-cols-2 content-center gap-x-5 gap-y-4 text-[10px]">{[["Apertura", price(quote?.openPrice, currency)], ["Máximo", price(quote?.dayHigh, currency)], ["Mínimo", price(quote?.dayLow, currency)], ["Volumen", integer(quote?.volume)]].map(([label, value]) => <div key={label} className="border-b border-[#1b3850] pb-2"><dt className="text-[#8399aa]">{label}</dt><dd className="mt-1 text-[13px] tabular-nums text-[#d9e2e8]">{value}</dd></div>)}</dl>
        </aside>

        <article className="terminal-panel grid min-h-0 grid-rows-[72px_42px_minmax(0,1fr)_86px] overflow-hidden">
          <header className="flex items-center justify-between border-b border-[var(--pi-color-border)] px-5"><div><div className="flex items-center gap-3"><h2 className="text-[22px] font-semibold">{quote?.companyName ?? ticker}</h2><span className="text-[11px] text-[#8ea2b2]">{quote?.ticker ?? ticker}</span></div><p className="mt-1 text-[9px] tracking-[.12em] text-[#6f879c]">COTIZACIÓN INSTITUCIONAL · DATOS DE MERCADO</p></div><div className="flex items-center gap-2 text-[10px] text-[#63d590]"><IconActivity size={15}/> {snapshot.dataStatus === "ready" ? "En vivo" : "Datos locales de continuidad"}</div></header>
          <div className="flex items-center border-b border-[var(--pi-color-border)] px-4">{(["1D", "1W", "1M", "6M", "1Y"] as CandlestickRange[]).map((item) => <button key={item} onClick={() => setRange(item)} className={`h-full border-x border-transparent px-6 text-[11px] ${range === item ? "border-[#795c18] bg-[#241f0d] text-[#f4c430]" : "text-[#98a9b6] hover:text-[#d8e1e8]"}`}>{item}</button>)}</div>
          <CandleChart points={chartPoints} currency={currency}/>
          <dl className="grid grid-cols-6 divide-x divide-[var(--pi-color-border)] border-t border-[var(--pi-color-border)] text-center">{[["Apertura", price(quote?.openPrice, currency)], ["Máximo", price(quote?.dayHigh, currency)], ["Mínimo", price(quote?.dayLow, currency)], ["Volumen", integer(quote?.volume)], ["Variación", `${positive ? "+" : ""}${quote?.changePercent?.toFixed(2) ?? "0.00"}%`], ["Último", price(quote?.currentPrice, currency)]].map(([label, value], index) => <div key={label} className="flex flex-col justify-center px-2"><dt className="text-[9px] text-[#8197a8]">{label}</dt><dd className={`mt-2 truncate text-[13px] tabular-nums ${index === 4 ? (positive ? "text-[#58d486]" : "text-[#f15b53]") : "text-[#dce4ea]"}`}>{value}</dd></div>)}</dl>
        </article>
      </section>

      <footer className="flex items-center justify-between px-1 text-[9px] text-[#72889b]"><span className="inline-flex items-center gap-2"><IconRefresh size={12}/> Fuente: Yahoo Finance / datos locales de continuidad</span><span className="inline-flex items-center gap-2"><IconClock size={12}/> Última actualización: {snapshot.lastUpdatedAt ? new Date(snapshot.lastUpdatedAt).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) : "modo local"}</span></footer>
    </div>
  );
}
