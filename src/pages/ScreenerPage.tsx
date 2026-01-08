import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { api } from '@/lib/api-client';
import { ScreenerStock } from '@shared/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { cn } from '@/lib/utils';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
type SortField = 'symbol' | 'price' | 'peRatio' | 'divYield' | 'rsi' | 'score' | 'volatility';
type SortDir = 'asc' | 'desc';
export function ScreenerPage() {
  const [peMax, setPeMax] = useState('100');
  const [yieldMin, setYieldMin] = useState([0]);
  const [volMax, setVolMax] = useState([100]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: 'score', dir: 'desc' });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const { data: stocks = [], isLoading } = useQuery<(ScreenerStock & { volatility: number })[]>({
    queryKey: ['screener', peMax],
    queryFn: () => api<(ScreenerStock & { volatility: number })[]>(`/api/screener?peMax=${peMax}`),
  });
  const processedStocks = useMemo(() => {
    let result = stocks.filter(s =>
      (s.symbol.toLowerCase().includes(search.toLowerCase()) ||
       s.name.toLowerCase().includes(search.toLowerCase())) &&
      s.divYield >= yieldMin[0] &&
      s.volatility <= volMax[0]
    );
    result.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sort.dir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [stocks, search, yieldMin, volMax, sort]);
  const paginatedStocks = processedStocks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(processedStocks.length / PAGE_SIZE);
  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return null;
    return sort.dir === 'asc' ? <ChevronUp className="size-3 ml-1" /> : <ChevronDown className="size-3 ml-1" />;
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader
            title="Market Screener"
            subtitle="Scan the global equity markets using proprietary quantitative filters and density analysis."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-card/60 shadow-soft ring-1 ring-border/10">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Ticker or name..."
                  className="pl-9 bg-card border-none rounded-xl h-10 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">P/E Under</Label>
              <Select value={peMax} onValueChange={setPeMax}>
                <SelectTrigger className="bg-card border-none rounded-xl h-10 font-bold text-xs uppercase tracking-widest shadow-sm">
                  <SelectValue placeholder="P/E Ratio" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-premium">
                  <SelectItem value="15">Under 15</SelectItem>
                  <SelectItem value="30">Under 30</SelectItem>
                  <SelectItem value="100">Any Ratio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min Yield</Label>
                <span className="text-xs font-bold text-brand-blue">{yieldMin[0]}%</span>
              </div>
              <Slider value={yieldMin} onValueChange={setYieldMin} max={5} step={0.1} className="py-2" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max Volatility</Label>
                <span className="text-xs font-bold text-rose-500">{volMax[0]}%</span>
              </div>
              <Slider value={volMax} onValueChange={setVolMax} max={100} step={1} className="py-2" />
            </div>
          </div>
          <Card className="rounded-4xl border-none shadow-soft overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-none">
                        <TableHead className="px-8 cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('symbol')}>
                          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest h-12">
                            Asset <SortIcon field="symbol" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('price')}>
                          <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest h-12">
                            Price <SortIcon field="price" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('peRatio')}>
                          <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest h-12">
                            P/E <SortIcon field="peRatio" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('divYield')}>
                          <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest h-12">
                            Yield <SortIcon field="divYield" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('volatility')}>
                          <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest h-12">
                            Vol <SortIcon field="volatility" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right px-8 min-w-[150px] cursor-pointer hover:text-brand-blue transition-colors" onClick={() => handleSort('score')}>
                          <div className="flex items-center justify-end text-[10px] font-bold uppercase tracking-widest h-12">
                            Score <SortIcon field="score" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStocks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">No stocks match these filters</TableCell>
                        </TableRow>
                      ) : (
                        paginatedStocks.map((stock) => (
                          <TableRow key={stock.symbol} className="border-none hover:bg-muted/20 transition-colors group">
                            <TableCell className="py-6 px-8">
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground text-sm tracking-tight">{stock.name}</span>
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{stock.symbol}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold tabular-nums text-sm px-4">
                              <div className="flex flex-col items-end">
                                {formatCurrencyUSD(stock.price)}
                                <span className={cn("text-[10px]", stock.changePct >= 0 ? "text-gain-500" : "text-loss-500")}>
                                  {formatPct(stock.changePct)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums text-sm px-4">{stock.peRatio.toFixed(1)}x</TableCell>
                            <TableCell className="text-right font-medium tabular-nums text-sm px-4">{stock.divYield.toFixed(2)}%</TableCell>
                            <TableCell className="text-right font-medium tabular-nums text-sm px-4">{stock.volatility.toFixed(1)}%</TableCell>
                            <TableCell className="text-right px-8 min-w-[150px]">
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="text-xs font-bold text-brand-blue">{Math.floor(stock.score)}/100</span>
                                <Progress value={stock.score} className="h-1.5 w-24 bg-secondary" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              {totalPages > 1 && (
                <div className="p-6 border-t border-muted/20 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">
                    Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, processedStocks.length)} of {processedStocks.length} assets
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-8 w-8"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-bold px-2">{page} / {totalPages}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-8 w-8"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}