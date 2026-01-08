import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function InteractiveAcademyChart() {
  const [volatility, setVolatility] = useState([15]); // Initial volatility 15%
  const [returnExpectation, setReturnExpectation] = useState([12]); // Initial return 12%
  const riskFreeRate = 4; // Constant risk-free rate for demo
  const chartData = useMemo(() => {
    // Generate data showing Sharpe Ratio across a range of return expectations
    const data = [];
    for (let r = 0; r <= 30; r += 2) {
      const vol = volatility[0] / 100;
      const ret = r / 100;
      const rf = riskFreeRate / 100;
      const sharpe = vol > 0 ? (ret - rf) / vol : 0;
      data.push({
        return: r,
        sharpe: parseFloat(sharpe.toFixed(3)),
      });
    }
    return data;
  }, [volatility]);
  const currentSharpe = useMemo(() => {
    const vol = volatility[0] / 100;
    const ret = returnExpectation[0] / 100;
    const rf = riskFreeRate / 100;
    return vol > 0 ? (ret - rf) / vol : 0;
  }, [volatility, returnExpectation]);
  return (
    <Card className="rounded-[2.5rem] border-none shadow-soft bg-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-8 border-r border-muted/20 space-y-10">
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-display">Sharpe Lab</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adjust variables to see how risk impacts the portfolio efficiency curve.
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Portfolio Volatility</Label>
                <span className="text-sm font-bold text-rose-500">{volatility[0]}%</span>
              </div>
              <Slider
                value={volatility}
                onValueChange={setVolatility}
                max={50}
                min={5}
                step={1}
                className="py-1"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expected Return</Label>
                <span className="text-sm font-bold text-brand-teal">{returnExpectation[0]}%</span>
              </div>
              <Slider
                value={returnExpectation}
                onValueChange={setReturnExpectation}
                max={30}
                min={5}
                step={1}
                className="py-1"
              />
            </div>
          </div>
          <motion.div
            key={currentSharpe}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-3xl bg-secondary/50 border border-input/20 space-y-2 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resulting Sharpe Ratio</p>
            <p className={cn(
              "text-4xl font-black font-display tracking-tighter tabular-nums",
              currentSharpe > 1 ? "text-brand-teal" : "text-brand-blue"
            )}>
              {currentSharpe.toFixed(2)}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground/60">
              {currentSharpe > 1 ? "Institutional Quality" : "Standard Efficiency"}
            </p>
          </motion.div>
        </div>
        <div className="lg:col-span-8 p-8 h-[450px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Efficiency Frontier curve</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-brand-blue" />
                <span className="text-[10px] font-bold text-muted-foreground">Sharpe Ratio</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="return"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                label={{ value: 'Annualized Return (%)', position: 'bottom', offset: -10, fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={[0, 'auto']}
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
              />
              <ReferenceLine x={returnExpectation[0]} stroke="#14B8A6" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="sharpe"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{ fill: '#0EA5E9', r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}