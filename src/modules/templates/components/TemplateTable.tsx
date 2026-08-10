import { IconDatabaseOff, IconEye, IconTable } from "@tabler/icons-react";
import type { TemplateDataStatus, TemplateProject } from "@/services/templates";

interface TemplateTableProps {
  dataStatus: TemplateDataStatus;
  hasActiveFilters: boolean;
  onSelect: (templateId: string) => void;
  selectedTemplateId: string | null;
  templates: readonly TemplateProject[];
}

const categoryLabels = {
  message: "Mensaje",
  other: "Otra",
  script: "Guion",
  trade: "Operación",
} as const;

const statusLabels = {
  active: "En uso",
  draft: "Borrador",
  inactive: "Inactiva",
} as const;

export function TemplateTable({
  dataStatus,
  hasActiveFilters,
  onSelect,
  selectedTemplateId,
  templates,
}: TemplateTableProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[#111316] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <header className="flex h-[50px] flex-none items-center justify-between border-b border-[var(--pi-color-border)] px-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
            <IconTable size={15} stroke={1.55} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[11px] font-semibold text-[var(--pi-color-text)]">Directorio de Plantillas</h2>
            <p className="mt-1 text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">BIBLIOTECA DE CONTENIDO</p>
          </div>
        </div>
        <span className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2.5 py-1 text-[8px] font-medium text-[var(--pi-color-text-faint)]">
          {templates.length} registros
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#16181b] text-[7px] font-semibold tracking-[0.09em] text-[var(--pi-color-text-faint)]">
            <tr>
              <th className="h-10 px-4 font-semibold">NOMBRE DE PLANTILLA</th>
              <th className="h-10 px-3 font-semibold">TIPO</th>
              <th className="h-10 px-3 font-semibold">ESTADO</th>
              <th className="h-10 px-3 font-semibold">CREACIÓN</th>
              <th className="h-10 px-3 font-semibold">ACTUALIZACIÓN</th>
              <th className="h-10 px-3 text-right font-semibold">USOS</th>
              <th className="h-10 px-4 text-right font-semibold">OPERACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr
                key={template.id}
                tabIndex={0}
                aria-selected={selectedTemplateId === template.id}
                onClick={() => onSelect(template.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(template.id);
                  }
                }}
                className="cursor-pointer border-t border-[var(--pi-color-border)] text-[9px] text-[var(--pi-color-text-muted)] outline-none hover:bg-[rgba(244,196,48,0.04)] focus-visible:bg-[rgba(244,196,48,0.07)] aria-selected:bg-[rgba(244,196,48,0.08)]"
              >
                <td className="h-12 px-4 font-medium text-[var(--pi-color-text)]">{template.name}</td>
                <td className="h-12 px-3">{categoryLabels[template.category]}</td>
                <td className="h-12 px-3">{template.status ? statusLabels[template.status] : "—"}</td>
                <td className="h-12 px-3 font-mono">{template.createdAt ?? "—"}</td>
                <td className="h-12 px-3 font-mono">{template.updatedAt ?? "—"}</td>
                <td className="h-12 px-3 text-right font-mono">{template.usageCount ?? "—"}</td>
                <td className="h-12 px-4 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(template.id);
                    }}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[rgba(244,196,48,0.24)] bg-[var(--pi-color-brand-soft)] px-2.5 text-[8px] font-semibold text-[var(--pi-color-brand)]"
                  >
                    <IconEye size={12} stroke={1.55} aria-hidden="true" />
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {templates.length === 0 ? (
          <div className="grid min-h-[360px] place-items-center px-8 text-center">
            <div className="max-w-[350px]">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
                <IconDatabaseOff size={20} stroke={1.45} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[11px] font-semibold text-[var(--pi-color-text)]">
                {dataStatus === "disconnected"
                  ? "Biblioteca de plantillas sin conectar"
                  : hasActiveFilters
                    ? "Sin resultados para los filtros"
                    : "Sin plantillas registradas"}
              </h3>
              <p className="mt-2 text-[8px] leading-5 text-[var(--pi-color-text-faint)]">
                {dataStatus === "disconnected"
                  ? "El directorio permanecerá vacío hasta conectar el almacenamiento de proyectos de plantilla."
                  : "Ajuste la categoría o la búsqueda para consultar otros proyectos disponibles."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="flex h-9 flex-none items-center justify-between border-t border-[var(--pi-color-border)] px-4 text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
        <span>SELECCIONE UNA PLANTILLA PARA ABRIR LA VISTA PREVIA</span>
        <span>PROYECTOS EN ALMACENAMIENTO INDEPENDIENTE</span>
      </footer>
    </section>
  );
}
