import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface KpiCardProps {
  label: string;
  value: number;
  deltaPct: number;
}
export function KpiCard({ label, value, deltaPct }: KpiCardProps) {
  const isPositive = deltaPct >= 0;
  return (
    <Card className="rounded-4xl border-none shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl bg-card overflow-hidden group border-white/40">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[140px] cursor-help">
                  {label}
                </p>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background text-xs rounded-lg px-3 py-1.5 border-none">
                {label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className={cn(
            "flex items-center gap-1 px-2.5 h-6 rounded-full text-xs font-bold tabular-nums shrink-0 shadow-sm transition-transform duration-300",
            isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {formatPct(deltaPct)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight font-display transition-all">
            {formatCurrencyUSD(value)}
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
            Last 24H Update
          </p>
        </div>
      </CardContent>
    </Card>
  );
}