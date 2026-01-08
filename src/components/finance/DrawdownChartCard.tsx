import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DrawdownData } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
interface DrawdownChartCardProps {
  data: DrawdownData;
}
export function DrawdownChartCard({ data }: DrawdownChartCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Maximum Drawdown</CardTitle>
          <p className="text-sm text-muted-foreground">Historical portfolio recovery cycles</p>
        </div>
        <Badge variant="destructive" className="rounded-lg px-3 py-1 bg-rose-50 text-rose-700 border-none font-bold">
          Max DD: {data.maxDrawdown}%
        </Badge>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.series}>
            <defs>
              <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
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
              formatter={(val: number, name: string) => [
                name === 'drawdownPct' ? `${val}%` : formatCurrencyUSD(val),
                name === 'drawdownPct' ? 'Drawdown' : 'Value'
              ]}
            />
            <Area
              type="monotone"
              dataKey="drawdownPct"
              stroke="none"
              fill="url(#drawdownFill)"
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14B8A6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}