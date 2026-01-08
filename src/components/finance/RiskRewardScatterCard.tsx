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
  Cell,
  Line,
  ComposedChart
} from 'recharts';
import { RiskRewardPoint } from '@shared/types';
import { cn } from '@/lib/utils';
interface RiskRewardScatterCardProps {
  data: RiskRewardPoint[];
}
export function RiskRewardScatterCard({ data }: RiskRewardScatterCardProps) {
  const getSharpeColor = (sharpe: number) => {
    if (sharpe > 1.5) return '#10b981'; // Emerald-500
    if (sharpe >= 0.5) return '#14B8A6'; // Brand-Teal
    return '#0ea5e9'; // Brand-Blue (Lower but positive)
  };
  // Static efficiency frontier points
  const frontier = [
    { volatility: 5, returns: 4 },
    { volatility: 10, returns: 12 },
    { volatility: 15, returns: 18 },
    { volatility: 25, returns: 25 },
    { volatility: 40, returns: 32 },
  ];
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full overflow-hidden">
      <CardHeader className="pb-2 px-8 pt-8">
        <CardTitle className="text-xl font-bold font-display tracking-tight">Efficiency Frontier</CardTitle>
        <p className="text-sm text-muted-foreground font-medium">Risk-adjusted asset efficiency mapping</p>
      </CardHeader>
      <CardContent className="h-[400px] px-4 pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
            <XAxis
              type="number"
              dataKey="volatility"
              name="Volatility"
              unit="%"
              domain={[0, 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              label={{ value: 'Volatility (��)', position: 'bottom', offset: 20, fontSize: 10, fill: '#64748b', fontWeight: 700 }}
            />
            <YAxis
              type="number"
              dataKey="returns"
              name="Returns"
              unit="%"
              domain={[0, 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              label={{ value: 'Return', angle: -90, position: 'left', offset: 0, fontSize: 10, fill: '#64748b', fontWeight: 700 }}
            />
            <ZAxis type="number" dataKey="weight" range={[100, 2000]} name="Weight" />
            <Line 
              data={frontier} 
              type="monotone" 
              dataKey="returns" 
              stroke="#cbd5e1" 
              strokeWidth={1} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as RiskRewardPoint;
                  if (!d.symbol) return null; // Ignore frontier line tooltip
                  return (
                    <div className="glass-premium p-4 rounded-2xl border border-white/40 shadow-premium min-w-[200px]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-extrabold text-foreground">{d.symbol}</p>
                        <div className={cn(
                          "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          d.sharpe > 1.5 ? "bg-emerald-50 text-emerald-700" : "bg-brand-blue/10 text-brand-blue"
                        )}>
                          Allocation: {d.weight?.toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">Sharpe Ratio</span>
                          <span className="text-foreground font-black tabular-nums">{d.sharpe?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">Vol / Ret</span>
                          <span className="text-foreground font-bold tabular-nums">{d.volatility?.toFixed(1)}% / {d.returns?.toFixed(1)}%</span>
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
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}