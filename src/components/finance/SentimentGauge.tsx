import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface SentimentGaugeProps {
  score: number; // 0-100
  className?: string;
}
export function SentimentGauge({ score, className }: SentimentGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const rotation = (normalizedScore / 100) * 180 - 90;
  const getLabel = (s: number) => {
    if (s > 75) return { text: 'Extreme Greed', color: 'text-gain-600' };
    if (s > 55) return { text: 'Institutional Optimism', color: 'text-brand-teal' };
    if (s > 45) return { text: 'Neutral Drift', color: 'text-muted-foreground' };
    if (s > 25) return { text: 'Fearful Sentiment', color: 'text-loss-500' };
    return { text: 'Extreme Fear', color: 'text-loss-700' };
  };
  const labelInfo = getLabel(normalizedScore);
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8", className)}>
      <div className="relative w-64 h-32 overflow-hidden">
        {/* Semi-circle track */}
        <div className="absolute inset-0 rounded-t-full bg-gradient-to-r from-loss-500 via-slate-200 to-gain-500 opacity-20" />
        <div className="absolute inset-2 rounded-t-full bg-card shadow-inner" />
        {/* Gauge ticks */}
        <div className="absolute bottom-0 w-full flex justify-between px-2 text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">
          <span>Fear</span>
          <span>Neutral</span>
          <span>Greed</span>
        </div>
        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1.5 h-28 bg-foreground rounded-full origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
          style={{ translateX: '-50%' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-foreground shadow-glow" />
        </motion.div>
        {/* Center hub */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-8 rounded-full bg-card border-4 border-muted shadow-soft z-10" />
      </div>
      <div className="text-center space-y-1">
        <motion.p 
          className="text-5xl font-bold font-display tracking-tighter tabular-nums"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={normalizedScore}
        >
          {normalizedScore}
        </motion.p>
        <p className={cn("text-[10px] font-black uppercase tracking-widest", labelInfo.color)}>
          {labelInfo.text}
        </p>
      </div>
    </div>
  );
}