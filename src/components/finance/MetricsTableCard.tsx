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
        <CardTitle className="text-xl font-bold font-display tracking-tight">Portfolio Positions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <LayoutGroup>
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest h-12 px-4">Asset</TableHead>
                  <TableHead className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">Price</TableHead>
                  <TableHead className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">24H Change</TableHead>
                  <TableHead className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">YTD Returns</TableHead>
                  <TableHead className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.symbol}>
                    <motion.tr
                      layout
                      onClick={() => toggleRow(row.symbol)}
                      className={cn(
                        "border-none group transition-all cursor-pointer rounded-2xl",
                        expandedSymbol === row.symbol ? "bg-muted/40" : "hover:bg-muted/20"
                      )}
                    >
                      <TableCell className="py-5 px-4 rounded-l-2xl">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-bold text-foreground text-sm tracking-tight">{row.name}</span>
                          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{row.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums px-4 whitespace-nowrap text-sm">
                        {formatCurrencyUSD(row.price)}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ml-auto shadow-sm",
                          row.changePct >= 0
                            ? "bg-gain-50 text-gain-700 ring-1 ring-gain-100"
                            : "bg-loss-50 text-loss-700 ring-1 ring-loss-100"
                        )}>
                          {row.changePct >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {formatPct(row.changePct)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums px-4 whitespace-nowrap text-sm">
                        <span className={cn(
                          "font-bold",
                          row.ytdPct >= 0 ? "text-gain-600" : "text-loss-600"
                        )}>
                          {formatPct(row.ytdPct)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-4 rounded-r-2xl">
                        <div className="flex justify-end">
                          <div className={cn(
                            "size-8 rounded-full flex items-center justify-center transition-colors",
                            expandedSymbol === row.symbol ? "bg-white shadow-sm" : "group-hover:bg-white/50"
                          )}>
                            {expandedSymbol === row.symbol
                              ? <ChevronUp className="size-4 text-brand-blue" />
                              : <ChevronDown className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground" />
                            }
                          </div>
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
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden bg-muted/10"
                            >
                              <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-white/40">
                                <div className="space-y-5">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                                    Momentum Scan
                                  </div>
                                  <div className="h-28 w-full bg-white/50 rounded-2xl p-4 shadow-sm border border-white/60">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={row.miniSeries}>
                                        <defs>
                                          <linearGradient id={`miniFill-${row.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={row.changePct >= 0 ? "#34C759" : "#FF3B30"} stopOpacity={0.15}/>
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
                                <div className="space-y-5">
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <Target className="size-3.5 text-brand-blue fill-brand-blue" />
                                    Sentiment Index
                                  </div>
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                      <span className="text-4xl font-bold font-display tabular-nums tracking-tighter">{row.sentiment}%</span>
                                      <span className={cn(
                                        "text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm border border-white/60",
                                        row.sentiment > 70 ? "bg-gain-50 text-gain-700" : 
                                        row.sentiment < 30 ? "bg-loss-50 text-loss-700" : "bg-white text-muted-foreground"
                                      )}>
                                        {row.sentiment > 70 ? 'Greed' : row.sentiment < 30 ? 'Fear' : 'Neutral'}
                                      </span>
                                    </div>
                                    <div className="relative h-2 w-full bg-white shadow-inner rounded-full overflow-hidden">
                                      <div 
                                        className={cn(
                                          "h-full rounded-full transition-all duration-700",
                                          row.sentiment > 70 ? "bg-gain-500" : row.sentiment < 30 ? "bg-loss-500" : "bg-brand-blue"
                                        )}
                                        style={{ width: `${row.sentiment}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                  <div className="p-5 rounded-3xl bg-white shadow-soft border border-white/60 hover:shadow-md transition-all">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-tighter">P/E Ratio</p>
                                    <p className="text-lg font-bold tabular-nums text-foreground">{row.peRatio ?? 'N/A'}</p>
                                  </div>
                                  <div className="p-5 rounded-3xl bg-white shadow-soft border border-white/60 hover:shadow-md transition-all">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-tighter">RSI (14D)</p>
                                    <p className={cn(
                                      "text-lg font-bold tabular-nums",
                                      (row.rsi ?? 50) > 70 ? "text-loss-500" : (row.rsi ?? 50) < 30 ? "text-gain-500" : "text-foreground"
                                    )}>{row.rsi ?? 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2 px-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest opacity-50">Volume (Cap)</p>
                                    <p className="text-xs font-bold text-foreground/80 tracking-tight">{row.volume}</p>
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