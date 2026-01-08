import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuantInsight } from '@shared/types';
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
interface AIAnalystNoteProps {
  insight: QuantInsight;
}
export function AIAnalystNote({ insight }: AIAnalystNoteProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  return (
    <Card className="relative rounded-4xl border-none overflow-hidden bg-white shadow-premium">
      {/* Animated gradient border simulation */}
      <div className="absolute inset-0 p-[2px] rounded-4xl bg-gradient-to-r from-brand-blue/20 via-brand-teal/40 to-brand-blue/20" />
      <CardContent className="relative m-[2px] bg-white rounded-[1.9rem] p-8 md:p-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
              <BrainCircuit className="size-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intelligence Report</p>
              <h3 className="text-xl font-bold font-display tracking-tight">AI Analyst Summary</h3>
            </div>
            <div className="ml-auto md:ml-4 px-3 py-1 rounded-full bg-gradient-to-r from-brand-blue to-brand-teal text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Sparkles className="size-3 fill-current" />
              Quantum AI
            </div>
          </div>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.p variants={item} className="text-lg font-medium text-foreground leading-relaxed">
              {insight.summary}
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/10">
              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-brand-teal uppercase tracking-widest">
                  <TrendingUp className="size-3" /> Attribution Detail
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.attribution}</p>
              </motion.div>
              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                  <AlertCircle className="size-3" /> Risk Exposure
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.riskExposure}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="md:w-64 shrink-0 bg-secondary/30 rounded-3xl p-6 flex flex-col justify-between border border-white/40 shadow-sm ring-1 ring-black/5">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actionable Guidance</p>
            <p className="text-xs font-bold text-foreground leading-relaxed">
              {insight.recommendation}
            </p>
          </div>
          <div className="pt-6">
            <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue w-2/3 rounded-full" />
            </div>
            <p className="text-[9px] font-black text-muted-foreground/60 uppercase mt-3 tracking-widest">Model Confidence: 88%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}