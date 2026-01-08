import React, { useState, useId } from 'react';
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
  const instanceId = useId().replace(/:/g, '');
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
          <TabsList className="bg-secondary/50 rounded-xl p-1">
            <TabsTrigger value="1Y" className="rounded-lg text-xs px-4">1Y</TabsTrigger>
            <TabsTrigger value="5Y" className="rounded-lg text-xs px-4">5Y</TabsTrigger>
            <TabsTrigger value="10Y" className="rounded-lg text-xs px-4">10Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">P10 (Worst)</p>
            <p className="text-sm font-bold text-rose-600 tabular-nums">{formatCurrencyUSD(stats.p10)}</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Median</p>
            <p className="text-sm font-bold text-foreground tabular-nums">{formatCurrencyUSD(stats.median)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">P90 (Best)</p>
            <p className="text-sm font-bold text-emerald-600 tabular-nums">{formatCurrencyUSD(stats.p90)}</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.series}>
              <defs>
                <linearGradient id={`monteFill-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(12px)',
                  padding: '16px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length >= 3) {
                    return (
                      <div className="space-y-2 min-w-[140px]">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{payload[0].payload.label}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-medium text-muted-foreground">P90</span>
                            <span className="text-xs font-bold text-emerald-600">{formatCurrencyUSD(payload[0].value as number)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-bold text-foreground">Median</span>
                            <span className="text-xs font-extrabold text-foreground">{formatCurrencyUSD(payload[2].value as number)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-medium text-muted-foreground">P10</span>
                            <span className="text-xs font-bold text-rose-600">{formatCurrencyUSD(payload[1].value as number)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="p90"
                stroke="none"
                fill={`url(#monteFill-${instanceId})`}
                fillOpacity={0.6}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="p10"
                stroke="none"
                fill="#ffffff"
                fillOpacity={0.4}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="median"
                stroke="#14B8A6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}