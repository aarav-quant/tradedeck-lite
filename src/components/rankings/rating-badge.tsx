import { ChevronsUp, ChevronUp, Minus, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Rating } from "@/types/market";

const STYLE: Record<Rating, { variant: "up" | "warn" | "neutral" | "down"; Icon: typeof ChevronUp }> = {
  Strong: { variant: "up", Icon: ChevronsUp },
  Positive: { variant: "up", Icon: ChevronUp },
  Neutral: { variant: "neutral", Icon: Minus },
  Weak: { variant: "down", Icon: ChevronDown },
};

/** Icon + word + colour, so the rating reads without relying on colour. */
export function RatingBadge({ rating }: { rating: Rating }) {
  const { variant, Icon } = STYLE[rating];
  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {rating}
    </Badge>
  );
}

/** Horizontal 0-100 bar with the number beside it */
export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2" title={`Score ${score} / 100`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
      <span className="w-6 text-right text-sm font-semibold tabular-nums">{score}</span>
    </div>
  );
}
