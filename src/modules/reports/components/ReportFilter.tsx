import { IconDatabaseOff, IconSearch, IconX } from "@tabler/icons-react";
import type { ReportCategory, ReportDataStatus, ReportStatus } from "@/services/reports";

export type ReportCategoryFilter = "all" | ReportCategory;
export type ReportDateRange = "all" | "7d" | "30d" | "90d" | "year";
export type ReportStatusFilter = "all" | Exclude<ReportStatus, null>;

interface ReportFilterProps {
  activeCategory: ReportCategoryFilter;
  dataStatus: ReportDataStatus;
  dateRange: ReportDateRange;
  onCategoryChange: (category: ReportCategoryFilter) => void;
  onDateRangeChange: (dateRange: ReportDateRange) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: ReportStatusFilter) => void;
  query: string;
  status: ReportStatusFilter;
}

const categories: readonly { id: ReportCategoryFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "clients", label: "Clientes" },
  { id: "operations", label: "Operaciones" },
  { id: "purchases", label: "Compras" },
  { id: "sales", label: "Ventas" },
  { id: "positions", label: "Posiciones" },
  { id: "market", label: "Mercado" },
];

export function ReportFilter({
  activeCategory,
  dataStatus,
  dateRange,
  onCategoryChange,
  onDateRangeChange,
  onQueryChange,
  onStatusChange,
  query,
  status,
}: ReportFilterProps) {
  return (
    <section className="grid h-[62px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[var(--pi-color-border)] bg-[#121417] px-3 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
      <div className="flex min-w-0 items-center gap-1" role="tablist" aria-label="Tipos de reporte">
        {categories.map((category) => {
          const active = category.id === activeCategory;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(category.id)}
              className={`h-8 whitespace-nowrap rounded-md border px-2.5 text-[8px] font-semibold transition-colors ${
                active
                  ? "border-[rgba(244,196,48,0.42)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]"
                  : "border-transparent text-[var(--pi-color-text-muted)] hover:border-[var(--pi-color-border-strong)] hover:bg-[#191b1e] hover:text-[var(--pi-color-text)]"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <select
          aria-label="Rango de tiempo"
          value={dateRange}
          onChange={(event) => onDateRangeChange(event.target.value as ReportDateRange)}
          className="h-8 rounded-md border border-[var(--pi-color-border)] bg-[#0c0e10] px-2 text-[8px] text-[var(--pi-color-text-muted)] outline-none focus:border-[rgba(244,196,48,0.45)]"
        >
          <option value="all">Todo el periodo</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="year">Año actual</option>
        </select>
        <select
          aria-label="Estado del reporte"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ReportStatusFilter)}
          className="h-8 rounded-md border border-[var(--pi-color-border)] bg-[#0c0e10] px-2 text-[8px] text-[var(--pi-color-text-muted)] outline-none focus:border-[rgba(244,196,48,0.45)]"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponible</option>
          <option value="pending">Pendiente</option>
          <option value="failed">Error</option>
        </select>
        <label className="flex h-8 w-[210px] items-center gap-2 rounded-md border border-[var(--pi-color-border)] bg-[#0c0e10] px-2.5 focus-within:border-[rgba(244,196,48,0.45)]">
          <IconSearch size={14} stroke={1.6} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
          <span className="sr-only">Buscar reportes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar reporte"
            className="min-w-0 flex-1 border-0 bg-transparent text-[9px] text-[var(--pi-color-text)] outline-none placeholder:text-[var(--pi-color-text-faint)]"
          />
          {query ? (
            <button type="button" onClick={() => onQueryChange("")} className="grid h-5 w-5 place-items-center rounded text-[var(--pi-color-text-faint)] hover:bg-[#1b1d20] hover:text-[var(--pi-color-text)]" aria-label="Limpiar búsqueda">
              <IconX size={12} stroke={1.6} aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <span className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--pi-color-border)] bg-[#0c0e10] px-2.5 text-[7px] font-semibold tracking-[0.09em] text-[var(--pi-color-text-faint)]">
          {dataStatus === "disconnected" ? <IconDatabaseOff size={12} stroke={1.5} aria-hidden="true" /> : null}
          {dataStatus === "ready" ? "DATOS DISPONIBLES" : "FUENTE SIN CONECTAR"}
        </span>
      </div>
    </section>
  );
}
