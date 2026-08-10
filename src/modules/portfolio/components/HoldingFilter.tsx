import { IconRefresh, IconSearch } from "@tabler/icons-react";
import type { HoldingFilterState } from "../types";

interface HoldingFilterProps {
  filters: HoldingFilterState;
  onChange: (filters: HoldingFilterState) => void;
  onReset: () => void;
}

export function HoldingFilter({ filters, onChange, onReset }: HoldingFilterProps) {
  return (
    <div className="flex h-[54px] items-center gap-2.5 border-b border-[var(--pi-color-border)] bg-[#08121d] px-3.5">
      <div className="grid h-8 grid-cols-3 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] p-0.5">
        {([
          ["all", "Todos"],
          ["US", "EE.UU."],
          ["MX", "México"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filters.market === value}
            onClick={() => onChange({ ...filters, market: value })}
            className={`min-w-[70px] rounded-md px-2 text-[9px] font-medium ${
              filters.market === value
                ? "border border-[rgba(244,196,48,0.3)] bg-[var(--pi-color-brand-soft)] text-[#e5c36e]"
                : "text-[var(--pi-color-text-muted)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="flex h-8 min-w-[270px] max-w-[390px] flex-1 items-center gap-2 rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5 focus-within:border-[rgba(244,196,48,0.4)]">
        <IconSearch size={14} stroke={1.65} className="text-[var(--pi-color-text-faint)]" aria-hidden="true" />
        <span className="sr-only">Buscar ticker</span>
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value.toUpperCase() })}
          placeholder="Buscar ticker"
          className="min-w-0 flex-1 bg-transparent font-mono text-[10px] uppercase text-[var(--pi-color-text)] outline-none placeholder:normal-case placeholder:text-[var(--pi-color-text-faint)]"
        />
      </label>

      <label className="flex h-8 min-w-[176px] items-center rounded-lg border border-[var(--pi-color-border)] bg-[#08121d] px-2.5">
        <span className="sr-only">Estado de P/G</span>
        <select
          value={filters.profit}
          onChange={(event) =>
            onChange({
              ...filters,
              profit: event.target.value as HoldingFilterState["profit"],
            })
          }
          className="w-full bg-transparent text-[9px] text-[var(--pi-color-text-muted)] outline-none"
        >
          <option value="all">Todos los resultados</option>
          <option value="gain">Con ganancia</option>
          <option value="loss">Con pérdida</option>
          <option value="flat">Sin variación</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto flex h-8 items-center gap-1.5 rounded-lg border border-[var(--pi-color-border)] px-2.5 text-[9px] text-[var(--pi-color-text-muted)] hover:border-[rgba(244,196,48,0.28)] hover:text-[#e5c36e]"
      >
        <IconRefresh size={13} stroke={1.7} aria-hidden="true" />
        Restablecer
      </button>
    </div>
  );
}
