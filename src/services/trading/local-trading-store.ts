import type {
  BuyOrder,
  ClientId,
  ClientTransaction,
  Currency,
  LocalTradingSnapshot,
  Market,
  Position,
  PositionId,
  PersonType,
  SellTransaction,
  Ticker,
} from "@/types";
import { desktopTradingSeed } from "./desktop-trading-seed";

const STORAGE_KEY = "pi:web-v2:local-trading:v1";

const emptySnapshot: LocalTradingSnapshot = {
  dataStatus: "disconnected",
  orders: [],
  positions: [],
  sellTransactions: [],
  transactions: [],
};

let cachedSnapshot: LocalTradingSnapshot | null = null;
const listeners = new Set<() => void>();

export interface LocalBuyPlan {
  allocatedCapital: number;
  allocatedQuantity: number;
  availableFunds: number;
  capitalRatio: number;
  clientId: ClientId;
  personType: PersonType;
}

export interface LocalBuyExecutionInput {
  currency: Currency;
  market: Market;
  plans: readonly LocalBuyPlan[];
  stockName: string;
  ticker: Ticker;
  totalTradeCapital: number;
  unitPrice: number;
}

export interface LocalBuyExecutionResult {
  order: BuyOrder;
  positions: readonly Position[];
  transactions: readonly ClientTransaction[];
}

export interface LocalSellExecutionInput {
  clientId: ClientId;
  market: Market;
  positionId: PositionId;
  quantity: number;
  sellPrice: number;
  ticker: Ticker;
}

export interface LocalSellExecutionResult {
  position: Position;
  transaction: SellTransaction;
}

function makeId(prefix: string) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${performance.now()}`;
  return `${prefix}-${suffix}`;
}

function normalizeSnapshot(value: unknown): LocalTradingSnapshot {
  if (!value || typeof value !== "object") return emptySnapshot;

  const candidate = value as Partial<LocalTradingSnapshot>;
  const orders = Array.isArray(candidate.orders)
    ? candidate.orders.map((order) => ({
        ...order,
        totalParticipantFunds:
          typeof order.totalParticipantFunds === "number"
            ? order.totalParticipantFunds
            : null,
        totalTradeCapital:
          typeof order.totalTradeCapital === "number"
            ? order.totalTradeCapital
            : order.totalAmount,
      }))
    : [];
  const positions = Array.isArray(candidate.positions)
    ? candidate.positions.map((position) => ({
        ...position,
        buyOrderId: position.buyOrderId ?? position.orderId,
        buyTransactionId: position.buyTransactionId ?? position.transactionId,
        personType: position.personType ?? null,
        status:
          position.status === "CLOSED" || position.status === "closed"
            ? "CLOSED" as const
            : "OPEN" as const,
      }))
    : [];
  const sellTransactions = Array.isArray(candidate.sellTransactions)
    ? candidate.sellTransactions
    : [];
  const transactions = Array.isArray(candidate.transactions)
    ? candidate.transactions.map((transaction) => ({
        ...transaction,
        allocatedCapital:
          typeof transaction.allocatedCapital === "number"
            ? transaction.allocatedCapital
            : transaction.amount,
        allocatedQuantity:
          typeof transaction.allocatedQuantity === "number"
            ? transaction.allocatedQuantity
            : transaction.quantity,
        availableFunds:
          typeof transaction.availableFunds === "number"
            ? transaction.availableFunds
            : null,
        capitalRatio:
          typeof transaction.capitalRatio === "number"
            ? transaction.capitalRatio
            : null,
        personType: transaction.personType ?? null,
      }))
    : [];

  return {
    dataStatus:
      orders.length > 0 ||
      positions.length > 0 ||
      sellTransactions.length > 0 ||
      transactions.length > 0
        ? "ready"
        : "disconnected",
    orders,
    positions,
    sellTransactions,
    transactions,
  };
}

function mergeWithDesktopSeed(snapshot: LocalTradingSnapshot): LocalTradingSnapshot {
  const mergeBy = <T>(base: readonly T[], local: readonly T[], key: (item: T) => string) => {
    const records = new Map(base.map((item) => [key(item), item]));
    local.forEach((item) => records.set(key(item), item));
    return Array.from(records.values());
  };

  return {
    dataStatus: "ready",
    orders: mergeBy(desktopTradingSeed.orders, snapshot.orders, (item) => item.orderId),
    positions: mergeBy(desktopTradingSeed.positions, snapshot.positions, (item) => item.positionId),
    sellTransactions: mergeBy(desktopTradingSeed.sellTransactions, snapshot.sellTransactions, (item) => item.sellTransactionId),
    transactions: mergeBy(desktopTradingSeed.transactions, snapshot.transactions, (item) => item.transactionId),
  };
}

function readFromStorage() {
  if (typeof window === "undefined") return desktopTradingSeed;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return desktopTradingSeed;
    const normalized = normalizeSnapshot(JSON.parse(raw));
    return mergeWithDesktopSeed(normalized);
  } catch {
    return desktopTradingSeed;
  }
}

function publish(snapshot: LocalTradingSnapshot) {
  cachedSnapshot = snapshot;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  listeners.forEach((listener) => listener());
}

export function getLocalTradingSnapshot() {
  if (typeof window === "undefined") return emptySnapshot;
  cachedSnapshot ??= readFromStorage();
  return cachedSnapshot;
}

export function getLocalTradingServerSnapshot() {
  return desktopTradingSeed;
}

export function subscribeLocalTradingStore(listener: () => void) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedSnapshot = readFromStorage();
    listener();
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function createLocalBuyExecution(
  input: LocalBuyExecutionInput,
): LocalBuyExecutionResult {
  const createdAt = new Date().toISOString();
  const orderId = makeId("BUY");
  const plansValid = input.plans.every(
    (plan) =>
      Number.isFinite(plan.availableFunds) &&
      plan.availableFunds >= 0 &&
      Number.isFinite(plan.capitalRatio) &&
      plan.capitalRatio >= 0 &&
      plan.capitalRatio <= 1 &&
      Number.isFinite(plan.allocatedCapital) &&
      plan.allocatedCapital >= 0 &&
      Number.isFinite(plan.allocatedQuantity) &&
      plan.allocatedQuantity >= 0,
  );
  const totalParticipantFunds = input.plans.reduce(
    (total, plan) => total + plan.availableFunds,
    0,
  );
  const totalAllocatedCapital = input.plans.reduce(
    (total, plan) => total + plan.allocatedCapital,
    0,
  );
  const allocationMathValid =
    Number.isFinite(input.unitPrice) &&
    input.unitPrice > 0 &&
    input.plans.every(
      (plan) =>
        Math.abs(
          plan.allocatedQuantity - plan.allocatedCapital / input.unitPrice,
        ) < 1e-8,
    );
  const totalCapitalTolerance = Math.max(
    1e-8,
    Math.abs(input.totalTradeCapital) * 1e-10,
  );

  if (
    input.plans.length === 0 ||
    !plansValid ||
    !Number.isFinite(totalParticipantFunds) ||
    totalParticipantFunds <= 0 ||
    !Number.isFinite(input.totalTradeCapital) ||
    input.totalTradeCapital <= 0 ||
    !allocationMathValid ||
    Math.abs(totalAllocatedCapital - input.totalTradeCapital) >
      totalCapitalTolerance
  ) {
    throw new Error("El fondo participante o el capital total no es válido.");
  }

  const transactions: ClientTransaction[] = [];
  const positions: Position[] = [];

  for (const plan of input.plans) {
    const { allocatedCapital, allocatedQuantity, capitalRatio } = plan;

    if (allocatedCapital <= 0 || allocatedQuantity <= 0) {
      continue;
    }

    const transactionId = makeId("TRX");
    const positionId = makeId("POS");

    transactions.push({
      allocatedCapital,
      allocatedQuantity,
      amount: allocatedCapital,
      availableFunds: plan.availableFunds,
      capitalRatio,
      clientId: plan.clientId,
      currency: input.currency,
      executedAt: createdAt,
      market: input.market,
      orderId,
      personType: plan.personType,
      positionId,
      quantity: allocatedQuantity,
      side: "buy",
      status: "completed",
      stockName: input.stockName,
      ticker: input.ticker,
      transactionId,
      unitPrice: input.unitPrice,
    });

    positions.push({
      buyOrderId: orderId,
      buyTransactionId: transactionId,
      clientId: plan.clientId,
      costPrice: input.unitPrice,
      currency: input.currency,
      currentPrice: null,
      market: input.market,
      marketValue: null,
      openedAt: createdAt,
      orderId,
      personType: plan.personType,
      positionId,
      profitLoss: null,
      quantity: allocatedQuantity,
      status: "OPEN",
      stockName: input.stockName,
      ticker: input.ticker,
      transactionId,
    });
  }

  const order: BuyOrder = {
    clientIds: transactions.map((transaction) => transaction.clientId),
    createdAt,
    currency: input.currency,
    market: input.market,
    orderId,
    positionIds: positions.map((position) => position.positionId),
    status: "completed",
    stockName: input.stockName,
    ticker: input.ticker,
    totalAmount: transactions.reduce((total, transaction) => total + transaction.amount, 0),
    totalParticipantFunds,
    totalQuantity: transactions.reduce(
      (total, transaction) => total + transaction.quantity,
      0,
    ),
    totalTradeCapital: input.totalTradeCapital,
    transactionIds: transactions.map((transaction) => transaction.transactionId),
    unitPrice: input.unitPrice,
  };

  const current = getLocalTradingSnapshot();
  publish({
    dataStatus: "ready",
    orders: [...current.orders, order],
    positions: [...current.positions, ...positions],
    sellTransactions: current.sellTransactions,
    transactions: [...current.transactions, ...transactions],
  });

  return { order, positions, transactions };
}

export function createLocalSellExecution(
  input: LocalSellExecutionInput,
): LocalSellExecutionResult {
  const current = getLocalTradingSnapshot();
  const normalizedTicker = input.ticker.trim().toUpperCase();
  const sourcePosition = current.positions.find(
    (position) =>
      position.positionId === input.positionId &&
      position.clientId === input.clientId &&
      position.ticker.trim().toUpperCase() === normalizedTicker &&
      position.market === input.market,
  );

  const quantity = input.quantity;
  if (
    !sourcePosition ||
    sourcePosition.status !== "OPEN" ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    quantity > sourcePosition.quantity ||
    !Number.isFinite(input.sellPrice) ||
    input.sellPrice <= 0
  ) {
    throw new Error("La posición o la cantidad de venta ya no es válida.");
  }

  const executionTime = new Date().toISOString();
  const transaction: SellTransaction = {
    amount: Number((quantity * input.sellPrice).toFixed(4)),
    clientId: sourcePosition.clientId,
    currency: sourcePosition.currency,
    executionTime,
    market: sourcePosition.market,
    quantity,
    sellPrice: input.sellPrice,
    sellTransactionId: makeId("SELL-TRX"),
    sourcePositionId: sourcePosition.positionId,
    status: "COMPLETED",
    ticker: sourcePosition.ticker,
  };

  const remainingValue = sourcePosition.quantity - quantity;
  const remainingQuantity =
    Math.abs(remainingValue) < 1e-8 ? 0 : remainingValue;
  const updatedPosition: Position = {
    ...sourcePosition,
    marketValue: null,
    profitLoss: null,
    quantity: remainingQuantity,
    status: remainingQuantity === 0 ? "CLOSED" : "OPEN",
  };

  publish({
    dataStatus: "ready",
    orders: current.orders,
    positions: current.positions.map((position) =>
      position.positionId === updatedPosition.positionId
        ? updatedPosition
        : position,
    ),
    sellTransactions: [...current.sellTransactions, transaction],
    transactions: current.transactions,
  });

  return { position: updatedPosition, transaction };
}
