import { PageContainer } from "@/components";
import { clients, clientsDataStatus } from "@/modules/clients";
import {
  tradeRecords,
  tradeRecordsDataStatus,
  tradableStocks,
  tradingMarketDataStatus,
  TradingWorkspace,
  type SalePositionContext,
  type TradeMode,
} from "@/modules/trading";

interface TradingPageProps {
  searchParams: Promise<{
    clientId?: string | string[];
    market?: string | string[];
    positionId?: string | string[];
    ticker?: string | string[];
    view?: string | string[];
  }>;
}

export default async function TradingPage({ searchParams }: TradingPageProps) {
  const { clientId, market, positionId, ticker, view } = await searchParams;
  const initialMode: TradeMode = view === "sell" ? "sell" : "buy";
  const initialSaleContext: SalePositionContext | null =
    initialMode === "sell" &&
    typeof clientId === "string" &&
    typeof positionId === "string" &&
    typeof ticker === "string" &&
    (market === "US" || market === "MX")
      ? { clientId, market, positionId, ticker }
      : null;

  return (
    <PageContainer
      title="执行中心"
      showHeader={false}
      className="h-full"
    >
      <TradingWorkspace
        clientsDataStatus={clientsDataStatus}
        initialClients={clients}
        initialMode={initialMode}
        initialSaleContext={initialSaleContext}
        marketDataStatus={tradingMarketDataStatus}
        records={tradeRecords}
        recordsDataStatus={tradeRecordsDataStatus}
        stocks={tradableStocks}
      />
    </PageContainer>
  );
}
