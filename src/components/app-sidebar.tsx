import React from "react";
import { Home, PieChart, FileText, Settings, Search, Box, TrendingUp } from "lucide-react";
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
    { label: "Quant", icon: TrendingUp, path: "/quant" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];
  return (
    <div className="h-full flex flex-col bg-card/60 backdrop-blur-xl">
      <SidebarHeader className="pt-8 pb-4">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <PieChart className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-display">PrismFin</span>
        </div>
        <div className="px-3 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            <SidebarInput 
              placeholder="Search assets..." 
              className="pl-9 bg-secondary/60 border-none h-10 text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-brand-blue/30" 
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Analytics
          </SidebarGroupLabel>
          <ul className="space-y-1">
            {navItems.map(({label, icon: Icon, path}) => {
              const active = location.pathname === path;
              return (
                <li key={path} className="list-none">
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group",
                      active 
                        ? "bg-white shadow-soft text-brand-blue font-semibold ring-1 ring-black/5" 
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("size-5 transition-colors", active ? "text-brand-blue" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="text-sm">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarGroup>
        <SidebarSeparator className="my-4 mx-4 opacity-30" />
      </SidebarContent>
      <SidebarFooter className="p-6 mt-auto">
        <div className="flex flex-col gap-1 rounded-2xl bg-muted/60 p-4 ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-foreground">Pro Account</p>
            <div className="size-1.5 rounded-full bg-brand-teal animate-pulse" />
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">Advanced risk simulations enabled</p>
        </div>
      </SidebarFooter>
    </div>
  );
}