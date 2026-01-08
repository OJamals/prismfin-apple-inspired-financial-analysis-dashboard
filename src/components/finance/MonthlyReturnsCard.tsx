import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SeriesPoint } from '@shared/types';
import { formatPct } from '@/lib/format';
import { cn } from '@/lib/utils';
interface MonthlyReturnsCardProps {
  data: SeriesPoint[];
}
export function MonthlyReturnsCard({ data }: MonthlyReturnsCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="text-xl font-bold font-display tracking-tight">Monthly Alpha</CardTitle>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Periodic Performance Sequence</p>
      </CardHeader>
      <CardContent className="h-[300px] p-8 pt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc', radius: 12 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const isPositive = val >= 0;
                  return (
                    <div className="glass-premium p-4 rounded-2xl border-none shadow-premium min-w-[140px]">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 border-b border-border/10 pb-1">
                        {payload[0].payload.label}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Return</span>
                        <span className={cn("text-sm font-black tabular-nums", isPositive ? "text-gain-600" : "text-loss-600")}>
                          {formatPct(val)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 8, 8]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value >= 0 ? '#14B8A6' : '#FF3B30'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}