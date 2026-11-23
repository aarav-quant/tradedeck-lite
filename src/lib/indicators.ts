// Technical indicators. Each returns one value per input candle,
// with null where there isn't enough history yet (e.g. the first 19 days of SMA 20).

/** Simple moving average: plain average of the last `period` closes */
export function sma(values: number[], period: number): (number | null)[] {
  let sum = 0;
  return values.map((v, i) => {
    sum += v;
    if (i >= period) sum -= values[i - period];
    return i >= period - 1 ? sum / period : null;
  });
}

/** Exponential moving average: recent closes weigh more. k = 2 / (period + 1) */
export function ema(values: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  let prev: number | null = null;
  return values.map((v, i) => {
    if (i < period - 1) return null;
    if (prev === null) {
      // seed with the SMA of the first `period` values
      prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
      return prev;
    }
    prev = v * k + prev * (1 - k);
    return prev;
  });
}

/** Wilder's RSI (0-100). Above 70 = overbought, below 30 = oversold */
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = [null];
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      out.push(i === period ? 100 - 100 / (1 + avgGain / (avgLoss || 1e-9)) : null);
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out.push(100 - 100 / (1 + avgGain / (avgLoss || 1e-9)));
    }
  }
  return out;
}
