import type { BusinessDataStatus, Position } from "@/types";
import { toReportingMxn } from "@/services/financial/money";
import type {
  PortfolioPosition,
  PortfolioSummaryData,
  PortfolioViewModel,
} from "./types";

interface BuildPortfolioInput {
  dataStatus: BusinessDataStatus;
  positions: readonly Position[];
}

const disconnectedSummary: PortfolioSummaryData = {
  availableFunds: null,
  positionValue: null,
  profitLossRatio: null,
  totalAssets: null,
  totalProfitLoss: null,
};

function strictSum(values: readonly (number | null)[]) {
  if (values.some((value) => value === null)) {
    return null;
  }

  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function mapPositions(sourcePositions: readonly Position[]) {
  return sourcePositions
    .filter((position) => position.status === "OPEN" && position.quantity > 0)
    .map<PortfolioPosition>((position) => {
      const averageCost = toReportingMxn(position.costPrice, position.currency);
      const currentPrice =
        position.currentPrice === null
          ? null
          : toReportingMxn(position.currentPrice, position.currency);
      const marketValue =
        position.marketValue === null
          ? null
          : toReportingMxn(position.marketValue, position.currency);
      const profitLoss =
        position.profitLoss === null
          ? null
          : toReportingMxn(position.profitLoss, position.currency);
      const costBasis = averageCost * position.quantity;
      const openedAt = new Date(position.openedAt).getTime();
      const profitLossRatio =
        profitLoss !== null && costBasis > 0
          ? (profitLoss / costBasis) * 100
          : null;

      return {
        averageCost,
        clientId: position.clientId,
        currency: position.currency,
        currentPrice,
        holdingDays: Number.isFinite(openedAt)
          ? Math.max(
              0,
              Math.floor((Date.now() - openedAt) / (24 * 60 * 60 * 1000)),
            )
          : null,
        id: position.positionId,
        market: position.market,
        marketValue,
        name: position.stockName,
        ownerCount: 1,
        positionId: position.positionId,
        profitLoss,
        profitLossRatio,
        quantity: position.quantity,
        ticker: position.ticker.trim().toUpperCase(),
      };
    })
    .sort((left, right) => left.ticker.localeCompare(right.ticker, "es-MX"));
}

function buildSummary(
  positions: readonly PortfolioPosition[],
): PortfolioSummaryData {
  const positionValue = strictSum(positions.map((position) => position.marketValue));
  const totalProfitLoss = strictSum(positions.map((position) => position.profitLoss));
  const costBasis = strictSum(
    positions.map((position) =>
      position.averageCost !== null && position.quantity !== null
        ? position.averageCost * position.quantity
        : null,
    ),
  );
  const profitLossRatio =
    totalProfitLoss !== null && costBasis !== null && costBasis > 0
      ? (totalProfitLoss / costBasis) * 100
      : null;

  return {
    availableFunds: null,
    positionValue,
    profitLossRatio,
    totalAssets: null,
    totalProfitLoss,
  };
}

export function buildPortfolioViewModel({
  dataStatus,
  positions: sourcePositions,
}: BuildPortfolioInput): PortfolioViewModel {
  if (dataStatus !== "ready") {
    return {
      dataStatus,
      positions: [],
      summary: disconnectedSummary,
    };
  }

  const positions = mapPositions(sourcePositions);

  return {
    dataStatus,
    positions,
    summary: buildSummary(positions),
  };
}

export function createVentaHref(position: PortfolioPosition) {
  const params = new URLSearchParams({
    clientId: position.clientId,
    market: position.market,
    positionId: position.positionId,
    ticker: position.ticker,
    view: "sell",
  });

  return `/trading?${params.toString()}`;
}
