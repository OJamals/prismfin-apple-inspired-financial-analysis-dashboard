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
interface BenchmarkingChartProps {
  portfolio: SeriesPoint[];
  benchmark: SeriesPoint[];
  range: string;
}
export function BenchmarkingChart({ portfolio, benchmark, range }: BenchmarkingChartProps) {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const uniqueId = useId().replace(/:/g, '');
  const portfolioGradientId = `colorPortfolio-${uniqueId}`;
  const benchmarkGradientId = `colorBenchmark-${uniqueId}`;
  const combinedData = portfolio.map((p, i) => ({
    label: p.label,
    portfolio: p.value,
    benchmark: benchmark[i]?.value || 0,
  }));
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[450px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold font-display">Benchmarking Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Portfolio Alpha vs. S&P 500 Index ({range})</p>
        </div>
        <div className="flex items-center space-x-3 bg-secondary/30 px-4 py-2 rounded-2xl border border-input/40">
          <Label htmlFor="benchmark-toggle" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Benchmark</Label>
          <Switch
            id="benchmark-toggle"
            checked={showBenchmark}
            onCheckedChange={setShowBenchmark}
          />
        </div>
      </CardHeader>
      <CardContent className="h-[350px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id={portfolioGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={benchmarkGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              hide={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval="preserveStartEnd"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                borderRadius: '20px',
                border: '1px solid rgba(226, 232, 240, 0.4)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '166x'
              }}
              formatter={(val: number) => [formatCurrencyUSD(val), 'Market Value']}
            />
            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px' }}
            />
            <Area
              name="My Portfolio"
              type="monotone"
              dataKey="portfolio"
              stroke="#14B8A6"
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${portfolioGradientId})`}
              isAnimationActive={true}
            />
            {showBenchmark && (
              <Area
                name="S&P 500 Index"
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