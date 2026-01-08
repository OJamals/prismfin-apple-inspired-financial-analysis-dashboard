import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader 
            title="Reports" 
            subtitle="Historical statements and performance audits."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.title} className="rounded-4xl border-none shadow-soft hover:shadow-md transition-shadow group">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.date}</CardDescription>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-teal/10 text-brand-teal">
                    <FileText className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-4">
                  <Badge variant="secondary" className="rounded-lg">{report.type}</Badge>
                  <Button variant="ghost" size="sm" className="gap-2 group-hover:text-brand-blue">
                    <Download className="size-4" />
                    Download
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