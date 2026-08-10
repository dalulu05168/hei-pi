"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { IconArrowLeft, IconDownload, IconPlus, IconRefresh, IconDeviceFloppy } from "@tabler/icons-react";
import type { TemplateProject } from "@/services/templates";

type TextAlign = "left" | "center" | "right";

interface TextLayer {
  align: TextAlign;
  background: string;
  color: string;
  fontFamily: "Arial" | "Georgia";
  fontSize: number;
  fontWeight: 500 | 700;
  h: number;
  id: string;
  label: string;
  text: string;
  w: number;
  x: number;
  y: number;
}

const t = (id: string, label: string, text: string, x: number, y: number, w: number, h: number, fontSize: number, color: string, fontWeight: 500 | 700 = 700, fontFamily: "Arial" | "Georgia" = "Arial", align: TextAlign = "center"): TextLayer => ({ align, background: "#ffffff", color, fontFamily, fontSize, fontWeight, h, id, label, text, w, x, y });

const PRESETS: Record<string, TextLayer[]> = {
  buy: [
    t("title-a", "主标题前半", "SEÑAL DE", 3.1, 11.6, 28.2, 11.2, 430, "#06294c", 700, "Arial", "left"),
    t("title-b", "主标题强调词", "COMPRA", 30.8, 11.6, 26, 11.2, 430, "#e6a500", 700, "Arial", "left"),
    t("subtitle", "副标题", "Información para tomar mejores decisiones.", 3.1, 23.4, 46, 5.5, 105, "#102b55", 500, "Arial", "left"),
    t("action", "股票代码标题", "ACCIÓN / CÓDIGO", 8.4, 32.2, 16, 4.4, 72, "#102b55"),
    t("current-price", "当前价格标题", "PRECIO ACTUAL", 28.4, 32.2, 16, 4.4, 72, "#102b55"),
    t("institutional-price", "机构价格标题", "PRECIO INSTITUCIONAL", 49.8, 32.2, 20, 4.4, 72, "#102b55"),
    t("potential", "预计潜力标题", "POTENCIAL ESTIMADO", 75.3, 24.8, 19, 5, 72, "#102b55"),
    t("horizon", "建议周期标题", "HORIZONTE SUGERIDO", 75.3, 55.8, 19, 5, 72, "#102b55"),
    t("reminder", "提醒内容", "Compre inmediatamente según la estrategia de trading", 17.2, 84.5, 55, 5, 72, "#102b55", 500, "Arial", "left"),
    t("benefit", "收益标题", "Beneficio proyectado:", 8.3, 90.6, 16, 4, 68, "#102b55", 700, "Arial", "left"),
  ],
  sell: [
    t("title-a", "主标题前半", "SEÑAL DE", 3.1, 11.6, 28.2, 11.2, 430, "#06294c", 700, "Arial", "left"),
    t("title-b", "主标题强调词", "VENTA", 29.5, 11.6, 22, 11.2, 430, "#e6a500", 700, "Arial", "left"),
    t("subtitle", "副标题", "Información para tomar mejores decisiones.", 3.1, 23.4, 46, 5.5, 105, "#102b55", 500, "Arial", "left"),
    t("action", "股票代码标题", "ACCIÓN / CÓDIGO", 8.4, 32.2, 16, 4.4, 72, "#102b55"),
    t("current-price", "当前价格标题", "PRECIO ACTUAL", 28.4, 32.2, 16, 4.4, 72, "#102b55"),
    t("sell-price", "卖出价格标题", "PRECIO DE VENTA", 49.8, 32.2, 20, 4.4, 72, "#102b55"),
    t("performance", "预计表现标题", "RENDIMIENTO ESTIMADO", 74.8, 23.8, 20, 5, 72, "#102b55"),
    t("horizon", "建议周期标题", "HORIZONTE SUGERIDO", 74.8, 55, 20, 5, 72, "#102b55"),
    t("reminder", "提醒内容", "Venta inmediatamente según la estrategia de trading", 17.2, 84.5, 55, 5, 72, "#102b55", 500, "Arial", "left"),
    t("return", "收益标题", "Rendimiento proyectado:", 8.3, 90.6, 18, 4, 68, "#102b55", 700, "Arial", "left"),
  ],
  "vip-ticket": [
    t("heading", "页面标题", "Nuevas oportunidades de inversión", 18, 18, 64, 10, 245, "#0a326f", 700, "Georgia"),
    t("ticket", "票种", "VIP", 42, 33, 16, 9, 235, "#c90000", 700, "Georgia"),
    t("range-left", "区间起点", "21%", 17.5, 46, 25, 25, 650, "#d00000", 700, "Georgia"),
    t("range-right", "区间终点", "25%", 56.5, 46, 25, 25, 650, "#d00000", 700, "Georgia"),
    t("details", "底部说明", "Los detalles se anunciarán más adelante", 25, 83, 50, 7, 170, "#0a326f", 500, "Arial"),
  ],
  "regular-ticket": [
    t("heading", "页面标题", "Nuevas oportunidades de inversión", 18, 20, 64, 10, 245, "#0a326f", 700, "Georgia"),
    t("range-left", "区间起点", "10%", 12.5, 39, 31, 29, 700, "#062f6a", 700, "Georgia"),
    t("range-right", "区间终点", "15%", 55.5, 39, 31, 29, 700, "#062f6a", 700, "Georgia"),
    t("details", "底部说明", "Los detalles se anunciarán más adelante", 25, 80, 50, 7, 170, "#0a326f", 500, "Arial"),
  ],
  "dual-ticket": [
    t("heading", "页面标题", "Nuevas oportunidades de inversión", 18, 18, 64, 10, 245, "#0a326f", 700, "Georgia"),
    t("vip", "左侧票种", "VIP", 20, 35, 19, 7, 210, "#b60000", 700, "Georgia"),
    t("vip-range", "VIP区间", "21% - 25%", 7, 47, 40, 22, 500, "#b60000", 700, "Georgia"),
    t("regular", "右侧票种", "REGULAR", 62, 35, 25, 7, 170, "#062f6a", 700, "Georgia"),
    t("regular-range", "常规区间", "10% - 15%", 53, 47, 41, 22, 500, "#062f6a", 700, "Georgia"),
    t("details", "底部说明", "Los detalles se anunciarán más adelante", 25, 81, 50, 7, 170, "#0a326f", 500, "Arial"),
  ],
};

function clonePreset(templateId: string) {
  return (PRESETS[templateId] ?? []).map((layer) => ({ ...layer }));
}

function drawWrappedText(ctx: CanvasRenderingContext2D, layer: TextLayer, width: number, height: number) {
  const x = (layer.x / 100) * width;
  const y = (layer.y / 100) * height;
  const w = (layer.w / 100) * width;
  const h = (layer.h / 100) * height;
  ctx.fillStyle = layer.background;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = layer.color;
  const scale = width / 6688;
  ctx.font = `${layer.fontWeight} ${Math.max(12, layer.fontSize * scale)}px ${layer.fontFamily}`;
  ctx.textAlign = layer.align;
  ctx.textBaseline = "middle";
  const anchorX = layer.align === "left" ? x : layer.align === "right" ? x + w : x + w / 2;
  ctx.fillText(layer.text, anchorX, y + h / 2, w);
}

export function TemplateImageEditor({ template, onBack }: { template: TemplateProject; onBack: () => void }) {
  const [layers, setLayers] = useState<TextLayer[]>(() => clonePreset(template.id));
  const [selectedId, setSelectedId] = useState<string | null>(() => clonePreset(template.id)[0]?.id ?? null);
  const selected = useMemo(() => layers.find((layer) => layer.id === selectedId) ?? null, [layers, selectedId]);

  useEffect(() => {
    const saved = window.localStorage.getItem(`pi-template-layers:${template.id}`);
    if (!saved) return;
    const frame = window.requestAnimationFrame(() => {
      try { setLayers(JSON.parse(saved) as TextLayer[]); } catch { /* 保留原始模板配置 */ }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [template.id]);

  function updateSelected(patch: Partial<TextLayer>) {
    if (!selectedId) return;
    setLayers((current) => current.map((layer) => layer.id === selectedId ? { ...layer, ...patch } : layer));
  }

  function addLayer() {
    const id = `custom-${Date.now()}`;
    setLayers((current) => [...current, t(id, "自定义替换文字", "请输入文字", 35, 45, 30, 8, 160, "#102b55")]);
    setSelectedId(id);
  }

  function saveTemplate() {
    window.localStorage.setItem(`pi-template-layers:${template.id}`, JSON.stringify(layers));
  }

  function resetTemplate() {
    const preset = clonePreset(template.id);
    setLayers(preset);
    setSelectedId(preset[0]?.id ?? null);
    window.localStorage.removeItem(`pi-template-layers:${template.id}`);
  }

  async function export4k() {
    if (!template.previewSourceUrl) return;
    const image = new window.Image();
    image.src = template.previewSourceUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 3840;
    canvas.height = 2160;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    layers.forEach((layer) => drawWrappedText(ctx, layer, canvas.width, canvas.height));
    const link = document.createElement("a");
    link.download = `${template.name}-4K.png`;
    link.href = canvas.toDataURL("image/png", 1);
    link.click();
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[56px_minmax(0,1fr)] gap-3">
      <header className="flex items-center justify-between border border-[#294b68] bg-[#071c2e] px-4">
        <div className="flex items-center gap-3"><button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center border border-[#385670] text-[#c5d0d8]"><IconArrowLeft size={17}/></button><div><h2 className="text-[14px] text-[#d8e0e6]">原图文字编辑器</h2><p className="mt-1 text-[9px] text-[#7d94a8]">模板中心 / {template.name} / 原图 6688px</p></div></div>
        <div className="flex gap-2"><button type="button" onClick={resetTemplate} className="inline-flex h-9 items-center gap-2 border border-[#385670] px-4 text-[11px] text-[#b9c6d0]"><IconRefresh size={15}/>重置原文</button><button type="button" onClick={saveTemplate} className="inline-flex h-9 items-center gap-2 border border-[#9b7418] px-4 text-[11px] text-[#f0bd35]"><IconDeviceFloppy size={15}/>保存编辑</button><button type="button" onClick={() => void export4k()} className="inline-flex h-9 items-center gap-2 bg-[#d8ad37] px-5 text-[11px] font-semibold text-[#06111d]"><IconDownload size={16}/>下载 4K PNG</button></div>
      </header>

      <div className="grid min-h-0 grid-cols-[210px_minmax(0,1fr)_286px] gap-3">
        <aside className="min-h-0 overflow-auto border border-[#294b68] bg-[#071c2e] p-3">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-[11px] tracking-[.12em] text-[#9eb0be]">原图文字位置</h3><button type="button" onClick={addLayer} className="grid h-7 w-7 place-items-center border border-[#8e6c1d] text-[#efbc34]"><IconPlus size={14}/></button></div>
          <div className="space-y-2">{layers.map((layer) => <button key={layer.id} type="button" onClick={() => setSelectedId(layer.id)} className={`w-full border px-3 py-2.5 text-left ${selectedId === layer.id ? "border-[#a77c18] bg-[#2c240d]" : "border-[#24455f] bg-[#0a2236]"}`}><span className="block text-[10px] text-[#d0d9df]">{layer.label}</span><span className="mt-1 block truncate text-[9px] text-[#7890a4]">{layer.text}</span></button>)}</div>
        </aside>

        <main className="grid min-h-0 place-items-center overflow-hidden border border-[#294b68] bg-[#030b12] p-4">
          <div className="relative aspect-video w-full max-w-[1180px] overflow-hidden border border-[#55718b] bg-white shadow-[0_25px_80px_rgba(0,0,0,.55)] [container-type:inline-size]">
            {template.previewSourceUrl ? <Image src={template.previewSourceUrl} alt={template.name} fill unoptimized priority className="object-fill" sizes="70vw" /> : null}
            {layers.map((layer) => {
              const style: CSSProperties = { alignItems: "center", background: layer.background, color: layer.color, display: "flex", fontFamily: layer.fontFamily, fontSize: `${(layer.fontSize / 6688) * 100}cqw`, fontWeight: layer.fontWeight, height: `${layer.h}%`, justifyContent: layer.align === "left" ? "flex-start" : layer.align === "right" ? "flex-end" : "center", left: `${layer.x}%`, lineHeight: 1.05, overflow: "hidden", position: "absolute", textAlign: layer.align, top: `${layer.y}%`, whiteSpace: "nowrap", width: `${layer.w}%` };
              return <button key={layer.id} type="button" onClick={() => setSelectedId(layer.id)} style={style} className={selectedId === layer.id ? "outline-2 outline-offset-1 outline-[#f0b91f]" : ""}>{layer.text}</button>;
            })}
          </div>
        </main>

        <aside className="min-h-0 overflow-auto border border-[#294b68] bg-[#071c2e] p-4">
          <h3 className="border-b border-[#294b68] pb-3 text-[13px] text-[#d6dfe6]">文字属性</h3>
          {selected ? <div className="space-y-4 pt-4">
            <label className="block text-[10px] text-[#8ca2b5]">文字内容<textarea value={selected.text} onChange={(event) => updateSelected({ text: event.target.value })} className="mt-2 h-20 w-full resize-none border border-[#31516b] bg-[#061522] p-3 text-[11px] text-[#e0e6eb] outline-none" /></label>
            <label className="block text-[10px] text-[#8ca2b5]">文字颜色<input type="color" value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })} className="mt-2 h-9 w-full border border-[#31516b] bg-[#061522]" /></label>
            <label className="block text-[10px] text-[#8ca2b5]">字号（原图像素）<input type="number" min={20} max={900} value={selected.fontSize} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} className="mt-2 h-9 w-full border border-[#31516b] bg-[#061522] px-3 text-[11px] text-[#e0e6eb]" /></label>
            <div className="grid grid-cols-2 gap-3"><label className="text-[10px] text-[#8ca2b5]">字体<select value={selected.fontFamily} onChange={(event) => updateSelected({ fontFamily: event.target.value as TextLayer["fontFamily"] })} className="mt-2 h-9 w-full border border-[#31516b] bg-[#061522] px-2 text-[11px] text-[#e0e6eb]"><option>Arial</option><option>Georgia</option></select></label><label className="text-[10px] text-[#8ca2b5]">粗细<select value={selected.fontWeight} onChange={(event) => updateSelected({ fontWeight: Number(event.target.value) as 500 | 700 })} className="mt-2 h-9 w-full border border-[#31516b] bg-[#061522] px-2 text-[11px] text-[#e0e6eb]"><option value="500">常规</option><option value="700">粗体</option></select></label></div>
            <label className="block text-[10px] text-[#8ca2b5]">对齐<select value={selected.align} onChange={(event) => updateSelected({ align: event.target.value as TextAlign })} className="mt-2 h-9 w-full border border-[#31516b] bg-[#061522] px-2 text-[11px] text-[#e0e6eb]"><option value="left">左对齐</option><option value="center">居中</option><option value="right">右对齐</option></select></label>
            <div className="grid grid-cols-2 gap-3">{(["x", "y", "w", "h"] as const).map((key) => <label key={key} className="text-[10px] uppercase text-[#8ca2b5]">{key}<input type="number" step="0.1" value={selected[key]} onChange={(event) => updateSelected({ [key]: Number(event.target.value) })} className="mt-2 h-8 w-full border border-[#31516b] bg-[#061522] px-2 text-[11px] text-[#e0e6eb]" /></label>)}</div>
            <p className="border-t border-[#294b68] pt-3 text-[9px] leading-5 text-[#71899c]">每个位置已预设原模板的字体、颜色和字号。修改文字后直接继承；下载固定输出 3840×2160 PNG。</p>
          </div> : <p className="pt-4 text-[10px] text-[#71899c]">请选择左侧文字位置</p>}
        </aside>
      </div>
    </div>
  );
}
