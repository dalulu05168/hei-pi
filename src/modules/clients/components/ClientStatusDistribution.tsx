import { IconChartDonut, IconDatabaseOff } from "@tabler/icons-react";
import type { ClientDataStatus, ClientStatsSummary } from "../types";

interface ClientStatusDistributionProps {
  dataStatus: ClientDataStatus;
  stats: ClientStatsSummary;
}

export function ClientStatusDistribution({
  dataStatus,
  stats,
}: ClientStatusDistributionProps) {
  const items = [
    { label: "Activos", value: stats.active, tone: "text-[var(--pi-color-success)]" },
    { label: "Seguimiento", value: stats.followUp, tone: "text-[var(--pi-color-brand)]" },
    { label: "Inactivos", value: stats.inactive, tone: "text-[var(--pi-color-text-muted)]" },
  ];

  return (
    <article className="relative min-h-[116px] overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[linear-gradient(145deg,var(--pi-color-surface-raised),var(--pi-color-surface))] px-4 py-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.22)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(244,196,48,0.42),transparent)]"
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] font-semibold tracking-[0.15em] text-[var(--pi-color-text-faint)]">
            ESTADÍSTICA DE CLIENTES
          </p>
          <h2 className="mt-1.5 text-[12px] font-medium text-[var(--pi-color-text-muted)]">
            Distribución de estado
          </h2>
        </div>
        <div className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[rgba(244,196,48,0.28)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <IconChartDonut size={16} stroke={1.55} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[var(--pi-color-border)] pt-2.5">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <span className="block truncate text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
              {item.label.toUpperCase()}
            </span>
            <strong className={`mt-1 block font-mono text-[14px] font-medium tabular-nums ${item.tone}`}>
              {item.value ?? "—"}
            </strong>
          </div>
        ))}
      </div>
      {dataStatus === "disconnected" ? (
        <span className="absolute right-3 bottom-2.5 flex items-center gap-1 text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
          <IconDatabaseOff size={10} stroke={1.5} aria-hidden="true" />
          SIN FUENTE
        </span>
      ) : null}
    </article>
  );
}
