import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsRow } from '@shared/types';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';
interface MetricsTableCardProps {
  rows: MetricsRow[];
}
export function MetricsTableCard({ rows }: MetricsTableCardProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const toggleRow = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-xl font-semibold">Positions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium h-10 px-4">Asset</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10 px-4 text-right">Price</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10 px-4 text-right">Change</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10 px-4 text-right">YTD</TableHead>
                <TableHead className="text-muted-foreground font-medium h-10 px-4 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.symbol}>
                  <TableRow 
                    className={cn(
                      "border-none group transition-all cursor-pointer",
                      expandedSymbol === row.symbol ? "bg-muted/60" : "hover:bg-muted/40"
                    )}
                    onClick={() => toggleRow(row.symbol)}
                  >
                    <TableCell className="py-4 px-4">
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="font-semibold text-foreground">{row.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{row.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums px-4 whitespace-nowrap">
                      {formatCurrencyUSD(row.price)}
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums ml-auto",
                        row.changePct >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {row.changePct >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {formatPct(row.changePct)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums px-4 whitespace-nowrap">
                      <span className={cn(row.ytdPct >= 0 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold")}>
                        {formatPct(row.ytdPct)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-4">
                      {expandedSymbol === row.symbol ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {expandedSymbol === row.symbol && (
                      <TableRow className="border-none hover:bg-transparent">
                        <TableCell colSpan={5} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden bg-muted/20"
                          >
                            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/40">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                  <Zap className="size-3.5 text-amber-500" />
                                  Recent Price Action
                                </div>
                                <div className="h-20 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={row.miniSeries}>
                                      <defs>
                                        <linearGradient id={`miniFill-${row.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                                          <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#14B8A6" 
                                        strokeWidth={2} 
                                        fill={`url(#miniFill-${row.symbol})`} 
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                  <Target className="size-3.5 text-brand-blue" />
                                  Market Sentiment
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold font-display">{row.sentiment}/100</span>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Bullish</span>
                                  </div>
                                  <Progress value={row.sentiment} className="h-1.5 bg-white shadow-inner" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-white/60 shadow-soft border border-white/60">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">P/E Ratio</p>
                                  <p className="text-sm font-bold">{row.peRatio ?? 'N/A'}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/60 shadow-soft border border-white/60">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">RSI (14D)</p>
                                  <p className={cn(
                                    "text-sm font-bold",
                                    (row.rsi ?? 50) > 70 ? "text-rose-600" : (row.rsi ?? 50) < 30 ? "text-emerald-600" : ""
                                  )}>{row.rsi ?? 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Volume</p>
                                  <p className="text-xs font-medium text-foreground">{row.volume}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}