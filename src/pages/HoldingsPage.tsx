import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { DashboardData, TimeRange, TradingMode } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { PerformanceAreaCard } from '@/components/finance/PerformanceAreaCard';
import { CashflowBarCard } from '@/components/finance/CashflowBarCard';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { ChartSkeleton, TableSkeleton } from '@/components/finance/PremiumSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
export function HoldingsPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as TradingMode) || 'live';
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', range, mode],
    queryFn: () => api<DashboardData>(`/api/dashboard?range=${range}&mode=${mode}`),
  });
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Portfolio Analytics"
            subtitle="Deep dive into asset performance and projected income streams."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            mode={mode}
          />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8"><ChartSkeleton /></div>
                  <div className="lg:col-span-4"><ChartSkeleton /></div>
                </div>
                <TableSkeleton />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <PerformanceAreaCard data={data?.performance ?? []} range={range} />
                  </div>
                  <div className="lg:col-span-4">
                    <CashflowBarCard data={data?.cashflow ?? []} />
                  </div>
                </div>
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