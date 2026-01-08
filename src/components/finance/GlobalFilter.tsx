import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssetClass } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
const OPTIONS: { label: string; value: AssetClass }[] = [
  { label: 'All Assets', value: 'all' },
  { label: 'Equities', value: 'equity' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Fixed Income', value: 'fixed-income' },
];
export function GlobalFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('filter') as AssetClass) || 'all';
  const handleFilterChange = (val: AssetClass) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === 'all') {
      newParams.delete('filter');
    } else {
      newParams.set('filter', val);
    }
    setSearchParams(newParams);
  };
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-underline">
      <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-soft ring-1 ring-black/5">
        {OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleFilterChange(opt.value)}
              className={cn(
                "relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl whitespace-nowrap",
                isActive 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-brand-blue rounded-xl shadow-lg shadow-brand-blue/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}