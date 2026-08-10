export type MarketDataStatus = "disconnected" | "ready";

export type CandlestickRange = "1D" | "1W" | "1M" | "6M" | "1Y";

export type MarketSummaryId =
  | "market"
  | "nyse"
  | "nasdaq"
  | "sp500"
  | "bmv"
  | "ipcMexico";

export interface MarketSummaryItem {
  changePercent: number | null;
  code: string;
  id: MarketSummaryId;
  label: string;
  status: "open" | "closed" | null;
  value: number | null;
}

export interface MarketStock {
  companyName: string;
  market: "BMV" | "NASDAQ" | "NYSE";
  ticker: string;
}

export interface StockQuote extends MarketStock {
  changePercent: number | null;
  currency: "MXN" | "USD";
  currentPrice: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  marketCap: number | null;
  openPrice: number | null;
  volume: number | null;
}

export interface CandlestickPoint {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  volume?: number;
}

export interface MarketSnapshot {
  candles: Readonly<Record<string, Partial<Record<CandlestickRange, readonly CandlestickPoint[]>>>>;
  dataStatus: MarketDataStatus;
  lastUpdatedAt: string | null;
  quotes: Readonly<Record<string, StockQuote>>;
  stocks: readonly MarketStock[];
  summary: readonly MarketSummaryItem[];
}

export type UsMarketSnapshot = MarketSnapshot;
export type MexicoMarketSnapshot = MarketSnapshot;

export interface UsMarketDataService {
  getSnapshot(): Promise<UsMarketSnapshot>;
}

export interface MexicoMarketDataService {
  getSnapshot(): Promise<MexicoMarketSnapshot>;
}
