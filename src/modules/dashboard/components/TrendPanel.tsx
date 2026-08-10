import { IconDatabaseOff, type TablerIcon } from "@tabler/icons-react";

interface TrendPanelProps {
  description: string;
  icon: TablerIcon;
  seriesLabel: string;
  title: string;
}

export function TrendPanel({
  description,
  icon: Icon,
  seriesLabel,
  title,
}: TrendPanelProps) {
  return (
    <article className="flex min-h-[270px] min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
      <header className="flex items-start justify-between gap-4 border-b border-[var(--pi-color-border)] px-4 py-3.5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.18)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
            <Icon size={16} stroke={1.55} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold text-[var(--pi-color-text)]">
              {title}
            </h3>
            <p className="mt-1 truncate text-[9px] text-[var(--pi-color-text-muted)]">
              {description}
            </p>
          </div>
        </div>
        <span className="flex-none rounded-md border border-[var(--pi-color-border)] bg-white/[0.02] px-2 py-1 text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">
          SIN PERIODO
        </span>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 py-5">
        <div className="absolute inset-x-5 top-1/2 border-t border-dashed border-white/[0.05]" aria-hidden="true" />
        <div className="relative z-10 flex max-w-[300px] items-center gap-3 rounded-lg border border-[var(--pi-color-border)] bg-[var(--pi-color-surface-subtle)] px-4 py-3">
          <IconDatabaseOff
            size={20}
            stroke={1.45}
            className="flex-none text-[var(--pi-color-brand)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] font-medium text-[var(--pi-color-text)]">
              Sin datos operativos
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[var(--pi-color-text-muted)]">
              La tendencia se habilitará al conectar la fuente correspondiente.
            </p>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--pi-color-border)] bg-[#08121d] px-4 py-2.5">
        <span className="text-[8px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">
          SERIE
        </span>
        <span className="text-[9px] text-[var(--pi-color-text-muted)]">
          {seriesLabel}
        </span>
      </footer>
    </article>
  );
}
