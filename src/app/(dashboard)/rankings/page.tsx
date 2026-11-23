import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TopPicks } from "@/components/rankings/top-picks";
import { RankingsTable } from "@/components/rankings/rankings-table";
import { WEIGHTS, getRankings } from "@/lib/ranking";

export const metadata = { title: "Top 10 Ranking" };

const pct = (w: number) => `${Math.round(w * 100)}%`;

export default function RankingsPage() {
  const rankings = getRankings();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Top 10 Ranking</h1>
          <p className="text-sm text-muted-foreground">NIFTY 50 stocks ranked by a composite technical score</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">Demo data</Badge>
      </div>

      <TopPicks stocks={rankings.slice(0, 3)} />

      <RankingsTable stocks={rankings} />

      {/* How the score works */}
      <Card className="py-4">
        <CardContent className="flex gap-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            <span className="font-medium text-foreground">How the score works.</span> Momentum (3-month return){" "}
            {pct(WEIGHTS.momentum)}, trend (price above SMA 20, SMA 50, EMA 200) {pct(WEIGHTS.trend)}, RSI health
            (closest to 60) {pct(WEIGHTS.rsi)}, and volume vs its 20-day average {pct(WEIGHTS.volume)}. Each factor is
            converted to a percentile across all stocks before weighting. Ratings: Strong ≥ 80, Positive ≥ 60, Neutral
            ≥ 40, Weak below 40. Educational illustration only, not investment advice. Change the weights in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">src/lib/ranking.ts</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
