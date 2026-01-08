import React from 'react';
import { RefreshCw, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  range?: string;
  onRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}
export function DashboardHeader({
  title,
  subtitle,
  range,
  onRangeChange,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onRangeChange && (
          <Select value={range} onValueChange={onRangeChange}>
            <SelectTrigger className="w-[100px] bg-card border-none shadow-soft rounded-xl h-10">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        )}
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl h-10 w-10 bg-card shadow-soft hover:bg-muted"
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 bg-card shadow-soft hover:bg-muted"
        >
          <Download className="size-4" />
        </Button>
        <ThemeToggle className="static" />
      </div>
    </div>
  );
}