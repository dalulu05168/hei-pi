import { desktopData, toMarket, toPersonType } from "@/data/desktop";
import type { BuyOrder, ClientTransaction, LocalTradingSnapshot, Position } from "@/types";

const orders: BuyOrder[] = [];
const transactions: ClientTransaction[] = [];
const positions: Position[] = [];

for (const holding of desktopData.holdings) {
  const stock = desktopData.stockCatalog.find((item) => item.ticker === holding.ticker);
  const person = desktopData.people.find((item) => item.personId === holding.personId);
  if (!stock || !person) continue;

  const market = toMarket(stock.currency);
  const orderId = `LEGACY-BUY-${holding.id}`;
  const transactionId = `LEGACY-TRX-${holding.id}`;
  const positionId = `LEGACY-POS-${holding.id}`;
  const openedAt = new Date(holding.openedAt).toISOString();
  const amount = holding.costPrice * holding.shares;
  const marketValue = holding.currentPrice * holding.shares;
  const personType = toPersonType(person.type);

  orders.push({
    clientIds: [person.personId], createdAt: openedAt, currency: stock.currency,
    market, orderId, positionIds: [positionId], status: "completed",
    stockName: holding.stockName, ticker: holding.ticker, totalAmount: amount,
    totalParticipantFunds: person.balance, totalQuantity: holding.shares,
    totalTradeCapital: amount, transactionIds: [transactionId], unitPrice: holding.costPrice,
  });
  transactions.push({
    allocatedCapital: amount, allocatedQuantity: holding.shares, amount,
    availableFunds: person.balance, capitalRatio: 1, clientId: person.personId,
    currency: stock.currency, executedAt: openedAt, market, orderId, personType,
    positionId, quantity: holding.shares, side: "buy", status: "completed",
    stockName: holding.stockName, ticker: holding.ticker, transactionId,
    unitPrice: holding.costPrice,
  });
  positions.push({
    buyOrderId: orderId, buyTransactionId: transactionId, clientId: person.personId,
    costPrice: holding.costPrice, currency: stock.currency, currentPrice: holding.currentPrice,
    market, marketValue, openedAt, orderId, personType, positionId,
    profitLoss: (holding.currentPrice - holding.costPrice) * holding.shares,
    quantity: holding.shares, remainingHours: holding.remainingHours,
    sellDeadline: new Date(holding.sellDeadline).toISOString(), status: "OPEN", stockName: holding.stockName,
    ticker: holding.ticker, transactionId,
  });
}

export const desktopTradingSeed: LocalTradingSnapshot = {
  dataStatus: positions.length ? "ready" : "disconnected",
  orders, positions, sellTransactions: [], transactions,
};
