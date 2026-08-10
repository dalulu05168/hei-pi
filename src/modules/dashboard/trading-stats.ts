import type {
  BusinessDataStatus,
  ClientTransaction,
  LocalTradingSnapshot,
  Position,
} from "@/types";
import {
  formatReportingMxn,
  sumAsReportingMxn,
  toReportingMxn,
} from "@/services/financial/money";

export interface DashboardClientProfile {
  accountFunds: number | null;
  level: "standard" | "vip";
}

export interface DashboardTradingStats {
  activeTraders: number | null;
  availableFunds: number | null;
  dataStatus: BusinessDataStatus;
  positionValue: number | null;
  todayProfitLoss: number | null;
  totalAssets: number | null;
  vipClients: number | null;
}

function getOpenPositions(snapshot: LocalTradingSnapshot) {
  return snapshot.positions.filter(
    (position) => position.status === "OPEN" && position.quantity > 0,
  );
}

function getPositionValues(positions: readonly Position[]) {
  if (positions.length === 0 || positions.some((position) => position.marketValue === null)) {
    return null;
  }

  return sumAsReportingMxn(
    positions.map((position) => ({
      currency: position.currency,
      value: position.marketValue,
    })),
  );
}

function isToday(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const valueDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));

  return valueDate === today;
}

function getTodayRealizedProfitLoss(snapshot: LocalTradingSnapshot) {
  const positionById = new Map(
    snapshot.positions.map((position) => [position.positionId, position]),
  );

  const values = snapshot.sellTransactions.flatMap((transaction) => {
    if (!isToday(transaction.executionTime)) return [];

    const sourcePosition = positionById.get(transaction.sourcePositionId);
    return sourcePosition
      ? [{
          value: toReportingMxn(
            (transaction.sellPrice - sourcePosition.costPrice) * transaction.quantity,
            transaction.currency,
          ),
        }]
      : [];
  });

  return values.length > 0
    ? values.reduce((total, { value }) => total + value, 0)
    : null;
}

function getActiveTraderIds(snapshot: LocalTradingSnapshot) {
  const clientIds = new Set<string>();
  snapshot.transactions.forEach((transaction: ClientTransaction) => clientIds.add(transaction.clientId));
  snapshot.sellTransactions.forEach((transaction) => clientIds.add(transaction.clientId));
  getOpenPositions(snapshot).forEach((position) => clientIds.add(position.clientId));
  return clientIds;
}

export function buildDashboardTradingStats({
  clientDataStatus,
  clients,
  snapshot,
}: {
  clientDataStatus: BusinessDataStatus;
  clients: readonly DashboardClientProfile[];
  snapshot: LocalTradingSnapshot;
}): DashboardTradingStats {
  const sourceReady = snapshot.dataStatus === "ready";
  const openPositions = getOpenPositions(snapshot);
  const positionValue = sourceReady ? getPositionValues(openPositions) : null;
  const availableFunds =
    clientDataStatus === "ready" && clients.every((client) => client.accountFunds !== null)
      ? clients.reduce((total, client) => total + (client.accountFunds ?? 0), 0)
      : null;

  return {
    activeTraders: sourceReady ? getActiveTraderIds(snapshot).size : null,
    availableFunds,
    dataStatus: snapshot.dataStatus,
    positionValue,
    todayProfitLoss: sourceReady ? getTodayRealizedProfitLoss(snapshot) : null,
    totalAssets:
      availableFunds !== null && positionValue !== null
        ? availableFunds + positionValue
        : null,
    vipClients:
      clientDataStatus === "ready"
        ? clients.filter((client) => client.level === "vip").length
        : null,
  };
}

export function formatDashboardCurrencyMetrics(
  value: number | null,
) {
  return formatReportingMxn(value);
}
