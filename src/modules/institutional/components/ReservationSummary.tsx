import { IconDatabaseSearch, IconLayersSelected, IconStack2 } from "@tabler/icons-react";
import type { InstitutionalDataStatus, ReservationSummaryData } from "@/services/institutional";

interface ReservationSummaryProps {
  data: ReservationSummaryData;
  dataStatus: InstitutionalDataStatus;
}

const number = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

export function ReservationSummary({ data, dataStatus }: ReservationSummaryProps) {
  const total = data.availableQuantity !== null && data.reservedQuantity !== null
    ? data.availableQuantity + data.reservedQuantity
    : null;
  const remaining = total && data.availableQuantity !== null
    ? `${((data.availableQuantity / total) * 100).toFixed(2)}%`
    : "—";

  return (
    <section aria-label="Parámetros de reserva institucional" className="grid h-full grid-cols-[minmax(360px,1.35fr)_minmax(220px,.65fr)_minmax(220px,.65fr)] gap-3">
      <article className="terminal-panel flex h-full items-center gap-4 px-4">
        <span className="grid h-10 w-10 place-items-center rounded-[5px] border border-[rgba(97,139,192,.24)] bg-[rgba(51,90,140,.15)] text-[#89a7cc]"><IconDatabaseSearch size={18} stroke={1.5}/></span>
        <label className="min-w-0 flex-1">
          <span className="terminal-kicker">BÚSQUEDA DE BLOQUE</span>
          <div className="mt-2 flex h-9 items-center border border-[rgba(97,139,192,.2)] bg-[#06111c] px-3">
            <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-[11px] outline-none" placeholder="Código / empresa / mercado" aria-label="Buscar reserva por código" />
            <span className="text-[8px] tracking-[.12em] text-[#61768d]">INSTITUCIONAL</span>
          </div>
        </label>
      </article>
      <article className="terminal-panel flex h-full items-center gap-3 px-4">
        <IconLayersSelected size={20} className="text-[#83a3ca]" stroke={1.5}/>
        <div><p className="text-[9px] text-[#8799ab]">Porcentaje restante</p><strong className="mt-2 block font-mono text-[23px] text-[var(--pi-color-text)]">{remaining}</strong><span className="terminal-kicker">MÉTRICA ESTÁTICA</span></div>
      </article>
      <article className="terminal-panel flex h-full items-center gap-3 px-4">
        <IconStack2 size={20} className="text-[#83a3ca]" stroke={1.5}/>
        <div><p className="text-[9px] text-[#8799ab]">Acciones totales</p><strong className="mt-2 block font-mono text-[23px] text-[var(--pi-color-text)]">{total === null ? "—" : number.format(total)}</strong><span className="terminal-kicker">{dataStatus === "ready" ? "FUENTE CONECTADA" : "FUENTE PENDIENTE"}</span></div>
      </article>
    </section>
  );
}
