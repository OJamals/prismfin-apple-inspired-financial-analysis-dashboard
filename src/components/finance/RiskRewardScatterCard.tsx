import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { RiskRewardPoint } from '@shared/types';
interface RiskRewardScatterCardProps {
  data: RiskRewardPoint[];
}
export function RiskRewardScatterCard({ data }: RiskRewardScatterCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Risk vs. Reward</CardTitle>
        <p className="text-sm text-muted-foreground">Efficiency frontier & asset positioning</p>
      </CardHeader>
      <CardContent className="h-[350px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              type="number" 
              dataKey="volatility" 
              name="Volatility" 
              unit="%" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              label={{ value: 'Volatility (SD)', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis 
              type="number" 
              dataKey="returns" 
              name="Returns" 
              unit="%" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              label={{ value: 'Expected Returns', angle: -90, position: 'left', fontSize: 10, fill: '#94a3b8' }}
            />
            <ZAxis type="number" dataKey="weight" range={[100, 1000]} name="Weight" unit="%" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RiskRewardPoint;
                  return (
                    <div className="space-y-1">
                      <p className="font-bold text-foreground">{data.symbol}</p>
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4">
                        <span>Returns:</span> <span className="text-foreground font-medium">{data.returns}%</span>
                        <span>Volatility:</span> <span className="text-foreground font-medium">{data.volatility}%</span>
                        <span>Sharpe:</span> <span className="text-brand-blue font-bold">{data.sharpe}</span>
                        <span>Weight:</span> <span className="text-foreground font-medium">{data.weight}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Assets" data={data}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.sharpe > 1.0 ? '#14B8A6' : '#0EA5E9'} 
                  fillOpacity={0.6}
                  stroke={entry.sharpe > 1.0 ? '#14B8A6' : '#0EA5E9'}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}