import React from 'react';
import { RefreshCw, Download, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TradingMode } from '@shared/types';
interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  range?: string;
  onRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  mode?: TradingMode;
}
export function DashboardHeader({
  title,
  subtitle,
  range,
  onRangeChange,
  onRefresh,
  isRefreshing,
  mode = 'live'
}: DashboardHeaderProps) {
  const isLive = mode === 'live';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            {title}
          </h1>
          <Badge 
            variant="secondary" 
            className={cn(
              "rounded-xl px-3 py-1 flex items-center gap-2 border-none font-bold uppercase tracking-widest text-[10px] shadow-sm",
              isLive ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            )}
          >
            <div className={cn("size-1.5 rounded-full", isLive ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
            {mode}
          </Badge>
        </div>
        <p className="text-muted-foreground/80 text-sm md:text-base font-medium max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2.5 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-soft ring-1 ring-black/5 backdrop-blur-md">
        {onRangeChange && (
          <Select value={range} onValueChange={onRangeChange}>
            <SelectTrigger className="w-[110px] bg-white border-none shadow-sm rounded-xl h-10 font-bold text-xs uppercase tracking-widest focus:ring-1 focus:ring-brand-blue/30">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/60 shadow-premium backdrop-blur-2xl bg-white/90">
              <SelectItem value="1M" className="rounded-lg text-xs font-bold uppercase tracking-widest py-2.5">1 Month</SelectItem>
              <SelectItem value="3M" className="rounded-lg text-xs font-bold uppercase tracking-widest py-2.5">3 Months</SelectItem>
              <SelectItem value="6M" className="rounded-lg text-xs font-bold uppercase tracking-widest py-2.5">6 Months</SelectItem>
              <SelectItem value="1Y" className="rounded-lg text-xs font-bold uppercase tracking-widest py-2.5">1 Year</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center h-10 px-1 gap-1">
          {onRefresh && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="rounded-xl h-9 w-9 bg-white shadow-sm hover:bg-muted/50 border-none"
              >
                <RefreshCw className={cn("size-4 text-brand-blue", isRefreshing && "animate-spin")} />
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-9 w-9 bg-white shadow-sm hover:bg-muted/50 border-none"
            >
              <Download className="size-4 text-muted-foreground" />
            </Button>
          </motion.div>
          <div className="w-px h-5 bg-muted/40 mx-1" />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ThemeToggle className="static" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}