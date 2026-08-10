import Link from "next/link";
import { IconArrowUpRight, type TablerIcon } from "@tabler/icons-react";

interface BusinessModuleCardProps {
  description: string;
  href: string;
  icon: TablerIcon;
  title: string;
}

export function BusinessModuleCard({
  description,
  href,
  icon: Icon,
  title,
}: BusinessModuleCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[146px] min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--pi-color-border)] bg-[var(--pi-color-surface)] p-3.5 shadow-[0_16px_38px_rgba(0,0,0,0.2)] transition-colors duration-150 hover:border-[rgba(244,196,48,0.38)] hover:bg-[var(--pi-color-surface-raised)]"
      aria-label={`Abrir ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(244,196,48,0.22)] bg-[var(--pi-color-brand-soft)] text-[var(--pi-color-brand)]">
          <Icon size={16} stroke={1.55} aria-hidden="true" />
        </div>
        <IconArrowUpRight
          size={15}
          stroke={1.55}
          className="text-[var(--pi-color-text-faint)] transition-colors duration-150 group-hover:text-[var(--pi-color-brand)]"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 min-w-0">
        <p className="text-[8px] font-semibold tracking-[0.16em] text-[var(--pi-color-brand)]">
          ACCESO DIRECTO
        </p>
        <h3 className="mt-1.5 truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--pi-color-text)]">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[var(--pi-color-text-muted)]">
          {description}
        </p>
      </div>

      <div className="mt-auto border-t border-[var(--pi-color-border)] pt-2.5 text-[8px] font-medium tracking-[0.12em] text-[var(--pi-color-text-faint)]">
        ABRIR MÓDULO
      </div>
    </Link>
  );
}
