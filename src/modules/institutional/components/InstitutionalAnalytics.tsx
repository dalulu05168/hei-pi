import { IconChartBar, IconChartLine, IconDatabaseOff } from "@tabler/icons-react";

function ChartPlaceholder({ kind, title }: { kind: "line" | "bar"; title: string }) {
  const Icon = kind === "line" ? IconChartLine : IconChartBar;

  return (
    <article className="terminal-empty-grid flex min-h-0 flex-col rounded-[5px] border border-[rgba(86,123,171,0.18)] bg-[#08121d]">
      <header className="flex h-9 items-center justify-between border-b border-[rgba(86,123,171,0.14)] px-3">
        <span className="flex items-center gap-2 text-[9px] font-medium text-[#cbd8e6]">
          <Icon size={14} stroke={1.5} className="text-[#789bc8]" aria-hidden="true" />
          {title}
        </span>
        <span className="text-[6px] tracking-[0.13em] text-[#52677f]">ANÁLISIS INSTITUCIONAL</span>
      </header>
      <div className="grid min-h-0 flex-1 place-items-center text-center">
        <div>
          <IconDatabaseOff size={17} stroke={1.35} className="mx-auto text-[#5f7691]" aria-hidden="true" />
          <p className="mt-1.5 text-[7px] text-[#657c95]">Fuente de bloques sin conectar</p>
        </div>
      </div>
    </article>
  );
}

export function InstitutionalAnalytics() {
  return (
    <section className="grid min-h-0 grid-cols-2 gap-3" aria-label="Análisis de operaciones en bloque">
      <ChartPlaceholder kind="line" title="Tendencia histórica de precio en bloque" />
      <ChartPlaceholder kind="bar" title="Distribución de volumen reservado" />
    </section>
  );
}
