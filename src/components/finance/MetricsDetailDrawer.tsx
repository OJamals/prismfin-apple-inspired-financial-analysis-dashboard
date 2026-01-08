import React from 'react';
import { BookOpen, Info, Target } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
interface MetricsDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  description?: string;
}
export function MetricsDetailDrawer({ isOpen, onClose, metricName, description }: MetricsDetailDrawerProps) {
  const navigate = useNavigate();
  const handleLearnMore = () => {
    onClose();
    navigate('/academy');
  };
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-card/95 backdrop-blur-3xl border-t border-white/20">
        <div className="max-w-3xl mx-auto w-full px-8 py-10 space-y-12">
          <DrawerHeader className="px-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-brand-blue/10 text-brand-blue">
                <Target className="size-6" />
              </div>
              <div>
                <DrawerTitle className="text-3xl font-bold font-display tracking-tight">Understanding {metricName}</DrawerTitle>
                <DrawerDescription className="text-muted-foreground font-medium">Just-in-time analytical insight for your terminal.</DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Info className="size-4" /> Why this matters
              </div>
              <p className="text-lg font-medium leading-relaxed text-foreground">
                {description || "This metric provides a quantitative measure of your portfolio's current stability relative to broad market benchmarks."}
              </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-secondary/30 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">The Formula</p>
                <code className="block font-mono text-sm bg-card p-3 rounded-xl border border-border/10">
                  Risk = σ_p / σ_m
                </code>
              </div>
              <div className="p-6 rounded-3xl bg-secondary/30 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action Step</p>
                <p className="text-xs font-bold leading-relaxed">Consider balancing high-volatility tech names with fixed-income assets to lower correlation.</p>
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0 pt-8 border-t border-border/5">
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Close Insight</Button>
              <Button onClick={handleLearnMore} className="rounded-2xl h-12 px-8 bg-brand-blue text-white font-bold gap-2">
                Deep Dive in Academy <BookOpen className="size-4" />
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}