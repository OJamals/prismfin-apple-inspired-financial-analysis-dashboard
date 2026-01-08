import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import { ScreenerStock } from '@shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X, TrendingUp, Shield, Zap, Target } from 'lucide-react';
interface StockCompareDrawerProps {
  selectedStocks: ScreenerStock[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}
export function StockCompareDrawer({ selectedStocks, isOpen, onClose, onClear }: StockCompareDrawerProps) {
  if (selectedStocks.length === 0) return null;
  // Normalize data for chart
  const chartData = Array.from({ length: 10 }).map((_, i) => {
    const point: any = { label: `T-${9-i}` };
    selectedStocks.forEach(s => {
      point[s.symbol] = s.miniSeries[i].value;
    });
    return point;
  });
  const colors = ['#0EA5E9', '#14B8A6', '#6366F1', '#F59E0B'];
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[80vh] bg-card/95 backdrop-blur-3xl border-t border-white/20">
        <div className="max-w-7xl mx-auto w-full px-8 overflow-y-auto scrollbar-hide">
          <DrawerHeader className="px-0 py-8 border-b border-border/5">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-3xl font-bold font-display tracking-tight">Factor Comparison Engine</DrawerTitle>
                <DrawerDescription className="text-muted-foreground font-medium">Side-by-side analysis of {selectedStocks.length} selected institutional assets.</DrawerDescription>
              </div>
              <Button variant="ghost" onClick={onClear} className="text-xs font-bold uppercase tracking-widest text-loss-500 hover:bg-loss-50">Clear Selection</Button>
            </div>
          </DrawerHeader>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-10">
            {selectedStocks.map((stock, idx) => (
              <Card key={stock.symbol} className="rounded-3xl border-none shadow-soft bg-white/50 ring-1 ring-black/5">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-black font-display text-brand-blue">{stock.symbol}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{stock.name}</span>
                    </div>
                    <div className="size-8 rounded-full" style={{ backgroundColor: colors[idx % colors.length], opacity: 0.2 }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">P/E Ratio</p>
                      <p className="text-lg font-bold tabular-nums">{stock.peRatio}x</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dividend</p>
                      <p className="text-lg font-bold tabular-nums text-gain-600">{formatPct(stock.yieldPct)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PEG Ratio</p>
                      <p className="text-lg font-bold tabular-nums">{stock.pegRatio}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Beta</p>
                      <p className="text-lg font-bold tabular-nums">{stock.beta}</p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap className="size-3.5 text-brand-teal" />
                       <span className="text-[10px] font-black uppercase text-muted-foreground">Sharpe</span>
                    </div>
                    <span className="text-sm font-black">{stock.sharpe.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-[300px] mb-12 p-8 bg-card/40 rounded-4xl border border-white/20 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="label" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
                />
                <Legend iconType="circle" />
                {selectedStocks.map((stock, idx) => (
                  <Line
                    key={stock.symbol}
                    type="monotone"
                    dataKey={stock.symbol}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={4}
                    dot={false}
                    animationDuration={1000}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}