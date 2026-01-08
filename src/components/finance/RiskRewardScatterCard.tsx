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
import { cn } from '@/lib/utils';
interface RiskRewardScatterCardProps {
  data: RiskRewardPoint[];
}
export function RiskRewardScatterCard({ data }: RiskRewardScatterCardProps) {
  const getSharpeColor = (sharpe: number) => {
    if (sharpe > 1.5) return '#059669'; // Gain-600
    if (sharpe >= 1.0) return '#14B8A6'; // Brand-Teal
    return '#EF4444'; // Loss-500
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full overflow-hidden">
      <CardHeader className="pb-2 px-8 pt-8">
        <CardTitle className="text-xl font-bold font-display tracking-tight">Risk / Reward Efficiency</CardTitle>
        <p className="text-sm text-muted-foreground font-medium">Portfolio positioning vs. Sharpe efficiency frontier</p>
      </CardHeader>
      <CardContent className="h-[400px] px-4 pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
            <XAxis
              type="number"
              dataKey="volatility"
              name="Volatility"
              unit="%"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              label={{ value: 'Realized Volatility (σ)', position: 'bottom', offset: 20, fontSize: 10, fill: '#64748b', fontWeight: 700, textAnchor: 'middle' }}
            />
            <YAxis
              type="number"
              dataKey="returns"
              name="Returns"
              unit="%"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              label={{ value: 'Expected Annual Returns', angle: -90, position: 'left', offset: -5, fontSize: 10, fill: '#64748b', fontWeight: 700, textAnchor: 'middle' }}
            />
            <ZAxis type="number" dataKey="weight" range={[100, 1500]} name="Weight" unit="%" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as RiskRewardPoint;
                  return (
                    <div className="glass-premium p-4 rounded-2xl border border-white/40 shadow-premium min-w-[180px] animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-extrabold text-foreground tracking-tight">{d.symbol}</p>
                        <div className={cn(
                          "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          d.sharpe > 1.5 ? "bg-gain-50 text-gain-700" : d.sharpe >= 1.0 ? "bg-teal-50 text-teal-700" : "bg-loss-50 text-loss-700"
                        )}>
                          {d.sharpe > 1.5 ? 'High Alpha' : d.sharpe >= 1.0 ? 'Efficient' : 'Underweight'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-muted-foreground">Sharpe Ratio</span>
                          <span className="text-brand-blue font-bold text-sm tabular-nums">{d.sharpe}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-muted-foreground">Allocation</span>
                          <span className="text-foreground font-bold tabular-nums">{d.weight}%</span>
                        </div>
                        <div className="h-px bg-muted/20 my-1" />
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-muted-foreground">Risk: {d.volatility}%</span>
                          <span className="text-foreground">Ret: {d.returns}%</span>
                        </div>
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
                  fill={getSharpeColor(entry.sharpe)}
                  fillOpacity={0.7}
                  stroke={getSharpeColor(entry.sharpe)}
                  strokeWidth={2}
                  className="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}