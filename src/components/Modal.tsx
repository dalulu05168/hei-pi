"use client";

import { useEffect, useId, type PropsWithChildren, type ReactNode } from "react";

interface ModalProps extends PropsWithChildren {
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({
  children,
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl border border-[var(--pi-color-border-strong)] bg-[var(--pi-color-surface-raised)] shadow-[0_28px_90px_rgba(0,0,0,0.62)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--pi-color-border)] px-4 py-3">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-transparent px-2 py-1 text-sm text-[var(--pi-color-text-muted)] hover:border-[var(--pi-color-border)] hover:bg-white/[0.035] hover:text-[var(--pi-color-text)]"
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer ? (
          <div className="border-t border-[var(--pi-color-border)] px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
