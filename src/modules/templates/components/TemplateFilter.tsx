import { IconDatabaseOff, IconSearch, IconX } from "@tabler/icons-react";
import type { TemplateCategory, TemplateDataStatus } from "@/services/templates";

export type TemplateCategoryFilter = "all" | TemplateCategory;

interface TemplateFilterProps {
  activeCategory: TemplateCategoryFilter;
  dataStatus: TemplateDataStatus;
  onCategoryChange: (category: TemplateCategoryFilter) => void;
  onQueryChange: (query: string) => void;
  query: string;
}

const categories: readonly { id: TemplateCategoryFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "script", label: "Plantillas de Guion" },
  { id: "message", label: "Plantillas de Mensaje" },
  { id: "trade", label: "Plantillas de Operación" },
  { id: "other", label: "Otras" },
];

export function TemplateFilter({
  activeCategory,
  dataStatus,
  onCategoryChange,
  onQueryChange,
  query,
}: TemplateFilterProps) {
  return (
    <section className="flex h-[54px] items-center justify-between gap-4 rounded-xl border border-[var(--pi-color-border)] bg-[#121417] px-3 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
      <div className="flex min-w-0 items-center gap-1" role="tablist" aria-label="Categorías de plantillas">
        {categories.map((category) => {
          const active = category.id === activeCategory;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(category.id)}
              className={`h-8 whitespace-nowrap rounded-md border px-3 text-[8px] font-semibold transition-colors ${
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

      <div className="flex flex-none items-center gap-2">
        <label className="flex h-8 w-[270px] items-center gap-2 rounded-md border border-[var(--pi-color-border)] bg-[#0c0e10] px-2.5 focus-within:border-[rgba(244,196,48,0.45)]">
          <IconSearch size={14} stroke={1.6} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
          <span className="sr-only">Buscar plantillas</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar nombre o tipo"
            className="min-w-0 flex-1 border-0 bg-transparent text-[9px] text-[var(--pi-color-text)] outline-none placeholder:text-[var(--pi-color-text-faint)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="grid h-5 w-5 place-items-center rounded text-[var(--pi-color-text-faint)] hover:bg-[#1b1d20] hover:text-[var(--pi-color-text)]"
              aria-label="Limpiar búsqueda"
            >
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
