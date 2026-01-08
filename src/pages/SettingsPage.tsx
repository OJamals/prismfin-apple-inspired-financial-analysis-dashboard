import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
} from '@/components/ui';
import {
  Bell,
  Database,
  GraduationCap,
  Layout,
  LayoutPanelLeft,
  Shield,
  Target,
} from 'lucide-react';
import { useUserSettings } from '@/hooks/use-user-settings';
import { SkillLevel, TradingMode } from '@shared/types';
import { cn } from '@/lib/utils';
export function SettingsPage() {
  const { 
    skillLevel, setSkillLevel, 
    tradingMode, setTradingMode,
    density, setDensity,
    showTooltips, setShowTooltips,
    alertThresholds, setAlertThresholds
  } = useUserSettings();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <DashboardHeader
            title="Institutional Control"
            subtitle="Manage your terminal environment, risk thresholds, and analytical complexity."
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {/* Adaptive Intelligence */}
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="size-5 text-brand-blue" />
                    <CardTitle className="text-xl font-bold font-display text-foreground">Adaptive Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <RadioGroup
                    value={skillLevel}
                    onValueChange={(v) => setSkillLevel(v as SkillLevel)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {[
                      { id: 'novice', label: 'Novice', icon: Target, desc: 'Plain-English summaries and core health metrics.' },
                      { id: 'pro', label: 'Pro', icon: Target, desc: 'Institutional grid access and factor attribution models.' },
                      { id: 'institutional', label: 'Institutional', icon: Shield, desc: 'Unrestricted access to all risk and quantitative simulation labs.' }
                    ].map((tier) => (
                      <div key={tier.id} className="relative">
                        <RadioGroupItem value={tier.id} id={tier.id} className="peer sr-only" />
                        <Label
                          htmlFor={tier.id}
                          className="flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-6 h-full hover:bg-accent/50 peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:bg-brand-blue/5 cursor-pointer transition-all text-center"
                        >
                          <tier.icon className={cn("mb-4 size-8", skillLevel === tier.id ? "text-brand-blue" : "text-muted-foreground")} />
                          <span className="font-bold text-base mb-2">{tier.label}</span>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {tier.desc}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              {/* Alert Intelligence */}
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <Bell className="size-5 text-brand-blue" />
                    <CardTitle className="text-xl font-bold font-display text-foreground">Alert Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold">Volatility Sensitivity</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Trigger on price swings</p>
                      </div>
                      <Badge className="bg-brand-blue/10 text-brand-blue border-none font-black">{alertThresholds.volatility}%</Badge>
                    </div>
                    <Slider 
                      value={[alertThresholds.volatility]} 
                      onValueChange={([v]) => setAlertThresholds({ volatility: v })}
                      min={1} max={15} step={0.5} 
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold">Crossover Threshold</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Signal on MA deviations</p>
                      </div>
                      <Badge className="bg-brand-teal/10 text-brand-teal border-none font-black">{alertThresholds.crossover}%</Badge>
                    </div>
                    <Slider 
                      value={[alertThresholds.crossover]} 
                      onValueChange={([v]) => setAlertThresholds({ crossover: v })}
                      min={0.5} max={5} step={0.1} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4 space-y-8">
              {/* System Environment */}
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <Database className="size-5 text-brand-blue" />
                    <CardTitle className="text-lg font-bold font-display text-foreground">Environment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Trading Mode</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{tradingMode === 'live' ? 'Live Execution' : 'Paper Simulation'}</p>
                    </div>
                    <Switch 
                      checked={tradingMode === 'live'} 
                      onCheckedChange={(c) => setTradingMode(c ? 'live' : 'paper')}
                      className="data-[state=checked]:bg-loss-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">UI Density</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{density === 'comfortable' ? 'Airy (Apple)' : 'Compact (Bloomberg)'}</p>
                    </div>
                    <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
                      <Button 
                        variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", density === 'comfortable' && "bg-card shadow-sm")}
                        onClick={() => setDensity('comfortable')}
                      ><Layout className="size-4" /></Button>
                      <Button 
                        variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", density === 'compact' && "bg-card shadow-sm")}
                        onClick={() => setDensity('compact')}
                      ><LayoutPanelLeft className="size-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Tooltips</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Educational Overlays</p>
                    </div>
                    <Switch checked={showTooltips} onCheckedChange={setShowTooltips} />
                  </div>
                </CardContent>
              </Card>
              {/* Data Safety */}
              <Card className="rounded-4xl border-none shadow-soft bg-loss-50/20 overflow-hidden">
                <CardHeader className="p-8">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-loss-500" />
                    <CardTitle className="text-lg font-bold font-display text-loss-700">Data Safety</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <Button variant="outline" className="w-full rounded-xl border-loss-200 text-loss-600 font-bold" onClick={() => { localStorage.clear(); window.location.reload(); }}>Purge Terminal Cache</Button>
                  <p className="text-[10px] text-loss-600/70 font-medium leading-relaxed text-center">Resets all institutional preferences to system defaults.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}