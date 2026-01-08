import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TradingMode } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
const OPTIONS: { label: string; value: TradingMode; icon: React.ElementType }[] = [
  { label: 'Live Trading', value: 'live', icon: Zap },
  { label: 'Paper Simulation', value: 'paper', icon: Shield },
];
export function GlobalFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMode = (searchParams.get('mode') as TradingMode) || 'live';
  const handleModeChange = (val: TradingMode) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mode', val);
    setSearchParams(newParams);
  };
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-underline">
      <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-soft ring-1 ring-black/5">
        {OPTIONS.map((opt) => {
          const isActive = activeMode === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => handleModeChange(opt.value)}
              className={cn(
                "relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl whitespace-nowrap flex items-center gap-2",
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className={cn(
                    "absolute inset-0 rounded-xl shadow-lg",
                    opt.value === 'live' 
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 shadow-rose-500/20" 
                      : "bg-gradient-to-r from-brand-blue to-brand-teal shadow-brand-blue/20"
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("size-3.5 relative z-10", isActive ? "animate-pulse" : "")} />
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}