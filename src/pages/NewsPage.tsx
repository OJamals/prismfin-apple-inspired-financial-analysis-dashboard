import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { api } from '@/lib/api-client';
import { MarketIntelligence } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SentimentGauge } from '@/components/finance/SentimentGauge';
import { PortfolioSentimentChart } from '@/components/finance/PortfolioSentimentChart';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Newspaper, BrainCircuit, Globe, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
export function NewsPage() {
  const [symbol, setSymbol] = useState('NVDA');
  const [inputValue, setInputValue] = useState('NVDA');
  const { data: tickerData, isLoading: isTickerLoading } = useQuery<MarketIntelligence>({
    queryKey: ['news', symbol],
    queryFn: () => api<MarketIntelligence>(`/api/news?symbol=${symbol}`),
  });
  const { data: marketData, isLoading: isMarketLoading } = useQuery<MarketIntelligence>({
    queryKey: ['news', 'MARKET'],
    queryFn: () => api<MarketIntelligence>(`/api/news?symbol=S&P500`),
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) setSymbol(inputValue.toUpperCase());
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Intelligence Hub"
            subtitle="Deep-dive into market-wide sentiment and ticker-specific news analysis."
          />
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-card/40 backdrop-blur-md p-1.5 rounded-2xl border border-card/60 shadow-soft ring-1 ring-border/10">
                <TabsTrigger value="overview" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-brand-blue data-[state=active]:text-white transition-all">
                  <Globe className="size-4 mr-2" />
                  Market Overview
                </TabsTrigger>
                <TabsTrigger value="analysis" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-brand-blue data-[state=active]:text-white transition-all">
                  <Search className="size-4 mr-2" />
                  Ticker Analysis
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper className="size-5 text-brand-blue" />
                    <h3 className="text-lg font-bold font-display tracking-tight">Global Headlines</h3>
                  </div>
                  {isMarketLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="rounded-3xl border-none shadow-soft p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-16 w-full" />
                      </Card>
                    ))
                  ) : (
                    marketData?.articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  )}
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <PortfolioSentimentChart />
                  <Card className="rounded-4xl border-none shadow-soft bg-gradient-to-br from-brand-blue to-brand-teal p-1">
                    <div className="rounded-[2.25rem] bg-white p-8 space-y-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="size-5 text-brand-blue" />
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-brand-blue">Market Outlook</h3>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed italic">
                        "Aggregated technical and fundamental indicators suggest a rotation into high-quality defensive equities as volatility spikes."
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analysis" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center">
                <form onSubmit={handleSearch} className="flex gap-2 bg-card/40 p-1.5 rounded-2xl border border-card/60 shadow-soft ring-1 ring-border/20 backdrop-blur-md w-full max-w-md">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search Ticker..."
                    className="flex-1 bg-card border-none rounded-xl h-10 font-bold uppercase tracking-widest text-xs"
                  />
                  <Button type="submit" className="bg-brand-blue rounded-xl text-[10px] font-bold uppercase tracking-widest px-6 h-10">
                    Analyze
                  </Button>
                </form>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Newspaper className="size-5 text-brand-blue" />
                    <h3 className="text-lg font-bold font-display tracking-tight">Headlines: {symbol}</h3>
                  </div>
                  {isTickerLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="rounded-3xl border-none shadow-soft p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                      </Card>
                    ))
                  ) : (
                    tickerData?.articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  )}
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <Card className="rounded-4xl border-none shadow-premium bg-card overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold font-display">{symbol} Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-10">
                      <SentimentGauge score={tickerData?.sentiment.score ?? 50} />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gain-50 border border-gain-100 text-center">
                          <p className="text-[10px] font-bold uppercase text-gain-700 tracking-widest">Bullish</p>
                          <p className="text-2xl font-bold tabular-nums text-gain-700">{tickerData?.sentiment.bullishPct ?? 0}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-loss-50 border border-loss-100 text-center">
                          <p className="text-[10px] font-bold uppercase text-loss-700 tracking-widest">Bearish</p>
                          <p className="text-2xl font-bold tabular-nums text-loss-700">{tickerData?.sentiment.bearishPct ?? 0}%</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground text-center italic leading-relaxed">
                        "{tickerData?.sentiment.outlook}"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
function ArticleCard({ article }: { article: any }) {
  return (
    <Card className="rounded-3xl border-none shadow-soft overflow-hidden hover:shadow-md transition-shadow group">
      <CardContent className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn(
              "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase border-none",
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
        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      </CardContent>
    </Card>
  );
}