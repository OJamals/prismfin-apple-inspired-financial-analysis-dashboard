import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from 'lucide-react';
interface ScreenerFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filters: {
    pe: number[];
    yield: number[];
    sharpe: number[];
    sector: string;
  };
  onFilterChange: (filters: any) => void;
}
export function ScreenerFilterBar({ search, onSearchChange, filters, onFilterChange }: ScreenerFilterBarProps) {
  const updateFilter = (key: string, val: any) => {
    onFilterChange({ ...filters, [key]: val });
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-card/40 backdrop-blur-md p-8 rounded-4xl border border-white/40 shadow-soft ring-1 ring-border/20">
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Quick Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Symbol or name..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-card border-none shadow-sm rounded-2xl focus-visible:ring-brand-blue/30"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between px-1">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">P/E Ratio</Label>
          <span className="text-[10px] font-bold tabular-nums text-brand-blue">{filters.pe[0]}-{filters.pe[1]}x</span>
        </div>
        <div className="pt-3 px-1">
          <Slider 
            min={0} 
            max={100} 
            step={1} 
            value={filters.pe} 
            onValueChange={(v) => updateFilter('pe', v)}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between px-1">
          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dividend Yield</Label>
          <span className="text-[10px] font-bold tabular-nums text-brand-blue">{filters.yield[0]}-{filters.yield[1]}%</span>
        </div>
        <div className="pt-3 px-1">
          <Slider 
            min={0} 
            max={10} 
            step={0.1} 
            value={filters.yield} 
            onValueChange={(v) => updateFilter('yield', v)}
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Sector Focus</Label>
        <Select value={filters.sector} onValueChange={(v) => updateFilter('sector', v)}>
          <SelectTrigger className="h-11 bg-card border-none shadow-sm rounded-2xl focus:ring-brand-blue/30">
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl shadow-premium border-white/20">
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Financials">Financials</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}