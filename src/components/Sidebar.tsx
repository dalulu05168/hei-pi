"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowsExchange, IconBuildingBank, IconChevronLeft, IconLayoutDashboard, IconMenu2, IconSettings, IconTemplate, IconUsersGroup, IconWorldDollar, type TablerIcon } from "@tabler/icons-react";
import type { NavigationItem } from "@/types";

type NavItem = NavigationItem & { icon: TablerIcon };
interface SidebarProps { expanded: boolean; onToggle: () => void; }

const items: NavItem[] = [
  { href: "/dashboard", label: "总览大盘", icon: IconLayoutDashboard },
  { href: "/market", label: "Mercados", icon: IconWorldDollar },
  { href: "/clients", label: "人物中心", icon: IconUsersGroup },
  { href: "/trading", label: "交易中心", icon: IconArrowsExchange },
  { href: "/institutional", label: "Operaciones en Bloque", icon: IconBuildingBank },
  { href: "/templates", label: "报表与模板", icon: IconTemplate },
  { href: "/settings", label: "系统设置", icon: IconSettings },
];

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="主导航" className={`absolute top-0 left-[178px] z-50 flex h-[68px] items-center transition-all duration-200 ${expanded ? "right-[420px]" : "right-auto"}`}>
      <button type="button" onClick={onToggle} className="mr-2 grid h-9 w-9 flex-none place-items-center border border-[var(--pi-color-border)] bg-[#071724] text-[var(--pi-color-text-muted)] hover:border-[var(--pi-color-brand)] hover:text-[var(--pi-color-brand)]" aria-label={expanded ? "隐藏导航" : "展开导航"} title={expanded ? "隐藏导航" : "展开导航"}>
        {expanded ? <IconChevronLeft size={17}/> : <IconMenu2 size={18}/>} 
      </button>
      <div className={`h-full min-w-0 items-center gap-0.5 overflow-hidden ${expanded ? "flex" : "hidden"}`}>
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex h-full items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[10px] font-medium transition-colors ${active ? "border-[var(--pi-color-brand)] text-[var(--pi-color-brand)]" : "border-transparent text-[var(--pi-color-text-muted)] hover:border-[rgba(244,196,48,.34)] hover:text-[var(--pi-color-text)]"}`}>
              <Icon size={15} stroke={1.65} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
