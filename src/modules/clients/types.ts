export type ClientGender = "female" | "male" | "unspecified";
export type ClientLevel = "standard" | "vip";
import type { PersonType } from "@/types";

export type ClientPersonType = PersonType;
export type ClientStudentStatus = "established" | "new";
export type ClientStatus = "active" | "inactive" | "follow_up";
export type ClientDataStatus = "disconnected" | "ready";

export interface Client {
  accountId: string;
  accountStatus: "opened" | "unopened";
  accountFunds: number | null;
  age: number | null;
  avatarUrl?: string;
  createdAt?: string;
  gender: ClientGender;
  group: string;
  id: string;
  level: ClientLevel;
  name: string;
  investedAmount: number | null;
  personType: ClientPersonType;
  phone: string;
  region: string;
  status: ClientStatus;
  studentStatus: ClientStudentStatus;
  todayProfitLoss: number | null;
  todayTrades: number | null;
  totalProfitLoss: number | null;
  vipTier: string;
  riskLevel: string;
}

export interface ClientFinancialSummary {
  netWorth: number | null;
  positionValue: number | null;
  profitLossRatio: number | null;
  totalProfitLoss: number | null;
}

export interface ClientHolding {
  cost: number | null;
  currentPrice: number | null;
  id: string;
  market: "MX" | "US" | "unknown";
  marketValue: number | null;
  name: string;
  profitLoss: number | null;
  quantity: number | null;
  symbol: string;
}

export interface ClientDetailRecord {
  clientId: string;
  financialSummary: ClientFinancialSummary;
  holdings: readonly ClientHolding[];
}

export interface ClientAccountSummary {
  availableFunds: number | null;
  investedAmount: number | null;
  positionValue: number | null;
  totalProfitLoss: number | null;
}

export interface ClientTradeHistoryItem {
  amount: number;
  currency: Currency;
  executionTime: string;
  market: Market;
  positionId: PositionId;
  price: number;
  quantity: number;
  side: "buy" | "sell";
  status: "COMPLETED";
  ticker: string;
  transactionId: string;
}

export interface ClientBusinessDetailViewModel {
  businessDataStatus: BusinessDataStatus;
  financialSummary: ClientAccountSummary;
  positions: readonly Position[];
  transactions: readonly ClientTradeHistoryItem[];
}

export interface ClientStatsSummary {
  active: number | null;
  addedToday: number | null;
  followUp: number | null;
  inactive: number | null;
  total: number | null;
  vip: number | null;
}

export interface ClientFilters {
  group: string;
  level: "all" | ClientLevel;
  query: string;
  status: "all" | ClientStatus;
}
import type {
  BusinessDataStatus,
  Currency,
  Market,
  Position,
  PositionId,
} from "@/types";
