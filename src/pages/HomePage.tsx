import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange, TradingMode } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { KpiCard } from '@/components/finance/KpiCard';
import { PerformanceAreaCard } from '@/components/finance/PerformanceAreaCard';
import { CashflowBarCard } from '@/components/finance/CashflowBarCard';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { KpiSkeleton, ChartSkeleton, TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  }
};
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as TradingMode) || 'live';
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard', range, mode],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}&mode=${mode}`),
    retry: 1,
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}&mode=${mode}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success(`${mode === 'live' ? 'Market' : 'Simulation'} state refreshed`, {
        icon: <div className="size-2 rounded-full bg-brand-blue animate-pulse" />
      });
    },
    onError: () => toast.error('Market synchronization failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <DashboardHeader
            title="Overview"
            subtitle={mode === 'live' ? "Analyzing real-time market liquidity and volatility spreads." : "Simulating portfolio resilience against historical risk factors."}
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
            mode={mode}
          />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8"><ChartSkeleton /></div>
                  <div className="lg:col-span-4"><ChartSkeleton className="h-full" /></div>
                </div>
                <TableSkeleton />
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 text-center rounded-[3rem] bg-white border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="size-16 rounded-full bg-loss-50 flex items-center justify-center">
                  <div className="size-8 rounded-full bg-loss-500 animate-pulse opacity-50" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold font-display">Data Link Failed</p>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">PrismFin could not reconcile the current {mode} market feed.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "space-y-12 transition-all duration-500",
                  refreshMutation.isPending && "opacity-60 grayscale-[0.2] pointer-events-none blur-[1px]"
                )}
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {data?.kpis.map((kpi) => (
                    <KpiCard
                      key={kpi.id}
                      label={kpi.label}
                      value={kpi.value}
                      deltaPct={kpi.deltaPct}
                    />
                  ))}
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <PerformanceAreaCard data={data?.performance ?? []} range={range} />
                  </div>
                  <div className="lg:col-span-4">
                    <CashflowBarCard data={data?.cashflow ?? []} />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8 pb-12">
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