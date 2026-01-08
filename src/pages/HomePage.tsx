import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { HoldingsMetricsGrid } from '@/components/finance/HoldingsMetricsGrid';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { SectorConcentrationCard } from '@/components/finance/SectorConcentrationCard';
import { PerformanceChartCard } from '@/components/finance/PerformanceChartCard';
import { BetaSensitivityCard } from '@/components/finance/BetaSensitivityCard';
import { PortfolioPulseCard } from '@/components/finance/PortfolioPulseCard';
import { ErrorRecoveryDisplay } from '@/components/finance/ErrorRecoveryDisplay';
import { HoldingsMetricsSkeleton, ChartSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ShieldCheck, Activity, Wifi } from 'lucide-react';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { skillLevel, tradingMode, density } = useUserSettings();
  const { data, isLoading, isError, refetch, isFetching } = useQuery<DashboardData>({
    queryKey: ['dashboard', range, tradingMode],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}&mode=${tradingMode}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}&mode=${tradingMode}`, { method: 'POST' }),
    onSuccess: (newData) => {
      queryClient.setQueryData(['dashboard', range, tradingMode], newData);
      toast.success('Market state synchronized');
    }
  });
  const onRefresh = useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);
  const isAdvanced = skillLevel === 'pro' || skillLevel === 'institutional';
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "py-8 md:py-10 lg:py-12 transition-all duration-300",
          density === 'comfortable' ? "space-y-12" : "space-y-6"
        )}>
          {/* Global Health Monitor */}
          <div className="flex items-center justify-between bg-card/40 backdrop-blur-md px-6 py-3 rounded-3xl border border-border/5 ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              {isFetching ? <Activity className="size-4 animate-spin text-brand-blue" /> : <Wifi className="size-4 text-gain-500" />}
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Feed Status: {isFetching ? 'Synchronizing...' : 'Healthy (Live)'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn(
                "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                tradingMode === 'live' ? "bg-loss-500 text-white" : "bg-brand-blue text-white"
              )}>
                <ShieldCheck className="size-3" /> {tradingMode} mode
              </div>
              <Button 
                variant="ghost" size="sm" onClick={() => refetch()} 
                className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/10 rounded-xl"
              >
                Reconnect Feed
              </Button>
            </div>
          </div>
          <DashboardHeader
            title="Dashboard"
            subtitle="Institutional portfolio intelligence and position health analysis."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          <AnimatePresence>
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <HoldingsMetricsSkeleton />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><ChartSkeleton /><ChartSkeleton /></div>
              </motion.div>
            ) : isError ? (
              <ErrorRecoveryDisplay key="error" onRetry={() => refetch()} isRetrying={isFetching} />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("space-y-12", density === 'compact' && "space-y-6")}
              >
                {data?.pulse && <PortfolioPulseCard pulse={data.pulse} />}
                {data?.holdingsMetrics && <HoldingsMetricsGrid metrics={data.holdingsMetrics} />}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8">
                    <PerformanceChartCard
                      portfolio={data?.performance ?? []}
                      benchmark={data?.benchmarkPerformance ?? []}
                      range={range}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    {isAdvanced ? (
                      <BetaSensitivityCard beta={data?.holdingsMetrics?.beta ?? 1.0} />
                    ) : (
                      <div className="h-full bg-secondary/20 rounded-4xl border border-dashed border-border/40 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <ShieldCheck className="size-10 text-muted-foreground/30" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Advanced Risk Metrics Hidden</p>
                        <p className="text-[10px] text-muted-foreground/60">Switch to 'Pro' in settings to unlock Systematic Risk Analysis.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <MetricsTableCard rows={data?.rows ?? []} />
                  </div>
                  <div className="lg:col-span-4">
                    {data?.sectors && <SectorConcentrationCard sectors={data.sectors} />}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}