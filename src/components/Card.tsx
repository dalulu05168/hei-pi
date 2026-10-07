import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  actions?: ReactNode;
  title?: ReactNode;
}

export function Card({
  actions,
  children,
  className = "",
  title,
  ...props
}: CardProps) {
  return (
    <div
      className={`terminal-panel terminal-card ${className}`.trim()}
      {...props}
    >
      {title || actions ? (
        <div className="flex min-h-[52px] items-center justify-between gap-4 border-b border-[var(--pi-color-border)] bg-white/[0.012] px-5 py-3.5">
          <div className="min-w-0 text-[13px] font-semibold leading-[1.35] text-[var(--pi-color-text)]">
            {title}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}
