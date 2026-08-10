"use client";

import { useEffect, useRef } from "react";
import {
  IconChartCandle,
  IconDatabaseOff,
} from "@tabler/icons-react";
import type {
  CandlestickPoint,
  CandlestickRange,
  MarketDataStatus,
} from "@/services/market";

interface CandlestickChartProps {
  candles: readonly CandlestickPoint[];
  dataStatus: MarketDataStatus;
  onRangeChange: (range: CandlestickRange) => void;
  range: CandlestickRange;
  ticker: string | null;
}

const ranges: readonly CandlestickRange[] = ["1D", "1W", "1M", "6M", "1Y"];

function CandleCanvas({ candles }: { candles: readonly CandlestickPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const container = canvas.parentElement;
    if (!container) return;

    function draw() {
      if (!canvas || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const padding = { top: 20, right: 22, bottom: 20, left: 22 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
      const highest = Math.max(...candles.map((candle) => candle.high));
      const lowest = Math.min(...candles.map((candle) => candle.low));
      const span = Math.max(highest - lowest, 0.01);

      context.strokeStyle = "rgba(75, 145, 108, 0.10)";
      context.lineWidth = 1;
      for (let index = 0; index <= 4; index += 1) {
        const y = padding.top + (chartHeight / 4) * index;
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(width - padding.right, y);
        context.stroke();
      }

      const slot = chartWidth / candles.length;
      const bodyWidth = Math.max(3, Math.min(10, slot * 0.46));
      const scaleY = (price: number) =>
        padding.top + ((highest - price) / span) * chartHeight;

      candles.forEach((candle, index) => {
        const x = padding.left + slot * index + slot / 2;
        const rising = candle.close >= candle.open;
        const color = rising ? "#4fc98a" : "#ef6a78";
        const openY = scaleY(candle.open);
        const closeY = scaleY(candle.close);

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, scaleY(candle.high));
        context.lineTo(x, scaleY(candle.low));
        context.stroke();
        context.fillRect(
          x - bodyWidth / 2,
          Math.min(openY, closeY),
          bodyWidth,
          Math.max(2, Math.abs(closeY - openY)),
        );
      });
    }

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => observer.disconnect();
  }, [candles]);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-label="Gráfico de velas BMV" />;
}

export function CandlestickChart({
  candles,
  dataStatus,
  onRangeChange,
  range,
  ticker,
}: CandlestickChartProps) {
  return (
    <section
      aria-labelledby="mexico-candlestick-chart"
      className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgba(75,145,108,0.17)] bg-[#08121d]"
    >
      <header className="flex h-[48px] flex-none items-center justify-between border-b border-[rgba(75,145,108,0.13)] px-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(75,145,108,0.18)] bg-[rgba(44,112,80,0.14)] text-[#69ad8b]">
            <IconChartCandle size={14} stroke={1.6} aria-hidden="true" />
          </span>
          <div>
            <h2 id="mexico-candlestick-chart" className="text-[10px] font-semibold text-[#e6eee9]">Gráfico de velas</h2>
            <p className="mt-0.5 font-mono text-[7px] tracking-[0.09em] text-[#506459]">{ticker ?? "EMISORA SIN SELECCIONAR"}</p>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-[rgba(75,145,108,0.16)] bg-[#070d0a] p-1" aria-label="Rango del gráfico">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRangeChange(item)}
              aria-pressed={range === item}
              className={`h-7 min-w-10 rounded-md px-2 text-[8px] font-medium ${
                range === item
                  ? "bg-[rgba(44,112,80,0.26)] text-[#91ceb0]"
                  : "text-[#587164] hover:text-[#afc5b9]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="relative min-h-0 flex-1 bg-[#080f0c]">
        {candles.length > 0 ? (
          <CandleCanvas candles={candles} />
        ) : (
          <div className="grid h-full min-h-[250px] place-items-center p-6 text-center">
            <div className="max-w-[390px]">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[rgba(75,145,108,0.18)] bg-[rgba(44,112,80,0.12)] text-[#4b916c]">
                <IconDatabaseOff size={20} stroke={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-[10px] font-medium text-[#dce8e1]">
                {dataStatus === "disconnected" ? "Serie BMV sin conectar" : "Sin velas para este periodo"}
              </h3>
              <p className="mt-1.5 text-[8px] leading-4 text-[#506459]">
                No se generan precios ni patrones simulados. Seleccione una emisora cuando la fuente institucional esté disponible.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="flex h-8 flex-none items-center justify-between border-t border-[rgba(75,145,108,0.12)] bg-[#0d1712] px-3.5">
        <span className="text-[7px] tracking-[0.1em] text-[#506459]">VELAS SIMPLES · SIN INDICADORES TÉCNICOS</span>
        <span className="font-mono text-[8px] text-[#587164]">PERIODO {range}</span>
      </footer>
    </section>
  );
}
