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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
export function HomePage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [searchParams] = useSearchParams();
  const filter = (searchParams.get('filter') as AssetClass) || 'all';
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', range, filter],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}&filter=${filter}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<DashboardData>(`/api/dashboard/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Market data updated');
    },
    onError: () => toast.error('Refresh failed'),
  });
  const onRefresh = () => refreshMutation.mutate();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 lg:py-10 space-y-8">
          <DashboardHeader
            title="Dashboard"
            subtitle={`Real-time ${filter === 'all' ? 'portfolio' : filter} analytics and insights.`}
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-4xl" />
              ))
            ) : (
              data?.kpis.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  deltaPct={kpi.deltaPct}
                />
              ))
            )}
          </div>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {isLoading ? (
                <Skeleton className="h-[400px] rounded-4xl" />
              ) : (
                <PerformanceAreaCard data={data?.performance ?? []} range={range} />
              )}
            </div>
            <div className="lg:col-span-4">
              {isLoading ? (
                <Skeleton className="h-[400px] rounded-4xl" />
              ) : (
                <CashflowBarCard data={data?.cashflow ?? []} />
              )}
            </div>
          </div>
          {/* Metrics Table */}
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <Skeleton className="h-[500px] rounded-4xl" />
            ) : (
              <MetricsTableCard rows={data?.rows ?? []} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}