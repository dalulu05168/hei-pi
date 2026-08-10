interface ClientSectionHeadingProps {
  code: string;
  id: string;
  title: string;
}

export function ClientSectionHeading({ code, id, title }: ClientSectionHeadingProps) {
  return (
    <div className="mb-2.5 flex h-5 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="h-3.5 w-0.5 flex-none rounded-full bg-[var(--pi-color-brand)]"
          aria-hidden="true"
        />
        <h2 id={id} className="truncate text-[12px] font-semibold text-[var(--pi-color-text)]">
          {title}
        </h2>
      </div>
      <span className="font-mono text-[8px] tracking-[0.16em] text-[var(--pi-color-text-faint)]">
        {code}
      </span>
    </div>
  );
}
