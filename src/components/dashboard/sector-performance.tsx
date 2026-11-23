import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectorPerf } from "@/types/market";
import { cn, formatPct } from "@/lib/utils";

/** Diverging bars around a centre zero line: right = up, left = down. */
export function SectorPerformance({ sectors }: { sectors: SectorPerf[] }) {
  const max = Math.max(...sectors.map((s) => Math.abs(s.changePct)), 0.01);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Sector performance</CardTitle>
          <CardDescription className="mt-1">Average % change today</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {sectors.map((s) => {
            const width = (Math.abs(s.changePct) / max) * 50; // half the track each side
            const up = s.changePct >= 0;
            return (
              <li key={s.name} className="grid grid-cols-[96px_1fr_72px] items-center gap-3 text-sm">
                <span className="truncate text-muted-foreground">{s.name}</span>
                <div className="relative h-2 rounded-full bg-muted" title={`${s.name}: ${formatPct(s.changePct)}`}>
                  <span className="absolute inset-y-0 left-1/2 w-px bg-muted-foreground/50" />
                  <span
                    className={cn("absolute inset-y-0", up ? "left-1/2 rounded-r-full bg-up" : "right-1/2 rounded-l-full bg-down")}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-right text-xs tabular-nums">
                  {up ? "▲" : "▼"} {formatPct(s.changePct)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
