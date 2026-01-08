import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { Database, Shield, User, GraduationCap, Target } from 'lucide-react';
import { useUserSettings } from '@/hooks/use-user-settings';
import { SkillLevel } from '@shared/types';
export function SettingsPage() {
  const { skillLevel, setSkillLevel } = useUserSettings();
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
                    <GraduationCap className="size-5 text-brand-blue" />
                    <CardTitle className="text-xl font-bold font-display">Adaptive Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <RadioGroup 
                    value={skillLevel} 
                    onValueChange={(v) => setSkillLevel(v as SkillLevel)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="relative">
                      <RadioGroupItem value="beginner" id="beginner" className="peer sr-only" />
                      <Label
                        htmlFor="beginner"
                        className="flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-blue [&:has([data-state=checked])]:border-brand-blue cursor-pointer transition-all"
                      >
                        <Target className="mb-4 size-8 text-muted-foreground" />
                        <span className="font-bold text-lg mb-2">Beginner</span>
                        <p className="text-center text-xs text-muted-foreground leading-relaxed">
                          Focused on plain-English summaries, core health metrics, and educational guides.
                        </p>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="advanced" id="advanced" className="peer sr-only" />
                      <Label
                        htmlFor="advanced"
                        className="flex flex-col items-center justify-between rounded-3xl border-2 border-muted bg-popover p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-blue [&:has([data-state=checked])]:border-brand-blue cursor-pointer transition-all"
                      >
                        <GraduationCap className="mb-4 size-8 text-muted-foreground" />
                        <span className="font-bold text-lg mb-2">Advanced</span>
                        <p className="text-center text-xs text-muted-foreground leading-relaxed">
                          Full institutional grid access including risk models, factor attribution, and Monte Carlo.
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-brand-blue" />
                    <CardTitle className="text-xl font-bold font-display">Profile Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
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
            </div>
            <div className="lg:col-span-4">
              <Card className="rounded-4xl border-none shadow-soft bg-loss-50/20 overflow-hidden">
                <CardHeader className="p-8 border-b border-loss-500/10">
                  <div className="flex items-center gap-3">
                    <Database className="size-5 text-loss-500" />
                    <CardTitle className="text-xl font-bold font-display text-loss-700">Data Controls</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <p className="text-xs text-loss-600/70 font-medium leading-relaxed">Danger Zone: IRREVERSIBLE terminal actions.</p>
                  <Button variant="outline" className="w-full rounded-xl border-loss-200 text-loss-600">Reset Local Cache</Button>
                  <Button variant="destructive" className="w-full rounded-xl bg-loss-500 text-white font-bold">Purge Cloud State</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}