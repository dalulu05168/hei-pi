import {
  IconBuilding,
  IconDatabaseOff,
  IconSearch,
} from "@tabler/icons-react";
import type {
  MarketDataStatus,
  MarketStock,
} from "@/services/market";

interface StockSearchProps {
  dataStatus: MarketDataStatus;
  onQueryChange: (query: string) => void;
  onSelect: (ticker: string) => void;
  query: string;
  results: readonly MarketStock[];
  selectedTicker: string | null;
}

export function StockSearch({
  dataStatus,
  onQueryChange,
  onSelect,
  query,
  results,
  selectedTicker,
}: StockSearchProps) {
  return (
    <section
      aria-labelledby="us-stock-search"
      className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgba(91,141,198,0.17)] bg-[#08121d]"
    >
      <header className="flex h-[46px] flex-none items-center justify-between border-b border-[rgba(91,141,198,0.13)] px-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(91,141,198,0.18)] bg-[rgba(54,103,156,0.12)] text-[#6f9ed0]">
            <IconSearch size={14} stroke={1.65} aria-hidden="true" />
          </span>
          <div>
            <h2 id="us-stock-search" className="text-[10px] font-semibold text-[#e8eef7]">Consulta de acciones</h2>
            <p className="mt-0.5 text-[7px] tracking-[0.09em] text-[#536477]">CÓDIGO O EMPRESA</p>
          </div>
        </div>
        <span className="font-mono text-[7px] tracking-[0.12em] text-[#536477]">02 / SEARCH</span>
      </header>

      <div className="flex-none border-b border-[rgba(91,141,198,0.13)] p-3">
        <label className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.18)] bg-[#070d14] px-3 focus-within:border-[rgba(111,158,208,0.55)]">
          <IconSearch size={14} stroke={1.6} className="text-[#607286]" aria-hidden="true" />
          <span className="sr-only">Buscar código o empresa</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar código o empresa"
            className="min-w-0 flex-1 bg-transparent text-[10px] text-[#dbe6f2] outline-none placeholder:text-[#465568]"
          />
        </label>
      </div>

      <div className="grid h-8 flex-none grid-cols-[78px_minmax(0,1fr)_72px] items-center border-b border-[rgba(91,141,198,0.12)] bg-[#0d1621] px-3 text-[7px] font-semibold tracking-[0.09em] text-[#536477]">
        <span>CÓDIGO</span>
        <span>EMPRESA</span>
        <span>MERCADO</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {results.length > 0 ? (
          <ul className="divide-y divide-[rgba(91,141,198,0.1)]">
            {results.map((stock) => {
              const selected = selectedTicker === stock.ticker;
              return (
                <li key={`${stock.market}-${stock.ticker}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(stock.ticker)}
                    className={`grid h-11 w-full grid-cols-[78px_minmax(0,1fr)_72px] items-center px-3 text-left ${
                      selected ? "bg-[rgba(54,103,156,0.16)]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <strong className="font-mono text-[9px] text-[#8fb9e5]">{stock.ticker}</strong>
                    <span className="truncate pr-2 text-[9px] text-[#b8c7d8]">{stock.companyName}</span>
                    <span className="text-[8px] text-[#607286]">{stock.market}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid h-full min-h-[220px] place-items-center p-5 text-center">
            <div className="max-w-[250px]">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-[rgba(91,141,198,0.18)] bg-[rgba(54,103,156,0.1)] text-[#5b8dc6]">
                {dataStatus === "disconnected" ? (
                  <IconDatabaseOff size={19} stroke={1.5} aria-hidden="true" />
                ) : (
                  <IconBuilding size={19} stroke={1.5} aria-hidden="true" />
                )}
              </span>
              <h3 className="mt-3 text-[10px] font-medium text-[#dbe6f2]">
                {dataStatus === "disconnected"
                  ? "Directorio bursátil sin conectar"
                  : query
                    ? "Sin coincidencias"
                    : "Sin instrumentos disponibles"}
              </h3>
              <p className="mt-1.5 text-[8px] leading-4 text-[#536477]">
                {dataStatus === "disconnected"
                  ? "La búsqueda se habilitará desde la fuente institucional de mercado."
                  : "Revise el código o el nombre de la empresa."}
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="flex h-8 flex-none items-center justify-between border-t border-[rgba(91,141,198,0.12)] bg-[#0d1621] px-3">
        <span className="text-[7px] tracking-[0.1em] text-[#536477]">RESULTADOS DE MERCADO</span>
        <span className="font-mono text-[8px] text-[#607286]">{dataStatus === "disconnected" ? "—" : results.length}</span>
      </footer>
    </section>
  );
}
