"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChangeBadge } from "@/components/ui/change-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkline } from "@/components/charts/sparkline";
import { RatingBadge, ScoreBar } from "@/components/rankings/rating-badge";
import type { RankedStock } from "@/types/market";
import { cn, formatNumber, formatPct, trendColor } from "@/lib/utils";

type SortKey = "rank" | "symbol" | "price" | "changePct" | "return3m" | "rsi14" | "volumeRatio" | "score";
type Sort = { key: SortKey; dir: "asc" | "desc" };

const COLUMNS: { key: SortKey; label: string; align?: "right"; className?: string }[] = [
  { key: "rank", label: "#" },
  { key: "symbol", label: "Symbol" },
  { key: "price", label: "LTP (₹)", align: "right", className: "hidden sm:table-cell" },
  { key: "changePct", label: "1D", align: "right", className: "hidden sm:table-cell" },
  { key: "return3m", label: "3M", align: "right", className: "hidden md:table-cell" },
  { key: "rsi14", label: "RSI", align: "right", className: "hidden lg:table-cell" },
  { key: "volumeRatio", label: "Vol ×avg", align: "right", className: "hidden lg:table-cell" },
  { key: "score", label: "Score" },
];

export function RankingsTable({ stocks }: { stocks: RankedStock[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState<Sort>({ key: "rank", dir: "asc" });
  const [showAll, setShowAll] = useState(false);

  const sectors = useMemo(() => ["All", ...new Set(stocks.map((s) => s.sector))].sort(), [stocks]);

  // Filter -> sort -> limit. Recomputed only when an input changes.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = stocks.filter(
      (s) =>
        (sector === "All" || s.sector === sector) &&
        (!q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)),
    );
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === "string" ? av.localeCompare(String(bv)) : (av as number) - (bv as number);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return { list: showAll ? sorted : sorted.slice(0, 10), total: sorted.length };
  }, [stocks, query, sector, sort, showAll]);

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "rank" || key === "symbol" ? "asc" : "desc" }, // numbers: biggest first
    );
  }

  return (
    <Card className="gap-3">
      <CardHeader className="flex-wrap items-center">
        <CardTitle>{showAll ? "All ranked stocks" : "Top 10 by composite score"}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search stocks</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-8 w-40 rounded-md border bg-background pl-8 pr-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>
          <label>
            <span className="sr-only">Filter by sector</span>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {sectors.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key;
                const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <TableHead
                    key={c.key}
                    className={cn(c.align === "right" && "text-right", c.className)}
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 uppercase hover:text-foreground",
                        active && "text-foreground",
                      )}
                    >
                      {c.label}
                      <Icon className={cn("size-3", !active && "opacity-40")} />
                    </button>
                  </TableHead>
                );
              })}
              <TableHead className="hidden sm:table-cell">Rating</TableHead>
              <TableHead className="hidden w-28 xl:table-cell">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.list.map((s) => (
              <TableRow key={s.symbol}>
                <TableCell className="w-10 tabular-nums text-muted-foreground">{s.rank}</TableCell>
                <TableCell>
                  <Link href={`/analysis?symbol=${encodeURIComponent(s.symbol)}`} className="group">
                    <span className="font-medium group-hover:text-primary">{s.symbol}</span>
                    <span className="block max-w-44 truncate text-xs text-muted-foreground">
                      {s.name} · {s.sector}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="hidden text-right tabular-nums sm:table-cell">{formatNumber(s.price)}</TableCell>
                <TableCell className="hidden text-right sm:table-cell">
                  <ChangeBadge value={s.changePct} />
                </TableCell>
                <TableCell className={cn("hidden text-right tabular-nums md:table-cell", trendColor(s.return3m))}>
                  {s.return3m > 0 ? "▲" : "▼"} {formatPct(s.return3m, 1)}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums lg:table-cell">{s.rsi14.toFixed(0)}</TableCell>
                <TableCell className="hidden text-right tabular-nums lg:table-cell">{s.volumeRatio.toFixed(2)}×</TableCell>
                <TableCell>
                  <ScoreBar score={s.score} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <RatingBadge rating={s.rating} />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Sparkline data={s.spark} positive={s.change >= 0} height={28} />
                </TableCell>
              </TableRow>
            ))}
            {rows.list.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                  No stocks match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-3 pt-3 text-xs text-muted-foreground">
          <span>
            Showing {rows.list.length} of {rows.total}
          </span>
          {rows.total > 10 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Show top 10" : `Show all ${rows.total}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
