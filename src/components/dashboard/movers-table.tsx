"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeBadge } from "@/components/ui/change-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkline } from "@/components/charts/sparkline";
import type { StockQuote } from "@/types/market";
import { formatIndianCompact, formatNumber } from "@/lib/utils";

type MoversTableProps = {
  gainers: StockQuote[];
  losers: StockQuote[];
  active: StockQuote[];
};

function MoversRows({ rows }: { rows: StockQuote[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">LTP (₹)</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="hidden text-right sm:table-cell">Volume</TableHead>
          <TableHead className="hidden w-28 md:table-cell">Trend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((s) => (
          <TableRow key={s.symbol}>
            <TableCell>
              <Link href={`/analysis?symbol=${encodeURIComponent(s.symbol)}`} className="group">
                <span className="font-medium group-hover:text-primary">{s.symbol}</span>
                <span className="block max-w-40 truncate text-xs text-muted-foreground">{s.name}</span>
              </Link>
            </TableCell>
            <TableCell className="text-right tabular-nums">{formatNumber(s.price)}</TableCell>
            <TableCell className="text-right">
              <ChangeBadge value={s.changePct} />
            </TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
              {formatIndianCompact(s.volume)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Sparkline data={s.spark} positive={s.change >= 0} height={28} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function MoversTable({ gainers, losers, active }: MoversTableProps) {
  return (
    <Card className="gap-2">
      <Tabs defaultValue="gainers">
        <CardHeader className="flex-wrap items-center">
          <CardTitle>NIFTY 50 movers</CardTitle>
          <TabsList>
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
            <TabsTrigger value="active">Most active</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-2">
          <TabsContent value="gainers">
            <MoversRows rows={gainers} />
          </TabsContent>
          <TabsContent value="losers">
            <MoversRows rows={losers} />
          </TabsContent>
          <TabsContent value="active">
            <MoversRows rows={active} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
