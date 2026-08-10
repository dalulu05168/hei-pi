import { IconDatabaseOff, type TablerIcon } from "@tabler/icons-react";

interface DashboardCardProps {
  dataStatus?: "disconnected" | "ready";
  icon: TablerIcon;
  label: string;
  value?: number | string | null;
}

export function DashboardCard({
  dataStatus = "disconnected",
  icon: Icon,
  label,
  value = null,
}: DashboardCardProps) {
  const hasValue = value !== null && value !== undefined;

  return (
    <article className="relative min-h-[132px] min-w-0 overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[linear-gradient(145deg,var(--pi-color-surface-raised),var(--pi-color-surface))] px-4 py-3.5 shadow-[0_16px_38px_rgba(0,0,0,0.22)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(244,196,48,0.42),transparent)]"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[8px] font-semibold tracking-[0.16em] text-[var(--pi-color-text-faint)]">
            INDICADOR OPERATIVO
          </p>
          <h2 className="mt-1.5 truncate text-[12px] font-medium text-[var(--pi-color-text-muted)]">
            {label}
          </h2>
        </div>
        <div className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <Icon size={16} stroke={1.55} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--pi-color-border)] pt-2.5">
        <span className="block truncate font-mono text-[clamp(19px,1.25vw,24px)] leading-none tabular-nums text-[var(--pi-color-text)]" title={hasValue ? String(value) : undefined}>
          {hasValue ? value : "—"}
        </span>
        <span className="mt-2 flex items-center justify-end gap-1.5 text-right text-[7px] tracking-[0.11em] text-[var(--pi-color-text-faint)]">
          {hasValue && dataStatus === "ready" ? (
            "LECTURA LOCAL"
          ) : (
            <>
              <IconDatabaseOff size={12} stroke={1.5} aria-hidden="true" />
              SIN FUENTE
            </>
          )}
        </span>
      </div>
    </article>
  );
}
