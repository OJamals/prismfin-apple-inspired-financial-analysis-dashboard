import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { QuantData, TimeRange } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { PerformanceChartCard } from '@/components/finance/PerformanceChartCard';
import { FactorAttributionCard } from '@/components/finance/FactorAttributionCard';
import { MonteCarloCard } from '@/components/finance/MonteCarloCard';
import { RiskRewardScatterCard } from '@/components/finance/RiskRewardScatterCard';
import { DrawdownChartCard } from '@/components/finance/DrawdownChartCard';
import { CorrelationMatrixCard } from '@/components/finance/CorrelationMatrixCard';
import { AIAnalystNote } from '@/components/finance/AIAnalystNote';
import { PortfolioPulseCard } from '@/components/finance/PortfolioPulseCard';

import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const { skillLevel, tradingMode, density } = useUserSettings();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch, isFetching } = useQuery<QuantData>({
    queryKey: ['quant', range, tradingMode],
    queryFn: () => api<QuantData>(`/api/quant?range=${range}&mode=${tradingMode}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<QuantData>(`/api/quant/refresh?range=${range}&mode=${tradingMode}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quant', range, tradingMode] });
      toast.success('Quant models recalculated');
    }
  });
  const isInstitutional = skillLevel === 'institutional';
  const activeDensity = density === 'compact' || isInstitutional ? 'compact' : 'comfortable';
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "py-8 md:py-10 lg:py-12 transition-all duration-300",
          activeDensity === 'comfortable' ? "space-y-12" : "space-y-6"
        )}>
          <div className="flex flex-col space-y-6">
            <DashboardHeader
              title="Quant Lab"
              subtitle="Predictive simulation and multi-factor risk engine."
              range={range}
              onRangeChange={(r) => setRange(r as TimeRange)}
              onRefresh={() => refreshMutation.mutate()}
              isRefreshing={refreshMutation.isPending}
            />
            <div className="flex items-center justify-between bg-card/60 backdrop-blur-md p-4 rounded-3xl border border-border/5 shadow-soft">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
                  tradingMode === 'live' ? "bg-loss-500 text-white" : "bg-brand-blue text-white"
                )}>
                  <ShieldCheck className="size-3.5" /> {tradingMode} execution
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Model Stability: <span className="text-gain-600">Tier 1 Institutional</span>
                </p>
              </div>

            </div>
          </div>
          <AnimatePresence>
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8"><div className="lg:col-span-12"><div className="animate-pulse bg-card/60 rounded-3xl h-96" /></div></div>
              </motion.div>
            ) : isError ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center py-24">
                <div className="text-6xl text-muted-foreground mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Quant analysis temporarily unavailable</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  Our quantitative models are experiencing technical difficulties. 
                </p>
                <motion.button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-brand-blue text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetching ? 'Retrying...' : 'Try Again'}
                </motion.button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-12",
                    activeDensity === 'comfortable' ? "gap-10" : "gap-4"
                  )}
                >
                  {data?.pulse && (
                    <div className="lg:col-span-12" id="quant-pulse">
                      <PortfolioPulseCard pulse={data.pulse} />
                    </div>
                  )}
                  {data?.insight && (
                    <div className="lg:col-span-12">
                      <AIAnalystNote insight={data.insight} />
                    </div>
                  )}
                  <div className="lg:col-span-12">
                    <PerformanceChartCard
                      portfolio={data?.portfolio ?? []}
                      benchmark={data?.benchmark ?? []}
                      range={range}
                    />
                  </div>
                  <div className="lg:col-span-8">
                    <DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} />
                  </div>
                  <div className="lg:col-span-4">
                    <FactorAttributionCard factors={data?.factors ?? []} />
                  </div>
                  <div className="lg:col-span-6" id="efficiency-frontier">
                    <RiskRewardScatterCard data={data?.riskReward ?? []} />
                  </div>
                  <div className="lg:col-span-6">
                    <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
                  </div>
                  <div className="lg:col-span-12 pb-12" id="monte-carlo">
                    <MonteCarloCard data={data?.monteCarlo ?? ({} as any)} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}