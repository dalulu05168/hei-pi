import { desktopData } from "@/data/desktop";
import type { CandlestickPoint, CandlestickRange, MarketStock, MexicoMarketDataService, MexicoMarketSnapshot, StockQuote } from "./types";
import { loadYahooInstrument } from "./yahoo-market";

const localStocks = desktopData.stockCatalog.filter((stock) => stock.currency === "MXN");
const stocks: MarketStock[] = localStocks.map((stock) => ({ companyName: stock.name, market: "BMV", ticker: stock.ticker }));

export const mexicoMarketDataService: MexicoMarketDataService = {
  async getSnapshot(): Promise<MexicoMarketSnapshot> {
    const results = await Promise.all(localStocks.map(async (stock) => {
      try { return await loadYahooInstrument({ companyName: stock.name, fallbackPrice: stock.currentPrice, market: "MX", ticker: stock.ticker }); }
      catch { return null; }
    }));
    const quotes: Record<string, StockQuote> = {};
    const candles: Record<string, Partial<Record<CandlestickRange, readonly CandlestickPoint[]>>> = {};
    localStocks.forEach((stock, index) => {
      const live = results[index];
      quotes[stock.ticker] = live?.quote ?? {
        changePercent: null, companyName: stock.name, currency: "MXN", currentPrice: stock.currentPrice,
        dayHigh: null, dayLow: null, market: "BMV", marketCap: null, openPrice: null, ticker: stock.ticker, volume: null,
      };
      candles[stock.ticker] = live?.candles ?? {};
    });
    let ipc = null;
    try { ipc = await loadYahooInstrument({ companyName: "S&P/BMV IPC", fallbackPrice: 0, market: "US", ticker: "^MXX" }); } catch {}
    if (ipc) {
      quotes["^MXX"] = { ...ipc.quote, companyName: "S&P/BMV IPC", currency: "MXN", market: "BMV", ticker: "^MXX" };
      candles["^MXX"] = ipc.candles;
    }
    const liveCount = results.filter(Boolean).length + (ipc ? 1 : 0);
    return {
      candles,
      dataStatus: liveCount > 0 ? "ready" : "disconnected",
      lastUpdatedAt: liveCount > 0 ? new Date().toISOString() : null,
      quotes,
      stocks,
      summary: [
        { changePercent: null, code: "MX", id: "market", label: "México", status: ipc?.marketOpen ? "open" : "closed", value: null },
        { changePercent: null, code: "BMV", id: "bmv", label: "Bolsa Mexicana de Valores", status: ipc?.marketOpen ? "open" : "closed", value: null },
        { changePercent: ipc?.quote.changePercent ?? null, code: "IPC MÉXICO", id: "ipcMexico", label: "Índice de Precios y Cotizaciones", status: ipc?.marketOpen ? "open" : "closed", value: ipc?.quote.currentPrice ?? null },
      ],
    };
  },
};
