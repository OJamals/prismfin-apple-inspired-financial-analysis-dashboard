import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { MetricsDetailDrawer } from './MetricsDetailDrawer';
import { GlossaryTerm } from './GlossaryOverlay';
interface KpiCardProps {
  label: string;
  value: number;
  deltaPct: number;
  isWarning?: boolean;
}
export function KpiCard({ label, value, deltaPct, isWarning }: KpiCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const isPositive = deltaPct >= 0;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <div className={cn(
        "absolute -inset-1 rounded-[2.25rem] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        isWarning ? "bg-amber-500" : isPositive ? "bg-gain-500" : "bg-loss-500"
      )} />
      <Card className={cn(
        "relative rounded-4xl border border-white/40 shadow-soft overflow-hidden h-full transition-colors duration-500",
        isWarning 
          ? "bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-900/10 dark:to-card"
          : isPositive 
            ? "bg-gradient-to-br from-gain-50/50 to-white dark:from-gain-900/10 dark:to-card" 
            : "bg-card"
      )}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-1.5 group/label">
              <GlossaryTerm term={label} className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[140px]">
                {label}
              </GlossaryTerm>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HelpCircle className="size-3.5 text-muted-foreground hover:text-brand-blue" />
              </button>
            </div>
            <div className={cn(
              "flex items-center gap-1 px-2.5 h-6 rounded-full text-xs font-bold tabular-nums shrink-0 shadow-sm transition-all duration-300",
              isPositive
                ? "bg-gain-50 text-gain-700 ring-1 ring-gain-100"
                : "bg-loss-50 text-loss-700 ring-1 ring-loss-100"
            )}>
              <motion.div
                animate={isPositive ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              </motion.div>
              {formatPct(deltaPct)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight font-display">
              {formatCurrencyUSD(value)}
            </div>
            <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className={cn(
                "size-1.5 rounded-full", 
                isWarning ? "bg-amber-500 animate-pulse" : isPositive ? "bg-gain-500" : "bg-loss-500"
              )} />
              {isWarning ? "Real-time volatility alert" : "Verified Market Data"}
            </p>
          </div>
        </CardContent>
      </Card>
      <MetricsDetailDrawer 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)} 
        metricName={label}
      />
    </motion.div>
  );
}