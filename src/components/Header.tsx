"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconActivity, IconClock, IconLogout, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { BrandLogo } from "@/components/BrandLogo";

function cdmxTime() {
  return new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/Mexico_City" }).format(new Date());
}

export function Header() {
  const { logout, status, user } = useAuth();
  const [currentTime, setCurrentTime] = useState("--:--:--");
  useEffect(() => {
    setCurrentTime(cdmxTime());
    const timer = window.setInterval(() => setCurrentTime(cdmxTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="relative z-40 flex h-[68px] min-w-0 items-center border-b border-[var(--pi-color-border)] bg-[var(--pi-color-header)] px-6 backdrop-blur-xl">
      <BrandLogo variant="actinver" priority className="h-auto max-h-[34px] w-[132px] flex-none object-contain" />
      <div className="ml-auto flex items-center gap-4">
        <div className="flex h-9 items-center gap-2.5 border-r border-[var(--pi-color-border)] pr-4" aria-label="Estado del sistema: operación normal">
          <IconActivity size={15} stroke={1.6} className="text-[#48d68a]" />
          <span><small className="block text-[8px] tracking-[0.14em] text-[var(--pi-color-text-faint)]">SISTEMA</small><strong className="mt-0.5 block text-[10px] font-medium text-[#70dba4]">Operación normal</strong></span>
        </div>
        <div className="flex h-9 items-center gap-2.5 border-r border-[var(--pi-color-border)] pr-4">
          <IconClock size={16} stroke={1.6} className="text-[var(--pi-color-text-muted)]" />
          <span><small className="block text-[8px] tracking-[0.14em] text-[var(--pi-color-text-faint)]">CDMX</small><time className="mt-0.5 block text-[11px] tabular-nums text-[var(--pi-color-text)]">{currentTime}</time></span>
        </div>
        <div className="flex h-9 items-center gap-2 text-[var(--pi-color-text-muted)]" aria-label="Perfil institucional">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--pi-color-border-strong)] bg-[#173047] text-[#cbd9e3]"><IconUserCircle size={20} stroke={1.55} /></span>
          <span className="max-w-28 truncate text-[11px] font-medium">{status === "loading" ? "Verificando" : (user?.username || "ZZL1122")}</span>
        </div>
        <Link href="/settings" className="grid h-9 w-9 place-items-center rounded-[3px] border border-[var(--pi-color-border)] text-[var(--pi-color-text-muted)] hover:border-[var(--pi-color-brand)] hover:text-[var(--pi-color-brand)]" aria-label="Configuración"><IconSettings size={17} stroke={1.55} /></Link>
        <button type="button" onClick={() => void logout()} className="grid h-9 w-9 place-items-center rounded-[3px] border border-[var(--pi-color-border)] text-[var(--pi-color-text-muted)] hover:border-[var(--pi-color-border-strong)] hover:text-[#e4edf3]" aria-label="Cerrar sesión"><IconLogout size={18} stroke={1.55} /></button>
      </div>
    </header>
  );
}
