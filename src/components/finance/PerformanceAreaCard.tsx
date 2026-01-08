import React from 'react';
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
import { SeriesPoint } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
interface PerformanceAreaCardProps {
  data: SeriesPoint[];
  range: string;
}
export function PerformanceAreaCard({ data, range }: PerformanceAreaCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Portfolio Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Historical growth across {range}</p>
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              hide 
            />
            <YAxis 
              hide 
              domain={['auto', 'auto']}
            />
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
              labelStyle={{ display: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#14B8A6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#perfFill)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}