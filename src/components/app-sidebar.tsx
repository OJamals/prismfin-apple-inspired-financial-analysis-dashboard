import React from "react";
import { Home, PieChart, FileText, Settings, Search, Box } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarInput,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
    <Sidebar className="bg-white/60 backdrop-blur-xl border-r border-white/60 shadow-soft">
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
          <SidebarMenu className="px-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  className={cn(
                    "rounded-xl px-4 py-5 transition-all duration-200",
                    location.pathname === item.path 
                      ? "bg-white shadow-soft text-brand-blue font-semibold" 
                      : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className={cn("size-5", location.pathname === item.path ? "text-brand-blue" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="mx-4 opacity-50" />
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-4">
          <p className="text-xs font-medium text-foreground">Pro Plan</p>
          <p className="text-[10px] text-muted-foreground">Premium Analysis Enabled</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}