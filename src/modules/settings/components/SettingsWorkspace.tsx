"use client";

import { useState } from "react";
import {
  IconApi,
  IconBell,
  IconDatabaseOff,
  IconFileSearch,
  IconLock,
  IconSettings,
  type TablerIcon,
} from "@tabler/icons-react";

type SettingsSection = "general" | "security" | "api" | "notifications" | "audit";

const sections: { id: SettingsSection; label: string; subtitle: string; icon: TablerIcon }[] = [
  { id: "general", label: "常规设置", subtitle: "区域、语言与币种", icon: IconSettings },
  { id: "security", label: "安全策略", subtitle: "认证与访问控制", icon: IconLock },
  { id: "api", label: "接口权限", subtitle: "数据服务授权", icon: IconApi },
  { id: "notifications", label: "通知管理", subtitle: "风险与订单通知", icon: IconBell },
  { id: "audit", label: "审计记录", subtitle: "访问与配置留痕", icon: IconFileSearch },
];

const sectionCopy: Record<SettingsSection, { title: string; description: string; fields: string[] }> = {
  general: { title: "常规设置", description: "系统运行区域、语言与显示标准。", fields: ["时区", "系统语言", "报表币种"] },
  security: { title: "机构安全策略", description: "登录认证与内部访问安全策略。", fields: ["双重身份认证", "会话有效期", "密码策略"] },
  api: { title: "接口权限", description: "外部数据服务的访问授权与凭据。", fields: ["行情服务", "交易服务", "访问密钥"] },
  notifications: { title: "通知管理", description: "运行、风险与订单状态通知。", fields: ["风险提醒", "交易状态", "通知渠道"] },
  audit: { title: "审计记录", description: "系统访问与配置变更记录。", fields: ["访问记录", "配置变更", "审计保留期限"] },
};

export function SettingsWorkspace() {
  const [active, setActive] = useState<SettingsSection>("general");
  const current = sectionCopy[active];

  return (
    <div className="grid h-full min-h-0 grid-cols-[210px_minmax(0,1fr)] gap-3 overflow-hidden">
      <aside className="terminal-panel p-2" aria-label="系统设置分类">
        <div className="border-b border-[var(--pi-color-border)] px-3 py-3">
          <p className="terminal-kicker">系统控制</p>
          <h2 className="mt-1.5 text-[13px] font-semibold text-[var(--pi-color-text)]">系统设置中心</h2>
        </div>
        <nav className="mt-2 space-y-1">
          {sections.map(({ id, icon: Icon, label, subtitle }) => {
            const selected = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-3 rounded-[5px] border px-3 py-2.5 text-left transition-colors ${selected ? "border-[var(--pi-color-border-strong)] bg-white/[0.055]" : "border-transparent hover:border-[var(--pi-color-border)] hover:bg-white/[0.025]"}`}
              >
                <Icon size={16} stroke={1.55} className={selected ? "text-[var(--pi-color-brand)]" : "text-[var(--pi-color-text-faint)]"} aria-hidden="true" />
                <span>
                  <strong className="block text-[10px] font-medium text-[var(--pi-color-text)]">{label}</strong>
                  <small className="mt-0.5 block text-[8px] text-[var(--pi-color-text-faint)]">{subtitle}</small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="terminal-panel flex min-h-0 flex-col">
        <header className="flex h-[72px] flex-none items-center justify-between border-b border-[var(--pi-color-border)] px-5">
          <div>
            <p className="terminal-kicker">系统设置</p>
            <h1 className="mt-1.5 text-[16px] font-semibold text-[var(--pi-color-text)]">{current.title}</h1>
            <p className="mt-1 text-[9px] text-[var(--pi-color-text-muted)]">{current.description}</p>
          </div>
          <span className="flex items-center gap-2 rounded-[5px] border border-[var(--pi-color-border)] bg-white/[0.02] px-3 py-2 text-[8px] text-[var(--pi-color-text-faint)]">
            <IconDatabaseOff size={13} stroke={1.5} aria-hidden="true" />
            配置服务未连接
          </span>
        </header>

        <div className="terminal-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            {current.fields.map((field, index) => (
              <article key={field} className="rounded-[5px] border border-[var(--pi-color-border)] bg-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium text-[var(--pi-color-text)]">{field}</p>
                    <p className="mt-1 text-[8px] text-[var(--pi-color-text-faint)]">等待系统配置数据源</p>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="relative h-5 w-9 cursor-not-allowed rounded-full border border-[var(--pi-color-border)] bg-[#07111d] opacity-70"
                    aria-label={`${field} 未连接`}
                  >
                    <span className="absolute top-[3px] left-[3px] h-3 w-3 rounded-full bg-[var(--pi-color-text-faint)]" />
                  </button>
                </div>
                {index === current.fields.length - 1 ? (
                  <div className="mt-3 flex h-9 items-center rounded-[5px] border border-[var(--pi-color-border)] bg-[var(--pi-control-background)] px-3 font-mono text-[9px] text-[var(--pi-color-text-faint)]">—</div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="terminal-empty-grid mt-3 grid min-h-[220px] place-items-center rounded-[5px] border border-[var(--pi-color-border)] text-center">
            <div>
              <IconDatabaseOff size={24} stroke={1.35} className="mx-auto text-[var(--pi-color-text-faint)]" aria-hidden="true" />
              <p className="mt-2 text-[10px] font-medium text-[var(--pi-color-text-muted)]">暂无可用配置数据</p>
              <p className="mt-1 text-[8px] text-[var(--pi-color-text-faint)]">连接配置服务后显示机构级控制项</p>
            </div>
          </div>
        </div>

        <footer className="flex h-[58px] flex-none items-center justify-end gap-2 border-t border-[var(--pi-color-border)] px-5">
          <button type="button" disabled className="h-9 rounded-[5px] border border-[var(--pi-color-border)] px-4 text-[9px] text-[var(--pi-color-text-faint)] opacity-50">恢复默认值</button>
          <button type="button" disabled className="h-9 rounded-[5px] border border-[rgba(244,196,48,0.25)] bg-[rgba(244,196,48,0.08)] px-4 text-[9px] font-semibold text-[var(--pi-color-brand)] opacity-50">保存更改</button>
        </footer>
      </section>
    </div>
  );
}
