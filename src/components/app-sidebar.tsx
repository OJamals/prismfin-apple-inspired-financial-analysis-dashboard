import React from "react";
import { Home, PieChart, Settings, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Quant Lab", icon: TrendingUp, path: "/quant" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];
  return (
    <div className="h-full flex flex-col bg-card/80 backdrop-blur-xl border-r border-border/40">
      <SidebarHeader className="pt-10 pb-6 px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <PieChart className="size-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground font-display">PrismFin</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 mt-4">
        <SidebarGroup>
          <ul className="space-y-1.5">
            {navItems.map(({label, icon: Icon, path}) => {
              const active = location.pathname === path;
              return (
                <li key={path} className="list-none">
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 group",
                      active
                        ? "bg-card/90 shadow-inset text-brand-blue font-semibold ring-1 ring-border/50"
                        : "hover:bg-card/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("size-5 transition-colors", active ? "text-brand-blue" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="text-sm font-medium tracking-tight">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-8 mt-auto">
        <div className="flex flex-col gap-1 rounded-3xl bg-card/50 backdrop-blur-md p-5 ring-1 ring-border/20 border border-border/20 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">System Status</p>
            <div className="size-1.5 rounded-full bg-brand-teal animate-pulse" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 font-medium">Core Intelligence Online</p>
        </div>
      </SidebarFooter>
    </div>
  );
}