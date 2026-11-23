import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Candle } from "@/types/market";
import { ema, rsi, sma } from "@/lib/indicators";
import { cn, formatNumber, formatPct, trendColor } from "@/lib/utils";

const last = <T,>(a: T[]) => a[a.length - 1];

export function TechnicalSummary({ candles }: { candles: Candle[] }) {
  const closes = candles.map((c) => c.close);
  const price = last(closes);

  const averages = [
    { label: "SMA 20", value: last(sma(closes, 20)) },
    { label: "SMA 50", value: last(sma(closes, 50)) },
    { label: "EMA 200", value: last(ema(closes, 200)) },
  ];
  const above = averages.filter((a) => a.value != null && price > a.value).length;

  const rsiNow = last(rsi(closes, 14)) ?? 50;
  const rsiState = rsiNow >= 70 ? "Overbought" : rsiNow <= 30 ? "Oversold" : "Neutral";

  // Simple trend score: how many averages price is above
  const trend = above === 3 ? "Strong uptrend" : above === 2 ? "Uptrend" : above === 1 ? "Weak" : "Downtrend";
  const trendVariant = above >= 2 ? "up" : above === 1 ? "warn" : "down";

  const returns = [
    { label: "1W", days: 5 },
    { label: "1M", days: 22 },
    { label: "3M", days: 66 },
    { label: "6M", days: 130 },
    { label: "1Y", days: closes.length - 1 },
  ].map((r) => {
    const past = closes[Math.max(0, closes.length - 1 - r.days)];
    return { ...r, pct: ((price - past) / past) * 100 };
  });

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Technicals</CardTitle>
          <CardDescription className="mt-1">Daily timeframe</CardDescription>
        </div>
        <Badge variant={trendVariant}>{trend}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Price vs moving averages */}
        <ul className="space-y-2 text-sm">
          {averages.map((a) => {
            const isAbove = a.value != null && price > a.value;
            return (
              <li key={a.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{a.label}</span>
                <span className="flex items-center gap-2 tabular-nums">
                  {a.value != null ? formatNumber(a.value) : "—"}
                  <span className={cn("flex items-center text-xs", isAbove ? "text-up" : "text-down")}>
                    {isAbove ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    {isAbove ? "Above" : "Below"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* RSI gauge */}
        <div className="space-y-1.5 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RSI (14)</span>
            <span className="tabular-nums">
              {rsiNow.toFixed(1)} <span className="text-xs text-muted-foreground">· {rsiState}</span>
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-gradient-to-r from-up/60 via-muted to-down/60">
            <span className="absolute inset-y-0 left-[30%] w-px bg-muted-foreground/50" />
            <span className="absolute inset-y-0 left-[70%] w-px bg-muted-foreground/50" />
            <span
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-foreground"
              style={{ left: `${rsiNow}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Oversold 30</span>
            <span>70 Overbought</span>
          </div>
        </div>

        {/* Period returns */}
        <div className="grid grid-cols-5 gap-1 border-t pt-4 text-center">
          {returns.map((r) => (
            <div key={r.label} className="rounded-md bg-muted px-1 py-2">
              <p className="text-[11px] text-muted-foreground">{r.label}</p>
              <p className={cn("text-xs font-medium tabular-nums", trendColor(r.pct))}>{formatPct(r.pct, 1)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
