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
        <div className="flex items-center justify-between border-b border-[var(--pi-color-border)] bg-white/[0.012] px-4 py-3">
          <div className="text-[13px] font-semibold text-[var(--pi-color-text)]">
            {title}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
