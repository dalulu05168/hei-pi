export type ClientId = string;
export type OrderId = string;
export type TransactionId = string;
export type PositionId = string;
export type PersonType =
  | "legacy_male"
  | "legacy_female"
  | "new_male"
  | "new_female";
export type Ticker = string;
export type Market = "US" | "MX";
export type Currency = "USD" | "MXN";
export type BusinessDataStatus = "disconnected" | "ready";

export interface BuyOrder {
  clientIds: readonly ClientId[];
  createdAt: string;
  currency: Currency;
  market: Market;
  orderId: OrderId;
  positionIds: readonly PositionId[];
  status: "completed";
  stockName: string;
  ticker: Ticker;
  totalAmount: number;
  totalParticipantFunds: number | null;
  totalQuantity: number;
  totalTradeCapital: number;
  transactionIds: readonly TransactionId[];
  unitPrice: number;
}

export interface ClientTransaction {
  allocatedCapital: number;
  allocatedQuantity: number;
  amount: number;
  availableFunds: number | null;
  capitalRatio: number | null;
  clientId: ClientId;
  currency: Currency;
  executedAt: string;
  market: Market;
  orderId: OrderId;
  personType: PersonType | null;
  positionId: PositionId;
  quantity: number;
  side: "buy";
  status: "completed";
  stockName: string;
  ticker: Ticker;
  transactionId: TransactionId;
  unitPrice: number;
}

export interface Position {
  buyOrderId: OrderId;
  buyTransactionId: TransactionId;
  clientId: ClientId;
  costPrice: number;
  currency: Currency;
  currentPrice: number | null;
  market: Market;
  marketValue: number | null;
  personType: PersonType | null;
  openedAt: string;
  orderId: OrderId;
  positionId: PositionId;
  profitLoss: number | null;
  quantity: number;
  remainingHours?: number | null;
  sellDeadline?: string | null;
  status: "OPEN" | "CLOSED";
  stockName: string;
  ticker: Ticker;
  transactionId: TransactionId;
}

export interface SellTransaction {
  amount: number;
  clientId: ClientId;
  currency: Currency;
  executionTime: string;
  market: Market;
  quantity: number;
  sellPrice: number;
  sellTransactionId: TransactionId;
  sourcePositionId: PositionId;
  status: "COMPLETED";
  ticker: Ticker;
}

export interface LocalTradingSnapshot {
  dataStatus: BusinessDataStatus;
  orders: readonly BuyOrder[];
  positions: readonly Position[];
  sellTransactions: readonly SellTransaction[];
  transactions: readonly ClientTransaction[];
}
