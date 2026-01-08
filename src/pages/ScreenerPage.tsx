import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { api } from '@/lib/api-client';
import { ScreenerStock } from '@shared/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
export function ScreenerPage() {
  const [peMax, setPeMax] = useState('100');
  const [yieldMin, setYieldMin] = useState('0');
  const [rsiMin, setRsiMin] = useState('0');
  const [search, setSearch] = useState('');
  const { data: stocks = [], isLoading } = useQuery<ScreenerStock[]>({
    queryKey: ['screener', peMax, yieldMin, rsiMin],
    queryFn: () => api<ScreenerStock[]>(`/api/screener?peMax=${peMax}&yieldMin=${yieldMin}&rsiMin=${rsiMin}`),
  });
  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader 
            title="Market Screener" 
            subtitle="Scan the global equity markets using proprietary quantitative filters."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-card/40 backdrop-blur-md border border-card/60 shadow-soft ring-1 ring-border/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Ticker or name..." 
                className="pl-9 bg-card border-none rounded-xl h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={peMax} onValueChange={setPeMax}>
              <SelectTrigger className="bg-card border-none rounded-xl h-10 font-bold text-xs uppercase tracking-widest">
                <SelectValue placeholder="P/E Ratio" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-premium">
                <SelectItem value="15">P/E Under 15</SelectItem>
                <SelectItem value="30">P/E Under 30</SelectItem>
                <SelectItem value="100">Any P/E</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yieldMin} onValueChange={setYieldMin}>
              <SelectTrigger className="bg-card border-none rounded-xl h-10 font-bold text-xs uppercase tracking-widest">
                <SelectValue placeholder="Yield" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-premium">
                <SelectItem value="0">Any Yield</SelectItem>
                <SelectItem value="2">Yield > 2%</SelectItem>
                <SelectItem value="4">Yield > 4%</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rsiMin} onValueChange={setRsiMin}>
              <SelectTrigger className="bg-card border-none rounded-xl h-10 font-bold text-xs uppercase tracking-widest">
                <SelectValue placeholder="RSI" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-premium">
                <SelectItem value="0">Any RSI</SelectItem>
                <SelectItem value="30">RSI > 30 (Stable)</SelectItem>
                <SelectItem value="50">RSI > 50 (Strong)</SelectItem>
              </SelectContent>
            </Select>
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
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest h-12 px-8">Asset</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest h-12">Price</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest h-12">P/E</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest h-12">Yield</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest h-12">RSI</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest h-12 px-8">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStocks.map((stock) => (
                        <TableRow key={stock.symbol} className="border-none hover:bg-muted/20 transition-colors group">
                          <TableCell className="py-6 px-8">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground text-sm tracking-tight">{stock.name}</span>
                              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{stock.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold tabular-nums text-sm">
                            <div className="flex flex-col items-end">
                              {formatCurrencyUSD(stock.price)}
                              <span className={cn("text-[10px]", stock.changePct >= 0 ? "text-gain-500" : "text-loss-500")}>
                                {formatPct(stock.changePct)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums text-sm">{stock.peRatio.toFixed(1)}x</TableCell>
                          <TableCell className="text-right font-medium tabular-nums text-sm">{stock.divYield.toFixed(2)}%</TableCell>
                          <TableCell className="text-right font-medium tabular-nums text-sm">{Math.floor(stock.rsi)}</TableCell>
                          <TableCell className="text-right px-8 min-w-[150px]">
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="text-xs font-bold text-brand-blue">{Math.floor(stock.score)}/100</span>
                              <Progress value={stock.score} className="h-1.5 w-24 bg-secondary" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}