import React, { useState, useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SeriesPoint } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
interface PerformanceChartCardProps {
  portfolio: SeriesPoint[];
  benchmark: SeriesPoint[];
  range: string;
}
export function PerformanceChartCard({ portfolio, benchmark, range }: PerformanceChartCardProps) {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '-');
  const combinedData = portfolio.map((p, i) => ({
    label: p.label,
    portfolio: p.value,
    benchmark: benchmark[i]?.value ?? 0
  }));
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
        <div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight">Performance Alpha</CardTitle>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Growth Dynamics ({range})</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/40 px-4 py-2 rounded-2xl ring-1 ring-black/5">
          <Label htmlFor="perf-benchmark-toggle" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer">S&P 500 Overlay</Label>
          <Switch 
            id="perf-benchmark-toggle" 
            checked={showBenchmark} 
            onCheckedChange={setShowBenchmark}
            className="data-[state=checked]:bg-brand-blue"
          />
        </div>
      </CardHeader>
      <CardContent className="h-[320px] p-8 pt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id={`portfolioFill-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`benchmarkFill-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
            <XAxis dataKey="label" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pVal = payload[0].value as number;
                  const bVal = payload[1]?.value as number;
                  return (
                    <div className="glass-premium p-5 rounded-3xl border-none shadow-premium min-w-[180px] space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/10 pb-2">{payload[0].payload.label}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-foreground">Portfolio</span>
                          <span className="text-sm font-black tabular-nums">{formatCurrencyUSD(pVal)}</span>
                        </div>
                        {showBenchmark && bVal && (
                          <div className="flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-bold text-muted-foreground">S&P 500</span>
                            <span className="text-xs font-bold tabular-nums">{formatCurrencyUSD(bVal)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="portfolio"
              stroke="#14B8A6"
              strokeWidth={4}
              fill={`url(#portfolioFill-${id})`}
              isAnimationActive={true}
            />
            {showBenchmark && (
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#0EA5E9"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill={`url(#benchmarkFill-${id})`}
                isAnimationActive={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}