import Link from "next/link";
import {
  IconArrowDownRight,
  IconDatabaseOff,
  IconEye,
} from "@tabler/icons-react";
import type { BusinessDataStatus } from "@/types";
import { createVentaHref } from "../data";
import type { PortfolioPosition } from "../types";

interface HoldingTableProps {
  dataStatus: BusinessDataStatus;
  hasActiveFilters: boolean;
  onViewDetails: (position: PortfolioPosition) => void;
  positions: readonly PortfolioPosition[];
}

function formatNumber(value: number | null) {
  return value === null
    ? "—"
    : new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);
}

function formatMoney(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function marketLabel(market: PortfolioPosition["market"]) {
  if (market === "US") return "EE.UU.";
  if (market === "MX") return "México";
  return "—";
}

const headers = [
  "CÓDIGO",
  "NOMBRE",
  "MERCADO",
  "CANTIDAD",
  "COSTO",
  "PRECIO ACTUAL",
  "VALOR",
  "P/G",
  "RATIO P/G",
  "DÍAS",
  "ACCIONES",
];

export function HoldingTable({
  dataStatus,
  hasActiveFilters,
  onViewDetails,
  positions,
}: HoldingTableProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="h-full w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0b1622]">
          <tr className="h-9 border-b border-[var(--pi-color-border)]">
            {headers.map((header, index) => (
              <th
                key={header}
                scope="col"
                className={`px-2.5 text-left text-[7px] font-semibold tracking-[0.1em] text-[var(--pi-color-text-faint)] ${
                  index === 1 ? "w-[13%]" : index === 10 ? "w-[13%]" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 ? (
            positions.map((position) => {
              const negative = position.profitLoss !== null && position.profitLoss < 0;

              return (
                <tr key={position.id} className="h-12 border-b border-[var(--pi-color-border)] bg-[#08121d] hover:bg-[#0b1622]">
                  <td className="px-2.5 font-mono text-[9px] font-semibold text-[#f4c430]">{position.ticker}</td>
                  <td className="truncate px-2.5 text-[9px] text-[var(--pi-color-text)]">{position.name}</td>
                  <td className="px-2.5 text-[8px] text-[var(--pi-color-text-muted)]">{marketLabel(position.market)}</td>
                  <td className="px-2.5 font-mono text-[8px] text-[var(--pi-color-text)]">{formatNumber(position.quantity)}</td>
                  <td className="px-2.5 font-mono text-[8px] text-[var(--pi-color-text-muted)]">{formatMoney(position.averageCost)}</td>
                  <td className="px-2.5 font-mono text-[8px] text-[var(--pi-color-text)]">{formatMoney(position.currentPrice)}</td>
                  <td className="px-2.5 font-mono text-[8px] text-[var(--pi-color-text)]">{formatMoney(position.marketValue)}</td>
                  <td className={`px-2.5 font-mono text-[8px] ${negative ? "text-[#ef6666]" : "text-[#4fc98a]"}`}>{formatMoney(position.profitLoss)}</td>
                  <td className={`px-2.5 font-mono text-[8px] ${negative ? "text-[#ef6666]" : "text-[#4fc98a]"}`}>{position.profitLossRatio === null ? "—" : `${formatNumber(position.profitLossRatio)}%`}</td>
                  <td className="px-2.5 font-mono text-[8px] text-[var(--pi-color-text-muted)]">{formatNumber(position.holdingDays)}</td>
                  <td className="px-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(position)}
                        className="flex h-7 items-center gap-1 rounded-md border border-[var(--pi-color-border)] px-2 text-[8px] text-[var(--pi-color-text-muted)] hover:text-[var(--pi-color-text)]"
                      >
                        <IconEye size={12} stroke={1.7} aria-hidden="true" />
                        Detalle
                      </button>
                      <Link
                        href={createVentaHref(position)}
                        className="flex h-7 items-center gap-1 rounded-md border border-[rgba(244,196,48,0.28)] bg-[var(--pi-color-brand-soft)] px-2 text-[8px] font-medium text-[#e5c36e]"
                      >
                        <IconArrowDownRight size={12} stroke={1.8} aria-hidden="true" />
                        Venta
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.length} className="h-full bg-[#08121d]">
                <div className="grid min-h-[210px] place-items-center p-5 text-center">
                  <div className="max-w-[410px]">
                    <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-[rgba(244,196,48,0.2)] bg-[var(--pi-color-brand-soft)] text-[#9f7e32]">
                      <IconDatabaseOff size={20} stroke={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-[10px] font-medium text-[var(--pi-color-text)]">
                      {dataStatus === "disconnected"
                        ? "Posiciones sin fuente conectada"
                        : hasActiveFilters
                          ? "Sin posiciones para los filtros actuales"
                          : "Sin posiciones registradas"}
                    </h3>
                    <p className="mt-1.5 text-[8px] leading-4 text-[var(--pi-color-text-faint)]">
                      {dataStatus === "disconnected"
                        ? "La tabla se completará desde las posiciones reales vinculadas a Centro de Clientes."
                        : "Ajuste los filtros o revise la fuente operativa vigente."}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
