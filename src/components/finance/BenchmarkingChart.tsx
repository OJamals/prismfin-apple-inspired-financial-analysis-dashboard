import React, { useState } from 'react';
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
  const combinedData = portfolio.map((p, i) => ({
    label: p.label,
    portfolio: p.value,
    benchmark: benchmark[i]?.value || 0,
  }));
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[450px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Benchmarking Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Portfolio vs S&P 500 Index ({range})</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="benchmark-toggle" className="text-xs font-medium text-muted-foreground">Show Benchmark</Label>
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
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              formatter={(val: number) => [formatCurrencyUSD(val), 'Value']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area
              name="Portfolio"
              type="monotone"
              dataKey="portfolio"
              stroke="#14B8A6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPortfolio)"
            />
            {showBenchmark && (
              <Area
                name="Benchmark"
                type="monotone"
                dataKey="benchmark"
                stroke="#0EA5E9"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorBenchmark)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}