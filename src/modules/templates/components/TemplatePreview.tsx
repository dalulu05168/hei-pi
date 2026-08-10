import Image from "next/image";
import {
  IconBraces,
  IconDatabaseOff,
  IconHistory,
  IconPhotoOff,
} from "@tabler/icons-react";
import type { TemplateDataStatus, TemplateProject } from "@/services/templates";

interface TemplatePreviewProps {
  dataStatus: TemplateDataStatus;
  template: TemplateProject | null;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[#121417] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <header className="flex h-[50px] flex-none items-center gap-3 border-b border-[var(--pi-color-border)] px-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <IconPhotoOff size={15} stroke={1.55} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[11px] font-semibold text-[var(--pi-color-text)]">Vista Previa de Plantilla</h2>
          <p className="mt-1 text-[7px] tracking-[0.12em] text-[var(--pi-color-text-faint)]">DETALLE DE CONTENIDO</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <section>
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[10px] font-semibold text-[var(--pi-color-text)]">{template?.name ?? "Plantilla sin seleccionar"}</h3>
              <p className="mt-1 text-[7px] text-[var(--pi-color-text-faint)]">{template?.version ?? "VISTA 16:9"}</p>
            </div>
            <span className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2 py-1 text-[7px] text-[var(--pi-color-text-faint)]">
              {template?.status ?? "—"}
            </span>
          </div>

          <div className={`relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--pi-color-border-strong)] bg-[#090a0c] ${template?.previewSourceUrl ? "grid place-items-center" : "grid grid-cols-2 gap-2 p-3"}`}>
            {template?.previewSourceUrl ? (
              <Image
                src={template.previewSourceUrl}
                alt={`Vista previa de ${template.name}`}
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              ["01", "02", "03", "04"].map((slot) => (
                <div key={slot} className="terminal-empty-grid grid place-items-center rounded-[4px] border border-[var(--pi-color-border)] bg-[#08121d] text-center">
                  <div>
                    <IconDatabaseOff size={15} stroke={1.4} className="mx-auto text-[var(--pi-color-text-faint)]" aria-hidden="true" />
                    <p className="mt-1.5 text-[7px] font-medium text-[var(--pi-color-text-muted)]">Vista {slot}</p>
                    <p className="mt-0.5 text-[6px] text-[var(--pi-color-text-faint)]">SIN FUENTE</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-4 border-t border-[var(--pi-color-border)] pt-3">
          <div className="flex items-center gap-2">
            <IconBraces size={14} stroke={1.55} className="text-[var(--pi-color-brand)]" aria-hidden="true" />
            <h3 className="text-[8px] font-semibold tracking-[0.1em] text-[var(--pi-color-text-muted)]">PARÁMETROS Y VARIABLES</h3>
          </div>
          {template?.variables.length ? (
            <dl className="mt-2 space-y-1">
              {template.variables.map((variable) => (
                <div key={variable.key} className="flex min-h-7 items-center justify-between rounded-md bg-[#0d0f11] px-2.5 text-[8px]">
                  <dt className="text-[var(--pi-color-text-muted)]">{variable.label}</dt>
                  <dd className="font-mono text-[var(--pi-color-text-faint)]">{variable.valueSource ?? "—"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 rounded-md border border-dashed border-[var(--pi-color-border)] px-3 py-2 text-[7px] text-[var(--pi-color-text-faint)]">Sin parámetros disponibles</p>
          )}
        </section>

        <section className="mt-4 border-t border-[var(--pi-color-border)] pt-3">
          <div className="flex items-center gap-2">
            <IconHistory size={14} stroke={1.55} className="text-[var(--pi-color-brand)]" aria-hidden="true" />
            <h3 className="text-[8px] font-semibold tracking-[0.1em] text-[var(--pi-color-text-muted)]">REGISTROS</h3>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <RecordState label="Historial de uso" count={template?.usageRecords.length ?? 0} />
            <RecordState label="Modificaciones" count={template?.changeRecords.length ?? 0} />
          </div>
        </section>
      </div>

      <footer className="flex h-9 flex-none items-center border-t border-[var(--pi-color-border)] px-4 text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
        VISTA PREVIA · SIN MODIFICAR DATOS OPERATIVOS
      </footer>
    </aside>
  );
}

function RecordState({ count, label }: { count: number; label: string }) {
  return (
    <div className="rounded-md border border-[var(--pi-color-border)] bg-[#0d0f11] px-2.5 py-2">
      <p className="text-[7px] text-[var(--pi-color-text-faint)]">{label}</p>
      <p className="mt-1.5 font-mono text-[12px] text-[var(--pi-color-text-muted)]">{count || "—"}</p>
    </div>
  );
}
