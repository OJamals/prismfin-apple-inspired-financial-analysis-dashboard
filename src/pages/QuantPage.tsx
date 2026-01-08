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
import { ErrorRecoveryDisplay } from '@/components/finance/ErrorRecoveryDisplay';
import { ChartSkeleton, PulseSkeleton } from '@/components/finance/PremiumSkeleton';
import { GuidedTour, TourStep } from '@/components/finance/GuidedTour';
import { useTourState } from '@/hooks/use-tour-state';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Sparkles, ShieldCheck } from 'lucide-react';
const QUANT_TOUR_STEPS: TourStep[] = [
  { targetId: 'quant-pulse', title: 'Intelligence Summary', content: 'Get an instant plain-English breakdown of your portfolios quantitative standing.', position: 'bottom' },
  { targetId: 'efficiency-frontier', title: 'Risk-Reward Mapping', content: 'Visualize how your assets map against the theoretical efficiency frontier.', position: 'right' },
  { targetId: 'monte-carlo', title: 'Predictive Wealth', content: 'Forecast potential terminal value ranges using institutional-grade simulation.', position: 'top' }
];
export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const { skillLevel, tradingMode, density, showTooltips } = useUserSettings();
  const queryClient = useQueryClient();
  const { isTourOpen, startTour, completeTour } = useTourState('quant-lab');
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
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startTour}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue/20"
              >
                <Sparkles className="size-4" /> Start Tour
              </motion.button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <PulseSkeleton /><div className="grid grid-cols-1 lg:grid-cols-12 gap-8"><div className="lg:col-span-12"><ChartSkeleton /></div></div>
              </motion.div>
            ) : isError ? (
              <ErrorRecoveryDisplay key="error" onRetry={() => refetch()} isRetrying={isFetching} />
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
                {showTooltips && <GuidedTour steps={QUANT_TOUR_STEPS} isOpen={isTourOpen} onComplete={completeTour} />}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}