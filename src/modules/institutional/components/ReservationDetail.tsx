import { IconDatabaseOff, IconFileDescription } from "@tabler/icons-react";
import type {
  InstitutionalDataStatus,
  InstitutionalReservation,
} from "@/services/institutional";

interface ReservationDetailProps {
  dataStatus: InstitutionalDataStatus;
  reservation: InstitutionalReservation | null;
}

const numberFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function money(value: number | null, currency?: string) {
  return value === null ? "—" : `${currency ?? ""} ${moneyFormatter.format(value)}`.trim();
}

export function ReservationDetail({
  dataStatus,
  reservation,
}: ReservationDetailProps) {
  const stockFields = [
    ["Código", reservation?.ticker ?? "—"],
    ["Empresa", reservation?.companyName ?? "—"],
    ["Mercado", reservation?.market ?? "—"],
    ["Precio referencia", money(reservation?.referencePrice ?? null, reservation?.currency)],
    ["Precio institucional", money(reservation?.institutionalPrice ?? null, reservation?.currency)],
    ["Descuento", reservation?.discountPercent === null || reservation?.discountPercent === undefined ? "—" : `${reservation.discountPercent}%`],
  ] as const;

  const reservationFields = [
    ["Cantidad disponible", reservation?.availableQuantity === null || reservation?.availableQuantity === undefined ? "—" : numberFormatter.format(reservation.availableQuantity)],
    ["Cantidad asignada", reservation?.assignedQuantity === null || reservation?.assignedQuantity === undefined ? "—" : numberFormatter.format(reservation.assignedQuantity)],
    ["Estado", reservation?.status ?? "—"],
  ] as const;

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgba(86,123,171,0.2)] bg-[#0a121d] shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
      <header className="flex h-[54px] flex-none items-center gap-3 border-b border-[rgba(86,123,171,0.14)] px-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(97,139,192,0.18)] bg-[rgba(51,90,140,0.12)] text-[#7194c3]">
          <IconFileDescription size={15} stroke={1.55} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[11px] font-semibold text-[#dce6f1]">Detalle de Reserva</h2>
          <p className="mt-1 text-[7px] tracking-[0.12em] text-[#53667c]">REVISIÓN INSTITUCIONAL</p>
        </div>
      </header>

      {!reservation ? (
        <div className="flex flex-1 flex-col">
          <div className="border-b border-[rgba(86,123,171,0.1)] px-4 py-4">
            <div className="flex items-start gap-3 rounded-lg border border-[rgba(86,123,171,0.15)] bg-[#0b1521] p-3">
              <IconDatabaseOff size={17} stroke={1.45} className="mt-0.5 flex-none text-[#698bb7]" aria-hidden="true" />
              <div>
                <p className="text-[9px] font-semibold text-[#cbd8e6]">Reserva sin seleccionar</p>
                <p className="mt-1.5 text-[7px] leading-4 text-[#5d7087]">
                  {dataStatus === "ready"
                    ? "Seleccione una reserva del directorio."
                    : "La ficha quedará disponible al conectar la fuente institucional."}
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
            <DetailGroup label="INFORMACIÓN DE LA ACCIÓN" fields={stockFields} />
            <div className="my-4 h-px bg-[rgba(86,123,171,0.11)]" />
            <DetailGroup label="INFORMACIÓN DE LA RESERVA" fields={reservationFields} />
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <div className="mb-4 rounded-lg border border-[rgba(86,123,171,0.18)] bg-[#0b1521] p-3">
            <p className="font-mono text-[16px] font-semibold text-[#e1eaf4]">{reservation.ticker}</p>
            <p className="mt-1 truncate text-[8px] text-[#70839a]">{reservation.companyName}</p>
          </div>
          <DetailGroup label="INFORMACIÓN DE LA ACCIÓN" fields={stockFields} />
          <div className="my-4 h-px bg-[rgba(86,123,171,0.11)]" />
          <DetailGroup label="INFORMACIÓN DE LA RESERVA" fields={reservationFields} />
        </div>
      )}

      <footer className="flex h-9 flex-none items-center border-t border-[rgba(86,123,171,0.12)] px-4 text-[7px] tracking-[0.08em] text-[#52657b]">
        SOLO LECTURA · DOMINIO INSTITUCIONAL
      </footer>
    </aside>
  );
}

interface DetailGroupProps {
  fields: readonly (readonly [string, string])[];
  label: string;
}

function DetailGroup({ fields, label }: DetailGroupProps) {
  return (
    <section>
      <h3 className="mb-2.5 text-[7px] font-semibold tracking-[0.14em] text-[#60758e]">{label}</h3>
      <dl className="space-y-0.5">
        {fields.map(([field, value]) => (
          <div key={field} className="flex min-h-8 items-center justify-between gap-3 rounded-md px-2 hover:bg-[rgba(65,104,153,0.06)]">
            <dt className="text-[8px] text-[#71849a]">{field}</dt>
            <dd className="max-w-[60%] truncate text-right font-mono text-[8px] font-medium text-[#c7d4e2]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
