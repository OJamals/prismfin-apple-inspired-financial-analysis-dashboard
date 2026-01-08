import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from 'lucide-react';
import { ScreenerFilters, ScreenerPreset } from '@shared/types';
const PRESETS: ScreenerPreset[] = [
  { id: 'div-aristocrats', label: 'Dividend Aristocrats', filters: { yield: [3, 10], pe: [0, 20], sentiment: 'Bullish' } },
  { id: 'growth', label: 'Small-Cap Growth', filters: { sharpe: [1.5, 4], peg: [0, 1.2], beta: [1.1, 2.5] } },
  { id: 'tech-value', label: 'Undervalued Tech', filters: { sector: 'Technology', pe: [0, 22], peg: [0, 1.0] } },
];
interface ScreenerFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filters: ScreenerFilters;
  onFilterChange: (filters: ScreenerFilters) => void;
}
export function ScreenerFilterBar({ search, onSearchChange, filters, onFilterChange }: ScreenerFilterBarProps) {
  const updateRange = (key: keyof ScreenerFilters, index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const current = [...((filters[key] as number[]) || [0, 100])];
    current[index] = num;
    onFilterChange({ ...filters, [key]: current });
  };
  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      onFilterChange({
        ...filters,
        ...preset.filters
      });
    }
  };
  const RangeFilter = ({ label, fKey, min, max, step, unit = '' }: { label: string, fKey: keyof ScreenerFilters, min: number, max: number, step: number, unit?: string }) => {
    const vals = (filters[fKey] as number[]) || [min, max];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</Label>
          <div className="flex items-center gap-1.5">
            <Input
              className="h-6 w-12 text-[10px] p-1 text-center bg-card border-none rounded-md"
              value={vals[0]}
              onChange={(e) => updateRange(fKey, 0, e.target.value)}
            />
            <span className="text-[10px] text-muted-foreground">-</span>
            <Input 
              className="h-6 w-12 text-[10px] p-1 text-center bg-card border-none rounded-md" 
              value={vals[1]} 
              onChange={(e) => updateRange(fKey, 1, e.target.value)}
            />
            <span className="text-[10px] font-bold text-brand-blue">{unit}</span>
          </div>
        </div>
        <Slider
          min={min}
          max={max}
          step={step}
          value={vals}
          onValueChange={(v) => onFilterChange({ ...filters, [fKey]: v })}
          className="px-1"
        />
      </div>
    );
  };
  return (
    <div className="space-y-6 bg-card/40 backdrop-blur-xl p-8 rounded-4xl border border-white/40 shadow-premium ring-1 ring-border/5">
      <div className="flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex-1 space-y-3 w-full">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Institutional Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Filter by ticker, name, or sector..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 bg-card border-none shadow-sm rounded-2xl focus-visible:ring-brand-blue/30"
            />
          </div>
        </div>
        <div className="w-full lg:w-64 space-y-3">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Analytical Presets</Label>
          <Select onValueChange={applyPreset}>
            <SelectTrigger className="h-12 bg-card border-none shadow-sm rounded-2xl">
              <SelectValue placeholder="Select Strategy..." />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-premium border-white/10">
              {PRESETS.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 pt-4">
        <RangeFilter label="P/E Ratio" fKey="pe" min={0} max={100} step={1} unit="x" />
        <RangeFilter label="Dividend Yield" fKey="yield" min={0} max={15} step={0.1} unit="%" />
        <RangeFilter label="Sharpe Ratio" fKey="sharpe" min={0} max={4} step={0.1} />
        <RangeFilter label="PEG Ratio" fKey="peg" min={0} max={5} step={0.1} />
        <RangeFilter label="Beta (Market Sync)" fKey="beta" min={0} max={3} step={0.1} />
      </div>
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sector</Label>
          <Select value={filters.sector} onValueChange={(v) => onFilterChange({...filters, sector: v})}>
            <SelectTrigger className="h-9 w-40 bg-card border-none shadow-sm rounded-xl text-xs font-bold">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Financials">Financials</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Energy">Energy</SelectItem>
              <SelectItem value="Consumer Staples">Consumer Staples</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sentiment</Label>
          <Select value={filters.sentiment} onValueChange={(v) => onFilterChange({...filters, sentiment: v})}>
            <SelectTrigger className="h-9 w-40 bg-card border-none shadow-sm rounded-xl text-xs font-bold">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Any Sentiment</SelectItem>
              <SelectItem value="Bullish">Bullish</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Bearish">Bearish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}