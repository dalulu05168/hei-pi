import {
  IconClock,
  IconDatabase,
  IconFileExport,
  IconReportAnalytics,
} from "@tabler/icons-react";
import type { ReportDataStatus, ReportSummaryData } from "@/services/reports";

interface ReportSummaryProps {
  data: ReportSummaryData;
  dataStatus: ReportDataStatus;
}

export function ReportSummary({ data, dataStatus }: ReportSummaryProps) {
  const items = [
    {
      icon: IconReportAnalytics,
      label: "Total de Reportes",
      meta: "CATÁLOGO OPERATIVO",
      value: data.totalReports,
    },
    {
      icon: IconClock,
      label: "Última Generación",
      meta: "CONTROL DE GENERACIÓN",
      value: data.latestGeneratedAt,
    },
    {
      icon: IconFileExport,
      label: "Reportes Exportables",
      meta: "FORMATOS AUTORIZADOS",
      value: data.exportableReports,
    },
    {
      icon: IconDatabase,
      label: "Actualización de Datos",
      meta: "ZONA HORARIA CDMX",
      value: data.dataUpdatedAt,
    },
  ] as const;

  return (
    <section aria-label="Resumen de reportes" className="grid grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.label}
            className="relative flex h-[88px] items-center overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[linear-gradient(145deg,#17191c,#111316)] px-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)]"
          >
            <span className="absolute inset-y-0 left-0 w-[2px] bg-[var(--pi-color-brand)]" aria-hidden="true" />
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.24)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
              <Icon size={16} stroke={1.55} aria-hidden="true" />
            </span>
            <div className="ml-3 min-w-0">
              <p className="truncate text-[9px] font-medium text-[var(--pi-color-text-muted)]">{item.label}</p>
              <p className="mt-1.5 truncate font-mono text-[17px] font-semibold tracking-[-0.03em] text-[var(--pi-color-text)]">
                {item.value ?? "—"}
              </p>
              <p className="mt-1 text-[6px] font-semibold tracking-[0.14em] text-[var(--pi-color-text-faint)]">
                {dataStatus === "ready" ? item.meta : "FUENTE DE REPORTES REQUERIDA"}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
