import { IconDatabaseOff, IconFolderOff } from "@tabler/icons-react";
import { sumAsReportingMxn, toReportingMxn } from "@/services/financial/money";
import type { BusinessDataStatus, Currency, Position } from "@/types";

interface ClientHoldingsTableProps {
  dataStatus: BusinessDataStatus;
  positions: readonly Position[];
}

function formatMoney(value: number | null, currency: Currency) {
  if (value === null) return "—";
  return new Intl.NumberFormat("zh-CN", { currency, currencyDisplay: "code", maximumFractionDigits: 2, style: "currency" }).format(value);
}

export function ClientHoldingsTable({ dataStatus, positions }: ClientHoldingsTableProps) {
  const disconnected = dataStatus === "disconnected";
  const openPositions = positions.filter((position) => position.status === "OPEN" && position.quantity > 0);
  const totalValue = sumAsReportingMxn(openPositions.map((position) => ({ currency: position.currency, value: position.marketValue })));

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#071c2e]">
      <table className="w-full min-w-[1320px] border-collapse text-left">
        <caption className="sr-only">客户持仓明细</caption>
        <thead className="sticky top-0 z-10 bg-[#0a2236]">
          <tr className="border-b border-[#31516c]">
            {["股票代码", "股票名称", "市场", "行业", "持仓数量", "成本价", "当前价", "市值", "盈亏", "权重"].map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-medium tracking-[0.12em] text-[#91a5b6]">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {openPositions.map((position) => {
            const mxnValue = toReportingMxn(position.marketValue ?? 0, position.currency);
            const weight = totalValue && totalValue > 0 ? (mxnValue / totalValue) * 100 : null;
            return (
              <tr key={position.positionId} className="border-b border-[#1d3b54] text-[11px] text-[#a8b7c3]">
                <td className="px-4 py-3 text-center font-mono font-semibold text-[#f0bd35]">{position.ticker}</td>
                <td className="px-4 py-3 text-center text-[#d6dfe6]">{position.stockName}</td>
                <td className="px-4 py-3 text-center">{position.market === "US" ? "美股" : "墨股"}</td>
                <td className="px-4 py-3 text-center">—</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{position.quantity.toLocaleString("zh-CN")}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{formatMoney(position.costPrice, position.currency)}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{formatMoney(position.currentPrice, position.currency)}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{formatMoney(position.marketValue, position.currency)}</td>
                <td className={`px-4 py-3 text-center font-mono tabular-nums ${(position.profitLoss ?? 0) >= 0 ? "text-[#65d99b]" : "text-[#ef776c]"}`}>{formatMoney(position.profitLoss, position.currency)}</td>
                <td className="px-4 py-3 text-center font-mono tabular-nums">{weight === null ? "—" : `${weight.toFixed(1)}%`}</td>
              </tr>
            );
          })}
          {openPositions.length === 0 ? (
            <tr>
              <td colSpan={10} className="h-[112px] text-center">
                <div className="mx-auto flex w-fit items-center gap-3 text-left">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-[#8b691c] text-[#e5b52f]">{disconnected ? <IconDatabaseOff size={18} /> : <IconFolderOff size={18} />}</div>
                  <div><p className="text-[12px] text-[#cbd5dd]">{disconnected ? "持仓数据源待连接" : "当前没有持仓"}</p><p className="mt-1 text-[10px] text-[#71899c]">统一 Position 数据接入后在此显示</p></div>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
