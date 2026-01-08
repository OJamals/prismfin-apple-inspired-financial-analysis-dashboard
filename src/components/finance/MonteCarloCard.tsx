import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { MonteCarloStats } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
interface MonteCarloCardProps {
  data: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
}
export function MonteCarloCard({ data }: MonteCarloCardProps) {
  const [horizon, setHorizon] = useState<'1Y' | '5Y' | '10Y'>('5Y');
  const stats = data?.[horizon];
  if (!stats || !stats.series) {
    return (
      <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[400px]">
        <div className="p-8 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Monte Carlo Risk</CardTitle>
          <p className="text-sm text-muted-foreground">Value distribution projections</p>
        </div>
        <Tabs value={horizon} onValueChange={(v) => setHorizon(v as any)}>
          <TabsList className="bg-secondary/50 rounded-xl">
            <TabsTrigger value="1Y" className="rounded-lg text-xs">1Y</TabsTrigger>
            <TabsTrigger value="5Y" className="rounded-lg text-xs">5Y</TabsTrigger>
            <TabsTrigger value="10Y" className="rounded-lg text-xs">10Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">P10 (Worst)</p>
            <p className="text-sm font-bold text-rose-600 tabular-nums">{formatCurrencyUSD(stats.p10)}</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Median</p>
            <p className="text-sm font-bold text-foreground tabular-nums">{formatCurrencyUSD(stats.median)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">P90 (Best)</p>
            <p className="text-sm font-bold text-emerald-600 tabular-nums">{formatCurrencyUSD(stats.p90)}</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px'
                }}
                formatter={(val: number) => [formatCurrencyUSD(val)]}
              />
              {/* Outer band */}
              <Area
                type="monotone"
                dataKey="p90"
                stroke="none"
                fill="#14B8A6"
                fillOpacity={0.05}
                isAnimationActive={false}
              />
              {/* Inner band */}
              <Area
                type="monotone"
                dataKey="p10"
                stroke="none"
                fill="#14B8A6"
                fillOpacity={0.1}
                isAnimationActive={false}
              />
              {/* Median Line last to be on top */}
              <Area
                type="monotone"
                dataKey="median"
                stroke="#14B8A6"
                strokeWidth={2}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}