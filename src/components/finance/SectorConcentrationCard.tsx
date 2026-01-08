import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
interface SectorConcentrationCardProps {
  sectors: Record<string, number>;
}
export function SectorConcentrationCard({ sectors }: SectorConcentrationCardProps) {
  const data = Object.entries(sectors).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0EA5E9', '#14B8A6', '#6366F1', '#F59E0B', '#10B981', '#94A3B8'];
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-full">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="text-xl font-bold font-display tracking-tight">Sector Concentration</CardTitle>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Capital Distribution</p>
      </CardHeader>
      <CardContent className="p-8 pt-4 flex flex-col md:flex-row items-center gap-8">
        <div className="h-48 w-48 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="glass-premium p-3 rounded-2xl border-none shadow-premium text-[10px] font-bold">
                        <p className="text-muted-foreground uppercase tracking-widest mb-1">{d.name}</p>
                        <p className="text-sm font-black">{d.value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-tighter">Top</span>
            <span className="text-lg font-black font-display">{data[0]?.value}%</span>
          </div>
        </div>
        <div className="flex-1 w-full space-y-3">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-muted/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${entry.value}%`, backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                </div>
                <span className="text-[10px] font-black tabular-nums">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}