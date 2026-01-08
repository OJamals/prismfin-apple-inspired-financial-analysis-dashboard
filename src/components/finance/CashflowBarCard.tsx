import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { SeriesPoint } from '@shared/types';
import { formatCurrencyUSD } from '@/lib/format';
interface CashflowBarCardProps {
  data: SeriesPoint[];
}
export function CashflowBarCard({ data }: CashflowBarCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full min-h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Monthly Cashflow</CardTitle>
        <p className="text-sm text-muted-foreground">Projected income by month</p>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 'auto']}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafb' }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
              formatter={(val: number) => [formatCurrencyUSD(val), 'Income']}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 600 }}
            />
            <Bar 
              dataKey="value" 
              radius={[10, 10, 0, 0]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index % 2 === 0 ? '#0EA5E9' : '#14B8A6'} 
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