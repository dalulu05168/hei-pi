import { IconDatabaseOff, IconTable } from "@tabler/icons-react";
import type {
  InstitutionalDataStatus,
  InstitutionalReservation,
} from "@/services/institutional";

interface ReservationTableProps {
  dataStatus: InstitutionalDataStatus;
  onSelect: (reservationId: string) => void;
  reservations: readonly InstitutionalReservation[];
  selectedReservationId: string | null;
}

const numberFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function ReservationTable({
  dataStatus,
  onSelect,
  reservations,
  selectedReservationId,
}: ReservationTableProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgba(86,123,171,0.2)] bg-[#09111b] shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
      <header className="flex h-[54px] flex-none items-center justify-between border-b border-[rgba(86,123,171,0.14)] px-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(97,139,192,0.18)] bg-[rgba(51,90,140,0.12)] text-[#7194c3]">
            <IconTable size={15} stroke={1.55} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[11px] font-semibold text-[#dce6f1]">Directorio de Reservas</h2>
            <p className="mt-1 text-[7px] tracking-[0.12em] text-[#53667c]">INVENTARIO INSTITUCIONAL</p>
          </div>
        </div>
        <span className="rounded-md border border-[rgba(86,123,171,0.16)] bg-[#0b1521] px-2.5 py-1 text-[8px] font-medium text-[#71849a]">
          {reservations.length} registros
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#0b1521] text-[7px] font-semibold tracking-[0.09em] text-[#667b94]">
            <tr>
              <th className="h-10 px-4 font-semibold">CÓDIGO DE ACCIÓN</th>
              <th className="h-10 px-3 font-semibold">EMPRESA</th>
              <th className="h-10 px-3 font-semibold">MERCADO</th>
              <th className="h-10 px-3 font-semibold">PAÍS</th>
              <th className="h-10 px-3 text-right font-semibold">CANTIDAD RESERVADA</th>
              <th className="h-10 px-3 text-right font-semibold">PRECIO INSTITUCIONAL</th>
              <th className="h-10 px-3 font-semibold">ESTADO</th>
              <th className="h-10 px-4 font-semibold">FECHA</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                tabIndex={0}
                aria-selected={selectedReservationId === reservation.id}
                onClick={() => onSelect(reservation.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(reservation.id);
                  }
                }}
                className="cursor-pointer border-t border-[rgba(86,123,171,0.1)] text-[9px] text-[#b7c6d7] outline-none hover:bg-[rgba(65,104,153,0.08)] focus-visible:bg-[rgba(65,104,153,0.12)] aria-selected:bg-[rgba(65,104,153,0.14)]"
              >
                <td className="h-12 px-4 font-mono font-semibold text-[#d9e5f1]">{reservation.ticker}</td>
                <td className="h-12 px-3">{reservation.companyName}</td>
                <td className="h-12 px-3">{reservation.market}</td>
                <td className="h-12 px-3">{reservation.country}</td>
                <td className="h-12 px-3 text-right font-mono">
                  {reservation.reservedQuantity === null
                    ? "—"
                    : numberFormatter.format(reservation.reservedQuantity)}
                </td>
                <td className="h-12 px-3 text-right font-mono">
                  {reservation.institutionalPrice === null
                    ? "—"
                    : `${reservation.currency} ${moneyFormatter.format(reservation.institutionalPrice)}`}
                </td>
                <td className="h-12 px-3">{reservation.status ?? "—"}</td>
                <td className="h-12 px-4 font-mono">{reservation.reservationDate ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 ? (
          <div className="grid min-h-[355px] place-items-center px-8 text-center">
            <div className="max-w-[340px]">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[rgba(97,139,192,0.2)] bg-[rgba(51,90,140,0.11)] text-[#698bb7]">
                <IconDatabaseOff size={20} stroke={1.45} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[11px] font-semibold text-[#d5e0ec]">
                {dataStatus === "ready" ? "Sin reservas registradas" : "Fuente institucional sin conectar"}
              </h3>
              <p className="mt-2 text-[8px] leading-5 text-[#5d7087]">
                {dataStatus === "ready"
                  ? "No existen operaciones en bloque para los criterios actuales."
                  : "El directorio permanecerá vacío hasta recibir datos del servicio independiente de reservas."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="flex h-9 flex-none items-center justify-between border-t border-[rgba(86,123,171,0.12)] px-4 text-[7px] tracking-[0.08em] text-[#52657b]">
        <span>SELECCIONE UNA FILA PARA REVISAR LA RESERVA</span>
        <span>DATOS INSTITUCIONALES AISLADOS</span>
      </footer>
    </section>
  );
}
