import React, { useState, useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SeriesPoint } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
interface BenchmarkingChartProps {
  portfolio: SeriesPoint[];
  benchmark: SeriesPoint[];
  range: string;
}
export function BenchmarkingChart({ portfolio, benchmark, range }: BenchmarkingChartProps) {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, '-');
  const portfolioGradientId = `grad-pfolio-${uniqueId}`;
  const benchmarkGradientId = `grad-bench-${uniqueId}`;
  const combinedData = portfolio.map((p, i) => ({
    label: p.label,
    portfolio: p.value,
    benchmark: benchmark[i]?.value || 0,
  }));
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full min-h-[500px]">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold font-display tracking-tight">Alpha Benchmarking</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Portfolio Performance vs. S&P 500 Index ({range})</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-input/40 shadow-sm ring-1 ring-black/5">
          <Label htmlFor="benchmark-toggle" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer">S&P 500 Overlay</Label>
          <Switch
            id="benchmark-toggle"
            checked={showBenchmark}
            onCheckedChange={setShowBenchmark}
            className="data-[state=checked]:bg-brand-blue"
          />
        </div>
      </CardHeader>
      <CardContent className="h-[380px] p-8 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id={portfolioGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={benchmarkGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              interval="preserveStartEnd"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                borderRadius: '24px',
                border: 'none',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(16px)',
                padding: '20px'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="space-y-4 min-w-[160px]">
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b border-muted/20 pb-2">{payload[0].payload.label}</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-brand-teal" />
                            <span className="text-xs font-bold text-foreground">Portfolio</span>
                          </div>
                          <span className="text-sm font-black tabular-nums">{formatCurrencyUSD(payload[0].value as number)}</span>
                        </div>
                        {payload[1] && (
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                              <div className="size-2 rounded-full bg-brand-blue opacity-50" />
                              <span className="text-xs font-bold text-muted-foreground">S&P 500</span>
                            </div>
                            <span className="text-sm font-bold text-muted-foreground tabular-nums">{formatCurrencyUSD(payload[1].value as number)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              height={50}
              iconType="circle"
              wrapperStyle={{ paddingBottom: '30px', paddingLeft: '8px' }}
              formatter={(value) => <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{value}</span>}
            />
            <Area
              name="Strategy Performance"
              type="monotone"
              dataKey="portfolio"
              stroke="#14B8A6"
              strokeWidth={4}
              fillOpacity={1}
              fill={`url(#${portfolioGradientId})`}
              isAnimationActive={true}
            />
            {showBenchmark && (
              <Area
                name="S&P 500 Index Benchmark"
                type="monotone"
                dataKey="benchmark"
                stroke="#0EA5E9"
                strokeWidth={2}
                strokeDasharray="6 4"
                fillOpacity={1}
                fill={`url(#${benchmarkGradientId})`}
                isAnimationActive={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}