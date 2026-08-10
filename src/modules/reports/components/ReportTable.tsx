import { IconDatabaseOff, IconEye, IconFileExport, IconRefresh, IconTable } from "@tabler/icons-react";
import type { Report, ReportDataStatus } from "@/services/reports";

interface ReportTableProps {
  dataStatus: ReportDataStatus;
  hasActiveFilters: boolean;
  onSelect: (reportId: string) => void;
  reports: readonly Report[];
  selectedReportId: string | null;
}

const categoryLabels = {
  clients: "Clientes",
  market: "Mercado",
  operations: "Operaciones",
  positions: "Posiciones",
  purchases: "Compras",
  sales: "Ventas",
} as const;

const statusLabels = {
  available: "Disponible",
  failed: "Error",
  pending: "Pendiente",
} as const;

export function ReportTable({ dataStatus, hasActiveFilters, onSelect, reports, selectedReportId }: ReportTableProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[#111316] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <header className="flex h-[50px] flex-none items-center justify-between border-b border-[var(--pi-color-border)] px-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
            <IconTable size={15} stroke={1.55} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[11px] font-semibold text-[var(--pi-color-text)]">Directorio de Reportes</h2>
            <p className="mt-1 text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">CONSULTA Y CONTROL OPERATIVO</p>
          </div>
        </div>
        <span className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2.5 py-1 text-[8px] font-medium text-[var(--pi-color-text-faint)]">
          {reports.length} registros
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[930px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#16181b] text-[7px] font-semibold tracking-[0.09em] text-[var(--pi-color-text-faint)]">
            <tr>
              <th className="h-10 px-4 font-semibold">NOMBRE DEL REPORTE</th>
              <th className="h-10 px-3 font-semibold">TIPO</th>
              <th className="h-10 px-3 font-semibold">CREACIÓN</th>
              <th className="h-10 px-3 font-semibold">ACTUALIZACIÓN</th>
              <th className="h-10 px-3 font-semibold">ESTADO</th>
              <th className="h-10 px-4 text-right font-semibold">OPERACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                tabIndex={0}
                aria-selected={selectedReportId === report.id}
                onClick={() => onSelect(report.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(report.id);
                  }
                }}
                className="cursor-pointer border-t border-[var(--pi-color-border)] text-[9px] text-[var(--pi-color-text-muted)] outline-none hover:bg-[rgba(244,196,48,0.04)] focus-visible:bg-[rgba(244,196,48,0.07)] aria-selected:bg-[rgba(244,196,48,0.08)]"
              >
                <td className="h-12 px-4 font-medium text-[var(--pi-color-text)]">{report.name}</td>
                <td className="h-12 px-3">{categoryLabels[report.category]}</td>
                <td className="h-12 px-3 font-mono">{report.createdAt ?? "—"}</td>
                <td className="h-12 px-3 font-mono">{report.updatedAt ?? "—"}</td>
                <td className="h-12 px-3">{report.status ? statusLabels[report.status] : "—"}</td>
                <td className="h-12 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <RowAction icon={IconEye} label="Ver" onClick={() => onSelect(report.id)} />
                    <RowAction icon={IconFileExport} label="Exportar" disabled />
                    <RowAction icon={IconRefresh} label="Generar" disabled />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 ? (
          <div className="grid min-h-[350px] place-items-center px-8 text-center">
            <div className="max-w-[380px]">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
                <IconDatabaseOff size={20} stroke={1.45} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[11px] font-semibold text-[var(--pi-color-text)]">
                {dataStatus === "disconnected" ? "Fuentes operativas sin conectar" : hasActiveFilters ? "Sin resultados para los filtros" : "Sin reportes disponibles"}
              </h3>
              <p className="mt-2 text-[8px] leading-5 text-[var(--pi-color-text-faint)]">
                {dataStatus === "disconnected"
                  ? "El catálogo permanecerá vacío hasta habilitar las fuentes autorizadas de Clientes, Operaciones y Posiciones."
                  : "Ajuste el periodo, el tipo, el estado o la búsqueda para consultar otros reportes."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="flex h-9 flex-none items-center justify-between border-t border-[var(--pi-color-border)] px-4 text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
        <span>SELECCIONE UN REPORTE PARA ABRIR LA VISTA PREVIA</span>
        <span>LECTURA SIN MODIFICAR DATOS DE ORIGEN</span>
      </footer>
    </section>
  );
}

function RowAction({ disabled = false, icon: Icon, label, onClick }: { disabled?: boolean; icon: typeof IconEye; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--pi-color-border)] bg-[#15171a] px-2 text-[7px] font-semibold text-[var(--pi-color-text-muted)] hover:border-[rgba(244,196,48,0.28)] hover:text-[var(--pi-color-brand)] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <Icon size={11} stroke={1.55} aria-hidden="true" />
      {label}
    </button>
  );
}
