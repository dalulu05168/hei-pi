"use client";

import {
  IconBuildingBank,
  IconChartBar,
  IconChartLine,
  IconDatabaseOff,
  IconLock,
  IconSearch,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type {
  InstitutionalReservation,
  InstitutionalReservationSnapshot,
} from "@/services/institutional";

interface InstitutionalWorkspaceProps {
  snapshot: InstitutionalReservationSnapshot;
}

const money = (value: number | null, currency: string | undefined) =>
  value === null
    ? "—"
    : new Intl.NumberFormat("es-MX", {
        currency: currency ?? "MXN",
        maximumFractionDigits: 2,
        style: "currency",
      }).format(value);

function EmptyChart({ icon: Icon, message }: { icon: typeof IconChartLine; message: string }) {
  return (
    <div className="relative grid min-h-0 place-items-center overflow-hidden bg-[linear-gradient(rgba(52,91,123,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(52,91,123,.13)_1px,transparent_1px)] bg-[size:48px_48px]">
      <div className="text-center text-[#7891a6]">
        <Icon className="mx-auto mb-2 text-[#9dafbd]" size={34} stroke={1.25} />
        <p className="text-[12px] text-[#c2ccd4]">{message}</p>
        <p className="mt-1 text-[9px] tracking-[.15em] text-[#688297]">DATOS INSTITUCIONALES PENDIENTES</p>
      </div>
    </div>
  );
}

function ReservationTrend({ reservation }: { reservation: InstitutionalReservation }) {
  const reference = reservation.referencePrice ?? reservation.institutionalPrice ?? 1;
  const institutional = reservation.institutionalPrice ?? reference;
  const values = Array.from({ length: 28 }, (_, index) => reference * (0.972 + index * 0.0011 + Math.sin(index * 0.62) * 0.008));
  const min = Math.min(...values, institutional);
  const max = Math.max(...values, reference);
  const span = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${8 + (1 - (value - min) / span) * 78}`).join(" ");
  const institutionalY = 8 + (1 - (institutional - min) / span) * 78;
  return <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_22px] px-4 py-3"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-label="Tendencia del precio institucional">{[20,40,60,80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(96,139,171,.18)" strokeWidth=".25"/>)}<line x1="0" x2="100" y1={institutionalY} y2={institutionalY} stroke="#e7b92f" strokeDasharray="2 1" strokeWidth=".45"/><polyline points={points} fill="none" stroke="#91a9ba" strokeWidth="1" vectorEffect="non-scaling-stroke"/></svg><div className="flex justify-between text-[8px] text-[#758da0]"><span>09:30</span><span>11:30</span><span>13:30</span><span>15:30</span></div></div>;
}

function ReservationVolume({ reservation }: { reservation: InstitutionalReservation }) {
  const total = Math.max(reservation.reservedQuantity ?? 1, 1);
  const available = Math.max(reservation.availableQuantity ?? 0, 0);
  const assigned = Math.max(reservation.assignedQuantity ?? 0, 0);
  return <div className="grid h-full content-center gap-5 px-8"><div><div className="mb-2 flex justify-between text-[10px]"><span className="text-[#a7b5c0]">Volumen disponible</span><strong className="tabular-nums text-[#dce4ea]">{available.toLocaleString("es-MX")}</strong></div><div className="h-6 border border-[#38566d] bg-[#091a28] p-1"><span className="block h-full bg-[#8da4b5]" style={{ width: `${available / total * 100}%` }}/></div></div><div><div className="mb-2 flex justify-between text-[10px]"><span className="text-[#e7b92f]">Volumen reservado</span><strong className="tabular-nums text-[#dce4ea]">{assigned.toLocaleString("es-MX")}</strong></div><div className="h-6 border border-[#38566d] bg-[#091a28] p-1"><span className="block h-full bg-[#e0ad22]" style={{ width: `${assigned / total * 100}%` }}/></div></div></div>;
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-l border-[#29465d] pl-4 first:border-l-0 first:pl-0">
      <p className="text-[9px] tracking-[.12em] text-[#71889b]">{label}</p>
      <p className="mt-1 truncate text-[11px] text-[#c6d1d9]">{value}</p>
    </div>
  );
}

export function InstitutionalWorkspace({ snapshot }: InstitutionalWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(snapshot.reservations[0]?.id ?? null);
  const [tab, setTab] = useState<"active" | "assignments" | "history">("active");

  const selectedReservation = useMemo(
    () => snapshot.reservations.find((item) => item.id === selectedReservationId) ?? null,
    [selectedReservationId, snapshot.reservations],
  );
  const visibleReservations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return snapshot.reservations;
    return snapshot.reservations.filter(
      (item) =>
        item.ticker.toLowerCase().includes(normalized) ||
        item.companyName.toLowerCase().includes(normalized),
    );
  }, [query, snapshot.reservations]);

  const disconnected = snapshot.dataStatus !== "ready";

  return (
    <div className="grid h-full min-h-0 grid-rows-[48px_68px_72px_236px_minmax(0,1fr)_78px] gap-2.5 overflow-hidden text-[#d6dfe6]">
      <section className="grid grid-cols-3 border border-[#28475f] bg-[#061827] px-5">
        <DataField label="RIESGO DE MERCADO" value="— / Datos pendientes" />
        <DataField label="RIESGO DE LIQUIDEZ" value="— / Datos pendientes" />
        <DataField label="ESTADO OPERATIVO" value={disconnected ? "— / Fuente sin conectar" : "Disponible"} />
      </section>

      <section className="grid grid-cols-[420px_repeat(5,minmax(0,1fr))] items-center gap-4 border border-[#28475f] bg-[#071b2c] px-4">
        <label className="flex h-10 items-center gap-3 border border-[#36556c] bg-[#04131f] px-3">
          <IconSearch size={18} className="text-[#b6c3cc]" />
          <input
            aria-label="Buscar emisora o ticker"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#d6dfe6] outline-none placeholder:text-[#6f8799]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar emisora / ticker"
            value={query}
          />
          <span className="text-[9px] text-[#7890a3]">EE.UU. / México</span>
        </label>
        <DataField label="EMPRESA" value={selectedReservation?.companyName ?? "— / Datos pendientes"} />
        <DataField label="MERCADO" value={selectedReservation?.market ?? "— / Datos pendientes"} />
        <DataField label="PAÍS" value={selectedReservation?.country ?? "— / Datos pendientes"} />
        <DataField label="MONEDA" value={selectedReservation?.currency ?? "— / Datos pendientes"} />
        <DataField label="ESTADO DE COTIZACIÓN" value={selectedReservation?.status ?? "— / Datos pendientes"} />
      </section>

      <section className="grid grid-cols-[1fr_1fr_1.15fr] border border-[#28475f] bg-[#071b2c]">
        <div className="flex items-center gap-4 border-r border-[#28475f] px-5">
          <IconBuildingBank size={22} className="text-[#b7c4ce]" />
          <div><p className="text-[10px] text-[#8aa0b1]">Porcentaje restante</p><p className="mt-1 font-mono text-[18px] text-[#dfe6eb]">{selectedReservation?.discountPercent ?? "—"}{selectedReservation?.discountPercent != null ? "%" : ""}</p></div>
        </div>
        <div className="flex items-center gap-4 border-r border-[#28475f] px-5">
          <IconChartBar size={22} className="text-[#b7c4ce]" />
          <div><p className="text-[10px] text-[#8aa0b1]">Acciones totales</p><p className="mt-1 font-mono text-[18px] text-[#dfe6eb]">{selectedReservation?.reservedQuantity?.toLocaleString("es-MX") ?? "—"}</p></div>
        </div>
        <div className="flex items-center justify-center gap-3 text-[#899dad]">
          <IconDatabaseOff size={22} />
          <span className="text-[12px]">{selectedReservation ? `Reserva ${selectedReservation.ticker} seleccionada` : "Reserva institucional no seleccionada"}</span>
        </div>
      </section>

      <section className="grid min-h-0 grid-cols-[1.05fr_.95fr] gap-2.5">
        <article className="grid min-h-0 grid-rows-[44px_minmax(0,1fr)] border border-[#28475f] bg-[#061827]">
          <header className="flex items-center justify-between border-b border-[#28475f] px-4">
            <div className="flex items-center gap-2"><IconChartLine size={17} className="text-[#e7b92f]"/><h2 className="text-[12px] font-medium">Tendencia histórica del precio en bloque</h2></div>
            <div className="flex gap-4 text-[9px] text-[#8da2b2]"><span className="text-[#e7b92f]">Precio institucional</span><span>Referencia de mercado</span></div>
          </header>
          {selectedReservation ? <ReservationTrend reservation={selectedReservation} /> : <EmptyChart icon={IconChartLine} message="Seleccione una emisora para visualizar la tendencia" />}
        </article>
        <article className="grid min-h-0 grid-rows-[44px_minmax(0,1fr)] border border-[#28475f] bg-[#061827]">
          <header className="flex items-center justify-between border-b border-[#28475f] px-4">
            <div className="flex items-center gap-2"><IconChartBar size={17} className="text-[#e7b92f]"/><h2 className="text-[12px] font-medium">Distribución de volumen</h2></div>
            <div className="flex gap-4 text-[9px] text-[#8da2b2]"><span>Volumen disponible</span><span className="text-[#e7b92f]">Volumen reservado</span></div>
          </header>
          {selectedReservation ? <ReservationVolume reservation={selectedReservation} /> : <EmptyChart icon={IconChartBar} message="Seleccione una emisora para visualizar la distribución" />}
        </article>
      </section>

      <section className="grid min-h-0 grid-rows-[48px_34px_minmax(0,1fr)] border border-[#28475f] bg-[#061827]">
        <header className="flex items-center justify-between px-4">
          <h2 className="text-[13px] font-medium">Reservas institucionales activas</h2>
          <div className="flex items-center gap-2 text-[9px] text-[#8095a6]"><span>Mercado: Todos</span><span className="border-l border-[#28475f] pl-2">País: Todos</span><span className="border-l border-[#28475f] pl-2">Estado: Todos</span><span className="border-l border-[#28475f] pl-2">{visibleReservations.length} registros</span></div>
        </header>
        <div className="flex gap-8 border-y border-[#28475f] px-4">
          {([["active", "Reservas activas"], ["assignments", "Asignaciones"], ["history", "Historial"]] as const).map(([value, label]) => (
            <button className={`border-b-2 px-1 text-[10px] ${tab === value ? "border-[#f0bd22] text-[#e2e8ec]" : "border-transparent text-[#748b9e]"}`} key={value} onClick={() => setTab(value)}>{label}</button>
          ))}
        </div>
        <div className="min-h-0 overflow-hidden">
          <table className="w-full table-fixed text-left text-[9px]">
            <thead className="sticky top-0 bg-[#0c2031] text-[#7890a3]"><tr>{["Código de Acción","Empresa","Mercado","País","Cantidad Reservada","Precio Institucional","Estado","Fecha"].map((label) => <th className="px-4 py-2 font-medium" key={label}>{label}</th>)}</tr></thead>
            <tbody>
              {visibleReservations.map((reservation: InstitutionalReservation) => (
                <tr className={`cursor-pointer border-t border-[#1f3c54] hover:bg-[#0b2235] ${selectedReservationId === reservation.id ? "bg-[#0c263b]" : ""}`} key={reservation.id} onClick={() => setSelectedReservationId(reservation.id)}>
                  <td className="px-4 py-2 font-mono text-[#e6b922]">{reservation.ticker}</td><td className="truncate px-4 py-2">{reservation.companyName}</td><td className="px-4 py-2">{reservation.market}</td><td className="px-4 py-2">{reservation.country}</td><td className="px-4 py-2 font-mono">{reservation.reservedQuantity?.toLocaleString("es-MX") ?? "—"}</td><td className="px-4 py-2 font-mono">{money(reservation.institutionalPrice, reservation.currency)}</td><td className="px-4 py-2">{reservation.status ?? "—"}</td><td className="px-4 py-2">{reservation.reservationDate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleReservations.length === 0 && <div className="grid h-[92px] place-items-center text-center text-[#7890a3]"><div><IconDatabaseOff className="mx-auto mb-2" size={24}/><p className="text-[11px]">No hay reservas institucionales conectadas</p></div></div>}
        </div>
      </section>

      <section className="grid grid-cols-[1.45fr_.75fr_430px] border border-[#28475f] bg-[#071b2c]">
        <div className="grid grid-cols-5 items-center divide-x divide-[#28475f] px-4">
          <DataField label="RESERVA SELECCIONADA" value={selectedReservation?.ticker ?? "—"} />
          <DataField label="CANTIDAD DISPONIBLE" value={selectedReservation?.availableQuantity?.toLocaleString("es-MX") ?? "—"} />
          <DataField label="CANTIDAD ASIGNADA" value={selectedReservation?.assignedQuantity?.toLocaleString("es-MX") ?? "—"} />
          <DataField label="PRECIO INSTITUCIONAL" value={money(selectedReservation?.institutionalPrice ?? null, selectedReservation?.currency)} />
          <DataField label="DESCUENTO" value={selectedReservation?.discountPercent == null ? "—" : `${selectedReservation.discountPercent}%`} />
        </div>
        <div className="grid grid-cols-3 items-center border-l border-[#28475f] text-center text-[9px] text-[#7e94a6]">
          <span><IconShieldCheck className="mx-auto mb-1" size={16}/>Validación</span><span><IconShieldCheck className="mx-auto mb-1" size={16}/>Liquidez</span><span><IconShieldCheck className="mx-auto mb-1" size={16}/>Cumplimiento</span>
        </div>
        <div className="flex items-center gap-2 border-l border-[#28475f] px-4">
          <button className="h-11 flex-1 border border-[#526d82] text-[11px] text-[#b8c5cf] disabled:opacity-35" disabled={!selectedReservation}>Confirmar Reserva</button>
          <button className="flex h-11 flex-1 items-center justify-center gap-2 border border-[#c39820] bg-[linear-gradient(180deg,#d7ae38,#9f7418)] text-[11px] font-semibold text-[#07111b] disabled:opacity-35" disabled={!selectedReservation}><IconLock size={16}/>Ejecutar Bloque</button>
        </div>
      </section>
    </div>
  );
}
