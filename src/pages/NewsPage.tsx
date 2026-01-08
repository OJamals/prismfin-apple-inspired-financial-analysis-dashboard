import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { api } from '@/lib/api-client';
import { MarketIntelligence } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SentimentGauge } from '@/components/finance/SentimentGauge';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Newspaper, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
export function NewsPage() {
  const [symbol, setSymbol] = useState('NVDA');
  const [inputValue, setInputValue] = useState('NVDA');
  const { data, isLoading } = useQuery<MarketIntelligence>({
    queryKey: ['news', symbol],
    queryFn: () => api<MarketIntelligence>(`/api/news?symbol=${symbol}`),
    enabled: !!symbol,
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) setSymbol(inputValue.toUpperCase());
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <DashboardHeader 
              title="Intelligence" 
              subtitle="Real-time news aggregation and sentiment scoring."
            />
            <form onSubmit={handleSearch} className="flex gap-2 bg-card/40 p-1.5 rounded-2xl border border-card/60 shadow-soft ring-1 ring-border/20 backdrop-blur-md">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter Ticker (e.g. AAPL)" 
                className="w-40 bg-card border-none rounded-xl h-10 font-bold uppercase tracking-widest text-xs"
              />
              <button type="submit" className="bg-brand-blue text-white px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-blue/80 transition-all">
                Analyze
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="size-5 text-brand-blue" />
                <h3 className="text-lg font-bold font-display tracking-tight">Recent Headlines: {symbol}</h3>
              </div>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="rounded-3xl border-none shadow-soft p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </Card>
                ))
              ) : (
                data?.articles.map((article) => (
                  <Card key={article.id} className="rounded-3xl border-none shadow-soft overflow-hidden hover:shadow-md transition-shadow group">
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={cn(
                            "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase",
                            article.sentiment === 'positive' ? "bg-gain-50 text-gain-700" :
                            article.sentiment === 'negative' ? "bg-loss-50 text-loss-700" : "bg-muted text-muted-foreground"
                          )}>
                            {article.sentiment}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {article.source} • {formatDistanceToNow(article.timestamp)} ago
                          </span>
                        </div>
                        <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="text-xl font-bold tracking-tight text-foreground leading-tight group-hover:text-brand-blue transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        {article.summary}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-4xl border-none shadow-premium bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold font-display">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pb-10">
                  <div className="flex flex-col items-center">
                    <SentimentGauge score={data?.sentiment.score ?? 50} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gain-50 border border-gain-100 text-center">
                      <p className="text-[10px] font-bold uppercase text-gain-700 tracking-widest">Bullish</p>
                      <p className="text-2xl font-bold tabular-nums text-gain-700">{data?.sentiment.bullishPct ?? 0}%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-loss-50 border border-loss-100 text-center">
                      <p className="text-[10px] font-bold uppercase text-loss-700 tracking-widest">Bearish</p>
                      <p className="text-2xl font-bold tabular-nums text-loss-700">{data?.sentiment.bearishPct ?? 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-none shadow-soft bg-gradient-to-br from-brand-blue to-brand-teal p-1">
                <div className="rounded-[2.25rem] bg-white p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="size-5 text-brand-blue" />
                    <h3 className="text-sm font-bold font-display uppercase tracking-wider text-brand-blue">AI Insights</h3>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed italic">
                    "{data?.sentiment.outlook}"
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}