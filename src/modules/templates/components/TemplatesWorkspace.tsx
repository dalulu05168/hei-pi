"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { IconEdit, IconPhoto, IconSearch } from "@tabler/icons-react";
import type { TemplateLibrarySnapshot, TemplateProject } from "@/services/templates";
import { TemplateImageEditor } from "./TemplateImageEditor";

const typeLabels: Record<string, string> = {
  buy: "买入信号",
  sell: "卖出信号",
  "vip-ticket": "VIP票",
  "regular-ticket": "常规单票",
  "dual-ticket": "双票",
};

export function TemplatesWorkspace({ snapshot }: { snapshot: TemplateLibrarySnapshot }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TemplateProject | null>(null);
  const templates = useMemo(() => snapshot.templates.filter((template) => template.name.toLowerCase().includes(query.toLowerCase())), [query, snapshot.templates]);

  if (editing) return <TemplateImageEditor template={editing} onBack={() => setEditing(null)} />;

  return (
    <div className="grid h-full min-h-0 grid-rows-[74px_48px_minmax(0,1fr)] gap-3 overflow-hidden">
      <section className="grid grid-cols-4 gap-3">
        {[["模板总数", snapshot.summary.totalTemplates], ["已接入原图", snapshot.templates.filter((item) => item.previewSourceUrl).length], ["输出规格", "3840 × 2160"], ["编辑方式", "原位文字替换"]].map(([label, value]) => <article key={String(label)} className="border border-[#294b68] bg-[#071c2e] px-4 py-3"><p className="text-[9px] tracking-[.12em] text-[#8198ab]">{label}</p><p className="mt-2 font-mono text-[18px] text-[#d7e0e6]">{value ?? "—"}</p></article>)}
      </section>

      <section className="flex items-center gap-3 border border-[#294b68] bg-[#071c2e] px-4">
        <IconSearch size={16} className="text-[#8299ad]"/><input className="h-9 flex-1 bg-transparent text-[12px] text-[#d8e0e6] outline-none" placeholder="搜索上传的模板" value={query} onChange={(event) => setQuery(event.target.value)}/><span className="text-[9px] tracking-[.12em] text-[#6f879c]">使用原始 PNG · 不重新绘制</span>
      </section>

      <section className="grid min-h-0 grid-cols-3 grid-rows-2 gap-3 overflow-hidden">
        {templates.map((template) => (
          <button key={template.id} type="button" onClick={() => setEditing(template)} className="group grid min-h-0 grid-rows-[minmax(0,1fr)_56px] overflow-hidden border border-[#294b68] bg-[#071c2e] text-left transition-colors hover:border-[#a67b19]">
            <div className="relative min-h-0 overflow-hidden bg-white">{template.previewSourceUrl ? <Image src={template.previewSourceUrl} alt={template.name} fill unoptimized className="object-contain" sizes="32vw" /> : <div className="grid h-full place-items-center text-[#71899c]"><IconPhoto size={24}/></div>}</div>
            <div className="flex items-center justify-between border-t border-[#294b68] px-4"><div><h3 className="text-[13px] text-[#d7e0e6]">{template.name}</h3><p className="mt-1 text-[8px] tracking-[.12em] text-[#71899c]">{typeLabels[template.templateType] ?? template.templateType} · 6688px 原图</p></div><span className="inline-flex items-center gap-2 text-[10px] text-[#efbd35]"><IconEdit size={14}/>编辑原图文字</span></div>
          </button>
        ))}
        {templates.length === 0 ? <div className="col-span-3 row-span-2 grid place-items-center border border-[#294b68] bg-[#071c2e] text-[12px] text-[#8299ad]">没有匹配的模板</div> : null}
      </section>
    </div>
  );
}
