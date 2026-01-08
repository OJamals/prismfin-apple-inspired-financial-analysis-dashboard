import React, { useState, useId } from 'react';
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
interface MetricsTableCardProps {
  rows: MetricsRow[];
}
export function MetricsTableCard({ rows }: MetricsTableCardProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const layoutGroupId = useId();
  const toggleRow = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };
  return (
    <Card className="rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden">
      <CardHeader className="px-8 pt-10">
        <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">Position Ledger</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <LayoutGroup id={layoutGroupId}>
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest h-12 px-4">Identifier</TableHead>
                  <TableHead className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">Price (USD)</TableHead>
                  <TableHead className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">Delta 24H</TableHead>
                  <TableHead className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right">Yield YTD</TableHead>
                  <TableHead className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest h-12 px-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => {
                  const safeSentiment = row.sentiment ?? 0;
                  const gradientId = `miniFill-${row.symbol}-${idx}`;
                  const isPositive = row.changePct >= 0;
                  return (
                    <React.Fragment key={`${row.symbol}-${idx}`}>
                      <motion.tr
                        layout
                        onClick={() => toggleRow(row.symbol)}
                        className={cn(
                          "border-none group transition-all cursor-pointer rounded-2xl",
                          expandedSymbol === row.symbol ? "bg-muted/15" : "hover:bg-muted/10"
                        )}
                      >
                        <TableCell className="py-6 px-4 rounded-l-3xl">
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-foreground text-sm tracking-tight">{row.name}</span>
                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">{row.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold tabular-nums px-4 whitespace-nowrap text-sm">
                          {formatCurrencyUSD(row.price)}
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tabular-nums ml-auto shadow-sm transition-all",
                            isPositive
                              ? "bg-[#34C759]/10 text-[#34C759] ring-1 ring-[#34C759]/20"
                              : "bg-[#FF3B30]/10 text-[#FF3B30] ring-1 ring-[#FF3B30]/20"
                          )}>
                            {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                            {formatPct(row.changePct)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums px-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-bold",
                            row.ytdPct >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
                          )}>
                            {formatPct(row.ytdPct)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right px-4 rounded-r-3xl">
                          <div className="flex justify-end">
                            <div className={cn(
                              "size-9 rounded-2xl flex items-center justify-center transition-all",
                              expandedSymbol === row.symbol ? "bg-white shadow-soft" : "group-hover:bg-white/80"
                            )}>
                              {expandedSymbol === row.symbol
                                ? <ChevronUp className="size-4 text-brand-blue" />
                                : <ChevronDown className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
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
                                className="overflow-hidden bg-muted/5"
                              >
                                <div className="px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/40">
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                                      <Zap className="size-4 text-amber-500 fill-amber-500" />
                                      Momentum Flux
                                    </div>
                                    <div className="h-32 w-full bg-white/60 rounded-3xl p-5 shadow-sm border border-white/60 ring-1 ring-black/5">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={row.miniSeries}>
                                          <defs>
                                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor={isPositive ? "#34C759" : "#FF3B30"} stopOpacity={0.2}/>
                                              <stop offset="95%" stopColor={isPositive ? "#34C759" : "#FF3B30"} stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={isPositive ? "#34C759" : "#FF3B30"}
                                            strokeWidth={3}
                                            fill={`url(#${gradientId})`}
                                            isAnimationActive={true}
                                          />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                                      <Target className="size-4 text-brand-blue fill-brand-blue" />
                                      Institutional Sentiment
                                    </div>
                                    <div className="space-y-5">
                                      <div className="flex justify-between items-end">
                                        <span className="text-5xl font-bold font-display tabular-nums tracking-tighter text-foreground">{safeSentiment}%</span>
                                        <span className={cn(
                                          "text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ring-1 ring-black/5",
                                          safeSentiment > 70 ? "bg-[#34C759]/10 text-[#34C759]" :
                                          safeSentiment < 30 ? "bg-[#FF3B30]/10 text-[#FF3B30]" : "bg-white text-muted-foreground"
                                        )}>
                                          {safeSentiment > 70 ? 'Greed' : safeSentiment < 30 ? 'Fear' : 'Neutral'}
                                        </span>
                                      </div>
                                      <div className="relative h-2.5 w-full bg-secondary/50 shadow-inner rounded-full overflow-hidden">
                                        <div
                                          className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            safeSentiment > 70 ? "bg-[#34C759]" : safeSentiment < 30 ? "bg-[#FF3B30]" : "bg-brand-blue"
                                          )}
                                          style={{ width: `${safeSentiment}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[2rem] bg-white shadow-soft border border-white/60 hover:shadow-premium transition-all ring-1 ring-black/5">
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter opacity-70">P/E Ratio</p>
                                      <p className="text-xl font-bold tabular-nums text-foreground">{row.peRatio ?? 'N/A'}</p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white shadow-soft border border-white/60 hover:shadow-premium transition-all ring-1 ring-black/5">
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter opacity-70">RSI (14D)</p>
                                      <p className={cn(
                                        "text-xl font-bold tabular-nums",
                                        (row.rsi ?? 50) > 70 ? "text-[#FF3B30]" : (row.rsi ?? 50) < 30 ? "text-[#34C759]" : "text-foreground"
                                      )}>{row.rsi ?? 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2 px-1 space-y-1">
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Volume Dynamics</p>
                                      <p className="text-xs font-bold text-foreground/70 tracking-tight tabular-nums">{row.volume}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </LayoutGroup>
      </CardContent>
    </Card>
  );
}