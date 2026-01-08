import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { QuantData, TimeRange, TradingMode } from '@shared/types';
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
import { cn } from '@/lib/utils';
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
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100
    }
  }
};
export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as TradingMode) || 'live';
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<QuantData>({
    queryKey: ['quant', range, mode],
    queryFn: () => api<QuantData>(`/api/quant?range=${range}&mode=${mode}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<QuantData>(`/api/quant/refresh?range=${range}&mode=${mode}`, { method: 'POST' }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['quant', range, mode], updated);
      toast.success('Quant models recalculated', {
        icon: <div className="size-2 rounded-full bg-brand-teal animate-ping" />
      });
    },
    onError: () => toast.error('Multi-factor simulation failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <DashboardHeader
            title="Quant Lab"
            subtitle={mode === 'live' ? "Institutional-grade risk modeling and multi-factor attribution analysis." : "Hypothetical stress-testing and predictive asset movement simulations."}
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
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
                className={cn(
                  "space-y-12 transition-all duration-700",
                  refreshMutation.isPending && "blur-sm opacity-70 grayscale-[0.2]"
                )}
              >
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8">
                  <BenchmarkingChart
                    portfolio={data?.portfolio ?? []}
                    benchmark={data?.benchmark ?? []}
                    range={range}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} />
                  </div>
                  <div className="lg:col-span-4">
                    <FactorAttributionCard factors={data?.factors ?? []} />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RiskRewardScatterCard data={data?.riskReward ?? []} />
                  <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8 pb-12">
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