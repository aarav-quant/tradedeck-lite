import { AppShell } from "@/components/layout/app-shell";

// Every page in (dashboard) is wrapped in the sidebar + top bar.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
