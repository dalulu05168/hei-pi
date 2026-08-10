"use client";

import { IconRefresh, IconSearch } from "@tabler/icons-react";
import type { ClientFilters } from "../types";

interface ClientFilterProps {
  filters: ClientFilters;
  groupOptions: string[];
  onChange: (filters: ClientFilters) => void;
  onReset: () => void;
}

const field = "h-9 border border-[#274866] bg-[#061827] px-3 text-[12px] text-white outline-none focus:border-[#d3a629]";

export function ClientFilter({ filters, groupOptions, onChange, onReset }: ClientFilterProps) {
  return (
    <div className="grid grid-cols-[minmax(230px,1.5fr)_120px_120px_120px_120px_42px] items-end gap-2 border-b border-[#274866] p-3">
      <label className="relative">
        <span className="sr-only">搜索人物</span>
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7390aa]" size={15} />
        <input className={`${field} w-full pl-9`} type="search" value={filters.query} onChange={(e) => onChange({ ...filters, query: e.target.value })} placeholder="搜索人物编号 / 账户ID / 电话" />
      </label>
      <label><span className="mb-1 block text-[10px] text-[#8ca4b8]">等级</span><select className={`${field} w-full`} value={filters.level} onChange={(e) => onChange({ ...filters, level: e.target.value as ClientFilters["level"] })}><option value="all">全部</option><option value="vip">VIP</option><option value="standard">普通</option></select></label>
      <label><span className="mb-1 block text-[10px] text-[#8ca4b8]">小组</span><select className={`${field} w-full`} value={filters.group} onChange={(e) => onChange({ ...filters, group: e.target.value })}><option value="all">全部</option>{groupOptions.map((group) => <option key={group}>{group}</option>)}</select></label>
      <label><span className="mb-1 block text-[10px] text-[#8ca4b8]">状态</span><select className={`${field} w-full`} value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as ClientFilters["status"] })}><option value="all">全部</option><option value="active">正常</option><option value="inactive">冻结</option><option value="follow_up">跟进</option></select></label>
      <label><span className="mb-1 block text-[10px] text-[#8ca4b8]">人物类型</span><select className={`${field} w-full`} disabled><option>全部</option></select></label>
      <button type="button" onClick={onReset} className="grid h-9 w-10 place-items-center border border-[#315477] text-[#9bb1c5] hover:text-[#f6c843]" aria-label="重置筛选"><IconRefresh size={17} /></button>
    </div>
  );
}
