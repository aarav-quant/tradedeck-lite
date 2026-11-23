"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IntradaySeries } from "@/types/market";
import { formatChange, formatNumber, formatPct } from "@/lib/utils";

type IntradayChartProps = { series: IntradaySeries; height?: number };

export function IntradayChart({ series, height = 280 }: IntradayChartProps) {
  const { points, prevClose } = series;
  const last = points[points.length - 1]?.value ?? prevClose;
  const color = last >= prevClose ? "var(--up)" : "var(--down)";
  // Y range always includes the previous close so its reference line is visible
  const values = points.map((p) => p.value);
  const pad = (Math.max(...values, prevClose) - Math.min(...values, prevClose)) * 0.08;
  const domain = [Math.min(...values, prevClose) - pad, Math.max(...values, prevClose) + pad];

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="intraday-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            ticks={["09:15", "10:30", "11:45", "13:00", "14:15", "15:30"]}
            interval="preserveStartEnd"
            padding={{ left: 8, right: 8 }}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            orientation="right"
            domain={domain}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(v: number) => formatNumber(v, 0)}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          {/* Dashed line at yesterday's close: above it = up day, below = down day */}
          <ReferenceLine
            y={prevClose}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            label={{ value: "Prev close", position: "insideTopLeft", fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const v = Number(payload[0].value);
              const diff = v - prevClose;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="text-muted-foreground">{label} IST</p>
                  <p className="text-sm font-medium">{formatNumber(v)}</p>
                  <p className="text-muted-foreground">
                    {formatChange(diff)} ({formatPct((diff / prevClose) * 100)})
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#intraday-fill)"
            activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
