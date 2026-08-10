"use client";

import { useMemo, useState } from "react";
import { IconArrowLeft, IconDatabaseOff, IconShieldCheck, IconUsersGroup } from "@tabler/icons-react";
import { Modal } from "@/components";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import type { Client, ClientDataStatus } from "@/modules/clients";
import {
  createLocalBuyExecution,
  createLocalSellExecution,
} from "@/services/trading";
import type { ClientId } from "@/types";
import { InvestorCard } from "./InvestorCard";
import { StockSelector } from "./StockSelector";
import { TradeActionBar } from "./TradeActionBar";
import { TradingOverview } from "./TradingOverview";
import { TradeSummary } from "./TradeSummary";
import { getRecommendedClients } from "../recommendation";
import type {
  TradableStock,
  SalePositionContext,
  TradeInvestorPlan,
  TradeMarket,
  TradeMode,
  TradeRecord,
  TradeStockType,
  TradeTotals,
  TradingDataStatus,
} from "../types";

interface TradingWorkspaceProps {
  clientsDataStatus: ClientDataStatus;
  initialClients: readonly Client[];
  initialMode: TradeMode;
  initialSaleContext: SalePositionContext | null;
  marketDataStatus: TradingDataStatus;
  records: readonly TradeRecord[];
  recordsDataStatus: TradingDataStatus;
  stocks: readonly TradableStock[];
}

function parseNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function StageToolbar({
  connected,
  mode,
  onBack,
  stage,
}: {
  connected: boolean;
  mode: TradeMode;
  onBack: () => void;
  stage: "configure" | "allocate";
}) {
  const title = stage === "configure"
    ? mode === "buy" ? "智能买入策略设置" : "精准卖出持仓选择"
    : mode === "buy" ? "12位目标客户资金分配确认" : "持有人卖出清算确认";
  const breadcrumb = stage === "configure" ? "执行中心 / 参数配置" : "执行中心 / 人员矩阵";
  return (
    <header className="flex h-[58px] items-center justify-between border border-[#294963] bg-[linear-gradient(100deg,#071a2b,#06131f)] px-4 shadow-[0_14px_34px_rgba(0,0,0,.2)]">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onBack} className="grid h-9 w-9 flex-none place-items-center border border-[#315272] text-[#a9bac8] hover:border-[#a78121] hover:text-[#f2bd24]" aria-label="返回上一层">
          <IconArrowLeft size={17} stroke={1.65}/>
        </button>
        <div className="min-w-0">
          <p className="text-[8px] tracking-[.16em] text-[#71889b]">{breadcrumb}</p>
          <h2 className="mt-1 truncate text-[15px] font-semibold text-[var(--pi-color-text)]">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2 text-right">
        <IconShieldCheck size={16} stroke={1.55} className={connected ? "text-[#62d98e]" : "text-[#f2bd24]"}/>
        <span><small className="block text-[8px] tracking-[.14em] text-[#71889b]">业务数据源</small><strong className={`mt-1 block text-[9px] ${connected ? "text-[#62d98e]" : "text-[#f2bd24]"}`}>{connected ? "已连接" : "等待连接"}</strong></span>
      </div>
    </header>
  );
}

function sumNullable(values: readonly (number | null)[]) {
  if (values.length === 0 || values.some((value) => value === null)) {
    return null;
  }

  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function resolvePurchaseCapital(
  clientId: string,
  suggestedCapital: number | null,
  purchaseCapitalInputs: Readonly<Record<string, string>>,
) {
  if (!Object.prototype.hasOwnProperty.call(purchaseCapitalInputs, clientId)) {
    return suggestedCapital;
  }

  const value = parseNumber(purchaseCapitalInputs[clientId]);
  return value !== null && value >= 0 ? value : null;
}

export function TradingWorkspace({
  clientsDataStatus,
  initialClients,
  initialMode,
  initialSaleContext,
  marketDataStatus,
  records,
  stocks,
}: TradingWorkspaceProps) {
  const [stage, setStage] = useState<"overview" | "configure" | "allocate">(
    initialSaleContext ? "allocate" : "overview",
  );
  const [mode, setMode] = useState<TradeMode>(initialMode);
  const [market, setMarket] = useState<TradeMarket>(initialSaleContext?.market ?? "US");
  const [stockType, setStockType] = useState<TradeStockType>("vip");
  const [ticker, setTicker] = useState(initialSaleContext?.ticker ?? "");
  const [discount, setDiscount] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(() => new Set());
  const [purchaseCapitalInputs, setPurchaseCapitalInputs] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastExecutionCount, setLastExecutionCount] = useState<number | null>(null);
  const localTrading = useLocalTradingSnapshot();

  const sourcePosition = useMemo(() => {
    if (mode !== "sell" || !initialSaleContext) {
      return null;
    }

    const normalizedTicker = initialSaleContext.ticker
      .trim()
      .replace(/\.MX$/i, "")
      .toUpperCase();

    return (
      localTrading.positions.find(
        (position) =>
          position.positionId === initialSaleContext.positionId &&
          position.clientId === initialSaleContext.clientId &&
          position.market === initialSaleContext.market &&
          position.ticker.replace(/\.MX$/i, "").toUpperCase() === normalizedTicker,
      ) ?? null
    );
  }, [initialSaleContext, localTrading.positions, mode]);

  const selectedStock = useMemo(() => {
    const normalizedTicker = ticker.trim().replace(/\.MX$/i, "").toUpperCase();

    return (
      stocks.find(
        (stock) =>
          stock.market === market &&
          (mode === "sell" && sourcePosition
            ? true
            : stock.stockType === stockType) &&
          stock.ticker.replace(/\.MX$/i, "").toUpperCase() === normalizedTicker,
      ) ?? null
    );
  }, [market, mode, sourcePosition, stockType, stocks, ticker]);

  const discountValue = parseNumber(discount);
  const quantityValue = parseNumber(mode === "buy" ? buyQuantity : sellQuantity);
  const discountLimit = mode === "sell" ? 20 : 99;
  const validDiscount =
    discountValue !== null && discountValue >= 0 && discountValue <= discountLimit
      ? discountValue
      : null;
  const discountedPrice =
    selectedStock?.currentPrice !== null &&
    selectedStock?.currentPrice !== undefined &&
    validDiscount !== null
      ? selectedStock.currentPrice * (1 - validDiscount / 100)
      : null;
  const estimatedAmount =
    discountedPrice !== null && quantityValue !== null && quantityValue > 0
      ? discountedPrice * quantityValue
      : null;

  const investors = useMemo<TradeInvestorPlan[]>(() => {
    if (clientsDataStatus !== "ready") {
      return [];
    }

    if (mode === "buy") {
      const recommendedClients = getRecommendedClients(initialClients, stockType).slice(0, 12);
      const participatingClients = recommendedClients.filter(
        (client) => !rejectedIds.has(client.id),
      );
      const fundsReady = participatingClients.every(
        (client) => client.accountFunds !== null && client.accountFunds >= 0,
      );
      const totalParticipantFunds = fundsReady
        ? participatingClients.reduce(
            (total, client) => total + (client.accountFunds ?? 0),
            0,
          )
        : null;

      return recommendedClients.map((client) => {
        const rejected = rejectedIds.has(client.id);
        const availableFunds = client.accountFunds;
        const capitalRatio =
          rejected
            ? 0
            : availableFunds !== null &&
                totalParticipantFunds !== null &&
                totalParticipantFunds > 0
              ? availableFunds / totalParticipantFunds
              : null;
        const suggestedCapital =
          capitalRatio !== null && estimatedAmount !== null
            ? estimatedAmount * capitalRatio
            : null;
        const allocatedCapital = rejected
          ? 0
          : resolvePurchaseCapital(
              client.id,
              suggestedCapital,
              purchaseCapitalInputs,
            );
        const allocatedQuantity =
          allocatedCapital !== null && discountedPrice !== null && discountedPrice > 0
            ? allocatedCapital / discountedPrice
            : null;

        return {
          allocatedCapital,
          allocatedQuantity,
          availableFunds,
          capitalRatio,
          client,
        };
      });
    }

    if (!sourcePosition || sourcePosition.status !== "OPEN" || sourcePosition.quantity <= 0) {
      return [];
    }

    const client = initialClients.find((item) => item.id === sourcePosition.clientId);
    return client
      ? [
          {
            allocatedCapital: sourcePosition.marketValue,
            allocatedQuantity: sourcePosition.quantity,
            availableFunds: client.accountFunds,
            capitalRatio: null,
            client,
          },
        ]
      : [];
  }, [
    clientsDataStatus,
    discountedPrice,
    estimatedAmount,
    initialClients,
    mode,
    purchaseCapitalInputs,
    rejectedIds,
    sourcePosition,
    stockType,
  ]);

  const selectedInvestors = investors.filter((plan) => !rejectedIds.has(plan.client.id));
  const totals: TradeTotals = {
    actualCount: lastExecutionCount,
    estimatedFunds:
      clientsDataStatus === "ready"
        ? mode === "buy"
          ? sumNullable(selectedInvestors.map((plan) => plan.allocatedCapital))
          : selectedInvestors.length > 0
            ? estimatedAmount
            : null
        : null,
    estimatedShares:
      clientsDataStatus === "ready"
        ? mode === "buy"
          ? sumNullable(selectedInvestors.map((plan) => plan.allocatedQuantity))
          : selectedInvestors.length > 0
            ? quantityValue
            : null
        : null,
    rejectedCount: clientsDataStatus === "ready" ? rejectedIds.size : null,
    selectedCount: clientsDataStatus === "ready" ? selectedInvestors.length : null,
  };

  const canConfirm =
    marketDataStatus === "ready" &&
    clientsDataStatus === "ready" &&
    selectedStock !== null &&
    validDiscount !== null &&
    quantityValue !== null &&
    quantityValue > 0 &&
    (mode === "sell" || Number.isInteger(quantityValue)) &&
    (mode === "buy"
      ? selectedInvestors.length > 0 &&
        selectedInvestors.every(
          (plan) =>
            plan.availableFunds !== null &&
            plan.availableFunds >= 0 &&
            plan.capitalRatio !== null &&
            plan.allocatedCapital !== null &&
            plan.allocatedQuantity !== null,
        ) &&
        selectedInvestors.some(
          (plan) =>
            plan.allocatedCapital !== null &&
            plan.allocatedCapital > 0 &&
            plan.allocatedQuantity !== null &&
            plan.allocatedQuantity > 0,
        )
      :
      (sourcePosition !== null &&
        sourcePosition.status === "OPEN" &&
        quantityValue <= sourcePosition.quantity &&
        sourcePosition.positionId === initialSaleContext?.positionId &&
        sourcePosition.clientId === initialSaleContext.clientId &&
        sourcePosition.market === market &&
        sourcePosition.ticker.replace(/\.MX$/i, "").toUpperCase() ===
          ticker.trim().replace(/\.MX$/i, "").toUpperCase())) &&
    selectedInvestors.length > 0;

  function changeMode(nextMode: TradeMode) {
    setMode(nextMode);
    setRejectedIds(new Set());
    setConfirmOpen(false);

    const url = new URL(window.location.href);
    url.searchParams.set("view", nextMode);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function toggleRejected(clientId: string) {
    setRejectedIds((current) => {
      const next = new Set(current);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  }

  function changePurchaseCapital(clientId: string, value: string) {
    setPurchaseCapitalInputs((current) => ({
      ...current,
      [clientId]: value,
    }));
    setLastExecutionCount(null);
  }

  function resetContext(next: "market" | "stockType", value: TradeMarket | TradeStockType) {
    if (mode === "sell") {
      return;
    }

    if (next === "market") {
      setMarket(value as TradeMarket);
    } else {
      setStockType(value as TradeStockType);
    }
    setTicker("");
    setPurchaseCapitalInputs({});
    setRejectedIds(new Set());
  }

  function confirmLocalBuy() {
    if (
      mode !== "buy" ||
      !canConfirm ||
      !selectedStock ||
      discountedPrice === null ||
      estimatedAmount === null ||
      totals.estimatedFunds === null
    ) {
      return;
    }

    const plans = selectedInvestors.flatMap((plan) =>
      plan.availableFunds !== null &&
      plan.capitalRatio !== null &&
      plan.allocatedCapital !== null &&
      plan.allocatedQuantity !== null
        ? [
            {
              allocatedCapital: plan.allocatedCapital,
              allocatedQuantity: plan.allocatedQuantity,
              availableFunds: plan.availableFunds,
              capitalRatio: plan.capitalRatio,
              clientId: plan.client.id as ClientId,
              personType: plan.client.personType,
            },
          ]
        : [],
    );

    if (plans.length === 0) return;

    const result = createLocalBuyExecution({
      currency: selectedStock.currency,
      market: selectedStock.market,
      plans,
      stockName: selectedStock.name,
      ticker: selectedStock.ticker,
      totalTradeCapital: totals.estimatedFunds,
      unitPrice: discountedPrice,
    });

    setLastExecutionCount(result.transactions.length);
    setConfirmOpen(false);
  }

  function confirmLocalSell() {
    if (
      mode !== "sell" ||
      !canConfirm ||
      !sourcePosition ||
      !initialSaleContext ||
      discountedPrice === null ||
      quantityValue === null
    ) {
      return;
    }

    const result = createLocalSellExecution({
      clientId: initialSaleContext.clientId,
      market: initialSaleContext.market,
      positionId: initialSaleContext.positionId,
      quantity: quantityValue,
      sellPrice: discountedPrice,
      ticker: initialSaleContext.ticker,
    });

    setLastExecutionCount(1);
    setSellQuantity("");
    setConfirmOpen(false);

    if (result.position.status === "CLOSED") {
      setRejectedIds(new Set());
    }
  }

  const localRecords: TradeRecord[] = localTrading.orders.map((order) => ({
    clientCount: order.clientIds.length,
    executedAt: order.createdAt,
    id: order.orderId,
    mode: "buy",
    ticker: order.ticker,
    totalAmount: order.totalAmount,
    totalShares: order.totalQuantity,
  }));
  const localSellRecords: TradeRecord[] = localTrading.sellTransactions.map(
    (transaction) => ({
      clientCount: 1,
      executedAt: transaction.executionTime,
      id: transaction.sellTransactionId,
      mode: "sell",
      ticker: transaction.ticker,
      totalAmount: transaction.amount,
      totalShares: transaction.quantity,
    }),
  );
  const visibleRecords = [...records, ...localRecords, ...localSellRecords];
  if (stage === "overview") {
    return (
      <TradingOverview
        clients={initialClients}
        onBuy={() => { changeMode("buy"); setStage("configure"); }}
        onSell={() => { changeMode("sell"); setStage("configure"); }}
        positions={localTrading.positions}
        records={visibleRecords}
      />
    );
  }

  if (stage === "configure") {
    return (
      <div className="grid h-full min-h-0 grid-rows-[58px_minmax(0,1fr)_64px] gap-3">
        <StageToolbar connected={marketDataStatus === "ready" && clientsDataStatus === "ready"} mode={mode} onBack={() => setStage("overview")} stage="configure"/>
        {mode === "buy" ? <section className="flex min-h-0 flex-col justify-center gap-5 border border-[#294963] bg-[linear-gradient(145deg,#071b2c,#061522)] p-6"><div><span className="text-[9px] tracking-[.16em] text-[#f2bd24]">买入执行 · 第二层</span><h3 className="mt-2 text-[22px] font-semibold text-[var(--pi-color-text)]">买入参数与资格规则</h3><p className="mt-2 text-[11px] text-[#8299ad]">完成市场、票种、股票代码、折扣比例和预计买入数量后，进入目标客户矩阵。</p></div><StockSelector discount={discount} estimatedAmount={estimatedAmount} market={market} marketDataStatus={marketDataStatus} mode={mode} onDiscountChange={setDiscount} onMarketChange={(value) => resetContext('market',value)} onQuantityChange={setBuyQuantity} onStockTypeChange={(value) => resetContext('stockType',value)} onTickerChange={setTicker} quantity={buyQuantity} selectedStock={selectedStock} stockOptions={stocks.filter((stock) => stock.market === market && stock.stockType === stockType)} stockType={stockType} ticker={ticker}/><div className="grid grid-cols-3 divide-x divide-[#1f3d57] border border-[#1f3d57] bg-[#06121e] px-4 py-3 text-[10px] text-[#94a9ba]"><span>推荐依据：票种资格 + 人员基础属性</span><span className="pl-4">VIP票：排除新学员并校验VIP资格</span><span className="pl-4">资金分配：按个人可用资金占比计算</span></div></section> : <section className="min-h-0 overflow-hidden border border-[#294963] bg-[linear-gradient(145deg,#071b2c,#061522)] p-5"><div className="flex items-end justify-between"><div><span className="text-[9px] tracking-[.16em] text-[#f2bd24]">卖出清算 · 第二层</span><h3 className="mt-2 text-[22px] font-semibold text-[var(--pi-color-text)]">选择具体开放持仓</h3></div><span className="text-[9px] text-[#71889b]">卖出必须绑定 positionId 与 clientId</span></div><div className="mt-5 grid grid-cols-4 gap-3">{localTrading.positions.filter((position) => position.status === 'OPEN').slice(0,12).map((position) => <button key={position.positionId} onClick={() => { window.location.href = `/trading?view=sell&positionId=${encodeURIComponent(position.positionId)}&clientId=${encodeURIComponent(position.clientId)}&ticker=${encodeURIComponent(position.ticker)}&market=${position.market}`; }} className="border border-[#284965] bg-[#082138] p-4 text-left hover:border-[#a27b1c]"><div className="flex items-center justify-between"><p className="font-mono text-[18px] text-[var(--pi-color-text)]">{position.ticker}</p><span className="text-[8px] text-[#f2bd24]">{position.market === 'US' ? '美股' : '墨股'}</span></div><p className="mt-2 truncate text-[9px] text-[#8da4b7]">持仓编号：{position.positionId}</p><div className="mt-4 flex justify-between text-[10px]"><span>客户 {position.clientId}</span><span className="font-mono text-[#f2bd24]">{position.quantity.toLocaleString('es-MX')} 股</span></div></button>)}</div></section>}
        <footer className="flex items-center justify-between border border-[#274866] bg-[#071a2b] px-4"><span className="text-[10px] text-[#8299ad]">第二层 · 参数与持仓确认</span>{mode === 'buy' ? <button disabled={!selectedStock || validDiscount === null || quantityValue === null} onClick={() => setStage('allocate')} className="h-10 border border-[#e0b33a] bg-[linear-gradient(180deg,#e2b944,#b9831d)] px-7 text-[11px] font-semibold text-[#07111b] shadow-[0_8px_20px_rgba(185,131,29,.2)] disabled:opacity-30">进入12位目标客户矩阵</button> : <span className="text-[10px] text-[#8299ad]">选择持仓后进入卖出确认矩阵</span>}</footer>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_360px] gap-3 overflow-hidden">
      <div className="grid min-h-0 min-w-0 grid-rows-[58px_minmax(0,1fr)_72px] gap-3">
        <StageToolbar connected={marketDataStatus === "ready" && clientsDataStatus === "ready"} mode={mode} onBack={() => setStage("configure")} stage="allocate"/>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="flex h-10 flex-none items-center justify-between border-b border-[var(--pi-color-border)] px-3.5">
            <div className="flex items-center gap-2">
              <IconUsersGroup size={15} stroke={1.6} className="text-[#f4c430]" aria-hidden="true" />
              <span>
                <h2 className="text-[11px] font-semibold text-[var(--pi-color-text)]">交易参与人员</h2>
                <p className="mt-0.5 text-[8px] text-[var(--pi-color-text-faint)]">
                  默认全部参与；仅使用红色 X 拒绝人员。
                </p>
              </span>
            </div>
            <span className="font-mono text-[8px] tracking-[0.14em] text-[var(--pi-color-text-faint)]">02 / 人员矩阵</span>
          </div>

          {investors.length > 0 ? (
            <div className={`grid min-h-0 flex-1 content-start gap-2.5 overflow-hidden p-3 ${mode === "buy" ? "grid-cols-4 grid-rows-3" : "grid-cols-[repeat(auto-fill,minmax(240px,1fr))]"}`}>
              {investors.map((plan) => (
                <InvestorCard
                  key={plan.client.id}
                  mode={mode}
                  onPurchaseCapitalChange={changePurchaseCapital}
                  onToggleRejected={toggleRejected}
                  plan={plan}
                  purchaseCapitalValue={
                    purchaseCapitalInputs[plan.client.id] ??
                    (plan.allocatedCapital === null
                      ? ""
                      : String(plan.allocatedCapital))
                  }
                  rejected={rejectedIds.has(plan.client.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 place-items-center bg-[#08121d] p-4 text-center">
              <div className="max-w-[390px]">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[#d9a817]">
                  <IconDatabaseOff size={20} stroke={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[11px] font-medium text-[var(--pi-color-text)]">
                  {mode === "buy" ? "人员数据源未连接" : "卖出持仓不可用"}
                </h3>
                <p className="mt-1.5 text-[9px] leading-4 text-[var(--pi-color-text-faint)]">
                  {mode === "buy"
                    ? "连接真实客户数据后，将按现有规则显示可用资金、购买资金和预计股数。"
                    : "卖出必须使用与开放持仓一致的持仓编号、客户编号、股票代码和市场。"}
                </p>
              </div>
            </div>
          )}
        </section>

        <TradeActionBar onRestoreRejected={() => setRejectedIds(new Set())} totals={totals} />
      </div>

      <TradeSummary
        canConfirm={canConfirm}
        discount={validDiscount}
        discountedPrice={discountedPrice}
        estimatedAmount={estimatedAmount}
        market={market}
        mode={mode}
        onConfirm={() => setConfirmOpen(true)}
        position={mode === "sell" ? sourcePosition : null}
        selectedStock={selectedStock}
        sellQuantity={
          mode === "sell" && quantityValue !== null && quantityValue > 0
            ? quantityValue
            : null
        }
        ticker={ticker}
        totals={totals}
      />

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={mode === "buy" ? "确认买入" : "确认卖出"}
        footer={
          <button
            type="button"
            disabled={!canConfirm}
            onClick={mode === "buy" ? confirmLocalBuy : confirmLocalSell}
            className="h-10 w-full rounded-lg border border-[rgba(244,196,48,0.42)] bg-[#f4c430] text-[10px] font-semibold text-[#08090b] disabled:cursor-not-allowed disabled:border-[var(--pi-color-border)] disabled:bg-[#102131] disabled:text-[var(--pi-color-text-faint)]"
          >
            {mode === "buy"
              ? "确认并登记买入"
              : "确认并登记卖出"}
          </button>
        }
      >
        <p className="text-[11px] leading-5 text-[var(--pi-color-text-muted)]">
          {mode === "buy"
            ? "买入确认后将写入当前共享交易数据源。"
            : "卖出仅作用于指定持仓，并同步更新该持仓的剩余数量。"}
        </p>
      </Modal>
    </div>
  );
}
