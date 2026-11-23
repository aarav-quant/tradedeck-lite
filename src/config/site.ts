import { LayoutDashboard, CandlestickChart, Trophy, type LucideIcon } from "lucide-react";

export type NavItem = { title: string; href: string; icon: LucideIcon };

export const siteConfig = {
  name: "TradeDeck",
  description: "Next.js fintech & trading dashboard template",
  edition: "lite" as "lite" | "pro",
  proUrl: "https://aaravster23.gumroad.com/l/tradedeck-pro",
};

/** Sidebar links. The pro edition adds 8 more entries here. */
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Stock Analysis", href: "/analysis", icon: CandlestickChart },
  { title: "Top 10 Ranking", href: "/rankings", icon: Trophy },
];
