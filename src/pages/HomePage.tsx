import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { HoldingsMetricsGrid } from '@/components/finance/HoldingsMetricsGrid';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { SectorConcentrationCard } from '@/components/finance/SectorConcentrationCard';
import { PerformanceChartCard } from '@/components/finance/PerformanceChartCard';
import { RiskRewardScatterCard } from '@/components/finance/RiskRewardScatterCard';
import { MonthlyReturnsCard } from '@/components/finance/MonthlyReturnsCard';
import { TopMoversCard } from '@/components/finance/TopMoversCard';
import { TableSkeleton, HoldingsMetricsSkeleton, ChartSkeleton, ListSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard', range],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}`),
    retry: 1,
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', range] });
      toast.success('Market state synchronized');
    },
    onError: () => toast.error('Market synchronization failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <div className="sticky top-[100px] z-20 bg-canvas/60 backdrop-blur-xl -mx-4 px-4 py-4 rounded-3xl border border-white/5 ring-1 ring-black/5 mb-8 transition-all">
            <DashboardHeader
              title="Dashboard"
              subtitle="Real-time portfolio intelligence and position health analysis."
              range={range}
              onRangeChange={(r) => setRange(r as TimeRange)}
              onRefresh={onRefresh}
              isRefreshing={refreshMutation.isPending}
            />
          </div>
          <LayoutGroup id="dashboard-content">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.div
                  key="skeletons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  <HoldingsMetricsSkeleton />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartSkeleton />
                    <ChartSkeleton />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8"><ChartSkeleton /></div>
                    <div className="lg:col-span-4"><ListSkeleton /></div>
                  </div>
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-40 text-center rounded-[3rem] bg-white border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center space-y-8 shadow-soft"
                >
                  <div className="size-20 rounded-full bg-loss-50 flex items-center justify-center">
                    <AlertTriangle className="size-10 text-loss-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold font-display tracking-tight">Data Link Failed</p>
                    <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">PrismFin could not reconcile the current holdings feed. The connection to the institutional terminal was interrupted.</p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    className="rounded-2xl h-12 px-8 bg-foreground text-background font-bold gap-2 hover:bg-foreground/90 transition-all shadow-lg"
                  >
                    <RefreshCw className="size-4" /> Reconnect Feed
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "space-y-12 transition-all duration-500",
                    refreshMutation.isPending && "opacity-60 blur-[1px]"
                  )}
                >
                  {data?.holdingsMetrics && (
                    <HoldingsMetricsGrid metrics={data.holdingsMetrics} />
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-8">
                      <PerformanceChartCard
                        portfolio={data?.performance ?? []}
                        benchmark={data?.benchmarkPerformance ?? []}
                        range={range}
                      />
                    </div>
                    <div className="lg:col-span-4">
                      {data?.sectors && <SectorConcentrationCard sectors={data.sectors} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                      <MonthlyReturnsCard data={data?.monthlyReturns ?? []} />
                    </div>
                    <div className="lg:col-span-4">
                      <TopMoversCard movers={data?.topMovers ?? []} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                      <div className="h-full bg-card rounded-4xl p-8 shadow-soft border border-white/40 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Zap className="size-5 text-brand-blue" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Portfolio Efficiency</span>
                          </div>
                          <h4 className="text-xl font-bold font-display">Alpha Scoring</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">Your strategy is currently generating 4.2% excess return relative to the S&P 500 benchmark on a risk-adjusted basis.</p>
                        </div>
                        <div className="pt-8 flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue w-[78%] rounded-full" />
                          </div>
                          <span className="text-[10px] font-black tabular-nums">78/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-8">
                      <RiskRewardScatterCard data={data?.riskReward ?? []} />
                    </div>
                  </div>
                  <div className="pb-12">
                    <MetricsTableCard rows={data?.rows ?? []} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
    </AppLayout>
  );
}