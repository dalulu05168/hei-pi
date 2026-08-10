import type { LocalTradingSnapshot } from "@/types";
import { sumAsReportingMxn } from "@/services/financial/money";
import type {
  Client,
  ClientBusinessDetailViewModel,
  ClientTradeHistoryItem,
} from "./types";

interface BuildClientBusinessDetailInput {
  client: Client | null;
  requestedId: string;
  snapshot: LocalTradingSnapshot;
}

export function buildClientBusinessDetail({
  client,
  requestedId,
  snapshot,
}: BuildClientBusinessDetailInput): ClientBusinessDetailViewModel {
  const positions = snapshot.positions.filter(
    (position) => position.clientId === requestedId,
  );
  const openPositions = positions.filter(
    (position) => position.status === "OPEN" && position.quantity > 0,
  );

  const buyTransactions: ClientTradeHistoryItem[] = snapshot.transactions
    .filter((transaction) => transaction.clientId === requestedId)
    .map((transaction) => ({
      amount: transaction.amount,
      currency: transaction.currency,
      executionTime: transaction.executedAt,
      market: transaction.market,
      positionId: transaction.positionId,
      price: transaction.unitPrice,
      quantity: transaction.quantity,
      side: "buy",
      status: "COMPLETED",
      ticker: transaction.ticker,
      transactionId: transaction.transactionId,
    }));

  const sellTransactions: ClientTradeHistoryItem[] = snapshot.sellTransactions
    .filter((transaction) => transaction.clientId === requestedId)
    .map((transaction) => ({
      amount: transaction.amount,
      currency: transaction.currency,
      executionTime: transaction.executionTime,
      market: transaction.market,
      positionId: transaction.sourcePositionId,
      price: transaction.sellPrice,
      quantity: transaction.quantity,
      side: "sell",
      status: transaction.status,
      ticker: transaction.ticker,
      transactionId: transaction.sellTransactionId,
    }));

  const hasBusinessSource = snapshot.dataStatus === "ready";
  const financialSummary = {
    availableFunds: client?.accountFunds ?? null,
    investedAmount: hasBusinessSource
      ? sumAsReportingMxn(openPositions.map((position) => ({
          currency: position.currency,
          value: position.costPrice * position.quantity,
        })))
      : null,
    positionValue: hasBusinessSource
      ? sumAsReportingMxn(openPositions.map((position) => ({
          currency: position.currency,
          value: position.marketValue,
        })))
      : null,
    totalProfitLoss: hasBusinessSource
      ? sumAsReportingMxn(openPositions.map((position) => ({
          currency: position.currency,
          value: position.profitLoss,
        })))
      : null,
  };

  return {
    businessDataStatus: snapshot.dataStatus,
    financialSummary,
    positions,
    transactions: [...buyTransactions, ...sellTransactions].sort(
      (left, right) =>
        new Date(right.executionTime).getTime() -
        new Date(left.executionTime).getTime(),
    ),
  };
}
