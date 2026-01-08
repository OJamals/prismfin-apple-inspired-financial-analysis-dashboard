import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QuantData, TimeRange, DensityMode } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { PerformanceChartCard } from '@/components/finance/PerformanceChartCard';
import { FactorAttributionCard } from '@/components/finance/FactorAttributionCard';
import { MonteCarloCard } from '@/components/finance/MonteCarloCard';
import { RiskRewardScatterCard } from '@/components/finance/RiskRewardScatterCard';
import { DrawdownChartCard } from '@/components/finance/DrawdownChartCard';
import { CorrelationMatrixCard } from '@/components/finance/CorrelationMatrixCard';
import { AIAnalystNote } from '@/components/finance/AIAnalystNote';
import { ChartSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileDown, Layout, LayoutPanelLeft } from 'lucide-react';
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<QuantData>({
    queryKey: ['quant', range],
    queryFn: () => api<QuantData>(`/api/quant?range=${range}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<QuantData>(`/api/quant/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quant', range] });
      toast.success('Quant models recalculated');
    }
  });
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "py-8 md:py-10 lg:py-12 transition-all duration-300",
          density === 'comfortable' ? "space-y-12" : "space-y-6"
        )}>
          <div className="flex flex-col space-y-8">
            <DashboardHeader
              title="Quant Lab"
              subtitle="Multi-factor risk attribution and predictive simulation engine."
              range={range}
              onRangeChange={(r) => setRange(r as TimeRange)}
              onRefresh={() => refreshMutation.mutate()}
              isRefreshing={refreshMutation.isPending}
            />
            <div className="sticky top-[100px] z-20 flex items-center justify-between bg-canvas/60 backdrop-blur-md p-3 rounded-2xl border border-border/5 ring-1 ring-black/5">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDensity('comfortable')}
                  className={cn("rounded-xl h-9 px-4 text-xs font-bold", density === 'comfortable' && "bg-white shadow-sm text-brand-blue")}
                >
                  <Layout className="size-3.5 mr-2" /> Comfortable
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDensity('compact')}
                  className={cn("rounded-xl h-9 px-4 text-xs font-bold", density === 'compact' && "bg-white shadow-sm text-brand-blue")}
                >
                  <LayoutPanelLeft className="size-3.5 mr-2" /> Compact
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success('Institutional risk report generated.')} className="rounded-xl h-9 px-4 text-xs font-bold border-none bg-white shadow-sm">
                <FileDown className="size-3.5 mr-2 text-brand-blue" /> Export PDF
              </Button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2"><ChartSkeleton /></div>
                <ChartSkeleton /><ChartSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12",
                  density === 'comfortable' ? "gap-10" : "gap-4"
                )}
              >
                {data?.insight && (
                  <motion.div variants={itemVariants} className="lg:col-span-12">
                    <AIAnalystNote insight={data.insight} />
                  </motion.div>
                )}
                <motion.div variants={itemVariants} className="lg:col-span-12">
                  <PerformanceChartCard 
                    portfolio={data?.portfolio ?? []} 
                    benchmark={data?.benchmark ?? []} 
                    range={range} 
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-8">
                  <DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-4">
                  <FactorAttributionCard factors={data?.factors ?? []} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-6">
                  <RiskRewardScatterCard data={data?.riskReward ?? []} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-6">
                  <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-12 pb-12">
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