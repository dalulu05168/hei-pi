"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconAdjustmentsDollar, IconArrowLeft, IconDownload, IconReceipt, IconSearch, IconShieldCheck } from "@tabler/icons-react";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { buildClientBusinessDetail } from "../detail-data";
import { ClientDeepAnalysis } from "./ClientDeepAnalysis";
import { ClientHoldingsTable } from "./ClientHoldingsTable";
import { ClientProfileHeader } from "./ClientProfileHeader";
import { ClientTransactionsTable } from "./ClientTransactionsTable";
import type { Client, ClientDataStatus } from "../types";

type DetailTable = "holdings" | "transactions";

function ToolButton({ active, disabled, icon: Icon, label, onClick }: { active?: boolean; disabled?: boolean; icon: typeof IconShieldCheck; label: string; onClick?: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`inline-flex h-9 items-center gap-2 border px-4 text-[11px] tracking-[0.08em] transition-colors ${active ? "border-[#a17417] bg-[#2d240d] text-[#f0bd35]" : "border-[#47617a] bg-[#0a2033] text-[#c0cbd4] hover:border-[#7991a5]"} disabled:cursor-not-allowed disabled:opacity-70`}>
      <Icon size={16} stroke={1.45} />{label}
    </button>
  );
}

export function ClientDetailWorkspace({ client, dataStatus, requestedId }: { client: Client | null; dataStatus: ClientDataStatus; requestedId: string }) {
  const localTrading = useLocalTradingSnapshot();
  const [activeTable, setActiveTable] = useState<DetailTable>("holdings");
  const detail = useMemo(() => buildClientBusinessDetail({ client, requestedId, snapshot: localTrading }), [client, localTrading, requestedId]);

  return (
    <div className="grid h-full min-h-0 grid-rows-[22px_160px_minmax(300px,1fr)_248px_18px] gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between px-1 text-[11px] tracking-[0.08em] text-[#8da1b3]">
        <p>人物中心　/　客户详情 · {client?.accountId || requestedId}</p>
        <Link href="/clients" className="inline-flex items-center gap-2 text-[#a8b7c3] hover:text-[#f0bd35]"><IconArrowLeft size={14} />返回人物目录</Link>
      </div>

      <ClientProfileHeader client={client} dataStatus={dataStatus} financialSummary={detail.financialSummary} requestedId={requestedId} />

      <ClientDeepAnalysis client={client} positions={detail.positions} />

      <section className="flex min-h-0 flex-col overflow-hidden border border-[#294b68] bg-[#071c2e]">
        <header className="flex h-[54px] flex-none items-center justify-between border-b border-[#294b68] px-4">
          <div className="flex items-center gap-3">
            <h2 className="mr-2 text-[14px] font-medium tracking-[0.12em] text-[#d5dee5]">{activeTable === "holdings" ? "行业持仓明细" : "客户交易记录"}</h2>
            {activeTable === "holdings" ? (
              <>
                <select aria-label="市场筛选" className="h-8 w-28 border border-[#35516a] bg-[#0a2033] px-3 text-[10px] text-[#aebbc6]"><option>全部市场</option><option>美股</option><option>墨股</option></select>
                <select aria-label="盈亏状态筛选" className="h-8 w-28 border border-[#35516a] bg-[#0a2033] px-3 text-[10px] text-[#aebbc6]"><option>全部盈亏</option><option>盈利</option><option>亏损</option></select>
                <label className="flex h-8 w-44 items-center gap-2 border border-[#35516a] bg-[#0a2033] px-3 text-[#71899c]"><IconSearch size={14} /><input aria-label="搜索股票代码" placeholder="搜索股票代码" className="min-w-0 flex-1 bg-transparent text-[10px] text-[#c4ced6] outline-none" /></label>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <ToolButton disabled icon={IconShieldCheck} label="识别风险等级" />
            <ToolButton disabled icon={IconAdjustmentsDollar} label="资金调整" />
            <ToolButton active={activeTable === "transactions"} icon={IconReceipt} label={activeTable === "transactions" ? "返回持仓明细" : "查看交易记录"} onClick={() => setActiveTable((current) => current === "holdings" ? "transactions" : "holdings")} />
            <ToolButton disabled icon={IconDownload} label="导出资产报告" />
          </div>
        </header>
        {activeTable === "holdings" ? <ClientHoldingsTable dataStatus={detail.businessDataStatus} positions={detail.positions} /> : <ClientTransactionsTable dataStatus={detail.businessDataStatus} transactions={detail.transactions} />}
      </section>

      <footer className="flex items-center justify-center gap-5 font-mono text-[9px] tracking-[0.12em] text-[#70879b]">
        <span>数据更新时间：本地交易数据</span><span className="h-3 w-px bg-[#35516a]" /><span>数据来源：统一 Position / Transaction</span>
      </footer>
    </div>
  );
}
