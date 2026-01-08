import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Database, Shield, User, Trash2 } from 'lucide-react';
export function SettingsPage() {
  const handlePurge = () => {
    toast.error('Cloud synchronization required to purge master records.');
  };
  const handleCacheReset = () => {
    toast.success('Local analytical cache cleared.');
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Settings"
            subtitle="Manage your institutional preferences and security protocols."
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-brand-blue" />
                    <CardTitle className="text-xl font-bold font-display">Profile Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <Avatar className="size-24 rounded-3xl border-4 border-white shadow-soft">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" />
                      <AvatarFallback>PF</AvatarFallback>
                    </Avatar>
                    <div className="space-y-4 flex-1 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Legal Name</Label>
                          <Input defaultValue="Institutional Trader" className="rounded-xl bg-secondary/30 border-none" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</Label>
                          <Input defaultValue="terminal@prismfin.io" className="rounded-xl bg-secondary/30 border-none" />
                        </div>
                      </div>
                      <Button className="rounded-xl h-10 px-6 font-bold bg-brand-blue text-white hover:bg-brand-blue/90">Save Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-brand-teal" />
                    <CardTitle className="text-xl font-bold font-display">Security Protocols</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your terminal access.</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-bold">Institutional Theme</Label>
                      <p className="text-xs text-muted-foreground">Switch between high-contrast mode or standard.</p>
                    </div>
                    <ThemeToggle className="static" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <Card className="rounded-4xl border-none shadow-soft bg-loss-50/20 overflow-hidden">
                <CardHeader className="p-8 border-b border-loss-500/10">
                  <div className="flex items-center gap-3">
                    <Database className="size-5 text-loss-500" />
                    <CardTitle className="text-xl font-bold font-display text-loss-700">Data Controls</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs text-loss-600/70 font-medium leading-relaxed">Danger Zone: Actions here are irreversible and will disconnect your local analytical engines from the master record.</p>
                    <Button variant="outline" className="w-full rounded-xl border-loss-200 text-loss-600 hover:bg-loss-50 font-bold" onClick={handleCacheReset}>Reset Local Cache</Button>
                    <Button variant="destructive" className="w-full rounded-xl bg-loss-500 text-white hover:bg-loss-600 font-bold gap-2" onClick={handlePurge}>
                      <Trash2 className="size-4" /> Purge Cloud State
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}