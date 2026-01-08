import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsTableCard } from '@/components/finance/MetricsTableCard';
import { getMockRows } from '@shared/mock-data';
export function HoldingsPage() {
  const rows = getMockRows();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader 
            title="Holdings" 
            subtitle="Detailed breakdown of your asset allocation."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-4xl border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Diversification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <p className="text-xs text-muted-foreground mt-1">High across 12 sectors</p>
              </CardContent>
            </Card>
            <Card className="rounded-4xl border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Moderate</div>
                <p className="text-xs text-muted-foreground mt-1">Beta 1.12 vs S&P 500</p>
              </CardContent>
            </Card>
            <Card className="rounded-4xl border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4%</div>
                <p className="text-xs text-muted-foreground mt-1">Annual dividend projection</p>
              </CardContent>
            </Card>
          </div>
          <MetricsTableCard rows={rows} />
        </div>
      </div>
    </AppLayout>
  );
}