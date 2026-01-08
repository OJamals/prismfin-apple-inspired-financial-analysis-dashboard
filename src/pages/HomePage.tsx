import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { HoldingsMetricsGrid } from '@/components/finance/HoldingsMetricsGrid';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { TableSkeleton, HoldingsMetricsSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard', range],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}`),
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
          <DashboardHeader
            title="Holdings Overview"
            subtitle="Real-time portfolio intelligence and position health analysis."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
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
                  <TableSkeleton />
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-40 text-center rounded-[3rem] bg-white border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center space-y-6"
                >
                  <AlertTriangle className="size-12 text-loss-500" />
                  <div className="space-y-2">
                    <p className="text-2xl font-bold font-display">Data Link Failed</p>
                    <p className="text-muted-foreground max-w-xs mx-auto">PrismFin could not reconcile the current holdings feed.</p>
                  </div>
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