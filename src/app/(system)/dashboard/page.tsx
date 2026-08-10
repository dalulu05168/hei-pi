"use client";

import { useMemo } from "react";
import { IconCash, IconChartPie, IconShield, IconTrendingUp, IconWallet } from "@tabler/icons-react";
import { PageContainer } from "@/components";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { clients, clientsDataStatus } from "@/modules/clients";
import { DashboardCard, OperationsBoard } from "@/modules/dashboard/components";
import { buildDashboardTradingStats, formatDashboardCurrencyMetrics } from "@/modules/dashboard/trading-stats";

export default function DashboardPage() {
  const snapshot = useLocalTradingSnapshot();
  const stats = useMemo(() => buildDashboardTradingStats({ clientDataStatus: clientsDataStatus, clients, snapshot }), [snapshot]);
  return (
    <PageContainer title="总览大盘" showHeader={false}>
      <div className="grid h-full min-h-0 grid-rows-[132px_minmax(0,1fr)] gap-4 overflow-hidden">
        <section className="grid grid-cols-5 gap-3" aria-label="运营核心指标">
          <DashboardCard dataStatus={stats.dataStatus} label="总资产" icon={IconWallet} value={formatDashboardCurrencyMetrics(stats.totalAssets)} />
          <DashboardCard dataStatus={stats.dataStatus} label="今日盈亏" icon={IconTrendingUp} value={formatDashboardCurrencyMetrics(stats.todayProfitLoss)} />
          <DashboardCard dataStatus={stats.dataStatus} label="当前持仓" icon={IconChartPie} value={snapshot.positions.filter((position) => position.status === "OPEN" && position.quantity > 0).length} />
          <DashboardCard dataStatus={stats.dataStatus} label="总风险敞口" icon={IconCash} value={formatDashboardCurrencyMetrics(stats.positionValue)} />
          <DashboardCard dataStatus="disconnected" label="风险评分" icon={IconShield} value={null} />
        </section>
        <OperationsBoard />
      </div>
    </PageContainer>
  );
}
