import { IconDatabaseOff, IconReceiptOff } from "@tabler/icons-react";
import type { BusinessDataStatus, Currency, Market } from "@/types";
import type { ClientTradeHistoryItem } from "../types";

interface ClientTransactionsTableProps {
  dataStatus: BusinessDataStatus;
  transactions: readonly ClientTradeHistoryItem[];
}

function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat("zh-CN", { currency, currencyDisplay: "code", maximumFractionDigits: 2, minimumFractionDigits: 2, style: "currency" }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "short", timeStyle: "medium" }).format(date);
}

function marketLabel(market: Market) {
  return market === "US" ? "美股" : "墨股";
}

const headings = ["类型", "交易编号", "持仓编号", "股票代码", "市场", "数量", "成交价格", "成交金额", "执行时间", "状态"];

export function ClientTransactionsTable({ dataStatus, transactions }: ClientTransactionsTableProps) {
  const disconnected = dataStatus === "disconnected";
  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#071c2e]">
      <table className="w-full min-w-[1180px] border-collapse text-left">
        <caption className="sr-only">客户交易记录</caption>
        <thead className="sticky top-0 z-10 bg-[#0a2236]">
          <tr className="border-b border-[#31516c]">{headings.map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-medium tracking-[0.12em] text-[#91a5b6]">{heading}</th>)}</tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId} className="border-b border-[#1d3b54] text-[11px] text-[#a8b7c3]">
              <td className={`px-4 py-3 text-center font-semibold ${transaction.side === "buy" ? "text-[#65d99b]" : "text-[#ef776c]"}`}>{transaction.side === "buy" ? "买入" : "卖出"}</td>
              <td className="px-4 py-3 text-center font-mono text-[#d6dfe6]">{transaction.transactionId}</td>
              <td className="px-4 py-3 text-center font-mono">{transaction.positionId}</td>
              <td className="px-4 py-3 text-center font-mono font-semibold text-[#f0bd35]">{transaction.ticker}</td>
              <td className="px-4 py-3 text-center">{marketLabel(transaction.market)}</td>
              <td className="px-4 py-3 text-center font-mono">{transaction.quantity}</td>
              <td className="px-4 py-3 text-center font-mono">{formatMoney(transaction.price, transaction.currency)}</td>
              <td className="px-4 py-3 text-center font-mono text-[#d6dfe6]">{formatMoney(transaction.amount, transaction.currency)}</td>
              <td className="px-4 py-3 text-center font-mono">{formatDate(transaction.executionTime)}</td>
              <td className="px-4 py-3 text-center text-[#65d99b]">已完成</td>
            </tr>
          ))}
          {transactions.length === 0 ? (
            <tr><td colSpan={headings.length} className="h-[112px] text-center"><div className="mx-auto flex w-fit items-center gap-3 text-left"><div className="grid h-10 w-10 place-items-center rounded-full border border-[#8b691c] text-[#e5b52f]">{disconnected ? <IconDatabaseOff size={18} /> : <IconReceiptOff size={18} />}</div><div><p className="text-[12px] text-[#cbd5dd]">{disconnected ? "交易数据源待连接" : "暂无交易记录"}</p><p className="mt-1 text-[10px] text-[#71899c]">统一买入与卖出交易接入后在此显示</p></div></div></td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
