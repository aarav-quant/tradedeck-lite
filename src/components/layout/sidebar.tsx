"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CandlestickChart, X } from "lucide-react";
import { navItems, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean; // desktop: icons only
  mobileOpen: boolean; // mobile: drawer visible
  onClose: () => void; // close the mobile drawer
};

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Dark overlay behind the drawer on mobile */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-all duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full", // mobile slide
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", // desktop: always visible
          collapsed && "lg:w-[72px]",
        )}
      >
        {/* Logo row */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-white">
            <CandlestickChart className="size-4" />
          </div>
          <span className={cn("font-semibold tracking-tight", collapsed && "lg:hidden")}>
            {siteConfig.name}
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ title, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? title : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>{title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: upsell in lite, hidden in pro */}
        {siteConfig.edition === "lite" && !collapsed && (
          <div className="m-3 rounded-xl border bg-muted p-4 text-sm">
            <p className="font-medium">Unlock 8 more pages</p>
            <p className="mt-1 text-xs text-muted-foreground">Backtest lab, F&amp;O, FII/DII flows and more.</p>
            <a
              href={siteConfig.proUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              Get Pro
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
