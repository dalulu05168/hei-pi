import { IconDatabaseOff, IconReceipt } from "@tabler/icons-react";
import type { TradeRecord, TradingDataStatus } from "../types";

interface TradeHistoryPanelProps {
  dataStatus: TradingDataStatus;
  records: readonly TradeRecord[];
}

export function TradeHistoryPanel({ dataStatus, records }: TradeHistoryPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)]">
      <div className="flex h-8 items-center justify-between border-b border-[var(--pi-color-border)] px-3.5">
        <div className="flex items-center gap-2">
          <IconReceipt size={14} stroke={1.6} className="text-[#f4c430]" aria-hidden="true" />
          <h2 className="text-[10px] font-semibold text-[var(--pi-color-text)]">交易记录</h2>
        </div>
        <span className="font-mono text-[8px] tracking-[0.14em] text-[var(--pi-color-text-faint)]">04 / 交易记录</span>
      </div>

      {records.length === 0 ? (
        <div className="flex h-[62px] items-center justify-center gap-2.5 bg-[#08121d] px-4 text-center">
          <IconDatabaseOff size={16} stroke={1.55} className="text-[#9c7b30]" aria-hidden="true" />
          <span>
            <strong className="block text-[9px] font-medium text-[var(--pi-color-text-muted)]">暂无交易记录</strong>
            <small className="mt-0.5 block text-[8px] text-[var(--pi-color-text-faint)]">
              {dataStatus === "disconnected"
                ? "连接真实业务数据源后显示交易历史。"
                : "当前条件下没有交易记录。"}
            </small>
          </span>
        </div>
      ) : (
        <div className="h-[62px] overflow-y-auto px-3.5 py-2 text-[9px] text-[var(--pi-color-text-muted)]">
          已连接 {records.length} 条交易记录
        </div>
      )}
    </section>
  );
}
