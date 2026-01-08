import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, ShieldCheck, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface BetaSensitivityCardProps {
  beta: number;
}
export function BetaSensitivityCard({ beta }: BetaSensitivityCardProps) {
  // Map beta to 0-100% on a logical scale (0.5 to 1.5)
  const normalizedValue = ((beta - 0.5) / (1.5 - 0.5)) * 100;
  const clampedValue = Math.min(Math.max(normalizedValue, 0), 100);
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full flex flex-col justify-between">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
              <Activity className="size-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Correlation</p>
              <h3 className="text-xl font-bold font-display tracking-tight">Beta Sensitivity</h3>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            beta > 1.2 ? "bg-loss-50 text-loss-600" : "bg-gain-50 text-gain-700"
          )}>
            {beta > 1.2 ? 'Aggressive' : beta < 0.8 ? 'Defensive' : 'Balanced'}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-5xl font-bold font-display tracking-tighter tabular-nums">{beta.toFixed(2)}x</span>
            <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">S&P 500 Anchor</span>
          </div>
          <div className="relative h-2.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-muted-foreground/20 z-10" />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${clampedValue}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-colors",
                beta > 1.1 ? "bg-loss-500" : "bg-brand-teal"
              )}
            />
          </div>
          <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
            <span>Low Risk (0.5)</span>
            <span>Market (1.0)</span>
            <span>High Risk (1.5)</span>
          </div>
        </div>
        <div className="pt-6 mt-4 border-t border-border/5 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-teal" />
            <p className="text-xs font-bold">Sensitivity Insight</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your portfolio currently moves <span className="text-foreground font-black">{beta.toFixed(2)}x</span> for every 1.0% change in the benchmark index. This implies {beta > 1 ? 'higher' : 'lower'} systematic risk than the market.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}