"use client";

import { useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { ClientAssetOverview } from "./ClientAssetOverview";
import { ClientFilter } from "./ClientFilter";
import { ClientTable } from "./ClientTable";
import type { Client, ClientDataStatus, ClientFilters } from "../types";

const initialFilters: ClientFilters = { group: "all", level: "all", query: "", status: "all" };
const PAGE_SIZE = 10;

export function ClientsWorkspace({ dataStatus, initialClients }: { dataStatus: ClientDataStatus; initialClients: readonly Client[] }) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialClients[0]?.id ?? null);
  const groupOptions = useMemo(() => Array.from(new Set(initialClients.map((client) => client.group))).sort(), [initialClients]);
  const filtered = useMemo(() => initialClients.filter((client) => {
    const q = filters.query.trim().toLowerCase();
    return (!q || [client.id, client.accountId, client.phone, client.group].some((value) => value.toLowerCase().includes(q))) && (filters.level === "all" || client.level === filters.level) && (filters.group === "all" || client.group === filters.group) && (filters.status === "all" || client.status === filters.status);
  }), [filters, initialClients]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = initialClients.find((client) => client.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1.65fr)_minmax(390px,.9fr)] gap-3">
      <section className="flex min-h-0 flex-col border border-[#274866] bg-[#071a2b]">
        <ClientFilter filters={filters} groupOptions={groupOptions} onChange={(next) => { setFilters(next); setPage(1); }} onReset={() => { setFilters(initialFilters); setPage(1); }} />
        <h2 className="border-b border-[#274866] px-4 py-2 text-[15px] tracking-[0.08em] text-white">人物目录</h2>
        <ClientTable clients={visible} dataStatus={dataStatus} onSelect={setSelectedId} selectedId={selected?.id ?? null} />
        <footer className="flex h-12 items-center justify-between border-t border-[#274866] px-4 text-[11px] text-[#91a7ba]"><span>共 {filtered.length} 人</span><div className="flex items-center gap-3"><button disabled={page === 1} onClick={() => setPage(page - 1)}><IconChevronLeft size={17}/></button><span className="font-mono">{page} / {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}><IconChevronRight size={17}/></button></div></footer>
      </section>
      <ClientAssetOverview client={selected} />
    </div>
  );
}
