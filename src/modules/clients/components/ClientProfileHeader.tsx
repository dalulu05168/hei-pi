import { IconDatabaseOff, IconUserOff } from "@tabler/icons-react";
import { ClientAvatar } from "./ClientAvatar";
import type { Client, ClientAccountSummary, ClientDataStatus } from "../types";

interface ClientProfileHeaderProps {
  client: Client | null;
  dataStatus: ClientDataStatus;
  financialSummary: ClientAccountSummary;
  requestedId: string;
}

const personTypeLabels = {
  legacy_female: "老女",
  legacy_male: "老男",
  new_female: "新女",
  new_male: "新男",
} as const;

function money(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("zh-CN", {
    currency: "MXN",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function Metric({ label, positive, value }: { label: string; positive?: boolean; value: number | null }) {
  return (
    <div className="flex min-w-0 flex-col justify-center border-l border-[#28445d] px-5">
      <span className="text-[12px] tracking-[0.16em] text-[#9baebe]">{label}</span>
      <strong className={`mt-3 truncate font-mono text-[24px] font-medium tabular-nums ${positive && value !== null ? "text-[#65d99b]" : "text-[#d6dee6]"}`}>
        {money(value)}
      </strong>
      <span className="mt-2 text-[10px] tracking-[0.12em] text-[#6f879c]">统一折算为 MXN</span>
    </div>
  );
}

export function ClientProfileHeader({ client, dataStatus, financialSummary, requestedId }: ClientProfileHeaderProps) {
  const disconnected = dataStatus === "disconnected";
  const netWorth = financialSummary.availableFunds !== null && financialSummary.positionValue !== null
    ? financialSummary.availableFunds + financialSummary.positionValue
    : null;
  const identity = client ? `${client.id}${personTypeLabels[client.personType]}` : "客户数据待接入";

  return (
    <article className="grid h-full min-h-0 grid-cols-[minmax(390px,1.45fr)_repeat(5,minmax(150px,1fr))] overflow-hidden border border-[#294b68] bg-[linear-gradient(145deg,#08243a,#071c2e)] shadow-[0_18px_48px_rgba(0,0,0,.26)]">
      <div className="flex min-w-0 flex-col justify-between p-5">
        <div className="flex min-w-0 items-center gap-4">
          {client ? (
            <ClientAvatar avatarUrl={client.avatarUrl} name={identity} size="large" />
          ) : (
            <div className="grid h-16 w-16 flex-none place-items-center rounded-full border border-[#60768a] bg-[#173149] text-[#9aacbc]">
              <IconUserOff size={27} stroke={1.4} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="truncate text-[24px] font-medium tracking-[0.04em] text-[#dbe2e8]">{identity}</h2>
              <span className="rounded-full border border-[#9a731b] px-3 py-1 text-[11px] text-[#f0bd35]">{client?.level === "vip" ? client.vipTier : "普通客户"}</span>
              <span className="rounded-full border border-[#315a83] px-3 py-1 text-[11px] text-[#a9c8ed]">{client?.group || "—"}</span>
            </div>
            <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-[#91a4b4]">账户ID　{client?.accountId || requestedId}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-[#28445d] pt-3 text-[11px]">
          <div><span className="text-[#8298aa]">风险偏好</span><strong className="ml-3 font-medium text-[#efbd3d]">{client?.riskLevel || "—"}</strong></div>
          <div className="border-l border-[#28445d] pl-4"><span className="text-[#8298aa]">账户状态</span><strong className="ml-3 font-medium text-[#65d99b]">{client?.accountStatus === "opened" ? "正常" : "未开户"}</strong></div>
          <div className="border-l border-[#28445d] pl-4"><span className="text-[#8298aa]">数据状态</span><strong className="ml-3 inline-flex items-center gap-1.5 font-medium text-[#a9bac8]">{disconnected ? <IconDatabaseOff size={13} /> : null}{disconnected ? "待接入" : "已连接"}</strong></div>
        </div>
      </div>
      <Metric label="账户净值" value={netWorth} />
      <Metric label="可用资金" value={financialSummary.availableFunds} />
      <Metric label="持仓市值" value={financialSummary.positionValue} />
      <Metric label="累计盈亏" positive value={financialSummary.totalProfitLoss} />
      <Metric label="今日盈亏" positive value={client?.todayProfitLoss ?? null} />
    </article>
  );
}
