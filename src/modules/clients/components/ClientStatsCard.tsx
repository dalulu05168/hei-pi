import { IconDatabaseOff, type TablerIcon } from "@tabler/icons-react";
import type { ClientDataStatus } from "../types";

interface ClientStatsCardProps {
  dataStatus: ClientDataStatus;
  eyebrow?: string;
  format?: "number" | "money";
  icon: TablerIcon;
  label: string;
  value: number | null;
}

export function ClientStatsCard({
  dataStatus,
  eyebrow = "人物统计",
  format = "number",
  icon: Icon,
  label,
  value,
}: ClientStatsCardProps) {
  const displayedValue = value === null
    ? "—"
    : format === "money"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value)
      : new Intl.NumberFormat("es-MX").format(value);

  return (
    <article className="relative overflow-hidden rounded-sm border border-[var(--pi-color-border-strong)] bg-[linear-gradient(145deg,#09253b,#071b2c)] px-5 py-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.16em] text-[var(--pi-color-text-faint)]">{eyebrow}</p>
          <h2 className="mt-2 text-[15px] font-medium text-[var(--pi-color-text-muted)]">{label}</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(244,196,48,0.35)] text-[var(--pi-color-brand)]">
          <Icon size={22} stroke={1.35} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-[22px] tabular-nums text-white">{displayedValue}</span>
        <span className="flex items-center gap-1.5 text-[9px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">
          {dataStatus === "disconnected" ? <IconDatabaseOff size={12} aria-hidden="true" /> : null}
          {dataStatus === "disconnected" ? "数据待接入" : "数据已连接"}
        </span>
      </div>
    </article>
  );
}
