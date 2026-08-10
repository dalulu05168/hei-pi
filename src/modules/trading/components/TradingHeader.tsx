import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconDatabaseOff,
} from "@tabler/icons-react";
import type { TradeMode, TradingDataStatus } from "../types";

interface TradingHeaderProps {
  dataStatus: TradingDataStatus;
  mode: TradeMode;
  onModeChange: (mode: TradeMode) => void;
}

const modes = [
  {
    description: "买入资金分配",
    icon: IconArrowUpRight,
    label: "买入",
    value: "buy" as const,
  },
  {
    description: "持仓卖出清算",
    icon: IconArrowDownRight,
    label: "卖出",
    value: "sell" as const,
  },
];

export function TradingHeader({ dataStatus, mode, onModeChange }: TradingHeaderProps) {
  return (
    <header className="flex h-[54px] items-center justify-between rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] px-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
      <nav aria-label="交易类型" className="flex h-9 items-center gap-1 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] p-1">
        {modes.map((item) => {
          const active = mode === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={active}
              onClick={() => onModeChange(item.value)}
              className={`flex h-7 min-w-[146px] items-center gap-2 rounded-md border px-3 text-left ${
                active
                  ? "border-[rgba(244,196,48,0.34)] bg-[var(--pi-color-brand-soft)] text-[#edcc77]"
                  : "border-transparent text-[var(--pi-color-text-muted)] hover:text-[var(--pi-color-text)]"
              }`}
            >
              <Icon size={15} stroke={1.7} aria-hidden="true" />
              <span className="text-[11px] font-semibold">{item.label}</span>
              <small className="text-[8px] text-[var(--pi-color-text-faint)]">
                {item.description}
              </small>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 pr-1 text-right">
        <IconDatabaseOff size={15} stroke={1.55} className="text-[#f4c430]" aria-hidden="true" />
        <span>
          <small className="block text-[8px] tracking-[0.15em] text-[var(--pi-color-text-faint)]">
            业务数据源
          </small>
          <strong className="mt-0.5 block text-[9px] font-medium text-[#f4c430]">
            {dataStatus === "ready" ? "已连接" : "等待连接"}
          </strong>
        </span>
      </div>
    </header>
  );
}
