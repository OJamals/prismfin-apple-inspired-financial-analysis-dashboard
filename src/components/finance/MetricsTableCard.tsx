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
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
    <Card className="rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-xl font-bold font-display">Portfolio Positions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <LayoutGroup>
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-widest h-10 px-4">Asset</TableHead>
                  <TableHead className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-widest h-10 px-4 text-right">Price</TableHead>
                  <TableHead className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-widest h-10 px-4 text-right">24H Change</TableHead>
                  <TableHead className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-widest h-10 px-4 text-right">YTD Performance</TableHead>
                  <TableHead className="text-muted-foreground/60 text-[11px] font-bold uppercase tracking-widest h-10 px-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.symbol}>
                    <motion.tr
                      layout
                      onClick={() => toggleRow(row.symbol)}
                      className={cn(
                        "border-none group transition-colors cursor-pointer rounded-xl",
                        expandedSymbol === row.symbol ? "bg-muted/60" : "hover:bg-muted/30"
                      )}
                    >
                      <TableCell className="py-4 px-4 rounded-l-2xl">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-bold text-foreground">{row.name}</span>
                          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{row.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums px-4 whitespace-nowrap">
                        {formatCurrencyUSD(row.price)}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ml-auto shadow-sm",
                          row.changePct >= 0 
                            ? "bg-gain-50 text-gain-700 ring-1 ring-gain-100" 
                            : "bg-loss-50 text-loss-700 ring-1 ring-loss-100"
                        )}>
                          {row.changePct >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {formatPct(row.changePct)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums px-4 whitespace-nowrap">
                        <span className={cn(
                          "font-bold",
                          row.ytdPct >= 0 ? "text-gain-600" : "text-loss-600"
                        )}>
                          {formatPct(row.ytdPct)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-4 rounded-r-2xl">
                        <div className="flex justify-end">
                          {expandedSymbol === row.symbol 
                            ? <ChevronUp className="size-4 text-brand-blue" /> 
                            : <ChevronDown className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
                          }
                        </div>
                      </TableCell>
                    </motion.tr>
                    <AnimatePresence initial={false}>
                      {expandedSymbol === row.symbol && (
                        <TableRow className="border-none hover:bg-transparent">
                          <TableCell colSpan={5} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1.4] }}
                              className="overflow-hidden bg-muted/20"
                            >
                              <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/60">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                                    Price Momentum
                                  </div>
                                  <div className="h-24 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={row.miniSeries}>
                                        <defs>
                                          <linearGradient id={`miniFill-${row.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={row.changePct >= 0 ? "#34C759" : "#FF3B30"} stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor={row.changePct >= 0 ? "#34C759" : "#FF3B30"} stopOpacity={0}/>
                                          </linearGradient>
                                        </defs>
                                        <Area
                                          type="monotone"
                                          dataKey="value"
                                          stroke={row.changePct >= 0 ? "#34C759" : "#FF3B30"}
                                          strokeWidth={2.5}
                                          fill={`url(#miniFill-${row.symbol})`}
                                          isAnimationActive={true}
                                        />
                                      </AreaChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <Target className="size-3.5 text-brand-blue fill-brand-blue" />
                                    Market Sentiment
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                      <span className="text-3xl font-bold font-display tabular-nums tracking-tighter">{row.sentiment}%</span>
                                      <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                        row.sentiment > 70 ? "bg-gain-100 text-gain-700" : "bg-muted text-muted-foreground"
                                      )}>
                                        {row.sentiment > 70 ? 'Greed' : row.sentiment < 30 ? 'Fear' : 'Neutral'}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={row.sentiment} 
                                      className="h-2 bg-white/50 shadow-inner" 
                                      // @ts-expect-error - shadcn progress indicator styling requires non-standard prop
                                      indicatorClassName={row.sentiment > 70 ? "bg-gain-500" : row.sentiment < 30 ? "bg-loss-500" : "bg-brand-blue"}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl bg-white shadow-soft border border-white/60 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">P/E Ratio</p>
                                    <p className="text-base font-bold tabular-nums">{row.peRatio ?? 'N/A'}</p>
                                  </div>
                                  <div className="p-4 rounded-2xl bg-white shadow-soft border border-white/60 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">RSI (14D)</p>
                                    <p className={cn(
                                      "text-base font-bold tabular-nums",
                                      (row.rsi ?? 50) > 70 ? "text-loss-500" : (row.rsi ?? 50) < 30 ? "text-gain-500" : ""
                                    )}>{row.rsi ?? 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2 px-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">Market Cap (Vol)</p>
                                    <p className="text-xs font-bold text-foreground">{row.volume}</p>
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
        </LayoutGroup>
      </CardContent>
    </Card>
  );
}