import React from "react";
import { Home, PieChart, FileText, Settings, Search, Box } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarInput,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Holdings", icon: Box, path: "/holdings" },
    { label: "Reports", icon: FileText, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];
  return (
    <div className="h-full flex flex-col bg-card/60 backdrop-blur-xl border-r border-card/60 shadow-soft">
      <SidebarHeader className="pt-6 pb-4">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shadow-soft">
            <PieChart className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-display">PrismFin</span>
        </div>
        <div className="px-3 mt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <SidebarInput placeholder="Search" className="pl-9 bg-secondary/50 border-none h-9 text-sm" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Menu</SidebarGroupLabel>
          <ul className="px-2 -m-1">
            {navItems.map(({label, icon: Icon, path}) => {
              const active = location.pathname === path;
              return (
                <li key={path} className="list-none">
                  <Link
                    to={path}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-5 transition-all duration-200 overflow-hidden hover:bg-muted/50 text-sm",
                      active && "bg-muted shadow-soft text-brand-blue font-semibold"
                    )}
                  >
                    <Icon className={cn("size-5", active ? "text-brand-blue" : "text-muted-foreground")} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarGroup>
        <SidebarSeparator className="mx-4 opacity-50" />
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-4">
          <p className="text-xs font-medium text-foreground">Pro Plan</p>
          <p className="text-[10px] text-muted-foreground">Premium Analysis Enabled</p>
        </div>
      </SidebarFooter>
    </div>
  );
}