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
import { motion } from 'framer-motion';
interface PerformanceAreaCardProps {
  data: SeriesPoint[];
  range: string;
}
export function PerformanceAreaCard({ data, range }: PerformanceAreaCardProps) {
  // Determine trend for gradient color
  const isUp = data.length > 1 && data[data.length - 1].value >= data[0].value;
  const strokeColor = isUp ? "#34C759" : "#FF3B30";
  const stopColor = isUp ? "#34C759" : "#FF3B30";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card className="rounded-4xl border border-white/40 shadow-soft bg-card h-full min-h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold font-display">Portfolio Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Historical growth across {range}</p>
          </div>
          <div className={cn(
            "size-10 rounded-xl flex items-center justify-center shadow-premium",
            isUp ? "bg-gain-50 text-gain-500" : "bg-loss-50 text-loss-500"
          )}>
            <div className={cn("size-2 rounded-full animate-pulse", isUp ? "bg-gain-500" : "bg-loss-500")} />
          </div>
        </CardHeader>
        <CardContent className="h-[320px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={stopColor} stopOpacity={0.12}/>
                  <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  padding: '16px'
                }}
                formatter={(val: number) => [
                  <span className="font-bold tabular-nums text-foreground">{formatCurrencyUSD(val)}</span>, 
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Portfolio Value</span>
                ]}
                labelStyle={{ display: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#perfFill)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}