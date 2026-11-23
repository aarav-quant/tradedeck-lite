"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Option = { symbol: string; name: string };

/** Native <select>: accessible, keyboard-friendly and good on mobile, with no extra library. */
export function SymbolSwitcher({ options, value }: { options: Option[]; value: string }) {
  const router = useRouter();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Choose a stock</span>
      <select
        value={value}
        onChange={(e) => router.push(`/analysis?symbol=${encodeURIComponent(e.target.value)}`)}
        className="h-9 appearance-none rounded-lg border bg-card pl-3 pr-9 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {options.map((o) => (
          <option key={o.symbol} value={o.symbol}>
            {o.symbol} · {o.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </label>
  );
}
