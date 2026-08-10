import { IconChartLine, IconDatabaseOff, IconListDetails, IconTable } from "@tabler/icons-react";
import type { Report, ReportDataStatus } from "@/services/reports";

interface ReportPreviewProps {
  dataStatus: ReportDataStatus;
  report: Report | null;
}

export function ReportPreview({ dataStatus, report }: ReportPreviewProps) {
  const hasSummary = Boolean(report?.summary.length);
  const hasTable = Boolean(report?.tablePreview.rows.length);
  const hasChart = Boolean(report?.chartPreview.some((series) => series.points.length));

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[#121417] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <header className="flex h-[50px] flex-none items-center justify-between border-b border-[var(--pi-color-border)] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
            <IconListDetails size={15} stroke={1.55} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[11px] font-semibold text-[var(--pi-color-text)]">Vista Previa del Reporte</h2>
            <p className="mt-1 text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">RESUMEN · TABLA · GRÁFICO</p>
          </div>
        </div>
        <span className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2 py-1 text-[7px] text-[var(--pi-color-text-faint)]">
          {report?.status ?? "—"}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div>
          <h3 className="truncate text-[10px] font-semibold text-[var(--pi-color-text)]">{report?.name ?? "Reporte sin seleccionar"}</h3>
          <p className="mt-1 text-[7px] text-[var(--pi-color-text-faint)]">
            {report?.generatedAt ? `GENERADO · ${report.generatedAt}` : "GENERE O SELECCIONE UN REPORTE DISPONIBLE"}
          </p>
        </div>

        <PreviewSection icon={IconListDetails} label="RESUMEN DE DATOS">
          {hasSummary ? (
            <dl className="grid grid-cols-2 gap-2">
              {report!.summary.map((metric) => (
                <div key={metric.id} className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2.5 py-2">
                  <dt className="text-[7px] text-[var(--pi-color-text-faint)]">{metric.label}</dt>
                  <dd className="mt-1.5 font-mono text-[11px] text-[var(--pi-color-text-muted)]">{metric.value ?? "—"} {metric.unit ?? ""}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <PreviewEmpty label="Resumen no disponible" />
          )}
        </PreviewSection>

        <PreviewSection icon={IconTable} label="VISTA DE TABLA">
          {hasTable ? (
            <div className="overflow-hidden rounded-md border border-[var(--pi-color-border)]">
              <table className="w-full text-left text-[7px]">
                <thead className="bg-[#17191c] text-[var(--pi-color-text-faint)]"><tr>{report!.tablePreview.columns.map((column) => <th key={column} className="px-2 py-2 font-semibold">{column}</th>)}</tr></thead>
                <tbody>{report!.tablePreview.rows.slice(0, 5).map((row, rowIndex) => <tr key={rowIndex} className="border-t border-[var(--pi-color-border)]">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-2 py-2 text-[var(--pi-color-text-muted)]">{cell ?? "—"}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : (
            <PreviewEmpty label="Tabla no disponible" />
          )}
        </PreviewSection>

        <PreviewSection icon={IconChartLine} label="VISTA DE GRÁFICO">
          {hasChart ? (
            <div className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-3 py-3 text-[7px] text-[var(--pi-color-text-faint)]">
              Datos de serie disponibles para el visualizador autorizado.
            </div>
          ) : (
            <PreviewEmpty label="Gráfico no disponible" />
          )}
        </PreviewSection>

        {!report ? (
          <div className="mt-4 rounded-lg border border-dashed border-[rgba(244,196,48,0.2)] bg-[rgba(244,196,48,0.025)] p-3 text-center">
            <IconDatabaseOff size={17} stroke={1.45} className="mx-auto text-[var(--pi-color-brand)]" aria-hidden="true" />
            <p className="mt-2 text-[7px] leading-4 text-[var(--pi-color-text-faint)]">
              {dataStatus === "disconnected" ? "La vista previa se habilitará al conectar fuentes operativas autorizadas." : "Seleccione un reporte para consultar su contenido."}
            </p>
          </div>
        ) : null}
      </div>

      <footer className="flex h-9 flex-none items-center border-t border-[var(--pi-color-border)] px-4 text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
        VISTA DE LECTURA · SIN ALTERAR FUENTES OPERATIVAS
      </footer>
    </aside>
  );
}

function PreviewSection({ children, icon: Icon, label }: { children: React.ReactNode; icon: typeof IconTable; label: string }) {
  return (
    <section className="mt-4 border-t border-[var(--pi-color-border)] pt-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} stroke={1.55} className="text-[var(--pi-color-brand)]" aria-hidden="true" />
        <h3 className="text-[8px] font-semibold tracking-[0.1em] text-[var(--pi-color-text-muted)]">{label}</h3>
      </div>
      {children}
    </section>
  );
}

function PreviewEmpty({ label }: { label: string }) {
  return <div className="rounded-md border border-dashed border-[var(--pi-color-border)] bg-[#0d0f11] px-3 py-3 text-center text-[7px] text-[var(--pi-color-text-faint)]">{label}</div>;
}
