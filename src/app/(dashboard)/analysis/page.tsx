import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeBadge } from "@/components/ui/change-badge";
import { PriceChart } from "@/components/charts/price-chart";
import { SymbolSwitcher } from "@/components/analysis/symbol-switcher";
import { StockStats } from "@/components/analysis/stock-stats";
import { TechnicalSummary } from "@/components/analysis/technical-summary";
import { getCandles, getStock, getStocks } from "@/lib/data";
import { formatChange, formatNumber } from "@/lib/utils";

type PageProps = { searchParams: Promise<{ symbol?: string }> };

const DEFAULT_SYMBOL = "RELIANCE";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { symbol = DEFAULT_SYMBOL } = await searchParams;
  return { title: `${symbol.toUpperCase()} · Stock Analysis` };
}

export default async function AnalysisPage({ searchParams }: PageProps) {
  const { symbol = DEFAULT_SYMBOL } = await searchParams;
  const stocks = getStocks();
  const stock = getStock(symbol);
  const options = stocks.map((s) => ({ symbol: s.symbol, name: s.name }));

  // Unknown ticker: friendly empty state with suggestions
  if (!stock) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <div>
              <h1 className="text-lg font-semibold">No data for “{symbol.toUpperCase()}”</h1>
              <p className="mt-1 text-sm text-muted-foreground">Try one of the NIFTY 50 stocks in this demo:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {stocks.slice(0, 10).map((s) => (
                <Badge key={s.symbol} variant="outline" asChild>
                  <Link href={`/analysis?symbol=${encodeURIComponent(s.symbol)}`}>{s.symbol}</Link>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const candles = getCandles(stock.symbol);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{stock.symbol}</h1>
            <Badge variant="secondary">NSE</Badge>
            <Badge variant="outline" className="text-muted-foreground">{stock.sector}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">₹{formatNumber(stock.price)}</p>
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm tabular-nums text-muted-foreground">{formatChange(stock.change)}</span>
              <ChangeBadge value={stock.changePct} />
            </div>
          </div>
          <SymbolSwitcher options={options} value={stock.symbol} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="min-w-0">
          <CardContent>
            {/* key forces a fresh chart when the symbol changes */}
            <PriceChart key={stock.symbol} candles={candles} />
          </CardContent>
        </Card>
        <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <StockStats stock={stock} candles={candles} />
          <TechnicalSummary candles={candles} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Demo data for illustration only. Charts by{" "}
        <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          TradingView
        </a>
        .
      </p>
    </div>
  );
}
