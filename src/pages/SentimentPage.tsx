import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { SentimentOverview } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { SentimentGauge } from '@/components/finance/SentimentGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
export function SentimentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = searchParams.get('ticker') || 'AAPL';
  const [inputValue, setInputValue] = useState(ticker);
  const { data: overview, isLoading } = useQuery<SentimentOverview>({
    queryKey: ['sentiment', ticker],
    queryFn: () => api<SentimentOverview>(`/api/sentiment?ticker=${ticker}`),
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ ticker: inputValue.toUpperCase() });
    }
  };
  const trendIcons = {
    improving: <TrendingUp className="size-4 text-gain-500" />,
    declining: <TrendingDown className="size-4 text-loss-500" />,
    stable: <Minus className="size-4 text-muted-foreground" />
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <DashboardHeader
              title="Sentiment Analysis"
              subtitle="Natural Language Processing applied to real-time institutional news feeds."
            />
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ticker (e.g. BTC)"
                  className="pl-10 h-11 rounded-2xl bg-card border-none shadow-soft"
                />
              </div>
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold font-display tracking-tight">Institutional Score</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center bg-muted/20 animate-pulse rounded-3xl" />
                  ) : (
                    <SentimentGauge score={overview?.overallScore ?? 50} />
                  )}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 gap-6">
                <Card className="rounded-3xl border-none shadow-soft bg-card">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">24H Mentions</p>
                      <p className="text-2xl font-bold tabular-nums">{overview?.mentions24h.toLocaleString() ?? '0'}</p>
                    </div>
                    <div className="size-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center">
                      <MessageSquare className="size-6 text-brand-blue" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-soft bg-card">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sentiment Trend</p>
                      <p className="text-2xl font-bold capitalize">{overview?.trend ?? 'Stable'}</p>
                    </div>
                    <div className="size-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                      {trendIcons[overview?.trend ?? 'stable']}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display tracking-tight">Intelligence Stream</h3>
                  <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold bg-muted/50 border-none">
                    {ticker} Signals
                  </Badge>
                </div>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {overview?.articles.map((article, idx) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="rounded-3xl border border-white/40 shadow-soft bg-card hover:shadow-premium transition-all group">
                          <CardContent className="p-6 flex gap-6">
                            <div className={cn(
                              "size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                              article.sentiment === 'positive' ? "bg-gain-50 text-gain-600" : 
                              article.sentiment === 'negative' ? "bg-loss-50 text-loss-600" : "bg-muted text-muted-foreground"
                            )}>
                              {article.sentiment === 'positive' ? <TrendingUp className="size-6" /> : 
                               article.sentiment === 'negative' ? <TrendingDown className="size-6" /> : <Minus className="size-6" />}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                  {article.source} • {formatDistanceToNow(article.timestamp)} ago
                                </p>
                                <Badge className={cn(
                                  "rounded-lg px-2 py-0.5 text-[10px] font-black border-none shadow-sm",
                                  article.score > 70 ? "bg-gain-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                  {article.score}%
                                </Badge>
                              </div>
                              <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-brand-blue transition-colors">
                                {article.headline}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {article.summary}
                              </p>
                              <div className="pt-2">
                                <a href={article.url} className="inline-flex items-center gap-1.5 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">
                                  View Source <ExternalLink className="size-3" />
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}