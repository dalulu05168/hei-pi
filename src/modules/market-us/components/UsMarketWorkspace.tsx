"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconArrowsExchange,
  IconBriefcase,
  IconLink,
} from "@tabler/icons-react";
import type {
  CandlestickRange,
  UsMarketSnapshot,
} from "@/services/market";
import { CandlestickChart } from "./CandlestickChart";
import { MarketHeader } from "./MarketHeader";
import { MarketSummary } from "./MarketSummary";
import { StockInfoCard } from "./StockInfoCard";
import { StockSearch } from "./StockSearch";

interface UsMarketWorkspaceProps {
  snapshot: UsMarketSnapshot;
}

export function UsMarketWorkspace({ snapshot }: UsMarketWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<CandlestickRange>("1D");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(() =>
    snapshot.stocks.find((stock) => (snapshot.candles[stock.ticker]?.["1D"]?.length ?? 0) > 0)?.ticker ??
    snapshot.stocks[0]?.ticker ??
    null,
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleUpperCase("es-MX");
    if (!normalized) return snapshot.stocks;
    return snapshot.stocks.filter(
      (stock) =>
        stock.ticker.toLocaleUpperCase("es-MX").includes(normalized) ||
        stock.companyName.toLocaleUpperCase("es-MX").includes(normalized),
    );
  }, [query, snapshot.stocks]);

  const quote = selectedTicker ? snapshot.quotes[selectedTicker] ?? null : null;
  const candles = selectedTicker ? snapshot.candles[selectedTicker]?.[range] ?? [] : [];

  return (
    <div className="grid h-full min-h-0 grid-rows-[58px_auto_minmax(0,1fr)_58px] gap-3 overflow-hidden text-[#dbe6f2]">
      <MarketHeader dataStatus={snapshot.dataStatus} lastUpdatedAt={snapshot.lastUpdatedAt} />
      <MarketSummary dataStatus={snapshot.dataStatus} items={snapshot.summary} />

      <div className="grid min-h-0 grid-cols-[330px_minmax(0,1fr)] gap-3">
        <StockSearch
          dataStatus={snapshot.dataStatus}
          onQueryChange={setQuery}
          onSelect={setSelectedTicker}
          query={query}
          results={results}
          selectedTicker={selectedTicker}
        />

        <div className="grid min-h-0 grid-rows-[175px_minmax(0,1fr)] gap-3">
          <StockInfoCard dataStatus={snapshot.dataStatus} quote={quote} />
          <CandlestickChart
            candles={candles}
            dataStatus={snapshot.dataStatus}
            onRangeChange={setRange}
            range={range}
            ticker={selectedTicker}
          />
        </div>
      </div>

      <nav
        aria-label="Relaciones rápidas del mercado"
        className="flex items-center justify-between rounded-xl border border-[rgba(91,141,198,0.17)] bg-[#08121d] px-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-[rgba(91,141,198,0.18)] bg-[rgba(54,103,156,0.12)] text-[#6f9ed0]">
            <IconLink size={16} stroke={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold text-[#dbe6f2]">Relación operativa</p>
            <p className="mt-1 truncate text-[7px] tracking-[0.08em] text-[#536477]">
              CONSULTE OPERACIONES O POSICIONES SIN CREAR UNA ORDEN DESDE MERCADO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/trading"
            className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.2)] bg-[#102131] px-3 text-[9px] font-medium text-[#9bc4ef] hover:border-[rgba(111,158,208,0.5)]"
          >
            <IconArrowsExchange size={14} stroke={1.65} aria-hidden="true" />
            Ver operaciones
            <IconArrowUpRight size={12} stroke={1.6} aria-hidden="true" />
          </Link>
          <Link
            href="/trading?view=sell"
            className="flex h-9 items-center gap-2 rounded-lg border border-[rgba(91,141,198,0.2)] px-3 text-[9px] font-medium text-[#8ca0b6] hover:bg-[#102131] hover:text-[#c8d7e7]"
          >
            <IconBriefcase size={14} stroke={1.65} aria-hidden="true" />
            Ver posiciones para venta
            <IconArrowUpRight size={12} stroke={1.6} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
