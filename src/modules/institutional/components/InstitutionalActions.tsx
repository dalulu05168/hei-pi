import {
  IconCalendarPlus,
  IconHistory,
  IconLockAccess,
  IconUserShare,
} from "@tabler/icons-react";

const actions = [
  { icon: IconCalendarPlus, label: "Nueva Reserva" },
  { icon: IconUserShare, label: "Asignación" },
  { icon: IconHistory, label: "Historial" },
] as const;

export function InstitutionalActions() {
  return (
    <section className="flex h-[62px] items-center justify-between overflow-hidden rounded-xl border border-[rgba(86,123,171,0.18)] bg-[#09111b] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(97,139,192,0.18)] bg-[rgba(51,90,140,0.12)] text-[#7194c3]">
          <IconLockAccess size={15} stroke={1.55} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[10px] font-semibold text-[#d6e1ed]">Operación Institucional</h2>
          <p className="mt-1 truncate text-[7px] tracking-[0.08em] text-[#52657a]">
            ACCIONES RESERVADAS HASTA CONECTAR LOS FLUJOS AUTORIZADOS
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2" aria-label="Acciones institucionales previstas">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              disabled
              title="Flujo institucional pendiente de conexión"
              className="flex h-9 min-w-[132px] cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[rgba(86,123,171,0.14)] bg-[#0b1521] px-3 text-[8px] font-semibold text-[#586a80] opacity-80"
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
