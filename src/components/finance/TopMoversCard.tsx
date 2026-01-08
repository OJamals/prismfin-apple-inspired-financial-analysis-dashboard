import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsRow } from '@shared/types';
import { cn } from '@/lib/utils';
import { formatPct, formatCurrencyUSD } from '@/lib/format';
interface TopMoversCardProps {
  movers: MetricsRow[];
}
export function TopMoversCard({ movers }: TopMoversCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-xl font-bold font-display tracking-tight">Market Movers</CardTitle>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Significant 24H Delta</p>
      </CardHeader>
      <CardContent className="px-8 pb-8 space-y-4">
        {movers.map((mover) => {
          const isPositive = mover.changePct >= 0;
          return (
            <motion.div
              key={mover.symbol}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/sentiment?ticker=${mover.symbol}`)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer group border border-transparent hover:border-white/20"
            >
              <div className={cn(
                "size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                isPositive ? "bg-gain-50 text-gain-600" : "bg-loss-50 text-loss-600"
              )}>
                {isPositive ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm tracking-tight truncate">{mover.name}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-black tabular-nums shadow-sm",
                    isPositive ? "bg-gain-500 text-white" : "bg-loss-500 text-white"
                  )}>
                    {formatPct(mover.changePct)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{mover.symbol}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{formatCurrencyUSD(mover.price)}</span>
                </div>
                <div className="mt-3 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, mover.sentiment)}%` }}
                    className={cn("h-full rounded-full", isPositive ? "bg-brand-teal" : "bg-brand-blue")}
                  />
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}