import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Breadth } from "@/types/market";
import { formatNumber } from "@/lib/utils";

/** Advance/decline split across all NSE stocks, shown as one stacked bar. */
export function BreadthCard({ breadth }: { breadth: Breadth }) {
  const { advances, declines, unchanged, newHighs, newLows } = breadth;
  const total = advances + declines + unchanged;
  const pct = (n: number) => (n / total) * 100;
  const ratio = declines ? advances / declines : advances;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Market breadth</CardTitle>
          <CardDescription className="mt-1">NSE, all stocks</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold tabular-nums">{ratio.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">A/D ratio</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stacked bar with 2px gaps between segments */}
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full" role="img"
          aria-label={`${advances} advancing, ${declines} declining, ${unchanged} unchanged`}>
          <div className="rounded-l-full bg-up" style={{ width: `${pct(advances)}%` }} />
          <div className="bg-muted-foreground/40" style={{ width: `${pct(unchanged)}%` }} />
          <div className="rounded-r-full bg-down" style={{ width: `${pct(declines)}%` }} />
        </div>
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-sm bg-up" /> Advances
            </dt>
            <dd className="tabular-nums">{formatNumber(advances, 0)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-sm bg-muted-foreground/40" /> Unchanged
            </dt>
            <dd className="tabular-nums">{formatNumber(unchanged, 0)}</dd>
          </div>
          <div className="text-right">
            <dt className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-sm bg-down" /> Declines
            </dt>
            <dd className="tabular-nums">{formatNumber(declines, 0)}</dd>
          </div>
        </dl>
        <div className="flex justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">52-week highs <span className="ml-1 text-foreground">{newHighs}</span></span>
          <span className="text-muted-foreground">52-week lows <span className="ml-1 text-foreground">{newLows}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
