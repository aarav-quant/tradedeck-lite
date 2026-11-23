import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IndexCard } from "@/components/dashboard/index-card";
import { MoversTable } from "@/components/dashboard/movers-table";
import { BreadthCard } from "@/components/dashboard/breadth-card";
import { SectorPerformance } from "@/components/dashboard/sector-performance";
import { IntradayChart } from "@/components/charts/intraday-chart";
import { FlowsChart } from "@/components/charts/flows-chart";
import { ChangeBadge } from "@/components/ui/change-badge";
import {
  getBreadth,
  getFiiDii,
  getIndices,
  getMostActive,
  getNiftyIntraday,
  getSectors,
  getTopMovers,
} from "@/lib/data";
import { formatChange, formatNumber, formatSignedCrore } from "@/lib/utils";

export default function DashboardPage() {
  const indices = getIndices();
  const nifty = indices[0];
  const intraday = getNiftyIntraday();
  const { gainers, losers } = getTopMovers(5);
  const active = getMostActive(5);
  const flows = getFiiDii();
  const latestFlow = flows[flows.length - 1];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Market overview</h1>
          <p className="text-sm text-muted-foreground">NSE &amp; BSE snapshot · 20 Nov 2026, 15:30 IST</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">Demo data</Badge>
      </div>

      {/* Index cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indices.map((q) => (
          <IndexCard key={q.symbol} quote={q} invert={q.symbol === "INDIAVIX"} />
        ))}
      </section>

      {/* Intraday chart + breadth */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>NIFTY 50 · Intraday</CardTitle>
              <CardDescription className="mt-1">5-minute, vs previous close</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums">{formatNumber(nifty.value)}</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">{formatChange(nifty.change)}</span>
                <ChangeBadge value={nifty.changePct} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pr-2">
            <IntradayChart series={intraday} />
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <BreadthCard breadth={getBreadth()} />
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>Institutional flows today</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {(["fii", "dii"] as const).map((k) => (
                <div key={k} className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{k.toUpperCase()} net</p>
                  <p className="font-semibold tabular-nums">{formatSignedCrore(latestFlow[k])}</p>
                  <p className="text-xs text-muted-foreground">{latestFlow[k] >= 0 ? "▲ Net buyer" : "▼ Net seller"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Movers + sectors */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MoversTable gainers={gainers} losers={losers} active={active} />
        </div>
        <SectorPerformance sectors={getSectors()} />
      </section>

      {/* FII / DII history */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>FII / DII activity</CardTitle>
            <CardDescription className="mt-1">Net buy (+) / sell (−) in ₹ crore, cash segment, last 6 sessions</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <FlowsChart data={flows} />
        </CardContent>
      </Card>
    </div>
  );
}
