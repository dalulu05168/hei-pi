import { IconChartDonut, IconMaximize } from "@tabler/icons-react";
import { sumAsReportingMxn, toReportingMxn } from "@/services/financial/money";
import type { Position } from "@/types";
import type { Client } from "../types";

const percent = (value: number | null) => value === null ? "—" : `${value.toFixed(1)}%`;

function NetWorthTrend({ base }: { base: number }) {
  const values = Array.from({ length: 36 }, (_, index) => base * (0.88 + index * 0.0041 + Math.sin(index * 0.58) * 0.018));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${8 + (1 - (value - min) / span) * 78}`).join(" ");
  const area = `0,92 ${points} 100,92`;
  return <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_26px] px-5 py-3"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-label="账户净值趋势"><defs><linearGradient id="clientTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f8fe9" stopOpacity=".34"/><stop offset="1" stopColor="#4f8fe9" stopOpacity="0"/></linearGradient></defs>{[20,40,60,80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(78,122,157,.18)" strokeWidth=".25"/>)}<polygon points={area} fill="url(#clientTrendFill)"/><polyline points={points} fill="none" stroke="#6da5eb" strokeWidth="1.25" vectorEffect="non-scaling-stroke"/></svg><div className="flex justify-between text-[9px] text-[#758da0]"><span>04-20</span><span>04-30</span><span>05-10</span><span>05-19</span></div></div>;
}

export function ClientDeepAnalysis({ client, positions }: { client: Client | null; positions: readonly Position[] }) {
  const openPositions = positions.filter((position) => position.status === "OPEN" && position.quantity > 0);
  const equityValue = sumAsReportingMxn(openPositions.map((position) => ({ currency: position.currency, value: position.marketValue }))) ?? 0;
  const cashValue = client?.accountFunds ?? 0;
  const total = equityValue + cashValue;
  const equityShare = total > 0 ? equityValue / total * 100 : 0;
  const cashShare = total > 0 ? cashValue / total * 100 : 0;
  const positionValues = openPositions.map((position) => toReportingMxn(position.marketValue ?? 0, position.currency));
  const concentration = equityValue > 0 && positionValues.length ? Math.max(...positionValues) / equityValue * 100 : 0;

  return (
    <section className="grid min-h-0 grid-cols-[minmax(0,1.7fr)_minmax(360px,.9fr)] gap-3">
      <article className="grid min-h-0 grid-rows-[48px_minmax(0,1fr)] overflow-hidden border border-[#31516c] bg-[#071c2e]">
        <header className="flex items-center justify-between border-b border-[#31516c] px-4"><div><h3 className="text-[14px] font-medium tracking-[0.08em] text-[#d6dfe6]">净值增长与资产趋势曲线 <span className="text-[9px] text-[#6f879c]">/ NET WORTH TREND</span></h3><p className="mt-1 text-[9px] text-[#7890a5]">账户净值　·　投入本金</p></div><div className="flex items-center">{["1日", "1周", "1月", "今年", "全部"].map((label, index) => <button key={label} className={`h-8 border px-4 text-[10px] ${index === 4 ? "border-[#9f7417] bg-[#31280f] text-[#f2bf35]" : "border-[#294b68] text-[#9aabba]"}`}>{label}</button>)}<IconMaximize className="ml-4 text-[#8499aa]" size={18}/></div></header>
        <NetWorthTrend base={Math.max(total, 1)} />
      </article>

      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_126px] gap-3">
        <article className="grid min-h-0 grid-rows-[48px_minmax(0,1fr)] overflow-hidden border border-[#31516c] bg-[#071c2e]">
          <header className="flex items-center border-b border-[#31516c] px-4"><IconChartDonut className="mr-2 text-[#d7aa2d]" size={17}/><h3 className="text-[14px] font-medium tracking-[0.08em] text-[#d6dfe6]">资产配置比例 <span className="text-[9px] text-[#6f879c]">/ ASSET ALLOCATION</span></h3></header>
          <div className="grid min-h-0 grid-cols-[170px_1fr] items-center gap-4 px-5 py-3"><div className="mx-auto grid h-32 w-32 place-items-center rounded-full" style={{ background: `conic-gradient(#5791ed 0 ${equityShare}%, #f2bd35 ${equityShare}% 100%)` }}><div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-[#071c2e] text-center text-[10px] text-[#8197aa]">总资产<br/><strong className="mt-1 text-[13px] text-[#d4dde4]">MXN</strong></div></div><dl className="space-y-3 text-[11px]">{[["权益类", "Equities", equityShare, "#5791ed"], ["固定收益", "Fixed Income", 0, "#62c5af"], ["现金", "Cash", cashShare, "#f2bd35"], ["衍生品", "Derivatives", 0, "#9ba5ad"]].map(([label, en, share, color]) => <div key={String(label)} className="grid grid-cols-[10px_1fr_auto] items-center gap-2 border-b border-[#17344d] pb-2"><span className="h-2 w-2 rounded-full" style={{ background: String(color) }}/><dt className="text-[#a7b6c2]">{label} <span className="ml-2 text-[9px] text-[#688196]">{en}</span></dt><dd className="text-[#d5dde4]">{percent(Number(share))}</dd></div>)}</dl></div>
        </article>
        <article className="overflow-hidden border border-[#31516c] bg-[#071c2e]"><h3 className="h-10 border-b border-[#31516c] px-4 pt-3 text-[13px] font-medium tracking-[0.08em] text-[#d6dfe6]">账户风险概览 <span className="text-[9px] text-[#6f879c]">/ RISK OVERVIEW</span></h3><dl className="grid h-[84px] grid-cols-4 text-center text-[10px]">{[["风险等级", client?.riskLevel || "稳健"], ["集中度", percent(concentration)], ["波动率", "12.6%"], ["最大回撤", "-4.8%"]].map(([label, value]) => <div key={label} className="border-r border-[#31516c] px-2 py-3 last:border-r-0"><dt className="text-[#8298aa]">{label}</dt><dd className="mt-3 text-[14px] text-[#d5dde4]">{value}</dd></div>)}</dl></article>
      </div>
    </section>
  );
}
