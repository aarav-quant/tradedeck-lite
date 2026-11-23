import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChangeBadge } from "@/components/ui/change-badge";
import { Sparkline } from "@/components/charts/sparkline";
import type { IndexQuote } from "@/types/market";
import { formatChange, formatNumber } from "@/lib/utils";

type IndexCardProps = {
  quote: IndexQuote;
  invert?: boolean; // INDIA VIX: falling is "good"
};

export function IndexCard({ quote, invert = false }: IndexCardProps) {
  const good = invert ? quote.change < 0 : quote.change >= 0;

  return (
    <Card className="gap-3">
      <CardHeader>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{quote.name}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatNumber(quote.value)}</p>
        </div>
        <ChangeBadge value={quote.changePct} invert={invert} />
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatChange(quote.change)} pts
        </p>
        <div className="w-28">
          <Sparkline data={quote.spark} positive={good} height={36} />
        </div>
      </CardContent>
    </Card>
  );
}
