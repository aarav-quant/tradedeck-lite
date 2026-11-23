import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPct } from "@/lib/utils";

type ChangeBadgeProps = {
  value: number; // percentage, e.g. 1.24
  invert?: boolean; // true for "lower is better" series like INDIA VIX
  className?: string;
};

/** Green/red % badge. Arrow + sign mean colour is never the only signal (colour-blind safe). */
export function ChangeBadge({ value, invert = false, className }: ChangeBadgeProps) {
  const good = invert ? value < 0 : value > 0;
  const variant = value === 0 ? "neutral" : good ? "up" : "down";
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;

  return (
    <Badge variant={variant} className={className}>
      <Icon aria-hidden />
      {formatPct(value)}
    </Badge>
  );
}
