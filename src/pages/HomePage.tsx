import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange, AssetClass } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { KpiCard } from '@/components/finance/KpiCard';
import { PerformanceAreaCard } from '@/components/finance/PerformanceAreaCard';
import { CashflowBarCard } from '@/components/finance/CashflowBarCard';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { KpiSkeleton, ChartSkeleton, TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast } from 'sonner';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    } 
  }
};
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [searchParams] = useSearchParams();
  const filter = (searchParams.get('filter') as AssetClass) || 'all';
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard', range, filter],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}&filter=${filter}`),
    retry: 1,
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Real-time data synchronized');
    },
    onError: () => toast.error('Connection failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Overview"
            subtitle={`Analyzing ${filter === 'all' ? 'total portfolio' : filter} performance metrics.`}
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8"><ChartSkeleton /></div>
                  <div className="lg:col-span-4"><ChartSkeleton /></div>
                </div>
                <TableSkeleton />
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center rounded-4xl bg-white border border-dashed"
              >
                <p className="text-muted-foreground font-semibold">Failed to reconcile market data. Please check your connection.</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-10"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data?.kpis.map((kpi) => (
                    <KpiCard
                      key={kpi.id}
                      label={kpi.label}
                      value={kpi.value}
                      deltaPct={kpi.deltaPct}
                    />
                  ))}
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <PerformanceAreaCard data={data?.performance ?? []} range={range} />
                  </div>
                  <div className="lg:col-span-4">
                    <CashflowBarCard data={data?.cashflow ?? []} />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 pb-8">
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