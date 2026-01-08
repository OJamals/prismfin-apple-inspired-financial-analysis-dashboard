import React, { useState, useCallback } from 'react';
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
import { BetaSensitivityCard } from '@/components/finance/BetaSensitivityCard';
import { PortfolioPulseCard } from '@/components/finance/PortfolioPulseCard';
import { HoldingsMetricsSkeleton, ChartSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserSettings } from '@/hooks/use-user-settings';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { skillLevel, isSimMode } = useUserSettings();
  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard', range],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: (newData) => {
      queryClient.setQueryData(['dashboard', range], newData);
      toast.success('Market state synchronized');
    }
  });
  const onRefresh = useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          {isSimMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-amber-500 text-white px-8 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-amber-500/20"
            >
              <div className="flex items-center gap-3">
                <Layers className="size-5 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest">Simulation Mode Active (Paper Trading)</span>
              </div>
              <p className="text-[10px] font-bold opacity-80 uppercase">Dashboards showing projected metrics</p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-[100px] z-20 bg-canvas/60 backdrop-blur-xl -mx-4 px-4 py-4 rounded-3xl border border-white/5 ring-1 ring-black/5 mb-8"
          >
            <DashboardHeader
              title="Dashboard"
              subtitle="Real-time portfolio intelligence and position health analysis."
              range={range}
              onRangeChange={(r) => setRange(r as TimeRange)}
              onRefresh={onRefresh}
              isRefreshing={refreshMutation.isPending}
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <HoldingsMetricsSkeleton />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
              </motion.div>
            ) : isError ? (
              <motion.div key="error" className="py-40 text-center rounded-[3rem] bg-card shadow-xl flex flex-col items-center justify-center space-y-8">
                <AlertTriangle className="size-16 text-loss-500" />
                <h2 className="text-3xl font-bold">Data Link Failed</h2>
                <Button onClick={() => refetch()} className="rounded-2xl h-12 px-8 bg-foreground text-background">Reconnect Feed</Button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn("space-y-12", refreshMutation.isPending && "opacity-60")}
              >
                {skillLevel === 'beginner' && data?.pulse && (
                  <motion.div variants={itemVariants}>
                    <PortfolioPulseCard pulse={data.pulse} />
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  {data?.holdingsMetrics && <HoldingsMetricsGrid metrics={data.holdingsMetrics} />}
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <motion.div variants={itemVariants} className="lg:col-span-8">
                    <PerformanceChartCard
                      portfolio={data?.performance ?? []}
                      benchmark={data?.benchmarkPerformance ?? []}
                      range={range}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="lg:col-span-4">
                    {skillLevel === 'beginner' ? (
                      <TopMoversCard movers={data?.topMovers ?? []} />
                    ) : (
                      <BetaSensitivityCard beta={data?.holdingsMetrics?.beta ?? 1.0} />
                    )}
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <motion.div variants={itemVariants} className="lg:col-span-8">
                    <MonthlyReturnsCard data={data?.monthlyReturns ?? []} />
                  </motion.div>
                  <motion.div variants={itemVariants} className="lg:col-span-4">
                    {data?.sectors && <SectorConcentrationCard sectors={data.sectors} />}
                  </motion.div>
                </div>
                <motion.div variants={itemVariants} className="pb-12">
                  <MetricsTableCard rows={data?.rows ?? []} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}