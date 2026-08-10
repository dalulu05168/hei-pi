import {
  IconCopy,
  IconEdit,
  IconLockAccess,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

const actions = [
  { icon: IconPlus, label: "Nueva Plantilla" },
  { icon: IconEdit, label: "Editar Plantilla" },
  { icon: IconCopy, label: "Copiar Plantilla" },
  { icon: IconTrash, label: "Eliminar Plantilla" },
] as const;

export function TemplateActions() {
  return (
    <section className="flex h-[62px] items-center justify-between overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[#111316] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <IconLockAccess size={15} stroke={1.55} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[10px] font-semibold text-[var(--pi-color-text)]">Operación de Plantillas</h2>
          <p className="mt-1 truncate text-[7px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
            ACCIONES RESERVADAS HASTA CONECTAR EL ALMACENAMIENTO Y EL EDITOR
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2" aria-label="Acciones de plantilla previstas">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              disabled
              title="Flujo de plantillas pendiente de conexión"
              className="flex h-9 min-w-[128px] cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[var(--pi-color-border)] bg-[#16181b] px-3 text-[8px] font-semibold text-[var(--pi-color-text-faint)] opacity-70"
            >
              <Icon size={14} stroke={1.55} aria-hidden="true" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
