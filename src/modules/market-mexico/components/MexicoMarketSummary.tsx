import {
  IconBuildingBank,
  IconChartLine,
  IconDatabaseOff,
  IconFlag3,
  type TablerIcon,
} from "@tabler/icons-react";
import type {
  MarketDataStatus,
  MarketSummaryId,
  MarketSummaryItem,
} from "@/services/market";

interface MexicoMarketSummaryProps {
  dataStatus: MarketDataStatus;
  items: readonly MarketSummaryItem[];
}

const summaryIcons: Partial<Record<MarketSummaryId, TablerIcon>> = {
  market: IconFlag3,
  bmv: IconBuildingBank,
  ipcMexico: IconChartLine,
};

function formatValue(value: number | null) {
  return value === null
    ? "—"
    : new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);
}

export function MexicoMarketSummary({
  dataStatus,
  items,
}: MexicoMarketSummaryProps) {
  return (
    <section aria-labelledby="mexico-market-summary">
      <div className="mb-2 flex h-5 items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-0.5 rounded-full bg-[#4b916c]" aria-hidden="true" />
          <h2 id="mexico-market-summary" className="text-[11px] font-semibold text-[#e6eee9]">
            Resumen del mercado
          </h2>
        </div>
        <span className="font-mono text-[7px] tracking-[0.15em] text-[#506459]">
          01 / MARKET OVERVIEW
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = summaryIcons[item.id] ?? IconChartLine;
          const isMarketCard = item.id === "market";

          return (
            <article
              key={item.id}
              className="h-[92px] rounded-xl border border-[rgba(75,145,108,0.17)] bg-[#08121d] px-3.5 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[7px] font-semibold tracking-[0.14em] text-[#587164]">
                    {isMarketCard ? "MERCADO" : item.code}
                  </p>
                  <h3 className="mt-1 truncate text-[10px] font-medium text-[#afc5b9]">
                    {item.label}
                  </h3>
                </div>
                <span className="grid h-7 w-7 flex-none place-items-center rounded-lg border border-[rgba(75,145,108,0.18)] bg-[rgba(44,112,80,0.14)] text-[#69ad8b]">
                  <Icon size={14} stroke={1.55} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2.5 flex items-end justify-between border-t border-[rgba(75,145,108,0.12)] pt-2">
                <strong className="font-mono text-[15px] font-medium tabular-nums text-[#dce8e1]">
                  {isMarketCard ? "MÉXICO" : formatValue(item.value)}
                </strong>
                <span className="flex items-center gap-1 text-[7px] tracking-[0.1em] text-[#506459]">
                  {dataStatus === "disconnected" ? <IconDatabaseOff size={11} stroke={1.5} aria-hidden="true" /> : null}
                  {item.status === "open" ? "ABIERTO" : item.status === "closed" ? "CERRADO" : "SIN CONEXIÓN"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
