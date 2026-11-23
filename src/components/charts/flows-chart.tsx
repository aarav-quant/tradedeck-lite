"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FlowDay } from "@/types/market";
import { formatSignedCrore } from "@/lib/utils";

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

/** FII vs DII net flows in ₹ crore. Bars above zero = net buying, below = net selling. */
export function FlowsChart({ data, height = 220 }: { data: FlowDay[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={dayLabel}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="mb-1 text-muted-foreground">{dayLabel(String(label))}</p>
                  {payload.map((p) => (
                    <p key={String(p.dataKey)} className="flex items-center gap-2">
                      <span className="size-2 rounded-sm" style={{ background: p.color }} />
                      <span className="w-8">{String(p.dataKey).toUpperCase()}</span>
                      <span className="tabular-nums">{formatSignedCrore(Number(p.value))}</span>
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend
            iconType="square"
            iconSize={8}
            formatter={(v: string) => <span className="text-xs text-muted-foreground">{v.toUpperCase()}</span>}
          />
          <Bar dataKey="fii" fill="var(--chart-1)" radius={[4, 4, 4, 4]} maxBarSize={18} isAnimationActive={false} />
          <Bar dataKey="dii" fill="var(--chart-3)" radius={[4, 4, 4, 4]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
