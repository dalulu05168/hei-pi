import type { PropsWithChildren, ReactNode } from "react";

interface PageContainerProps extends PropsWithChildren {
  actions?: ReactNode;
  className?: string;
  description?: string;
  showHeader?: boolean;
  title: string;
}

export function PageContainer({
  actions,
  children,
  className = "",
  description,
  showHeader = true,
  title,
}: PageContainerProps) {
  return (
    <section className={`mx-auto h-full w-full max-w-none ${className}`.trim()}>
      {showHeader ? (
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--pi-color-border)] pb-5">
          <div>
            <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-[var(--pi-color-brand)]">
              PI FINANCIAL OPERATIONS
            </p>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--pi-color-text)]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1.5 text-[12px] text-[var(--pi-color-text-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : (
        <h1 className="sr-only">{title}</h1>
      )}
      {children}
    </section>
  );
}
