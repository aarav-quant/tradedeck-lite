"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, PanelLeft, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

type TopbarProps = {
  onMenuClick: () => void; // open mobile drawer
  onCollapseClick: () => void; // shrink desktop sidebar
};

export function Topbar({ onMenuClick, onCollapseClick }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const symbol = query.trim().toUpperCase();
    if (symbol) router.push(`/analysis?symbol=${encodeURIComponent(symbol)}`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <button
        onClick={onCollapseClick}
        aria-label="Collapse sidebar"
        className="hidden size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:grid"
      >
        <PanelLeft className="size-5" />
      </button>

      <form onSubmit={handleSearch} className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol, e.g. RELIANCE"
          aria-label="Search symbol"
          className="h-9 w-full rounded-lg border bg-muted pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-up/10 px-2.5 py-1 text-xs font-medium text-up sm:flex">
          <span className="size-1.5 rounded-full bg-up" /> Market open
        </span>
        <button
          aria-label="Notifications"
          className="grid size-9 place-items-center rounded-lg border text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" />
        </button>
        <ThemeToggle />
        <div className="grid size-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          AJ
        </div>
      </div>
    </header>
  );
}
