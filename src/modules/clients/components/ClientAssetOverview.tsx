"use client";

import Link from "next/link";
import { IconChevronRight, IconDatabaseOff } from "@tabler/icons-react";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { sumAsReportingMxn, toReportingMxn } from "@/services/financial/money";
import type { Client } from "../types";
import { ClientAvatar } from "./ClientAvatar";

const personTypeLabel = { legacy_male: "老男", legacy_female: "老女", new_male: "新男", new_female: "新女" } as const;
const money = (value: number | null) => value === null ? "—" : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

export function ClientAssetOverview({ client }: { client: Client | null }) {
  const snapshot = useLocalTradingSnapshot();
  if (!client) return <aside className="grid min-h-0 place-items-center border border-[#274866] bg-[#071a2b] text-[#7890a7]">请选择人物</aside>;

  const positions = snapshot.positions.filter((position) => position.clientId === client.id && position.status === "OPEN");
  const positionValue = sumAsReportingMxn(positions.map((position) => ({ currency: position.currency, value: position.marketValue })));
  const usValue = positions.filter((position) => position.market === "US").reduce((sum, position) => sum + toReportingMxn(position.marketValue ?? 0, position.currency), 0);
  const mxValue = positions.filter((position) => position.market === "MX").reduce((sum, position) => sum + toReportingMxn(position.marketValue ?? 0, position.currency), 0);
  const cash = client.accountFunds ?? 0;
  const total = cash + (positionValue ?? 0);
  const cashPart = total > 0 ? cash / total * 100 : 0;
  const usPart = total > 0 ? usValue / total * 100 : 0;
  const mxPart = total > 0 ? mxValue / total * 100 : 0;
  const identity = `${client.id}${personTypeLabel[client.personType]}`;

  return (
    <aside className="min-h-0 overflow-auto border border-[#274866] bg-[#071a2b] shadow-[0_18px_48px_rgba(0,0,0,.28)]">
      <h2 className="border-b border-[#274866] px-4 py-3 text-[15px] font-medium tracking-[0.08em] text-white">人物资产详情</h2>
      <div className="flex items-center gap-3 border-b border-[#274866] px-4 py-3">
        <ClientAvatar name={identity} size="large" />
        <div className="min-w-0"><p className="text-[22px] text-white">{identity}</p><p className="font-mono text-[11px] text-[#8da3b8]">账户ID：{client.accountId}</p></div>
        <span className="ml-auto rounded-full border border-[#8d6919] px-3 py-1 text-[#f3bf32]">{client.level === "vip" ? client.vipTier : "非VIP"}</span>
        <span className="rounded-full border border-[#315a83] px-3 py-1 text-[#a9c8ed]">{client.group}</span>
      </div>

      <section className="border-b border-[#274866] p-4">
        <div className="flex items-center justify-between"><h3 className="text-[15px] text-white">资产净值趋势</h3><span className="text-[10px] text-[#8098ae]">7日　30日　90日　1年</span></div>
        <div className="mt-3 grid h-36 place-items-center border border-[#1d3d59] bg-[linear-gradient(rgba(50,92,127,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(50,92,127,.14)_1px,transparent_1px)] bg-[size:36px_36px]">
          <div className="text-center text-[#8299ae]"><IconDatabaseOff className="mx-auto mb-2" size={22} /><p className="text-[12px]">个人资产趋势数据待接入</p></div>
        </div>
      </section>

      <section className="border-b border-[#274866] p-4">
        <h3 className="text-[15px] text-white">资产配置</h3>
        <div className="mt-3 grid grid-cols-[150px_1fr] items-center gap-5">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full" style={{ background: `conic-gradient(#4f8ff5 0 ${cashPart}%, #5ec6ad ${cashPart}% ${cashPart + usPart}%, #f2be36 ${cashPart + usPart}% ${cashPart + usPart + mxPart}%, #526374 0)` }}><div className="grid h-16 w-16 place-items-center rounded-full bg-[#071a2b] text-center text-[10px] text-[#8fa5b9]">总净值<br/><strong className="text-white">{money(total)}</strong></div></div>
          <dl className="space-y-2 text-[11px]">{[["可用资金", cash, cashPart, "#4f8ff5"],["美股持仓", usValue, usPart, "#5ec6ad"],["墨股持仓", mxValue, mxPart, "#f2be36"]].map(([label,value,part,color]) => <div key={String(label)} className="grid grid-cols-[12px_1fr_auto_auto] gap-2 border-b border-white/5 pb-2"><span className="mt-1 h-2 w-2 rounded-full" style={{background:String(color)}}/><dt className="text-[#9eb1c2]">{label}</dt><dd className="font-mono text-white">{money(Number(value))}</dd><dd className="w-10 text-right font-mono text-[#8ca1b5]">{Number(part).toFixed(1)}%</dd></div>)}</dl>
        </div>
      </section>

      <section className="grid grid-cols-2 border-b border-[#274866] text-[11px]"><div className="border-r border-[#274866] p-3"><span className="text-[#8ca2b5]">VIP资格</span><strong className="ml-3 text-[#f3bf32]">{client.vipTier}</strong></div><div className="p-3"><span className="text-[#8ca2b5]">风险等级</span><strong className="ml-3 text-white">{client.riskLevel}</strong></div><div className="border-r border-t border-[#274866] p-3"><span className="text-[#8ca2b5]">学员状态</span><strong className="ml-3 text-[#58dc8b]">{client.studentStatus === "new" ? "新学员" : "老学员"}</strong></div><div className="border-t border-[#274866] p-3"><span className="text-[#8ca2b5]">账户状态</span><strong className="ml-3 text-[#58dc8b]">{client.accountStatus === "opened" ? "正常" : "未开户"}</strong></div></section>
      <Link href={`/clients/${client.id}`} className="flex items-center justify-between px-4 py-3 text-[12px] text-[#9dc2eb] hover:text-[#f6c843]">进入客户深度资产详情 <IconChevronRight size={16} /></Link>
    </aside>
  );
}
