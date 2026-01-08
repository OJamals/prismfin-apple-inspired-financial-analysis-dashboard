import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal } from 'lucide-react';
import { ScreenerFilters } from '@shared/types';
import { Button } from '@/components/ui/button';
interface ScreenerActiveChipsProps {
  filters: ScreenerFilters;
  onReset: (key: keyof ScreenerFilters) => void;
  onClearAll: () => void;
}
const DEFAULT_FILTERS: ScreenerFilters = {
  pe: [0, 100],
  yield: [0, 15],
  sharpe: [0, 4],
  peg: [0, 5],
  beta: [0, 3],
  sector: 'all',
  sentiment: 'all'
};
export function ScreenerActiveChips({ filters, onReset, onClearAll }: ScreenerActiveChipsProps) {
  const chips: { label: string, key: keyof ScreenerFilters }[] = [];
  const checkRange = (key: keyof ScreenerFilters, label: string, unit = '') => {
    const val = filters[key] as number[];
    const def = DEFAULT_FILTERS[key] as number[];
    if (val[0] !== def[0] || val[1] !== def[1]) {
      chips.push({ label: `${label}: ${val[0]}-${val[1]}${unit}`, key });
    }
  };
  checkRange('pe', 'P/E', 'x');
  checkRange('yield', 'Yield', '%');
  checkRange('sharpe', 'Sharpe');
  checkRange('peg', 'PEG');
  checkRange('beta', 'Beta');
  if (filters.sector !== 'all') chips.push({ label: `Sector: ${filters.sector}`, key: 'sector' });
  if (filters.sentiment !== 'all') chips.push({ label: `Sentiment: ${filters.sentiment}`, key: 'sentiment' });
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 mr-2 text-muted-foreground">
        <SlidersHorizontal className="size-3.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Active Filters:</span>
      </div>
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="rounded-full px-3 py-1 bg-white border-white/40 shadow-sm flex items-center gap-2 text-[10px] font-bold text-foreground group"
        >
          {chip.label}
          <button
            onClick={() => onReset(chip.key)}
            className="hover:text-brand-blue transition-colors rounded-full p-0.5 hover:bg-muted"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-loss-500 transition-colors"
      >
        Clear All
      </Button>
    </div>
  );
}