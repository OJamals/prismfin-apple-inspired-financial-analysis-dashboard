import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ScreenerStock } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { ScreenerFilterBar } from '@/components/finance/ScreenerFilterBar';
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
export function ScreenerPage() {
  const { data: stocks = [], isLoading } = useQuery<ScreenerStock[]>({
    queryKey: ['screener'],
    queryFn: () => api<ScreenerStock[]>('/api/screener'),
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    pe: [0, 100],
    yield: [0, 10],
    sharpe: [0, 4],
    sector: 'all'
  });
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) || 
                           s.name.toLowerCase().includes(search.toLowerCase());
      const matchesSector = filters.sector === 'all' || s.sector === filters.sector;
      const matchesPe = s.peRatio >= filters.pe[0] && s.peRatio <= filters.pe[1];
      const matchesYield = s.yieldPct >= filters.yield[0] && s.yieldPct <= filters.yield[1];
      const matchesSharpe = s.sharpe >= filters.sharpe[0] && s.sharpe <= filters.sharpe[1];
      return matchesSearch && matchesSector && matchesPe && matchesYield && matchesSharpe;
    });
  }, [stocks, search, filters]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader 
            title="Market Screener" 
            subtitle="Institutional-grade equity filtering across 50+ global symbols."
          />
          <ScreenerFilterBar 
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={setFilters}
          />
          <Card className="rounded-4xl border border-white/40 shadow-soft bg-card overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-none">
                        <TableHead className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Asset</TableHead>
                        <TableHead className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest">Sector</TableHead>
                        <TableHead className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Price</TableHead>
                        <TableHead className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-right">P/E</TableHead>
                        <TableHead className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Yield</TableHead>
                        <TableHead className="px-4 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Sharpe</TableHead>
                        <TableHead className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Market Cap</TableHead>
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
                            exit={{ opacity: 0 }}
                            className="border-none hover:bg-muted/10 transition-colors group cursor-default"
                          >
                            <TableCell className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground">{stock.symbol}</span>
                                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{stock.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-5">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary/50 text-secondary-foreground">
                                {stock.sector}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-5 text-right font-bold tabular-nums">
                              {formatCurrencyUSD(stock.price)}
                            </TableCell>
                            <TableCell className="px-4 py-5 text-right font-medium tabular-nums">
                              {stock.peRatio}x
                            </TableCell>
                            <TableCell className="px-4 py-5 text-right font-bold text-gain-600 tabular-nums">
                              {formatPct(stock.yieldPct)}
                            </TableCell>
                            <TableCell className="px-4 py-5 text-right">
                              <div className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black tabular-nums shadow-sm",
                                stock.sharpe > 1.5 ? "bg-gain-50 text-gain-700" : "bg-muted text-muted-foreground"
                              )}>
                                {stock.sharpe.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell className="px-8 py-5 text-right text-xs font-bold text-muted-foreground tabular-nums">
                              {stock.marketCap}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                  {filteredStocks.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground font-medium">No assets matching your filtering criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}