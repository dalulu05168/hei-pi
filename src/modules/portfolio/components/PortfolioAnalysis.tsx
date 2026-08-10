import {
  IconChartDonut,
  IconChartLine,
  IconChartPie,
  IconDatabaseOff,
  type TablerIcon,
} from "@tabler/icons-react";
import type { BusinessDataStatus } from "@/types";

interface PortfolioAnalysisProps {
  dataStatus: BusinessDataStatus;
}

interface AnalysisPanelProps {
  dataStatus: BusinessDataStatus;
  description: string;
  icon: TablerIcon;
  title: string;
}

function AnalysisPanel({ dataStatus, description, icon: Icon, title }: AnalysisPanelProps) {
  return (
    <article className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_14px_36px_rgba(0,0,0,0.16)]">
      <header className="flex h-11 flex-none items-center gap-2.5 border-b border-[var(--pi-color-border)] px-3.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]">
          <Icon size={15} stroke={1.55} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[10px] font-semibold text-[var(--pi-color-text)]">{title}</h3>
          <p className="mt-0.5 truncate text-[8px] text-[var(--pi-color-text-faint)]">{description}</p>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 place-items-center bg-[#08121d] p-3 text-center">
        <div>
          <IconDatabaseOff size={17} stroke={1.5} className="mx-auto text-[#9f7e32]" aria-hidden="true" />
          <strong className="mt-2 block text-[9px] font-medium text-[var(--pi-color-text-muted)]">
            {dataStatus === "ready" ? "Sin serie para el periodo" : "Serie sin fuente conectada"}
          </strong>
          <small className="mt-1 block text-[8px] text-[var(--pi-color-text-faint)]">
            No se genera información analítica simulada.
          </small>
        </div>
      </div>
      <footer className="flex h-6 flex-none items-center justify-between border-t border-[var(--pi-color-border)] px-3.5 font-mono text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">
        <span>ANÁLISIS</span>
        <span>FUENTE PENDIENTE</span>
      </footer>
    </article>
  );
}

export function PortfolioAnalysis({ dataStatus }: PortfolioAnalysisProps) {
  return (
    <div className="grid min-h-0 grid-cols-3 gap-3">
      <AnalysisPanel
        dataStatus={dataStatus}
        description="Evolución consolidada del patrimonio y posiciones."
        icon={IconChartLine}
        title="Tendencia de activos"
      />
      <AnalysisPanel
        dataStatus={dataStatus}
        description="Distribución de posiciones con ganancia y pérdida."
        icon={IconChartDonut}
        title="Distribución de P/G"
      />
      <AnalysisPanel
        dataStatus={dataStatus}
        description="Concentración del valor por industria bursátil."
        icon={IconChartPie}
        title="Distribución por industria"
      />
    </div>
  );
}
