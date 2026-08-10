import type { Client } from "@/modules/clients";
import type {
  ClientId,
  Currency,
  Market,
  PositionId,
  Ticker,
} from "@/types";

export type TradeMode = "buy" | "sell";
export type TradeMarket = Market;
export type TradeStockType = "vip" | "normal";
export type TradingDataStatus = "disconnected" | "ready";

export interface SalePositionContext {
  clientId: ClientId;
  market: TradeMarket;
  positionId: PositionId;
  ticker: Ticker;
}

export interface TradableStock {
  currency: Currency;
  currentPrice: number | null;
  market: TradeMarket;
  name: string;
  stockType: TradeStockType;
  ticker: string;
}

export interface TradeInvestorPlan {
  allocatedCapital: number | null;
  allocatedQuantity: number | null;
  availableFunds: number | null;
  capitalRatio: number | null;
  client: Client;
}

export interface TradeRecord {
  clientCount: number;
  executedAt: string;
  id: string;
  mode: TradeMode;
  ticker: string;
  totalAmount: number;
  totalShares: number;
}

export interface TradeTotals {
  actualCount: number | null;
  estimatedFunds: number | null;
  estimatedShares: number | null;
  rejectedCount: number | null;
  selectedCount: number | null;
}
