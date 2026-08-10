import type { CandlestickPoint, CandlestickRange, StockQuote } from "./types";

interface YahooChartResult {
  indicators?: {
    quote?: Array<{
      close?: Array<number | null>;
      high?: Array<number | null>;
      low?: Array<number | null>;
      open?: Array<number | null>;
      volume?: Array<number | null>;
    }>;
  };
  meta?: {
    chartPreviousClose?: number;
    currency?: string;
    exchangeName?: string;
    marketState?: string;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
    regularMarketOpen?: number;
    regularMarketPrice?: number;
    regularMarketVolume?: number;
  };
  timestamp?: number[];
}

interface YahooChartResponse {
  chart?: { result?: YahooChartResult[] | null };
}

const rangeSizes: Record<CandlestickRange, number> = {
  "1D": 1,
  "1W": 5,
  "1M": 22,
  "6M": 132,
  "1Y": 260,
};

export function toYahooSymbol(ticker: string, market: "US" | "MX") {
  const normalized = ticker.replace("*", "");
  return market === "MX" ? `${normalized}.MX` : normalized;
}

export async function loadYahooInstrument({
  companyName,
  fallbackPrice,
  market,
  ticker,
}: {
  companyName: string;
  fallbackPrice: number;
  market: "US" | "MX";
  ticker: string;
}) {
  const symbol = toYahooSymbol(ticker, market);
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d&includePrePost=false`,
    {
      headers: { "User-Agent": "Mozilla/5.0 Pi-Web-V2/1.1" },
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) throw new Error(`Yahoo chart ${symbol}: ${response.status}`);
  const payload = (await response.json()) as YahooChartResponse;
  const result = payload.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo chart ${symbol}: empty response`);

  const series = result.indicators?.quote?.[0];
  const timestamps = result.timestamp ?? [];
  const candles: CandlestickPoint[] = timestamps.flatMap((timestamp, index) => {
    const open = series?.open?.[index];
    const high = series?.high?.[index];
    const low = series?.low?.[index];
    const close = series?.close?.[index];
    if (open == null || high == null || low == null || close == null) return [];
    return [{ close, high, low, open, timestamp: new Date(timestamp * 1000).toISOString(), volume: series?.volume?.[index] ?? 0 }];
  });

  const latestClose = result.meta?.regularMarketPrice ?? candles.at(-1)?.close ?? fallbackPrice;
  const previousClose = result.meta?.chartPreviousClose ?? candles.at(-2)?.close ?? null;
  const quote: StockQuote = {
    changePercent:
      previousClose && previousClose !== 0
        ? ((latestClose - previousClose) / previousClose) * 100
        : null,
    companyName,
    currency: market === "US" ? "USD" : "MXN",
    currentPrice: latestClose,
    dayHigh: result.meta?.regularMarketDayHigh ?? candles.at(-1)?.high ?? null,
    dayLow: result.meta?.regularMarketDayLow ?? candles.at(-1)?.low ?? null,
    market: market === "US" ? (result.meta?.exchangeName === "NYQ" ? "NYSE" : "NASDAQ") : "BMV",
    marketCap: null,
    openPrice: result.meta?.regularMarketOpen ?? candles.at(-1)?.open ?? null,
    ticker,
    volume: result.meta?.regularMarketVolume ?? series?.volume?.at(-1) ?? null,
  };

  return {
    candles: {
      "1D": candles.slice(-rangeSizes["1D"]),
      "1W": candles.slice(-rangeSizes["1W"]),
      "1M": candles.slice(-rangeSizes["1M"]),
      "6M": candles.slice(-rangeSizes["6M"]),
      "1Y": candles.slice(-rangeSizes["1Y"]),
    } satisfies Record<CandlestickRange, readonly CandlestickPoint[]>,
    marketOpen: result.meta?.marketState === "REGULAR",
    quote,
  };
}
