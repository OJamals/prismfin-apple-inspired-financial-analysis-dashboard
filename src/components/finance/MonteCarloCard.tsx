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
import { Target, ShieldAlert, TrendingUp, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
interface MonteCarloCardProps {
  data: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
}
export function MonteCarloCard({ data }: MonteCarloCardProps) {
  const [horizon, setHorizon] = useState<'1Y' | '5Y' | '10Y'>('5Y');
  const [showConfidence, setShowConfidence] = useState(true);
  const instanceId = useId().replace(/:/g, '');
  const stats = data?.[horizon];
  if (!stats) {
    return (
      <Card className="rounded-4xl border-none shadow-soft bg-card min-h-[450px]">
        <div className="p-10 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
      </Card>
    );
  }
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight">Risk Projection (Monte Carlo)</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Terminal value distribution over {horizon} horizon</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-2xl ring-1 ring-black/5">
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
      <CardContent className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-loss-50/30 border border-loss-100/50 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-loss-600 uppercase tracking-widest">
              <ShieldAlert className="size-3" /> P10 Worst Case
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatCurrencyUSD(stats.p10)}</p>
          </div>
          <div className="p-6 rounded-3xl bg-brand-blue/5 border border-brand-blue/10 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest">
              <Target className="size-3" /> P50 Expected
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatCurrencyUSD(stats.median)}</p>
          </div>
          <div className="p-6 rounded-3xl bg-gain-50/30 border border-gain-100/50 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-gain-600 uppercase tracking-widest">
              <TrendingUp className="size-3" /> P90 Best Case
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatCurrencyUSD(stats.p90)}</p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.series}>
              <defs>
                <linearGradient id={`gradMonte-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', padding: '20px' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="space-y-4 min-w-[180px]">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{row.label}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-muted-foreground">P90 Ceiling</span>
                            <span className="text-gain-600 font-bold">{formatCurrencyUSD(row.p90)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-black py-1 px-3 bg-brand-blue/5 rounded-lg">
                            <span className="text-brand-blue">Median</span>
                            <span>{formatCurrencyUSD(row.median)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-muted-foreground">P10 Floor</span>
                            <span className="text-loss-600 font-bold">{formatCurrencyUSD(row.p10)}</span>
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
                fill={showConfidence ? `url(#gradMonte-${instanceId})` : "none"}
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