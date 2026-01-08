import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Layers, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { useUserSettings } from '@/hooks/use-user-settings';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
interface SimulateChangeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assetName?: string;
}
export function SimulateChangeDrawer({ isOpen, onClose, assetName }: SimulateChangeDrawerProps) {
  const { setSimMode } = useUserSettings();
  const [stress, setStress] = useState([0]);
  const [adjust, setAdjust] = useState([0]);
  const handleApply = () => {
    setSimMode(true);
    onClose();
  };
  const projectedImpact = (stress[0] * 1200) + (adjust[0] * 500);
  const newBeta = 1.08 + (stress[0] * 0.02);
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-card/95 backdrop-blur-3xl border-t border-white/20">
        <div className="max-w-4xl mx-auto w-full px-8 py-10">
          <DrawerHeader className="px-0 pb-8 border-b border-border/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Layers className="size-6" />
              </div>
              <div>
                <DrawerTitle className="text-3xl font-bold font-display tracking-tight">
                  Simulate {assetName ? `Change: ${assetName}` : 'Portfolio Shift'}
                </DrawerTitle>
                <DrawerDescription className="text-muted-foreground font-medium">Model "What-if" scenarios across your institutional holdings.</DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Stress Test</Label>
                  <span className="text-xs font-black text-amber-500">{stress[0]}% Market Shift</span>
                </div>
                <Slider 
                  value={stress} 
                  onValueChange={setStress} 
                  min={-20} 
                  max={20} 
                  step={1} 
                  className="py-4"
                />
                <p className="text-[10px] text-muted-foreground italic">Simulates a broader market rally or crash impact.</p>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Weight Adjustment</Label>
                  <span className="text-xs font-black text-brand-blue">{adjust[0]}% Allocation Change</span>
                </div>
                <Slider 
                  value={adjust} 
                  onValueChange={setAdjust} 
                  min={-50} 
                  max={50} 
                  step={5} 
                  className="py-4"
                />
                <p className="text-[10px] text-muted-foreground italic">Simulates increasing or decreasing your position size.</p>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-4xl p-8 flex flex-col justify-between border border-white/10 shadow-inner">
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Projected Engine Output</p>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-gain-500" />
                      <span className="text-sm font-bold">Net P&L Shift</span>
                    </div>
                    <span className="text-xl font-black tabular-nums">{formatCurrencyUSD(projectedImpact)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-brand-blue" />
                      <span className="text-sm font-bold">New Portfolio Beta</span>
                    </div>
                    <span className="text-xl font-black tabular-nums">{newBeta.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
              <div className="pt-8 flex items-start gap-3 border-t border-border/5">
                <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                  Caution: Projections are based on historical correlation factors and may not reflect real-time slippage or liquidity constraints.
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0 pt-8 border-t border-border/5">
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Discard Model</Button>
              <Button onClick={handleApply} className="rounded-2xl h-14 px-10 bg-amber-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20">
                Apply Paper Mode
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}