import Link from "next/link";
import {
  IconArrowUpRight,
  IconDatabaseOff,
  type TablerIcon,
} from "@tabler/icons-react";

export interface MarketTickerItem {
  code: string;
  href?: string;
  icon: TablerIcon;
  label: string;
  market: string;
}

interface MarketTickerProps {
  items: MarketTickerItem[];
}

export function MarketTicker({ items }: MarketTickerProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] shadow-[0_16px_38px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-4 divide-x divide-[var(--pi-color-border)]">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-white/[0.04] bg-white/[0.025] text-[var(--pi-color-brand)]">
                    <Icon size={16} stroke={1.55} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-[var(--pi-color-text)]">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-[8px] tracking-[0.11em] text-[var(--pi-color-text-faint)]">
                      {item.code} · {item.market.toUpperCase()}
                    </p>
                  </div>
                </div>
                {item.href ? (
                  <IconArrowUpRight
                    size={14}
                    stroke={1.5}
                    className="flex-none text-[var(--pi-color-text-faint)]"
                    aria-hidden="true"
                  />
                ) : null}
              </div>

              <div className="mt-3 flex items-end justify-between gap-3 border-t border-[var(--pi-color-border)] pt-3">
                <span className="font-mono text-[21px] leading-none tabular-nums text-[var(--pi-color-text-muted)]">
                  —
                </span>
                <span className="flex items-center gap-1.5 text-[8px] tracking-[0.1em] text-[var(--pi-color-text-faint)]">
                  <IconDatabaseOff size={12} stroke={1.5} aria-hidden="true" />
                  SIN CONEXIÓN
                </span>
              </div>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="min-w-0 px-4 py-3.5 transition-colors duration-150 hover:bg-white/[0.025]"
                aria-label={`Abrir ${item.label}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <article key={item.label} className="min-w-0 px-4 py-3.5">
              {content}
            </article>
          );
        })}
      </div>
    </div>
  );
}
