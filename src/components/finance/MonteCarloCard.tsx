import React, { useState, useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { formatCurrencyUSD } from '@/lib/format';
import { MonteCarloStats } from '@shared/types';
import { ShieldAlert, Target, TrendingUp } from 'lucide-react';
interface MonteCarloCardProps {
  data: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
}
export function MonteCarloCard({ data }: MonteCarloCardProps) {
  const [horizon, setHorizon] = useState<'1Y' | '5Y' | '10Y'>('5Y');
  const [showConfidence, setShowConfidence] = useState(true);
  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const stats = data?.[horizon];
  if (!stats) {
    return (
      <Card className="rounded-4xl border-none shadow-soft bg-card min-h-[450px]">
        <div className="p-10 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[350px] w-full rounded-3xl" />
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full overflow-hidden flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">Risk Projection (Monte Carlo)</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Predictive wealth distribution for the {horizon} window.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-2xl ring-1 ring-black/5">
            <Label htmlFor="ci-toggle" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer">Confidence Bands</Label>
            <Switch id="ci-toggle" checked={showConfidence} onCheckedChange={setShowConfidence} />
          </div>
          <Tabs value={horizon} onValueChange={(v) => setHorizon(v as '1Y' | '5Y' | '10Y')}>
            <TabsList className="bg-secondary/50 rounded-2xl p-1 h-11">
              <TabsTrigger value="1Y" className="rounded-xl text-xs font-bold px-6">1Y</TabsTrigger>
              <TabsTrigger value="5Y" className="rounded-xl text-xs font-bold px-6">5Y</TabsTrigger>
              <TabsTrigger value="10Y" className="rounded-xl text-xs font-bold px-6">10Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-12 flex-1">
        <div className="h-[350px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stats.series} key={horizon}>
              <defs>
                <linearGradient id={`gradMonte-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05}/>
                </linearGradient>
                <pattern id={`patternMonte-${instanceId}`} width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#14B8A6" strokeWidth="0.5" opacity="0.1" />
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '24px' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="space-y-4 min-w-[200px]">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/10 pb-2">Simulation: {row.label}</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-medium">P90 Ceiling</span>
                            <span className="text-gain-600 font-bold tabular-nums">{formatCurrencyUSD(row.p90)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-black py-2 px-3 bg-brand-blue/5 rounded-xl">
                            <span className="text-brand-blue">Median</span>
                            <span className="tabular-nums">{formatCurrencyUSD(row.median)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground font-medium">P10 Floor</span>
                            <span className="text-loss-600 font-bold tabular-nums">{formatCurrencyUSD(row.p10)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="p90"
                  stroke="none"
                  fill={`url(#gradMonte-${instanceId})`}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              )}
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="p10"
                  stroke="none"
                  fill="hsl(var(--card))"
                  fillOpacity={1}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              )}
              <Line
                type="monotone"
                dataKey="median"
                stroke="#14B8A6"
                strokeWidth={4}
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
                className="drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/5">
          <div className="p-6 rounded-3xl bg-loss-50/20 border border-loss-100/30 space-y-2 group hover:bg-loss-50/40 transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-black text-loss-600 uppercase tracking-widest">
              <ShieldAlert className="size-3.5" /> P10 Floor
            </div>
            <p className="text-2xl font-bold font-display tracking-tight tabular-nums">{formatCurrencyUSD(stats.p10)}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">90% confidence of value above this floor.</p>
          </div>
          <div className="p-6 rounded-3xl bg-brand-blue/5 border border-brand-blue/10 space-y-2 shadow-sm ring-1 ring-brand-blue/5 group hover:bg-brand-blue/10 transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest">
              <Target className="size-3.5" /> Expected Median
            </div>
            <p className="text-2xl font-bold font-display tracking-tight tabular-nums">{formatCurrencyUSD(stats.median)}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">Statistically most likely terminal outcome.</p>
          </div>
          <div className="p-6 rounded-3xl bg-gain-50/20 border border-gain-100/30 space-y-2 group hover:bg-gain-50/40 transition-colors">
            <div className="flex items-center gap-2 text-[10px] font-black text-gain-600 uppercase tracking-widest">
              <TrendingUp className="size-3.5" /> P90 Ceiling
            </div>
            <p className="text-2xl font-bold font-display tracking-tight tabular-nums">{formatCurrencyUSD(stats.p90)}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">Optimistic ceiling in favorable conditions.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}