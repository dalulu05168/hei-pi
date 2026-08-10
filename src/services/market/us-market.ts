import { desktopData } from "@/data/desktop";
import type { CandlestickPoint, CandlestickRange, MarketStock, StockQuote, UsMarketDataService, UsMarketSnapshot } from "./types";
import { loadYahooInstrument } from "./yahoo-market";

const localStocks = desktopData.stockCatalog.filter((stock) => stock.currency === "USD");
const stocks: MarketStock[] = localStocks.map((stock) => ({ companyName: stock.name, market: stock.exchange, ticker: stock.ticker }));

export const usMarketDataService: UsMarketDataService = {
  async getSnapshot(): Promise<UsMarketSnapshot> {
    const results = await Promise.all(localStocks.map(async (stock) => {
      try { return await loadYahooInstrument({ companyName: stock.name, fallbackPrice: stock.currentPrice, market: "US", ticker: stock.ticker }); }
      catch { return null; }
    }));
    const quotes: Record<string, StockQuote> = {};
    const candles: Record<string, Partial<Record<CandlestickRange, readonly CandlestickPoint[]>>> = {};
    localStocks.forEach((stock, index) => {
      const live = results[index];
      quotes[stock.ticker] = live?.quote ?? {
        changePercent: null, companyName: stock.name, currency: "USD", currentPrice: stock.currentPrice,
        dayHigh: null, dayLow: null, market: stock.exchange, marketCap: null, openPrice: null, ticker: stock.ticker, volume: null,
      };
      candles[stock.ticker] = live?.candles ?? {};
    });
    const indexResults = await Promise.all(["^NYA", "^IXIC", "^GSPC"].map(async (ticker) => {
      try { return await loadYahooInstrument({ companyName: ticker, fallbackPrice: 0, market: "US", ticker }); } catch { return null; }
    }));
    const sp500 = indexResults[2];
    if (sp500) {
      quotes["^GSPC"] = { ...sp500.quote, companyName: "S&P 500", ticker: "^GSPC" };
      candles["^GSPC"] = sp500.candles;
    }
    const liveCount = results.filter(Boolean).length + indexResults.filter(Boolean).length;
    return {
      candles,
      dataStatus: liveCount > 0 ? "ready" : "disconnected",
      lastUpdatedAt: liveCount > 0 ? new Date().toISOString() : null,
      quotes,
      stocks,
      summary: [
        { changePercent: null, code: "US", id: "market", label: "Estados Unidos", status: indexResults.some((item) => item?.marketOpen) ? "open" : "closed", value: null },
        { changePercent: indexResults[0]?.quote.changePercent ?? null, code: "NYSE", id: "nyse", label: "New York Stock Exchange", status: indexResults[0]?.marketOpen ? "open" : "closed", value: indexResults[0]?.quote.currentPrice ?? null },
        { changePercent: indexResults[1]?.quote.changePercent ?? null, code: "NASDAQ", id: "nasdaq", label: "NASDAQ Composite", status: indexResults[1]?.marketOpen ? "open" : "closed", value: indexResults[1]?.quote.currentPrice ?? null },
        { changePercent: indexResults[2]?.quote.changePercent ?? null, code: "S&P 500", id: "sp500", label: "S&P 500", status: indexResults[2]?.marketOpen ? "open" : "closed", value: indexResults[2]?.quote.currentPrice ?? null },
      ],
    };
  },
};
