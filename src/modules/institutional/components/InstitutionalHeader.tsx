import {
  IconBuildingBank,
  IconClock,
  IconDatabaseOff,
  IconShieldLock,
} from "@tabler/icons-react";
import type { InstitutionalDataStatus } from "@/services/institutional";

interface InstitutionalHeaderProps {
  dataStatus: InstitutionalDataStatus;
  lastUpdatedAt: string | null;
}

export function InstitutionalHeader({
  dataStatus,
  lastUpdatedAt,
}: InstitutionalHeaderProps) {
  return (
    <section className="flex h-[58px] items-center justify-between overflow-hidden rounded-xl border border-[rgba(86,123,171,0.22)] bg-[linear-gradient(100deg,#08111c_0%,#09131f_56%,#080e17_100%)] px-4 shadow-[0_18px_44px_rgba(0,0,0,0.3)]">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-[rgba(99,139,191,0.24)] bg-[rgba(55,91,139,0.16)] text-[#7da0cf]">
          <IconBuildingBank size={18} stroke={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[7px] font-semibold tracking-[0.2em] text-[#6883a5]">
            INSTITUCIONAL
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-[#e7eef7]">
            Operaciones en Bloque
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(86,123,171,0.18)] bg-[#0b1521] px-3">
          <IconShieldLock size={14} stroke={1.55} className="text-[#7999c3]" aria-hidden="true" />
          <span>
            <small className="block text-[7px] tracking-[0.13em] text-[#5e7188]">ÁMBITO DE DATOS</small>
            <strong className="mt-0.5 block text-[9px] font-medium text-[#b8c7d8]">Dominio institucional</strong>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(86,123,171,0.18)] bg-[#0b1521] px-3">
          <IconClock size={14} stroke={1.55} className="text-[#7999c3]" aria-hidden="true" />
          <span>
            <small className="block text-[7px] tracking-[0.13em] text-[#5e7188]">CDMX · ACTUALIZACIÓN</small>
            <strong className="mt-0.5 block font-mono text-[9px] font-medium text-[#b8c7d8]">
              {lastUpdatedAt ?? "—"}
            </strong>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(86,123,171,0.2)] bg-[#0b1521] px-3 text-[#7da0cf]">
          <IconDatabaseOff size={14} stroke={1.55} aria-hidden="true" />
          <span className="text-[8px] font-semibold tracking-[0.1em]">
            {dataStatus === "ready" ? "DATOS DISPONIBLES" : "FUENTE SIN CONECTAR"}
          </span>
        </div>
      </div>
    </section>
  );
}
