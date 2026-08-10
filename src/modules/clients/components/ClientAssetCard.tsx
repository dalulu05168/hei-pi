import { IconDatabaseOff, type TablerIcon } from "@tabler/icons-react";

interface ClientAssetCardProps {
  format?: "money" | "percent";
  icon: TablerIcon;
  label: string;
  value: number | null;
}

function formatValue(value: number | null, format: "money" | "percent") {
  if (value === null) return "—";

  if (format === "percent") {
    return new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "percent",
    }).format(value / 100);
  }

  return new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function ClientAssetCard({
  format = "money",
  icon: Icon,
  label,
  value,
}: ClientAssetCardProps) {
  return (
    <article className="relative h-full min-h-0 overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] font-semibold tracking-[0.14em] text-[var(--pi-color-text-faint)]">
            POSICIÓN FINANCIERA
          </p>
          <h3 className="mt-1.5 text-[11px] font-medium text-[var(--pi-color-text-muted)]">
            {label}
          </h3>
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <Icon size={16} stroke={1.55} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-[var(--pi-color-border)] pt-2.5">
        <strong className="font-mono text-[22px] font-medium leading-none tabular-nums text-[var(--pi-color-text)]">
          {formatValue(value, format)}
        </strong>
        {value === null ? (
          <span className="flex items-center gap-1.5 text-[8px] tracking-[0.09em] text-[var(--pi-color-text-faint)]">
            <IconDatabaseOff size={11} stroke={1.5} aria-hidden="true" />
            SIN DATOS
          </span>
        ) : null}
      </div>
    </article>
  );
}
