// Shapes of the mock data in src/data/*.json.
// If you connect a real API, map its response to these types and every page keeps working.

export type IndexQuote = {
  symbol: string; // "NIFTY"
  name: string; // "NIFTY 50"
  value: number;
  prevClose: number;
  change: number;
  changePct: number;
  spark: number[]; // recent closes for the mini chart
};

export type StockQuote = {
  symbol: string; // NSE ticker, e.g. "RELIANCE"
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  volume: number; // shares traded today
  marketCapCr: number; // market cap in ₹ crore
  high52: number;
  low52: number;
  spark: number[];
};

/** One daily OHLCV bar. time is "YYYY-MM-DD" (the format TradingView charts expect) */
export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IntradayPoint = { time: string; value: number };

export type IntradaySeries = {
  symbol: string;
  prevClose: number;
  points: IntradayPoint[];
};

export type SectorPerf = { name: string; changePct: number };

export type Breadth = {
  advances: number;
  declines: number;
  unchanged: number;
  newHighs: number;
  newLows: number;
};

/** Score bands. Descriptive on purpose: not buy/sell advice. */
export type Rating = "Strong" | "Positive" | "Neutral" | "Weak";

export type RankedStock = StockQuote & {
  rank: number;
  score: number; // 0-100 composite
  rating: Rating;
  return3m: number; // %
  rsi14: number;
  volumeRatio: number; // today's volume / 20-day average
  aboveCount: number; // how many of SMA20, SMA50, EMA200 the price is above
  factors: { momentum: number; trend: number; rsi: number; volume: number }; // each 0-100
};

export type FlowDay = {
  date: string; // ISO date
  fii: number; // net buy/sell in ₹ crore
  dii: number;
};
