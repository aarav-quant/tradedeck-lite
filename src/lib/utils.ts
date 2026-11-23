import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely: cn("p-2", isActive && "bg-primary") */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹ with Indian digit grouping: 1234567.8 -> ₹12,34,567.80 */
export function formatINR(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Plain number with Indian grouping: 24312.45 -> 24,312.45 */
export function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** +1.23% / -0.45% */
export function formatPct(value: number, decimals = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/** +123.45 / -67.80 */
export function formatChange(value: number, decimals = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, decimals)}`;
}

/** Indian compact units: 23,50,000 -> 23.5 L, 4,20,00,000 -> 4.2 Cr */
export function formatIndianCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${+(value / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${+(value / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `${+(value / 1e3).toFixed(1)} K`;
  return String(value);
}

/** Market cap given in ₹ crore: 1965000 -> ₹19.65 L Cr */
export function formatCrore(crore: number) {
  if (Math.abs(crore) >= 1e5) return `₹${+(crore / 1e5).toFixed(2)} L Cr`;
  return `₹${formatNumber(crore, 0)} Cr`;
}

/** Signed ₹ crore amount: -3369 -> −₹3,369 Cr, 1721 -> +₹1,721 Cr */
export function formatSignedCrore(crore: number, decimals = 0) {
  const sign = crore > 0 ? "+" : crore < 0 ? "−" : "";
  return `${sign}₹${formatNumber(Math.abs(crore), decimals)} Cr`;
}

/** Tailwind text colour class for a signed value */
export function trendColor(value: number) {
  return value > 0 ? "text-up" : value < 0 ? "text-down" : "text-muted-foreground";
}
