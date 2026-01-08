import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface KpiCardProps {
  label: string;
  value: number;
  deltaPct: number;
}
export function KpiCard({ label, value, deltaPct }: KpiCardProps) {
  const isPositive = deltaPct >= 0;
  return (
    <Card className="rounded-4xl border-none shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-card overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </p>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums",
            isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {formatPct(deltaPct)}
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight">
          {formatCurrencyUSD(value)}
        </div>
      </CardContent>
    </Card>
  );
}