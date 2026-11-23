"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// true in the browser, false during server render -> avoids hydration mismatch
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className="grid size-9 place-items-center rounded-lg border text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {/* Render a fixed-size placeholder until we know the theme */}
      {!mounted ? <span className="size-4" /> : isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
