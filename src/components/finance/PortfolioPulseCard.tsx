import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PulseMetric } from '@shared/types';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MetricsDetailDrawer } from './MetricsDetailDrawer';
interface PortfolioPulseCardProps {
  pulse: PulseMetric;
}
export function PortfolioPulseCard({ pulse }: PortfolioPulseCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const isHealthy = pulse.health === 'healthy';
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ translateY: -4 }}
        className="relative group"
      >
        <div className={cn(
          "absolute -inset-1 rounded-[3rem] blur-2xl opacity-20 transition-opacity duration-500",
          isHealthy ? "bg-gain-500" : "bg-amber-500"
        )} />
        <Card className={cn(
          "relative rounded-5xl border-none shadow-premium overflow-hidden",
          isHealthy ? "bg-white" : "bg-amber-50/10"
        )}>
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className={cn(
                "size-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg",
                isHealthy ? "bg-gain-500 text-white" : "bg-amber-500 text-white"
              )}>
                <Sparkles className="size-10 fill-current" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Pulse</span>
                  <div className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                    isHealthy ? "bg-gain-50 text-gain-600" : "bg-amber-50 text-amber-700"
                  )}>
                    {isHealthy ? 'System Balanced' : 'Optimization Required'}
                  </div>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold font-display tracking-tight text-foreground leading-tight">
                  {pulse.summary}
                </h3>
                <p className="text-muted-foreground font-medium max-w-2xl">
                  {pulse.comparisonLabel}
                </p>
              </div>
              <div className="shrink-0">
                <Button 
                  onClick={() => setShowDetail(true)}
                  className="rounded-2xl h-14 px-8 bg-foreground text-background font-bold gap-3 hover:scale-105 transition-transform"
                >
                  Analyze Impact <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <MetricsDetailDrawer 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)}
        metricName="Portfolio Health"
        description={pulse.detail}
      />
    </div>
  );
}