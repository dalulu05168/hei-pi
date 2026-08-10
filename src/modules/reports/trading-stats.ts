import type {
  LocalTradingSnapshot,
} from "@/types";
import { sumAsReportingMxn, toReportingMxn } from "@/services/financial/money";

export interface ReportTradingStats {
  buyAmount: number | null;
  clientCount: number | null;
  currentPositionCount: number | null;
  realizedProfitLoss: number | null;
  sellAmount: number | null;
  unrealizedProfitLoss: number | null;
}

export function buildReportTradingStats(
  snapshot: LocalTradingSnapshot,
  masterClientCount?: number,
): ReportTradingStats {
  if (snapshot.dataStatus !== "ready") {
    return {
      buyAmount: null,
      clientCount: null,
      currentPositionCount: null,
      realizedProfitLoss: null,
      sellAmount: null,
      unrealizedProfitLoss: null,
    };
  }

  const clientIds = new Set<string>();
  snapshot.transactions.forEach((transaction) => clientIds.add(transaction.clientId));
  snapshot.positions.forEach((position) => clientIds.add(position.clientId));
  snapshot.sellTransactions.forEach((transaction) => clientIds.add(transaction.clientId));

  const positionById = new Map(
    snapshot.positions.map((position) => [position.positionId, position]),
  );
  const openPositions = snapshot.positions.filter(
    (position) => position.status === "OPEN" && position.quantity > 0,
  );

  const realizedValues = snapshot.sellTransactions.flatMap((transaction) => {
    const sourcePosition = positionById.get(transaction.sourcePositionId);
    return sourcePosition
      ? [
          {
            value: toReportingMxn(
              (transaction.sellPrice - sourcePosition.costPrice) * transaction.quantity,
              transaction.currency,
            ),
          },
        ]
      : [];
  });

  const unrealizedValues = openPositions.flatMap((position) =>
    position.profitLoss === null
      ? []
      : [{ currency: position.currency, value: position.profitLoss }],
  );

  return {
    buyAmount:
      snapshot.transactions.length > 0
        ? sumAsReportingMxn(
            snapshot.transactions.map((transaction) => ({
              currency: transaction.currency,
              value: transaction.amount,
            })),
          )
        : null,
    clientCount: masterClientCount ?? clientIds.size,
    currentPositionCount: openPositions.length,
    realizedProfitLoss:
      realizedValues.length > 0
        ? realizedValues.reduce((total, { value }) => total + value, 0)
        : null,
    sellAmount:
      snapshot.sellTransactions.length > 0
        ? sumAsReportingMxn(
            snapshot.sellTransactions.map((transaction) => ({
              currency: transaction.currency,
              value: transaction.amount,
            })),
          )
        : null,
    unrealizedProfitLoss:
      unrealizedValues.length > 0 ? sumAsReportingMxn(unrealizedValues) : null,
  };
}
