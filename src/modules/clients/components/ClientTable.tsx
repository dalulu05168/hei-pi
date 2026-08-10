"use client";

import Link from "next/link";
import { IconEye } from "@tabler/icons-react";
import { ClientAvatar } from "./ClientAvatar";
import type { Client, ClientDataStatus } from "../types";

interface ClientTableProps {
  clients: readonly Client[];
  dataStatus: ClientDataStatus;
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const personTypeLabel = { legacy_male: "老男", legacy_female: "老女", new_male: "新男", new_female: "新女" } as const;
const statusLabel = { active: "正常", inactive: "冻结", follow_up: "跟进" } as const;
const money = (value: number | null) => value === null ? "—" : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

export function ClientTable({ clients, dataStatus, onSelect, selectedId }: ClientTableProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full min-w-[940px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[#082039]">
          <tr className="border-b border-[#315272] text-[10px] tracking-[0.1em] text-[#9db0c3]">
            {['人物','账户ID','小组','VIP状态','账户状态','账户资金 (MXN)','今日盈亏','操作'].map((item) => <th key={item} className="px-3 py-3 font-medium">{item}</th>)}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const identity = `${client.id}${personTypeLabel[client.personType]}`;
            return (
              <tr key={client.id} onClick={() => onSelect(client.id)} className={`cursor-pointer border-b border-[#183651] text-[12px] ${selectedId === client.id ? "bg-[#103554]" : "hover:bg-[#0c2942]"}`}>
                <td className="px-3 py-2"><span className="flex items-center gap-2 text-white"><ClientAvatar name={identity} />{identity}</span></td>
                <td className="px-3 py-2 font-mono text-[#b4c5d4]">{client.accountId}</td>
                <td className="px-3 py-2"><span className="rounded-full border border-[#315a83] px-2 py-1 text-[#a9c8ed]">{client.group}</span></td>
                <td className="px-3 py-2"><span className="rounded-full border border-[#8f6a14] px-2 py-1 text-[#f3bf32]">{client.level === 'vip' ? client.vipTier : '非VIP'}</span></td>
                <td className="px-3 py-2 text-[#65dc91]">● {statusLabel[client.status]}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{money(client.accountFunds)}</td>
                <td className={`px-3 py-2 text-right font-mono ${(client.todayProfitLoss ?? 0) >= 0 ? 'text-[#58dc8b]' : 'text-[#ff6a63]'}`}>{money(client.todayProfitLoss)}</td>
                <td className="px-3 py-2"><Link href={`/clients/${client.id}`} className="inline-flex items-center gap-1 text-[#82aeda] hover:text-[#f6c843]">查看详情 <IconEye size={14} /></Link></td>
              </tr>
            );
          })}
          {dataStatus === "disconnected" || clients.length === 0 ? <tr><td colSpan={8} className="h-56 text-center text-[#7790a6]">人物数据源未连接</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
