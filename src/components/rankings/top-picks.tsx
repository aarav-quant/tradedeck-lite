import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeBadge } from "@/components/ui/change-badge";
import { Sparkline } from "@/components/charts/sparkline";
import { RatingBadge } from "@/components/rankings/rating-badge";
import type { RankedStock } from "@/types/market";
import { formatNumber, formatPct } from "@/lib/utils";

const FACTOR_LABELS = { momentum: "Momentum", trend: "Trend", rsi: "RSI", volume: "Volume" } as const;

/** Highest-scoring factor, used as the one-line "why" on each card */
function topFactor(s: RankedStock) {
  const [key] = Object.entries(s.factors).sort((a, b) => b[1] - a[1])[0];
  return FACTOR_LABELS[key as keyof typeof FACTOR_LABELS];
}

export function TopPicks({ stocks }: { stocks: RankedStock[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {stocks.map((s) => (
        <Link key={s.symbol} href={`/analysis?symbol=${encodeURIComponent(s.symbol)}`} className="group">
          <Card className="h-full gap-3 transition group-hover:border-primary/50">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    #{s.rank}
                  </span>
                  <div>
                    <p className="font-semibold group-hover:text-primary">{s.symbol}</p>
                    <p className="max-w-40 truncate text-xs text-muted-foreground">{s.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold tabular-nums">{s.score}</p>
                  <p className="text-[11px] text-muted-foreground">score</p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums">₹{formatNumber(s.price)}</span>
                    <ChangeBadge value={s.changePct} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RatingBadge rating={s.rating} />
                    <span>
                      3M {formatPct(s.return3m, 1)} · best: {topFactor(s)}
                    </span>
                  </div>
                </div>
                <div className="w-24 shrink-0">
                  <Sparkline data={s.spark} positive={s.change >= 0} height={36} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
