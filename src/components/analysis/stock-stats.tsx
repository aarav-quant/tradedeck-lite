import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Candle, StockQuote } from "@/types/market";
import { formatCrore, formatIndianCompact, formatNumber } from "@/lib/utils";

type StockStatsProps = { stock: StockQuote; candles: Candle[] };

/** Where `value` sits between low and high, as a 0-100% marker on a bar */
function RangeBar({ label, low, high, value }: { label: string; low: number; high: number; value: number }) {
  const pos = high > low ? ((value - low) / (high - low)) * 100 : 50;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(pos)}% of range</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <span
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
          style={{ left: `${Math.min(100, Math.max(0, pos))}%` }}
        />
      </div>
      <div className="flex justify-between text-xs tabular-nums">
        <span>{formatNumber(low)}</span>
        <span>{formatNumber(high)}</span>
      </div>
    </div>
  );
}

export function StockStats({ stock, candles }: StockStatsProps) {
  const today = candles[candles.length - 1];
  const yearHigh = Math.max(...candles.map((c) => c.high));
  const yearLow = Math.min(...candles.map((c) => c.low));
  const last20 = candles.slice(-20);
  const avgVolume = last20.reduce((s, c) => s + c.volume, 0) / last20.length;

  const rows: [string, string][] = [
    ["Open", formatNumber(today.open)],
    ["Prev close", formatNumber(stock.price - stock.change)],
    ["Volume", formatIndianCompact(today.volume)],
    ["Avg vol (20D)", formatIndianCompact(Math.round(avgVolume))],
    ["Market cap", formatCrore(stock.marketCapCr)],
    ["Sector", stock.sector],
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <RangeBar label="Day range" low={today.low} high={today.high} value={today.close} />
        <RangeBar label="52-week range" low={yearLow} high={yearHigh} value={today.close} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 text-sm">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
