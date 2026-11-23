"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

type SparklineProps = {
  data: number[];
  positive: boolean; // colours the line green or red
  height?: number;
};

/** Tiny trend line for cards and table rows. No axes, no tooltip: it shows shape only. */
export function Sparkline({ data, positive, height = 40 }: SparklineProps) {
  const points = data.map((value, i) => ({ i, value }));

  return (
    <div style={{ height }} className="w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={positive ? "var(--up)" : "var(--down)"}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
