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
        <div className="mb-4 flex min-h-[72px] items-start justify-between gap-6 border-b border-[var(--pi-color-border)] pb-4">
          <div className="min-w-0">
            <p className="mb-2 text-[9.5px] font-semibold leading-none tracking-[0.16em] text-[var(--pi-color-brand)]">
              PI FINANCIAL OPERATIONS
            </p>
            <h1 className="text-[25px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--pi-color-text)]">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-[980px] text-[13px] leading-5 text-[var(--pi-color-text-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : (
        <h1 className="sr-only">{title}</h1>
      )}
      {children}
    </section>
  );
}
