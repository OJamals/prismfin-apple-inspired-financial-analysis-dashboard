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
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Download, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 28, stiffness: 120 } }
};
const MOCK_REPORTS = [
  { id: '1', title: '2023 Annual Performance', date: 'Jan 15, 2024', type: 'Annual', size: '2.4 MB' },
  { id: '2', title: 'Q4 Risk Attribution', date: 'Jan 02, 2024', type: 'Quarterly', size: '1.8 MB' },
  { id: '3', title: 'Tax Efficiency Audit', date: 'Dec 20, 2023', type: 'Compliance', size: '0.9 MB' },
  { id: '4', title: 'Asset Allocation Shift', date: 'Nov 12, 2023', type: 'Strategy', size: '1.2 MB' },
];
const MOCK_ACTIVITY = [
  { month: 'Jul', volume: 4200 }, { month: 'Aug', volume: 3800 }, { month: 'Sep', volume: 5100 },
  { month: 'Oct', volume: 4600 }, { month: 'Nov', volume: 5900 }, { month: 'Dec', volume: 6200 },
];
export function QuantPage() {
  const [range, setRange] = useState<TimeRange>('6M');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<QuantData>({
    queryKey: ['quant', range],
    queryFn: () => api<QuantData>(`/api/quant?range=${range}`),
  });
  const refreshMutation = useMutation({
    mutationFn: () => api<QuantData>(`/api/quant/refresh?range=${range}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quant', range] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Quant models recalculated', { icon: <div className="size-2 rounded-full bg-brand-teal animate-ping" /> });
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
            subtitle="Institutional-grade risk modeling and multi-factor attribution analysis within a unified reporting framework."
            range={range}
            onRangeChange={(r) => setRange(r as TimeRange)}
            onRefresh={onRefresh}
            isRefreshing={refreshMutation.isPending}
          />
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div key="skeletons" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2"><ChartSkeleton /></div>
                <ChartSkeleton /><ChartSkeleton />
              </motion.div>
            ) : (
              <motion.div key="content" layout variants={containerVariants} initial="hidden" animate="show" className={cn("space-y-12 transition-all duration-700", refreshMutation.isPending && "blur-sm opacity-70")}>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8">
                  <BenchmarkingChart portfolio={data?.portfolio ?? []} benchmark={data?.benchmark ?? []} range={range} />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8"><DrawdownChartCard data={data?.drawdown ?? { maxDrawdown: 0, series: [] }} /></div>
                  <div className="lg:col-span-4"><FactorAttributionCard factors={data?.factors ?? []} /></div>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RiskRewardScatterCard data={data?.riskReward ?? []} />
                  <CorrelationMatrixCard data={data?.correlation ?? { symbols: [], matrix: {} }} />
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8"><MonteCarloCard data={data?.monteCarlo ?? {} as any} /></motion.div>
                {data && (
                  <motion.div variants={itemVariants} className="pt-12 border-t border-border/40">
                    <div className="flex flex-col gap-2 mb-10">
                      <h2 className="text-3xl font-bold font-display tracking-tight">Reporting Archive</h2>
                      <p className="text-muted-foreground font-medium">Historical activity audits and verified performance statements.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <Card className="lg:col-span-7 rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                        <CardHeader className="p-8 pb-0"><CardTitle className="text-xl font-bold font-display">Monthly Volume Audit</CardTitle></CardHeader>
                        <CardContent className="h-[340px] p-8 pt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_ACTIVITY}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.6} />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                              <YAxis hide /><Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', padding: '16px' }} cursor={{ fill: '#f8fafc', radius: 12 }} />
                              <Bar dataKey="volume" radius={[12, 12, 12, 12]} barSize={40}>{MOCK_ACTIVITY.map((entry, index) => (<Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#14B8A6' : '#0EA5E9'} fillOpacity={0.8} />))}</Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {MOCK_REPORTS.map((report) => (
                          <Card key={report.id} className="rounded-3xl border-none shadow-soft bg-card hover:shadow-premium transition-all group cursor-pointer">
                            <CardContent className="p-6 space-y-4">
                              <div className="size-10 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors"><FileText className="size-5 text-muted-foreground group-hover:text-brand-blue" /></div>
                              <div className="space-y-1"><p className="text-sm font-bold leading-tight line-clamp-2">{report.title}</p><div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest"><Calendar className="size-3" />{report.date}</div></div>
                              <div className="flex items-center justify-between pt-2 border-t border-border/5"><span className="text-[10px] font-bold text-muted-foreground">{report.size}</span><Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted/80"><Download className="size-4 text-brand-blue" /></Button></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <motion.div variants={itemVariants} className="pb-12 pt-8 text-center"><div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-blue/5 border border-brand-blue/10"><p className="text-xs font-semibold text-brand-blue">All models are re-validated daily against historical settlement data.</p><ArrowRight className="size-3 text-brand-blue" /></div></motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}