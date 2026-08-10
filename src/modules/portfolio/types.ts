import type {
  BusinessDataStatus,
  ClientId,
  Currency,
  PositionId,
} from "@/types";

export type PortfolioMarket = "MX" | "US" | "unknown";
export type PortfolioProfitFilter = "all" | "gain" | "loss" | "flat";

export interface PortfolioPosition {
  averageCost: number | null;
  currentPrice: number | null;
  holdingDays: number | null;
  id: string;
  clientId: ClientId;
  currency: Currency;
  market: PortfolioMarket;
  marketValue: number | null;
  name: string;
  ownerCount: number;
  positionId: PositionId;
  profitLoss: number | null;
  profitLossRatio: number | null;
  quantity: number | null;
  ticker: string;
}

export interface PortfolioSummaryData {
  availableFunds: number | null;
  positionValue: number | null;
  profitLossRatio: number | null;
  totalAssets: number | null;
  totalProfitLoss: number | null;
}

export interface HoldingFilterState {
  market: "all" | "MX" | "US";
  profit: PortfolioProfitFilter;
  query: string;
}

export interface PortfolioViewModel {
  dataStatus: BusinessDataStatus;
  positions: readonly PortfolioPosition[];
  summary: PortfolioSummaryData;
}
