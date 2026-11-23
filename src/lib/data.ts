// Single data-access layer. Every page reads data through these functions.
// To use live data, replace the JSON imports with fetch() calls to your API
// and keep the return types the same.

import indicesJson from "@/data/indices.json";
import stocksJson from "@/data/stocks.json";
import intradayJson from "@/data/nifty-intraday.json";
import sectorsJson from "@/data/sectors.json";
import breadthJson from "@/data/breadth.json";
import flowsJson from "@/data/fii-dii.json";
import { generateCandles } from "@/lib/mock/candles";
import type {
  Breadth,
  Candle,
  FlowDay,
  IndexQuote,
  IntradaySeries,
  SectorPerf,
  StockQuote,
} from "@/types/market";

export function getIndices(): IndexQuote[] {
  return indicesJson;
}

export function getStocks(): StockQuote[] {
  return stocksJson;
}

export function getStock(symbol: string): StockQuote | undefined {
  return stocksJson.find((s) => s.symbol === symbol.toUpperCase());
}

/** About one year of daily candles for a symbol (mock, generated). */
export function getCandles(symbol: string): Candle[] {
  const stock = getStock(symbol);
  return stock ? generateCandles(stock.symbol, stock.price, stock.price - stock.change) : [];
}

/** Biggest % movers in each direction. */
export function getTopMovers(count = 5) {
  const sorted = [...stocksJson].sort((a, b) => b.changePct - a.changePct);
  return {
    gainers: sorted.slice(0, count),
    losers: sorted.slice(-count).reverse(),
  };
}

export function getMostActive(count = 5): StockQuote[] {
  return [...stocksJson].sort((a, b) => b.volume * b.price - a.volume * a.price).slice(0, count);
}

export function getNiftyIntraday(): IntradaySeries {
  return intradayJson;
}

export function getSectors(): SectorPerf[] {
  return sectorsJson;
}

export function getBreadth(): Breadth {
  return breadthJson;
}

export function getFiiDii(): FlowDay[] {
  return flowsJson;
}
