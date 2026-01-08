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
  Zap, Target, Newspaper, Search, Copy, Play, Activity, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SimulateChangeDrawer } from './SimulateChangeDrawer';
interface MetricsTableCardProps {
  rows: MetricsRow[];
}
export function MetricsTableCard({ rows }: MetricsTableCardProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [simTarget, setSimTarget] = useState<MetricsRow | null>(null);
  const layoutGroupId = useId().replace(/[^a-zA-Z0-9]/g, '-');
  const navigate = useNavigate();
  const toggleRow = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };
  return (
    <Card className="rounded-4xl border border-border/40 shadow-soft bg-card overflow-hidden">
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
                  const isImproving = row.isImproving;
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
                                <div className="flex-1 px-4 flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground text-sm tracking-tight">{row.name}</span>
                                    {row.tags?.map(tag => (
                                      <Badge key={tag} className={cn(
                                        "rounded-lg px-2 py-0 text-[8px] font-black uppercase border-none",
                                        tag === 'High Vol' ? "bg-rose-500/10 text-rose-500" :
                                        tag === 'Inst Fav' ? "bg-indigo-500/10 text-indigo-500" :
                                        "bg-brand-teal/10 text-brand-teal"
                                      )}>
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">{row.symbol}</span>
                                </div>
                                <div className="w-32 text-right font-bold tabular-nums px-4 text-sm">{formatCurrencyUSD(row.price)}</div>
                                <div className="w-32 text-right px-4">
                                  <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tabular-nums shadow-sm",
                                    isPositive ? "bg-gain-500/10 text-gain-500" : "bg-loss-500/10 text-loss-500"
                                  )}>
                                    {isImproving ? (
                                      <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <TrendingUp className="size-3" />
                                      </motion.div>
                                    ) : (
                                      isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />
                                    )}
                                    {formatPct(row.changePct)}
                                  </div>
                                </div>
                                <div className="w-32 text-right tabular-nums px-4 text-sm">
                                  <span className={cn("font-bold", row.ytdPct >= 0 ? "text-gain-500" : "text-loss-500")}>
                                    {formatPct(row.ytdPct)}
                                  </span>
                                </div>
                                <div className="w-16 flex justify-end px-4">
                                    <div className={cn("size-8 rounded-xl flex items-center justify-center transition-all", isExpanded ? "bg-card shadow-soft" : "group-hover:bg-card/80")}>
                                    {isExpanded ? <ChevronUp className="size-4 text-brand-blue" /> : <ChevronDown className="size-4 text-muted-foreground/30" />}
                                  </div>
                                </div>
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-64 rounded-2xl bg-card/95 backdrop-blur-xl ring-1 ring-border/20 shadow-premium p-2">
                              <ContextMenuItem onClick={() => setSimTarget(row)} className="rounded-xl px-4 py-3 gap-3">
                                <Play className="size-4 text-amber-500" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs">Simulate Change</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">Open Paper Mode</span>
                                </div>
                              </ContextMenuItem>
                              <ContextMenuItem onClick={() => navigate(`/screener?sector=${row.sector || 'Technology'}&sentiment=${row.sentiment > 50 ? 'Bullish' : 'Neutral'}`)} className="rounded-xl px-4 py-3 gap-3">
                                <Search className="size-4 text-indigo-500" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs">Find Similar</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">Cross-Sector Analysis</span>
                                </div>
                              </ContextMenuItem>
                              <ContextMenuSeparator className="bg-border/20 my-1" />
                              <ContextMenuItem onClick={() => navigate(`/sentiment?ticker=${row.symbol}`)} className="rounded-xl px-4 py-3 gap-3">
                                <Newspaper className="size-4 text-brand-teal" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs">Analyze Sentiment</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">Institutional News Feed</span>
                                </div>
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
                                className="overflow-hidden bg-muted/5 border-t border-border/40"
                              >
                                <div className="px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                                  {/* Mini Trend Section */}
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Activity className="size-4 text-brand-blue" />
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Historical Trend</p>
                                    </div>
                                    <div className="h-32 w-full bg-card/40 backdrop-blur-sm rounded-3xl p-4 ring-1 ring-border/20">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={row.miniSeries}>
                                          <defs>
                                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor={isPositive ? "#14B8A6" : "#FF3B30"} stopOpacity={0.2} />
                                              <stop offset="95%" stopColor={isPositive ? "#14B8A6" : "#FF3B30"} stopOpacity={0} />
                                            </linearGradient>
                                          </defs>
                                          <XAxis hide dataKey="label" />
                                          <YAxis hide domain={['auto', 'auto']} />
                                          <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={isPositive ? "#14B8A6" : "#FF3B30"}
                                            strokeWidth={3}
                                            fill={`url(#${gradientId})`}
                                          />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                  {/* Technical Profile Section */}
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                      <Target className="size-4 text-brand-teal" />
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical Profile</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">P/E Ratio</p>
                                        <p className="text-sm font-black tabular-nums">{row.peRatio ?? '24.5'}x</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">RSI (14)</p>
                                        <p className="text-sm font-black tabular-nums">{row.rsi ?? '58.2'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">24H Vol</p>
                                        <p className="text-sm font-black tabular-nums">{row.volume ?? '12.4M'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Sentiment</p>
                                        <p className="text-sm font-black tabular-nums">{row.sentiment ?? '72'}%</p>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Signal Stream Section */}
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Newspaper className="size-4 text-indigo-500" />
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Signal Stream</p>
                                    </div>
                                    <div className="space-y-3">
                                      {row.news?.slice(0, 2).map((news, nIdx) => (
                                        <div key={nIdx} className="p-3 bg-card/40 backdrop-blur-sm rounded-2xl ring-1 ring-border/20 hover:bg-card transition-colors cursor-pointer group/news">
                                          <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2 group-hover/news:text-brand-blue">{news.headline}</p>
                                          <div className="flex items-center justify-between mt-2">
                                            <span className="text-[8px] font-black uppercase text-muted-foreground/60">PRISM SIGNAL</span>
                                            <Badge className="bg-brand-blue/10 text-brand-blue border-none text-[8px] h-4">{news.score}% Match</Badge>
                                          </div>
                                        </div>
                                      )) ?? (
                                        <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                                          <Info className="size-8 mb-2" />
                                          <p className="text-[10px] font-bold">No active news signals</p>
                                        </div>
                                      )}
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
      {simTarget && (
        <SimulateChangeDrawer
          isOpen={!!simTarget}
          onClose={() => setSimTarget(null)}
          assetName={simTarget.name}
        />
      )}
    </Card>
  );
}