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
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MonteCarloCardProps {
  data: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
}
export function MonteCarloCard({ data }: MonteCarloCardProps) {
  const [horizon, setHorizon] = useState<'1Y' | '5Y' | '10Y'>('5Y');
  const instanceId = useId().replace(/:/g, '');
  const stats = data?.[horizon];
  if (!stats || !stats.series) {
    return (
      <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[450px]">
        <div className="p-10 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">Monte Carlo Projections</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Simulated terminal value distribution over {horizon} horizon</p>
        </div>
        <Tabs value={horizon} onValueChange={(v) => setHorizon(v as any)} className="w-auto">
          <TabsList className="bg-secondary/50 rounded-2xl p-1 h-11 ring-1 ring-black/5">
            <TabsTrigger value="1Y" className="rounded-xl text-xs font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">1Y</TabsTrigger>
            <TabsTrigger value="5Y" className="rounded-xl text-xs font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">5Y</TabsTrigger>
            <TabsTrigger value="10Y" className="rounded-xl text-xs font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">10Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${horizon}-p10`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-loss-50/30 border border-loss-100/50 space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] font-black text-loss-600 uppercase tracking-widest">
                <AlertTriangle className="size-3" />
                Worst-Case (P10)
              </div>
              <p className="text-2xl font-bold tabular-nums text-foreground tracking-tight">{formatCurrencyUSD(stats.p10)}</p>
            </motion.div>
            <motion.div
              key={`${horizon}-median`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-5 rounded-3xl bg-brand-blue/5 border border-brand-blue/10 space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest">
                <Target className="size-3" />
                Expected Value
              </div>
              <p className="text-2xl font-bold tabular-nums text-foreground tracking-tight">{formatCurrencyUSD(stats.median)}</p>
            </motion.div>
            <motion.div
              key={`${horizon}-p90`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-3xl bg-gain-50/30 border border-gain-100/50 space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] font-black text-gain-600 uppercase tracking-widest">
                <TrendingUp className="size-3" />
                Best-Case (P90)
              </div>
              <p className="text-2xl font-bold tabular-nums text-foreground tracking-tight">{formatCurrencyUSD(stats.p90)}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.series}>
              <defs>
                <linearGradient id={`monteFill-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  borderRadius: '24px',
                  border: 'none',
                  boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  padding: '20px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length >= 3) {
                    const row = payload[0].payload;
                    return (
                      <div className="space-y-4 min-w-[180px]">
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-muted/20 pb-2">{row.label}</p>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Top Decile</span>
                            <span className="text-sm font-bold text-gain-600 tabular-nums">{formatCurrencyUSD(row.p90)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4 py-1.5 px-3 bg-brand-blue/5 rounded-xl">
                            <span className="text-[10px] font-black text-brand-blue uppercase">Median</span>
                            <span className="text-sm font-extrabold text-foreground tabular-nums">{formatCurrencyUSD(row.median)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Bottom Decile</span>
                            <span className="text-sm font-bold text-loss-600 tabular-nums">{formatCurrencyUSD(row.p10)}</span>
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
                isAnimationActive={true}
              />
              <Area
                type="monotone"
                dataKey="p10"
                stroke="none"
                fill="#ffffff"
                fillOpacity={0.8}
                isAnimationActive={true}
              />
              <Area
                type="monotone"
                dataKey="median"
                stroke="#14B8A6"
                strokeWidth={3}
                strokeDasharray="6 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}