import { desktopData, toMarket } from "@/data/desktop";
import type { TradableStock, TradeRecord, TradingDataStatus } from "./types";

export const tradableStocks: readonly TradableStock[] = desktopData.stockCatalog.map((stock) => ({
  currency: stock.currency,
  currentPrice: stock.currentPrice,
  market: toMarket(stock.currency),
  name: stock.name,
  stockType: "normal",
  ticker: stock.ticker,
}));

export const tradingMarketDataStatus: TradingDataStatus = "ready";
export const tradeRecords: readonly TradeRecord[] = [];
export const tradeRecordsDataStatus: TradingDataStatus = "disconnected";
