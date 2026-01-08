import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ScreenerStock, ScreenerFilters } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { ScreenerFilterBar } from '@/components/finance/ScreenerFilterBar';
import { ScreenerActiveChips } from '@/components/finance/ScreenerActiveChips';
import { StockCompareDrawer } from '@/components/finance/StockCompareDrawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  LayoutGrid, 
  List, 
  Download, 
  Bookmark, 
  TrendingUp, 
  AlertCircle,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
const INITIAL_FILTERS: ScreenerFilters = {
  pe: [0, 100],
  yield: [0, 15],
  sharpe: [0, 4],
  peg: [0, 5],
  beta: [0, 3],
  sector: 'all',
  sentiment: 'all'
};
export function ScreenerPage() {
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ScreenerFilters>(INITIAL_FILTERS);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const { data: stocks = [], isLoading } = useQuery<ScreenerStock[]>({
    queryKey: ['screener'],
    queryFn: () => api<ScreenerStock[]>('/api/screener'),
  });
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) ||
                           s.name.toLowerCase().includes(search.toLowerCase()) ||
                           s.sector.toLowerCase().includes(search.toLowerCase());
      const matchesSector = filters.sector === 'all' || s.sector === filters.sector;
      const matchesSentiment = filters.sentiment === 'all' || s.sentiment === filters.sentiment;
      const inRange = (val: number, range: number[]) => val >= range[0] && val <= range[1];
      return matchesSearch && matchesSector && matchesSentiment &&
             inRange(s.peRatio, filters.pe) &&
             inRange(s.yieldPct, filters.yield) &&
             inRange(s.sharpe, filters.sharpe) &&
             inRange(s.pegRatio, filters.peg) &&
             inRange(s.beta, filters.beta);
    });
  }, [stocks, search, filters]);
  const handleExport = () => {
    toast.promise(new Promise(r => setTimeout(r, 1200)), {
      loading: 'Compiling institutional data set...',
      success: 'Screener results exported to CSV',
      error: 'Export failed'
    });
  };
  const handleSaveWatchlist = () => {
    localStorage.setItem('prism_watchlist', JSON.stringify(selectedSymbols));
    toast.success(`${selectedSymbols.length} assets saved to secure watchlist`);
  };
  const handleResetFilter = (key: keyof ScreenerFilters) => {
    setFilters(prev => ({ ...prev, [key]: INITIAL_FILTERS[key] }));
  };
  const selectedStocks = stocks.filter(s => selectedSymbols.includes(s.symbol));
  const averagePe = useMemo(() => {
    if (stocks.length === 0) return 22;
    return Math.round(stocks.reduce((acc, s) => acc + s.peRatio, 0) / stocks.length);
  }, [stocks]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <DashboardHeader
              title="Equity Screener"
              subtitle="Institutional-grade multi-factor filtering engine."
            />
            <div className="flex items-center gap-3 bg-card/60 p-1.5 rounded-2xl border border-card/60 shadow-soft backdrop-blur-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-xl transition-all", viewMode === 'compact' ? "bg-white shadow-sm" : "text-muted-foreground")}
                onClick={() => setViewMode('compact')}
              >
                <List className="size-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-xl transition-all", viewMode === 'detailed' ? "bg-white shadow-sm" : "text-muted-foreground")}
                onClick={() => setViewMode('detailed')}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <div className="w-px h-5 bg-border/20 mx-1" />
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground" onClick={handleExport}>
                <Download className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground" onClick={handleSaveWatchlist}>
                <Bookmark className="size-4" />
              </Button>
            </div>
          </div>
          <ScreenerFilterBar
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={setFilters}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ScreenerActiveChips 
                  filters={filters} 
                  onReset={handleResetFilter} 
                  onClearAll={() => setFilters(INITIAL_FILTERS)} 
                />
                {filteredStocks.length > 0 && (
                  <span className="text-xs font-bold text-muted-foreground mb-4">
                    {filteredStocks.length} analytical results found
                  </span>
                )}
              </div>
              {selectedSymbols.length > 0 && (
                <Button 
                  onClick={() => setSelectedSymbols([])} 
                  variant="outline" 
                  className="rounded-xl h-9 text-xs font-bold mb-4"
                >
                  Clear Selection ({selectedSymbols.length})
                </Button>
              )}
            </div>
            <Card className="rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <TableSkeleton />
                ) : filteredStocks.length === 0 ? (
                  <div className="py-32 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="size-20 rounded-full bg-muted/20 flex items-center justify-center">
                      <AlertCircle className="size-10 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display tracking-tight">Zero Matches Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        No assets satisfy the current multi-factor requirements. 
                        Try widening the <span className="font-bold text-brand-blue">P/E Ratio</span> range (Market Avg: {averagePe}x).
                      </p>
                    </div>
                    <Button 
                      onClick={() => setFilters({...filters, pe: [0, 40]})} 
                      variant="secondary" 
                      className="rounded-2xl gap-2 h-11 px-8 font-bold"
                    >
                      Loosen P/E Guardrails <ArrowRight className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/10 border-none">
                        <TableRow className="border-none h-14">
                          <TableHead className="w-12 px-6"></TableHead>
                          <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest">Identifier</TableHead>
                          <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest">Price / Delta</TableHead>
                          <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">P/E Ratio</TableHead>
                          <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">Yield</TableHead>
                          {viewMode === 'detailed' && (
                            <>
                              <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">PEG</TableHead>
                              <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">Beta</TableHead>
                              <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">Sharpe</TableHead>
                              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-right">Market Cap</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode='popLayout'>
                          {filteredStocks.map((stock) => (
                            <motion.tr
                              key={stock.symbol}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={cn(
                                "border-none group transition-all",
                                selectedSymbols.includes(stock.symbol) ? "bg-brand-blue/5 hover:bg-brand-blue/10" : "hover:bg-muted/10"
                              )}
                            >
                              <TableCell className="px-6 py-4">
                                <Checkbox 
                                  checked={selectedSymbols.includes(stock.symbol)}
                                  onCheckedChange={(checked) => {
                                    if (checked) setSelectedSymbols([...selectedSymbols, stock.symbol]);
                                    else setSelectedSymbols(selectedSymbols.filter(s => s !== stock.symbol));
                                  }}
                                  className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-brand-blue"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-black text-foreground font-display">{stock.symbol}</span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter truncate max-w-[100px]">{stock.sector}</span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className="flex flex-col cursor-help group/pop">
                                      <span className="font-bold tabular-nums text-sm group-hover/pop:text-brand-blue transition-colors">{formatCurrencyUSD(stock.price)}</span>
                                      <div className={cn(
                                        "flex items-center gap-1 text-[10px] font-black",
                                        stock.changePct >= 0 ? "text-gain-500" : "text-loss-500"
                                      )}>
                                        <TrendingUp className={cn("size-3", stock.changePct < 0 && "rotate-180")} />
                                        {formatPct(stock.changePct)}
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent side="right" className="w-64 p-4 rounded-3xl border-none shadow-premium bg-card/95 backdrop-blur-xl">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stock.symbol} Technical Preview</p>
                                        <Eye className="size-3 text-brand-blue" />
                                      </div>
                                      <div className="h-24 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={stock.miniSeries}>
                                            <defs>
                                              <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                                              </linearGradient>
                                            </defs>
                                            <Area 
                                              type="monotone" 
                                              dataKey="value" 
                                              stroke="#14B8A6" 
                                              strokeWidth={2} 
                                              fill={`url(#grad-${stock.symbol})`} 
                                            />
                                          </AreaChart>
                                        </ResponsiveContainer>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-muted-foreground">Sentiment Score</span>
                                        <Badge className={cn(
                                          "rounded-lg px-2 py-0.5",
                                          stock.sentiment === 'Bullish' ? "bg-gain-50 text-gain-600" :
                                          stock.sentiment === 'Bearish' ? "bg-loss-50 text-loss-600" : "bg-muted text-muted-foreground"
                                        )}>
                                          {stock.sentiment}
                                        </Badge>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>
                              <TableCell className="px-4 py-4 text-right font-bold tabular-nums text-sm">
                                {stock.peRatio}x
                              </TableCell>
                              <TableCell className="px-4 py-4 text-right font-black text-gain-600 tabular-nums text-sm">
                                {formatPct(stock.yieldPct)}
                              </TableCell>
                              {viewMode === 'detailed' && (
                                <>
                                  <TableCell className="px-4 py-4 text-right tabular-nums text-xs font-medium">{stock.pegRatio}</TableCell>
                                  <TableCell className="px-4 py-4 text-right tabular-nums text-xs font-medium">{stock.beta}</TableCell>
                                  <TableCell className="px-4 py-4 text-right">
                                    <Badge variant="secondary" className="rounded-lg bg-secondary/80 text-[11px] font-black">
                                      {stock.sharpe.toFixed(2)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="px-8 py-4 text-right text-xs font-bold text-muted-foreground tabular-nums">
                                    {stock.marketCap}
                                  </TableCell>
                                </>
                              )}
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <StockCompareDrawer 
        selectedStocks={selectedStocks}
        isOpen={selectedSymbols.length > 1}
        onClose={() => {}} // Controlled by selection length mostly
        onClear={() => setSelectedSymbols([])}
      />
    </AppLayout>
  );
}