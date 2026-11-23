// Composite stock score (0-100). Edit WEIGHTS to change how stocks are ranked.
// Each factor is turned into a percentile (0-100) across all stocks first,
// so factors with different units (%, ratio, RSI points) can be added fairly.

import { getCandles, getStocks } from "@/lib/data";
import { ema, rsi, sma } from "@/lib/indicators";
import type { RankedStock, Rating } from "@/types/market";

export const WEIGHTS = {
  momentum: 0.4, // 3-month return
  trend: 0.3, // price above SMA 20 / SMA 50 / EMA 200
  rsi: 0.15, // healthy strength: RSI near 60, not overbought or oversold
  volume: 0.15, // today's volume vs 20-day average
} as const;

const last = <T,>(a: T[]) => a[a.length - 1];

/** Percentile rank of each value within the list: lowest -> 0, highest -> 100 */
function percentiles(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  return values.map((v) => (n > 1 ? (sorted.indexOf(v) / (n - 1)) * 100 : 50));
}

function ratingFor(score: number): Rating {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Positive";
  if (score >= 40) return "Neutral";
  return "Weak";
}

export function getRankings(): RankedStock[] {
  const raw = getStocks().map((stock) => {
    const candles = getCandles(stock.symbol);
    const closes = candles.map((c) => c.close);
    const price = last(closes);
    const past = closes[Math.max(0, closes.length - 67)];
    const averages = [last(sma(closes, 20)), last(sma(closes, 50)), last(ema(closes, 200))];
    const avgVol = candles.slice(-20).reduce((s, c) => s + c.volume, 0) / 20;

    return {
      stock,
      return3m: ((price - past) / past) * 100,
      aboveCount: averages.filter((a) => a != null && price > a).length,
      rsi14: last(rsi(closes, 14)) ?? 50,
      volumeRatio: last(candles).volume / avgVol,
    };
  });

  const momentumP = percentiles(raw.map((r) => r.return3m));
  const volumeP = percentiles(raw.map((r) => r.volumeRatio));

  const ranked = raw.map((r, i) => {
    const trendScore = (r.aboveCount / 3) * 100;
    const rsiScore = Math.max(0, 100 - Math.abs(r.rsi14 - 60) * 2.5);
    const score =
      momentumP[i] * WEIGHTS.momentum +
      trendScore * WEIGHTS.trend +
      rsiScore * WEIGHTS.rsi +
      volumeP[i] * WEIGHTS.volume;

    return {
      ...r.stock,
      rank: 0,
      score: Math.round(score),
      rating: ratingFor(score),
      return3m: r.return3m,
      rsi14: r.rsi14,
      volumeRatio: r.volumeRatio,
      aboveCount: r.aboveCount,
      factors: {
        momentum: Math.round(momentumP[i]),
        trend: Math.round(trendScore),
        rsi: Math.round(rsiScore),
        volume: Math.round(volumeP[i]),
      },
    };
  });

  return ranked.sort((a, b) => b.score - a.score).map((s, i) => ({ ...s, rank: i + 1 }));
}
