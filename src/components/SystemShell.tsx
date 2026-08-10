"use client";

import { useState, type PropsWithChildren } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function SystemShell({ children }: PropsWithChildren) {
  const [navigationVisible, setNavigationVisible] = useState(true);
  return (
    <div className="relative grid h-screen min-w-[1280px] grid-rows-[68px_minmax(0,1fr)] overflow-hidden bg-[var(--pi-color-canvas)] [background-image:linear-gradient(rgba(149,184,211,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(149,184,211,0.025)_1px,transparent_1px)] [background-size:48px_48px]">
      <Header />
      <Sidebar expanded={navigationVisible} onToggle={() => setNavigationVisible((value) => !value)} />
      <main className="actinver-terminal min-h-0 overflow-hidden px-5 py-3">
        {children}
      </main>
    </div>
  );
}
