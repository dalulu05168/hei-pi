"use client";

import { IconChartLine, IconClockHour4, IconDatabaseOff, IconReceipt } from "@tabler/icons-react";
import { useLocalTradingSnapshot } from "@/hooks/useLocalTradingSnapshot";
import { toReportingMxn } from "@/services/financial/money";

const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

function EquityCurve({ values }: { values: readonly number[] }) {
  if (values.length < 2) {
    return <div className="grid h-full place-items-center text-center"><div><IconDatabaseOff size={18} className="mx-auto text-[#6f879b]"/><p className="mt-2 text-[10px] text-[#9eb0c0]">历史净值时间序列未连接</p></div></div>;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${32 - ((value - min) / span) * 25}`).join(" ");
  const area = `0,36 ${points} 100,36`;
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] px-4 pt-3 pb-2">
      <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-full w-full" aria-label="本地持仓权益曲线">
        <defs><linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2bd24" stopOpacity=".28"/><stop offset="1" stopColor="#f2bd24" stopOpacity="0"/></linearGradient></defs>
        {[8,16,24,32].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(154,181,201,.12)" strokeWidth=".25"/>)}
        <polygon points={area} fill="url(#equityFill)"/>
        <polyline points={points} fill="none" stroke="#f2bd24" strokeWidth="1.1" vectorEffect="non-scaling-stroke"/>
      </svg>
      <div className="flex items-center justify-between font-mono text-[8px] text-[#7890a4]"><span>LOCAL POSITION SERIES</span><strong className="text-[#cbd6de]">{money(values.at(-1) ?? 0)}</strong></div>
    </div>
  );
}

export function OperationsBoard() {
  const snapshot = useLocalTradingSnapshot();
  const openPositions = snapshot.positions.filter((position) => position.status === "OPEN" && position.quantity > 0);
  const recentOrders = [...snapshot.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const usValue = openPositions.filter((position) => position.market === "US").reduce((sum, position) => sum + toReportingMxn(position.marketValue ?? 0, position.currency), 0);
  const mxValue = openPositions.filter((position) => position.market === "MX").reduce((sum, position) => sum + toReportingMxn(position.marketValue ?? 0, position.currency), 0);
  const totalValue = usValue + mxValue;
  const equityValues = openPositions
    .slice()
    .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime())
    .reduce<number[]>((series, position) => {
      series.push((series.at(-1) ?? 0) + toReportingMxn(position.marketValue ?? 0, position.currency));
      return series;
    }, []);

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.65fr)_minmax(360px,.9fr)] grid-rows-[minmax(0,1fr)_174px] gap-3">
      <section className="terminal-panel grid min-h-0 grid-rows-[44px_minmax(0,1fr)] overflow-hidden">
        <header className="flex items-center justify-between border-b border-[var(--pi-color-border)] px-4"><span className="flex items-center gap-2 text-[12px] font-semibold text-[var(--pi-color-text)]"><IconClockHour4 size={16} className="text-[#f2bd24]"/>72小时交易倒计时监控</span><span className="terminal-kicker">EXECUTION WINDOW MONITOR</span></header>
        <div className="min-h-0 overflow-hidden"><table className="h-full w-full table-fixed text-left text-[10px]"><thead className="h-9 bg-[#0b2134] text-[#829ab0]"><tr><th className="px-4">股票代码</th><th className="px-4">购买时间</th><th className="px-4">剩余倒计时</th><th className="px-4">锁定状态</th></tr></thead><tbody>{openPositions.slice(0, 6).map((position) => { const hours = position.remainingHours ?? null; return <tr key={position.positionId} className="border-t border-white/5 text-[#b6c6d4]"><td className="px-4 font-mono text-[var(--pi-color-text)]">{position.ticker}</td><td className="px-4 font-mono">{new Date(position.openedAt).toLocaleString("zh-CN")}</td><td className="px-4 font-mono text-[#f2bd24]">{hours === null ? "—" : `${hours.toFixed(1)} 小时`}</td><td className="px-4 text-[#66da91]">● {hours !== null && hours > 0 ? "锁定中" : "待确认"}</td></tr>;})}</tbody></table></div>
      </section>

      <div className="grid min-h-0 grid-rows-[minmax(0,1.12fr)_minmax(150px,.88fr)] gap-3">
        <section className="terminal-panel grid min-h-0 grid-rows-[40px_minmax(0,1fr)]"><header className="flex items-center justify-between border-b border-white/10 px-4"><span className="flex items-center gap-2 text-[11px] text-[var(--pi-color-text)]"><IconChartLine size={15} className="text-[#f2bd24]"/>权益曲线</span><span className="terminal-kicker">LOCAL SOURCE</span></header><EquityCurve values={equityValues}/></section>
        <section className="terminal-panel grid min-h-0 grid-rows-[36px_minmax(0,1fr)] p-4 pt-0"><div className="flex items-center justify-between"><h3 className="text-[11px] text-[var(--pi-color-text)]">持仓分配</h3><span className="terminal-kicker">MXN BASIS</span></div><div className="grid content-center gap-3"><div className="flex items-end justify-between border-b border-white/5 pb-2"><span className="text-[9px] text-[#8195a6]">总持仓市值</span><strong className="font-mono text-[15px] text-[#dce4ea]">{money(totalValue)}</strong></div>{[["美股",usValue,"#4f8ff5"],["墨股",mxValue,"#f2bd24"]].map(([label,value,color]) => <div key={String(label)}><div className="mb-1 flex justify-between text-[9px]"><span className="text-[#9db0c0]">{label}</span><span className="font-mono text-[#dce4ea]">{money(Number(value))} · {totalValue ? ((Number(value)/totalValue)*100).toFixed(1) : "0.0"}%</span></div><div className="h-1.5 bg-white/5"><div className="h-full" style={{width:`${totalValue ? Number(value)/totalValue*100 : 0}%`,background:String(color)}}/></div></div>)}</div></section>
      </div>

      <section className="terminal-panel col-span-2 grid min-h-0 grid-rows-[40px_minmax(0,1fr)] overflow-hidden"><header className="flex items-center justify-between border-b border-white/10 px-4"><span className="flex items-center gap-2 text-[11px] text-[var(--pi-color-text)]"><IconReceipt size={15} className="text-[#f2bd24]"/>近期订单</span><span className="terminal-kicker">{recentOrders.length} ORDERS</span></header>{recentOrders.length ? <div className="grid h-full grid-cols-5 divide-x divide-white/5">{recentOrders.map((order) => <div key={order.orderId} className="flex min-w-0 flex-col justify-center px-4"><div className="flex items-center justify-between"><p className="font-mono text-[13px] text-[var(--pi-color-text)]">{order.ticker}</p><span className="text-[7px] tracking-[.1em] text-[#5f7689]">{order.market}</span></div><p className="mt-2 text-[9px] text-[#7f98ad]">{order.clientIds.length} 人 · {new Date(order.createdAt).toLocaleDateString("zh-CN")}</p><p className="mt-2 font-mono text-[12px] text-[#f2bd24]">{money(toReportingMxn(order.totalAmount, order.currency))}</p></div>)}</div> : <div className="grid place-items-center text-[10px] text-[#7890a4]">暂无订单</div>}</section>
    </div>
  );
}
