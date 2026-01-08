import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
interface KpiCardProps {
  label: string;
  value: number;
  deltaPct: number;
}
export function KpiCard({ label, value, deltaPct }: KpiCardProps) {
  const isPositive = deltaPct >= 0;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <div className={cn(
        "absolute -inset-1 rounded-[2.25rem] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        isPositive ? "bg-gain-500" : "bg-loss-500"
      )} />
      <Card className="relative rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden h-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[140px] cursor-help">
                    {label}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground text-background text-xs rounded-lg px-3 py-1.5 border-none shadow-premium">
                  {label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className={cn(
              "flex items-center gap-1 px-2.5 h-6 rounded-full text-xs font-bold tabular-nums shrink-0 shadow-sm transition-all duration-300",
              isPositive 
                ? "bg-gain-50 text-gain-700 ring-1 ring-gain-100" 
                : "bg-loss-50 text-loss-700 ring-1 ring-loss-100"
            )}>
              {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {formatPct(deltaPct)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight font-display">
              {formatCurrencyUSD(value)}
            </div>
            <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className={cn("size-1 rounded-full", isPositive ? "bg-gain-500" : "bg-loss-500")} />
              Last 24H Update
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}