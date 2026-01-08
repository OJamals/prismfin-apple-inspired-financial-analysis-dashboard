import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QuantData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { BenchmarkingChart } from '@/components/finance/BenchmarkingChart';
import { FactorAttributionCard } from '@/components/finance/FactorAttributionCard';
import { MonteCarloCard } from '@/components/finance/MonteCarloCard';
import { RiskRewardScatterCard } from '@/components/finance/RiskRewardScatterCard';
import { DrawdownChartCard } from '@/components/finance/DrawdownChartCard';
import { CorrelationMatrixCard } from '@/components/finance/CorrelationMatrixCard';
import { ChartSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast } from 'sonner';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    }
  }
};
export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<QuantData>({
    queryKey: ['quant', range],
    queryFn: () => api<QuantData>(`/api/quant?range=${range}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<QuantData>(`/api/quant/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['quant', range], updated);
      toast.success('Risk models recalculated');
    },
    onError: () => toast.error('Simulation failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Quant Models"
            subtitle="Proprietary risk simulations and multi-factor attribution."
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
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="lg:col-span-2">
                  <ChartSkeleton />
                </div>
                <ChartSkeleton />
                <ChartSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
                  <BenchmarkingChart
                    portfolio={data?.portfolio ?? []}
                    benchmark={data?.benchmark ?? []}
                    range={range}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} />
                  </div>
                  <div className="lg:col-span-4">
                    <FactorAttributionCard factors={data?.factors ?? []} />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RiskRewardScatterCard data={data?.riskReward ?? []} />
                  <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 pb-12">
                  <MonteCarloCard data={data?.monteCarlo ?? {} as any} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}