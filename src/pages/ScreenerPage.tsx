import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
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
  LayoutGrid,
  List,
  Download,
  Bookmark,
  TrendingUp,
  AlertCircle,
  Eye,
  ArrowRight,
  Share2
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ScreenerFilters>(INITIAL_FILTERS);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  useEffect(() => {
    const sector = searchParams.get('sector') || 'all';
    const peMin = parseInt(searchParams.get('pe_min') || '0');
    const peMax = parseInt(searchParams.get('pe_max') || '100');
    if (sector !== 'all' || peMin !== 0 || peMax !== 100) {
      setFilters(prev => ({
        ...prev,
        sector,
        pe: [peMin, peMax]
      }));
    }
  }, [searchParams]);
  const { data: stocks = [], isLoading } = useQuery<ScreenerStock[]>({
    queryKey: ['screener'],
    queryFn: () => api<ScreenerStock[]>('/api/screener'),
  });
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) ||
                           s.name.toLowerCase().includes(search.toLowerCase());
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
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Analytical view link copied to clipboard');
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <DashboardHeader title="Equity Screener" subtitle="Cross-sectional factor engine." />
            <div className="flex items-center gap-3 bg-card/60 p-1.5 rounded-2xl border border-card/60 shadow-soft backdrop-blur-md">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('compact')} className={cn("rounded-xl transition-all", viewMode === 'compact' && "bg-white shadow-sm")}>
                <List className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('detailed')} className={cn("rounded-xl transition-all", viewMode === 'detailed' && "bg-white shadow-sm")}>
                <LayoutGrid className="size-4" />
              </Button>
              <div className="w-px h-5 bg-border/20 mx-1" />
              <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-xl text-muted-foreground hover:text-brand-blue">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>
          <ScreenerFilterBar search={search} onSearchChange={setSearch} filters={filters} onFilterChange={setFilters} />
          <div className="space-y-4">
            <ScreenerActiveChips filters={filters} onReset={(key) => setFilters({...filters, [key]: INITIAL_FILTERS[key]})} onClearAll={() => setFilters(INITIAL_FILTERS)} />
            <Card className="rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <TableSkeleton />
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
                              <TableHead className="px-4 text-[10px] font-black uppercase tracking-widest text-right">Sharpe</TableHead>
                              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-right">Market Cap</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode='popLayout'>
                          {filteredStocks.map((stock) => (
                            <motion.tr key={stock.symbol} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("border-none hover:bg-muted/10 transition-all", selectedSymbols.includes(stock.symbol) && "bg-brand-blue/5")}>
                              <TableCell className="px-6 py-4">
                                <Checkbox checked={selectedSymbols.includes(stock.symbol)} onCheckedChange={(checked) => checked ? setSelectedSymbols([...selectedSymbols, stock.symbol]) : setSelectedSymbols(selectedSymbols.filter(s => s !== stock.symbol))} className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-brand-blue" />
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-black text-foreground font-display">{stock.symbol}</span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter truncate max-w-[100px]">{stock.sector}</span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold tabular-nums text-sm">{formatCurrencyUSD(stock.price)}</span>
                                  <div className={cn("flex items-center gap-1 text-[10px] font-black", stock.changePct >= 0 ? "text-gain-500" : "text-loss-500")}>
                                    {formatPct(stock.changePct)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4 text-right font-bold tabular-nums text-sm">{stock.peRatio}x</TableCell>
                              <TableCell className="px-4 py-4 text-right font-black text-gain-600 tabular-nums text-sm">{formatPct(stock.yieldPct)}</TableCell>
                              {viewMode === 'detailed' && (
                                <>
                                  <TableCell className="px-4 py-4 text-right tabular-nums text-xs">{stock.pegRatio}</TableCell>
                                  <TableCell className="px-4 py-4 text-right">
                                    <Badge variant="secondary" className="rounded-lg bg-secondary/80 text-[11px] font-black">{stock.sharpe.toFixed(2)}</Badge>
                                  </TableCell>
                                  <TableCell className="px-8 py-4 text-right text-xs font-bold text-muted-foreground">{stock.marketCap}</TableCell>
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
      <StockCompareDrawer selectedStocks={stocks.filter(s => selectedSymbols.includes(s.symbol))} isOpen={selectedSymbols.length > 1} onClose={() => {}} onClear={() => setSelectedSymbols([])} />
    </AppLayout>
  );
}