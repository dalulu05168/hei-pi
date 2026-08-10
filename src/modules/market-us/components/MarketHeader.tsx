import {
  IconBuildingBank,
  IconClock,
  IconDatabaseOff,
  IconMapPin,
} from "@tabler/icons-react";
import type { MarketDataStatus } from "@/services/market";

interface MarketHeaderProps {
  dataStatus: MarketDataStatus;
  lastUpdatedAt: string | null;
}

export function MarketHeader({
  dataStatus,
  lastUpdatedAt,
}: MarketHeaderProps) {
  return (
    <section className="flex h-[58px] items-center justify-between overflow-hidden rounded-xl border border-[rgba(91,141,198,0.2)] bg-[#08101a] px-4 shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-[rgba(91,141,198,0.2)] bg-[rgba(54,103,156,0.12)] text-[#6f9ed0]">
          <IconBuildingBank size={17} stroke={1.55} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[7px] font-semibold tracking-[0.2em] text-[#66819e]">
            OBSERVACIÓN INSTITUCIONAL
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-[#e8eef7]">
            Mercado: Estados Unidos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.16)] bg-[#0b1521] px-3">
          <IconMapPin size={14} stroke={1.6} className="text-[#6f9ed0]" aria-hidden="true" />
          <span>
            <small className="block text-[7px] tracking-[0.13em] text-[#607286]">ZONA HORARIA</small>
            <strong className="mt-0.5 block text-[9px] font-medium text-[#b8c7d8]">New York</strong>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.16)] bg-[#0b1521] px-3">
          <IconClock size={14} stroke={1.6} className="text-[#6f9ed0]" aria-hidden="true" />
          <span>
            <small className="block text-[7px] tracking-[0.13em] text-[#607286]">ÚLTIMA ACTUALIZACIÓN</small>
            <strong className="mt-0.5 block font-mono text-[9px] font-medium text-[#b8c7d8]">
              {lastUpdatedAt ?? "—"}
            </strong>
          </span>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.18)] bg-[#0b1521] px-3 text-[#6f9ed0]">
          <IconDatabaseOff size={14} stroke={1.6} aria-hidden="true" />
          <span className="text-[8px] font-semibold tracking-[0.1em]">
            {dataStatus === "ready" ? "DATOS DISPONIBLES" : "FUENTE SIN CONECTAR"}
          </span>
        </div>
      </div>
    </section>
  );
}
