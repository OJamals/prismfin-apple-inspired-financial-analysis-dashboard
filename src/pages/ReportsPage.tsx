import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
function MonthlyActivityChart() {
  const data = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden h-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Analytical Frequency</CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradientTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity={1} />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={1} />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)'
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index % 2 === 0 ? 'url(#barGradientTeal)' : 'url(#barGradientBlue)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
export function ReportsPage() {
  const reports = [
    { title: 'Annual Performance 2023', date: 'Jan 15, 2024', type: 'Annual' },
    { title: 'Q4 Quarterly Review', date: 'Oct 12, 2023', type: 'Quarterly' },
    { title: 'Monthly Tax Summary', date: 'Mar 02, 2024', type: 'Tax' },
    { title: 'Asset Allocation Audit', date: 'Feb 28, 2024', type: 'Compliance' },
  ];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Reports"
            subtitle="Secure audit trail and institutional performance summaries."
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
              <MonthlyActivityChart />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.title} className="rounded-4xl border-none shadow-soft hover:shadow-md transition-all group bg-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold font-display">{report.title}</CardTitle>
                    <CardDescription className="text-xs font-medium">{report.date}</CardDescription>
                  </div>
                  <div className="p-3 rounded-2xl bg-brand-teal/5 text-brand-teal">
                    <FileText className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-4">
                  <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-secondary/80 text-foreground font-bold tracking-tighter text-[10px]">
                    {report.type}
                  </Badge>
                  <Button variant="ghost" size="sm" className="gap-2 group-hover:text-brand-blue rounded-xl text-xs font-bold uppercase tracking-widest">
                    <Download className="size-4" />
                    Archive
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}