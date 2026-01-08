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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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
      toast.success('Simulation re-run complete');
    },
    onError: () => toast.error('Refresh failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader
            title="Quant Analysis"
            subtitle="Deep-dive into factor exposure and risk simulations."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <Skeleton className="h-[450px] rounded-4xl" />
            ) : (
              <BenchmarkingChart
                portfolio={data?.portfolio ?? []}
                benchmark={data?.benchmark ?? []}
                range={range}
              />
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {isLoading ? (
                <Skeleton className="h-[400px] rounded-4xl" />
              ) : (
                <DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} />
              )}
            </div>
            <div className="lg:col-span-4">
              {isLoading ? (
                <Skeleton className="h-[400px] rounded-4xl" />
              ) : (
                <FactorAttributionCard factors={data?.factors ?? []} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <Skeleton className="h-[400px] rounded-4xl" />
            ) : (
              <RiskRewardScatterCard data={data?.riskReward ?? []} />
            )}
            {isLoading ? (
              <Skeleton className="h-[400px] rounded-4xl" />
            ) : (
              <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <Skeleton className="h-[400px] rounded-4xl" />
            ) : (
              <MonteCarloCard data={data?.monteCarlo ?? {} as any} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}