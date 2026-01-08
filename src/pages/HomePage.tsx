import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { HoldingsMetricsGrid } from '@/components/finance/HoldingsMetricsGrid';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { TableSkeleton, HoldingsMetricsSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard', range],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}`),
    retry: 1,
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', range] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Market state synchronized', {
        icon: <div className="size-3 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue animate-pulse" />
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
            title="Holdings Overview"
            subtitle="Analyzing real-time portfolio intelligence and position health in a unified analytical framework."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading ? (
              <motion.div
                key="skeletons"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <HoldingsMetricsSkeleton />
                <TableSkeleton />
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-40 text-center rounded-[3rem] bg-white border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center space-y-6"
              >
                <div className="size-20 rounded-full bg-loss-50 flex items-center justify-center shadow-inner">
                  <div className="size-10 rounded-full bg-loss-500 animate-pulse opacity-40 blur-sm" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold font-display tracking-tight text-foreground">Data Link Failed</p>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">PrismFin could not reconcile the current holdings feed. Please check your connectivity.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "space-y-12 transition-all duration-500",
                  refreshMutation.isPending && "opacity-60 blur-[1px]"
                )}
              >
                {data?.holdingsMetrics && (
                  <div className="grid grid-cols-1 xl:gap-10">
                    <HoldingsMetricsGrid metrics={data.holdingsMetrics} />
                  </div>
                )}
                <div className="pb-12">
                  <MetricsTableCard rows={data?.rows ?? []} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}