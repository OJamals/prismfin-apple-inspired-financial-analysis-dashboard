import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HoldingsMetrics } from '@shared/types';
import { ShieldCheck, Activity, Landmark, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface HoldingsMetricsGridProps {
  metrics: HoldingsMetrics;
}
export function HoldingsMetricsGrid({ metrics }: HoldingsMetricsGridProps) {
  const cards = [
    {
      title: 'Diversification',
      value: `${metrics.diversificationPct}%`,
      label: metrics.diversificationLabel,
      icon: Activity,
      color: 'text-brand-teal',
      bg: 'bg-brand-teal/5',
      trend: metrics.diversificationPct > 70 ? 'High' : 'Moderate'
    },
    {
      title: 'Risk Level',
      value: metrics.riskLevel,
      label: `Beta ${metrics.beta} vs S&P 500`,
      icon: ShieldCheck,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/5',
      badge: metrics.riskLevel === 'Conservative' ? 'Stable' : metrics.riskLevel === 'Aggressive' ? 'Growth' : 'Balanced'
    },
    {
      title: 'Yield',
      value: `${metrics.yieldPct}%`,
      label: metrics.yieldLabel,
      icon: Landmark,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/5',
      trend: 'Annualized'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02, translateY: -4 }}
          className="group"
        >
          <Card className="rounded-4xl border-white/40 shadow-soft bg-card overflow-hidden hover:shadow-premium transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl", card.bg)}>
                  <card.icon className={cn("size-6", card.color)} />
                </div>
                {card.trend && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {card.trend}
                  </div>
                )}
                {card.badge && (
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    card.badge === 'Stable' ? "bg-gain-50 text-gain-700" : "bg-brand-blue/10 text-brand-blue"
                  )}>
                    {card.badge}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </p>
                <div className="text-3xl font-bold font-display tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground/60 font-medium">
                  {card.label}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}