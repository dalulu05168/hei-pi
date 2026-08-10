import { IconActivity, IconCrown, IconUserPlus, IconUsers, IconWallet } from "@tabler/icons-react";
import { PageContainer } from "@/components";
import { ClientStatsCard, ClientsWorkspace, clients, clientsDataStatus, getClientStats } from "@/modules/clients";

export default function ClientsPage() {
  const stats = getClientStats();
  const totalNetAssets = clients.reduce(
    (total, client) => total + (client.accountFunds ?? 0) + (client.investedAmount ?? 0),
    0,
  );

  return (
    <PageContainer title="人物中心" showHeader={false}>
      <div className="grid h-full min-h-0 grid-rows-[136px_minmax(0,1fr)] gap-4 overflow-hidden">
        <section className="grid grid-cols-5 gap-3" aria-label="人物统计">
          <ClientStatsCard dataStatus={clientsDataStatus} label="总人数" icon={IconUsers} value={stats.total} />
          <ClientStatsCard dataStatus={clientsDataStatus} label="VIP人数" icon={IconCrown} value={stats.vip} />
          <ClientStatsCard dataStatus={clientsDataStatus} label="活跃用户" icon={IconActivity} value={stats.active} />
          <ClientStatsCard dataStatus={clientsDataStatus} label="今日新增" icon={IconUserPlus} value={stats.addedToday} />
          <ClientStatsCard
            dataStatus={clientsDataStatus}
            label="总资产净值"
            icon={IconWallet}
            value={totalNetAssets}
            format="money"
          />
        </section>
        <ClientsWorkspace dataStatus={clientsDataStatus} initialClients={clients} />
      </div>
    </PageContainer>
  );
}
