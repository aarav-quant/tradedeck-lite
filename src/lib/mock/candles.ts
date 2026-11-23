// Deterministic mock daily candles. Same symbol -> same history on every load,
// and the last close always equals the stock's price in src/data/stocks.json.
// Replace getCandles() in src/lib/data.ts with your API to use real history.

import type { Candle } from "@/types/market";

/** Small seeded random generator (mulberry32) so charts don't change on refresh */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Last `count` NSE weekdays up to and including `end` (weekends skipped, holidays ignored) */
function tradingDays(end: string, count: number): string[] {
  const days: string[] = [];
  const d = new Date(`${end}T00:00:00Z`);
  while (days.length < count) {
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) days.unshift(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return days;
}

export function generateCandles(
  symbol: string,
  lastClose: number,
  prevClose: number,
  count = 260,
  end = "2026-11-20",
): Candle[] {
  const rand = seeded(hash(symbol));
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  const days = tradingDays(end, count);
  const vol = 0.012 + rand() * 0.008; // daily volatility 1.2% - 2.0%

  // Walk backwards from yesterday's close so the last two bars match stocks.json exactly
  const closes = [prevClose, lastClose];
  for (let i = 2; i < count; i++) closes.unshift(closes[0] / (1 + 0.0004 + gauss() * vol));

  const baseVolume = 2e6 + rand() * 1.2e7;
  return days.map((time, i) => {
    const close = closes[i];
    const open = i === 0 ? close * (1 + gauss() * vol * 0.4) : closes[i - 1] * (1 + gauss() * vol * 0.25);
    const high = Math.max(open, close) * (1 + Math.abs(gauss()) * vol * 0.5);
    const low = Math.min(open, close) * (1 - Math.abs(gauss()) * vol * 0.5);
    const volume = Math.round(baseVolume * (0.6 + rand() * 0.8) * (1 + Math.abs(close - open) / close * 20));
    const r = (n: number) => Math.round(n * 100) / 100;
    return { time, open: r(open), high: r(high), low: r(low), close: r(close), volume };
  });
}
