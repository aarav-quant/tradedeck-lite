"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import type { Candle } from "@/types/market";
import { ema, rsi, sma } from "@/lib/indicators";
import { cn, formatIndianCompact, formatNumber } from "@/lib/utils";

const RANGES = { "1M": 22, "3M": 66, "6M": 130, "1Y": 260 } as const;
type RangeKey = keyof typeof RANGES;

const OVERLAYS = [
  { key: "sma20", label: "SMA 20", colorVar: "--chart-1" },
  { key: "sma50", label: "SMA 50", colorVar: "--chart-3" },
  { key: "ema200", label: "EMA 200", colorVar: "--chart-4" },
] as const;
type OverlayKey = (typeof OVERLAYS)[number]["key"];

/** Read a CSS variable as a concrete colour (canvas charts can't use var()). */
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Turn indicator output into chart points, skipping the warm-up nulls */
const toLine = (candles: Candle[], values: (number | null)[]) =>
  candles.flatMap((c, i) => (values[i] == null ? [] : [{ time: c.time as Time, value: values[i] as number }]));

export function PriceChart({ candles }: { candles: Candle[] }) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const overlayRefs = useRef<Partial<Record<OverlayKey, ISeriesApi<"Line">>>>({});

  const [range, setRange] = useState<RangeKey>("6M");
  const [visible, setVisible] = useState<Record<OverlayKey, boolean>>({ sma20: true, sma50: true, ema200: false });
  const [hovered, setHovered] = useState<Candle | null>(null);

  // Indicators are computed once per symbol, not on every render
  const series = useMemo(() => {
    const closes = candles.map((c) => c.close);
    return {
      sma20: toLine(candles, sma(closes, 20)),
      sma50: toLine(candles, sma(closes, 50)),
      ema200: toLine(candles, ema(closes, 200)),
      rsi: toLine(candles, rsi(closes, 14)),
    };
  }, [candles]);

  // Build the chart. Rebuilt when the symbol or theme changes, so colours always match.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || candles.length === 0) return;

    const up = cssVar("--up");
    const down = cssVar("--down");
    const text = cssVar("--muted-foreground");
    const grid = cssVar("--border");

    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: text,
        fontFamily: getComputedStyle(document.body).fontFamily,
        fontSize: 11,
        attributionLogo: true, // TradingView licence: keep the attribution
        panes: { separatorColor: grid, separatorHoverColor: grid },
      },
      grid: { vertLines: { visible: false }, horzLines: { color: grid, style: LineStyle.Dashed } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, rightOffset: 4 },
      localization: { priceFormatter: (p: number) => formatNumber(p) },
    });
    chartRef.current = chart;

    // 1. Candles
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: up,
      downColor: down,
      borderVisible: false,
      wickUpColor: up,
      wickDownColor: down,
    });
    candleSeries.setData(candles.map((c) => ({ ...c, time: c.time as Time })));

    // 2. Volume as faint bars along the bottom 18% of the price pane
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    volumeSeries.setData(
      candles.map((c) => ({ time: c.time as Time, value: c.volume, color: `${c.close >= c.open ? up : down}55` })),
    );

    // 3. Moving-average overlays
    overlayRefs.current = {};
    for (const o of OVERLAYS) {
      const line = chart.addSeries(LineSeries, {
        color: cssVar(o.colorVar),
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      line.setData(series[o.key]);
      overlayRefs.current[o.key] = line;
    }

    // 4. RSI in its own pane underneath (pane index 1)
    const rsiSeries = chart.addSeries(
      LineSeries,
      {
        color: cssVar("--chart-4"),
        lineWidth: 2,
        priceLineVisible: false,
        // Fixed 0-100 scale so the 30/70 bands sit in the same place for every stock
        autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
      },
      1,
    );
    rsiSeries.setData(series.rsi);
    rsiSeries.createPriceLine({ price: 70, color: down, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: false, title: "" });
    rsiSeries.createPriceLine({ price: 30, color: up, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: false, title: "" });
    // Price pane gets ~75% of the height, RSI ~25%
    const [pricePane, rsiPane] = chart.panes();
    pricePane?.setStretchFactor(3);
    rsiPane?.setStretchFactor(1);

    // OHLC legend follows the crosshair
    const byTime = new Map(candles.map((c) => [c.time, c]));
    chart.subscribeCrosshairMove((param) => {
      setHovered(param.time ? (byTime.get(String(param.time)) ?? null) : null);
    });

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, series, resolvedTheme]);

  // Show/hide overlays without rebuilding the chart
  useEffect(() => {
    for (const o of OVERLAYS) overlayRefs.current[o.key]?.applyOptions({ visible: visible[o.key] });
  }, [visible, candles, resolvedTheme]);

  // Zoom to the selected range
  useEffect(() => {
    const n = candles.length;
    chartRef.current?.timeScale().setVisibleLogicalRange({ from: Math.max(0, n - RANGES[range]), to: n + 3 });
  }, [range, candles, resolvedTheme]);

  const shown = hovered ?? candles[candles.length - 1];
  const lastRsi = series.rsi[series.rsi.length - 1]?.value;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {OVERLAYS.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={visible[o.key]}
              onClick={() => setVisible((v) => ({ ...v, [o.key]: !v[o.key] }))}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition",
                visible[o.key] ? "bg-muted text-foreground" : "text-muted-foreground opacity-60 hover:opacity-100",
              )}
            >
              <span className="h-0.5 w-3 rounded-full" style={{ background: `var(${o.colorVar})` }} />
              {o.label}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-lg bg-muted p-0.5">
          {(Object.keys(RANGES) as RangeKey[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition",
                range === r && "bg-card text-foreground shadow-sm",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* OHLC legend */}
      {shown && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-muted-foreground">
          <span>{new Date(`${shown.time}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span>O <b className="font-medium text-foreground">{formatNumber(shown.open)}</b></span>
          <span>H <b className="font-medium text-foreground">{formatNumber(shown.high)}</b></span>
          <span>L <b className="font-medium text-foreground">{formatNumber(shown.low)}</b></span>
          <span>C <b className="font-medium text-foreground">{formatNumber(shown.close)}</b></span>
          <span>Vol <b className="font-medium text-foreground">{formatIndianCompact(shown.volume)}</b></span>
        </div>
      )}

      <div ref={containerRef} className="h-[460px] w-full md:h-[520px]" />
      <p className="text-xs text-muted-foreground">
        Lower pane: RSI 14{lastRsi != null && <> · now <b className="font-medium text-foreground">{lastRsi.toFixed(1)}</b></>} · dashed lines at 70 (overbought) and 30 (oversold)
      </p>
    </div>
  );
}
