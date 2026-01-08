import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
export function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <DashboardHeader 
            title="Settings" 
            subtitle="Manage your preferences and security."
          />
          <div className="max-w-2xl space-y-6">
            <Card className="rounded-4xl border-none shadow-soft">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how PrismFin looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch between light and dark theme.</p>
                  </div>
                  <ThemeToggle className="static" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact View</Label>
                    <p className="text-xs text-muted-foreground">Show more rows in tables at once.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-4xl border-none shadow-soft">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Protect your financial data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
                  </div>
                  <Switch checked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}