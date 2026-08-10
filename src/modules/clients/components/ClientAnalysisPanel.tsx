import { IconDatabaseOff, type TablerIcon } from "@tabler/icons-react";

interface ClientAnalysisPanelProps {
  description: string;
  icon: TablerIcon;
  title: string;
}

export function ClientAnalysisPanel({
  description,
  icon: Icon,
  title,
}: ClientAnalysisPanelProps) {
  return (
    <article className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_16px_38px_rgba(0,0,0,0.2)]">
      <header className="flex items-start gap-3 border-b border-[var(--pi-color-border)] px-4 py-3">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.18)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <Icon size={16} stroke={1.55} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-semibold text-[var(--pi-color-text)]">
            {title}
          </h3>
          <p className="mt-1 truncate text-[9px] text-[var(--pi-color-text-muted)]">
            {description}
          </p>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-4">
        <div className="flex max-w-[300px] items-center gap-3 rounded-lg border border-[var(--pi-color-border)] bg-[var(--pi-color-surface-subtle)] px-4 py-3">
          <IconDatabaseOff
            size={19}
            stroke={1.45}
            className="flex-none text-[var(--pi-color-brand)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] font-medium text-[var(--pi-color-text)]">
              Serie sin datos conectados
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[var(--pi-color-text-muted)]">
              El análisis se habilitará desde la fuente financiera real del cliente.
            </p>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-between border-t border-[var(--pi-color-border)] bg-[#08121d] px-4 py-2">
        <span className="text-[8px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">
          ANÁLISIS
        </span>
        <span className="text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">
          FUENTE PENDIENTE
        </span>
      </footer>
    </article>
  );
}
