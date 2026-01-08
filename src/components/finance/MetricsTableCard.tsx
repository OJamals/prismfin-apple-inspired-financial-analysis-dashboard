import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { MetricsRow } from '@shared/types';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import {
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  Zap, Target, Newspaper, Search, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
interface MetricsTableCardProps {
  rows: MetricsRow[];
}
export function MetricsTableCard({ rows }: MetricsTableCardProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const layoutGroupId = useId().replace(/[^a-zA-Z0-9]/g, '-');
  const navigate = useNavigate();
  const toggleRow = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };
  const findSimilar = (row: MetricsRow) => {
    const params = new URLSearchParams();
    // Intelligent factor mapping based on asset class
    if (row.class === 'equity') {
      params.set('pe_min', (row.price / 10).toFixed(0)); // Mock logic: range around current price/earnings
      params.set('pe_max', (row.price / 2).toFixed(0));
      params.set('beta_min', '0.5');
      params.set('beta_max', '1.5');
    } else if (row.class === 'crypto') {
      params.set('sentiment', 'Bullish');
      params.set('beta_min', '1.5');
    }
    navigate(`/screener?${params.toString()}`);
    toast.success(`Scanning factor engine for assets similar to ${row.symbol}`);
  };
  const copyTicker = (symbol: string) => {
    navigator.clipboard.writeText(symbol);
    toast.success(`${symbol} copied to clipboard`);
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
                <TableRow className="border-none hover:bg-transparent text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  <TableHead className="px-4">Identifier</TableHead>
                  <TableHead className="px-4 text-right">Price (USD)</TableHead>
                  <TableHead className="px-4 text-right">Delta 24H</TableHead>
                  <TableHead className="px-4 text-right">Yield YTD</TableHead>
                  <TableHead className="px-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => {
                  const isExpanded = expandedSymbol === row.symbol;
                  const gradientId = `miniFill-${row.symbol}-${idx}-${layoutGroupId}`;
                  const isPositive = row.changePct >= 0;
                  const hasMiniSeries = row.miniSeries && row.miniSeries.length > 0;
                  return (
                    <React.Fragment key={`${row.symbol}-${idx}`}>
                      <TableRow className="border-none p-0 h-0">
                        <TableCell colSpan={5} className="p-0 h-0 border-none">
                          <ContextMenu>
                            <ContextMenuTrigger asChild>
                              <div
                                onClick={() => toggleRow(row.symbol)}
                                className={cn(
                                  "flex items-center w-full py-6 px-2 rounded-2xl transition-all cursor-pointer group",
                                  isExpanded ? "bg-muted/15" : "hover:bg-muted/10"
                                )}
                              >
                                <div className="flex-1 px-4 flex flex-col">
                                  <span className="font-bold text-foreground text-sm tracking-tight">{row.name}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">{row.symbol}</span>
                                </div>
                                <div className="w-32 text-right font-bold tabular-nums px-4 text-sm">{formatCurrencyUSD(row.price)}</div>
                                <div className="w-32 text-right px-4">
                                  <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tabular-nums shadow-sm",
                                    isPositive ? "bg-gain-500/10 text-gain-500" : "bg-loss-500/10 text-loss-500"
                                  )}>
                                    {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    {formatPct(row.changePct)}
                                  </div>
                                </div>
                                <div className="w-32 text-right tabular-nums px-4 text-sm">
                                  <span className={cn("font-bold", row.ytdPct >= 0 ? "text-gain-500" : "text-loss-500")}>
                                    {formatPct(row.ytdPct)}
                                  </span>
                                </div>
                                <div className="w-16 flex justify-end px-4">
                                  <div className={cn("size-8 rounded-xl flex items-center justify-center transition-all", isExpanded ? "bg-white shadow-soft" : "group-hover:bg-white/80")}>
                                    {isExpanded ? <ChevronUp className="size-4 text-brand-blue" /> : <ChevronDown className="size-4 text-muted-foreground/30" />}
                                  </div>
                                </div>
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-64 rounded-2xl bg-card/95 backdrop-blur-xl border-white/10 shadow-premium p-2">
                              <ContextMenuItem onClick={() => findSimilar(row)} className="rounded-xl px-4 py-3 gap-3">
                                <Search className="size-4 text-brand-blue" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs">Find Similar</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">Open in Screener</span>
                                </div>
                              </ContextMenuItem>
                              <ContextMenuItem onClick={() => navigate(`/sentiment?ticker=${row.symbol}`)} className="rounded-xl px-4 py-3 gap-3">
                                <Newspaper className="size-4 text-brand-teal" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs">Analyze Sentiment</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">Institutional News Feed</span>
                                </div>
                              </ContextMenuItem>
                              <ContextMenuSeparator className="bg-border/5 my-1" />
                              <ContextMenuItem onClick={() => copyTicker(row.symbol)} className="rounded-xl px-4 py-3 gap-3">
                                <Copy className="size-4 text-muted-foreground" />
                                <span className="font-bold text-xs">Copy Ticker</span>
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        </TableCell>
                      </TableRow>
                      <AnimatePresence>
                        {isExpanded && (
                          <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={5} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-muted/5 border-t border-white/40"
                              >
                                <div className="px-10 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                                      <Zap className="size-4 text-amber-500 fill-amber-500" /> Momentum Flux
                                    </div>
                                    <div className="h-32 w-full bg-white/60 rounded-3xl p-5 shadow-sm ring-1 ring-black/5">
                                      {hasMiniSeries ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={row.miniSeries}>
                                            <defs>
                                              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isPositive ? "#34C759" : "#FF3B30"} stopOpacity={0.15}/>
                                                <stop offset="95%" stopColor={isPositive ? "#34C759" : "#FF3B30"} stopOpacity={0}/>
                                              </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="value" stroke={isPositive ? "#34C759" : "#FF3B30"} strokeWidth={3} fill={`url(#${gradientId})`} />
                                          </AreaChart>
                                        </ResponsiveContainer>
                                      ) : (
                                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                                          Loading trend data...
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                                      <Newspaper className="size-4 text-brand-blue" /> Contextual Intelligence
                                    </div>
                                    <div className="space-y-3">
                                      {row.news && row.news.length > 0 ? row.news.slice(0, 3).map((n, i) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                                          <p className="text-xs font-bold text-foreground truncate flex-1 pr-4">{n.headline}</p>
                                          <Badge className="rounded-lg bg-secondary/80 text-[10px] font-black text-muted-foreground">{n.score}%</Badge>
                                        </div>
                                      )) : (
                                        <div className="p-4 text-center text-xs text-muted-foreground bg-white/40 rounded-2xl">
                                          No recent headlines for {row.symbol}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">
                                      <Target className="size-4 text-brand-blue fill-brand-blue" /> Sentiment
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-end">
                                        <span className="text-4xl font-bold font-display">{row.sentiment}%</span>
                                        <Badge className="rounded-lg bg-gain-50 text-gain-700 font-bold uppercase tracking-widest text-[9px]">Stable</Badge>
                                      </div>
                                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-blue" style={{ width: `${row.sentiment}%` }} />
                                      </div>
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