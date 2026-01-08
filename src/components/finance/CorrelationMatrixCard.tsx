import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationData } from '@shared/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
interface CorrelationMatrixCardProps {
  data: CorrelationData;
}
export function CorrelationMatrixCard({ data }: CorrelationMatrixCardProps) {
  const { symbols, matrix } = data;
  const getCellColor = (val: number) => {
    if (val === 1) return 'bg-slate-50 text-slate-300';
    // Positive Correlation (Red Scale)
    if (val > 0.7) return 'bg-rose-600 text-white';
    if (val > 0.3) return 'bg-rose-300 text-rose-900';
    if (val > 0) return 'bg-rose-50 text-rose-800';
    // Negative Correlation (Blue Scale)
    if (val > -0.3) return 'bg-blue-50 text-blue-800';
    if (val > -0.7) return 'bg-blue-300 text-blue-900';
    return 'bg-blue-600 text-white';
  };
  const getLabel = (val: number) => {
    if (val === 1) return "Self Correlation";
    if (val > 0.7) return "High Positive Synchronization";
    if (val > 0.3) return "Moderate Positive Coupling";
    if (val > 0) return "Slight Positive Drift";
    if (val > -0.3) return "Effective Diversifier";
    if (val > -0.7) return "Strong Counter-Cyclical";
    return "Inversely Correlated Alpha";
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full flex flex-col overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-xl font-bold font-display tracking-tight text-foreground">Correlation Matrix</CardTitle>
        <p className="text-sm text-muted-foreground font-medium">Inter-asset move affinity (-1 Blue to +1 Red)</p>
      </CardHeader>
      <CardContent className="flex-1 p-8 pt-2">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <table className="min-w-max w-full border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="p-2"></th>
                {symbols.map(s => (
                  <th key={s} className="p-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center font-display">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symbols.map(s1 => (
                <tr key={s1}>
                  <td className="p-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right align-middle font-display">
                    {s1}
                  </td>
                  {symbols.map(s2 => {
                    const val = matrix[s1]?.[s2] ?? 0;
                    return (
                      <td key={`${s1}-${s2}`} className="p-0">
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "aspect-square w-14 flex items-center justify-center rounded-xl text-[11px] font-extrabold transition-all duration-300 cursor-help hover:scale-105 hover:shadow-lg hover:z-10",
                                getCellColor(val)
                              )}>
                                {val === 1 ? '1.0' : val.toFixed(2)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="glass-premium border-white/20 p-5 rounded-2xl min-w-[200px] shadow-premium">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-muted/20 pb-2">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s1} × {s2}</p>
                                  <span className="text-lg font-black text-foreground tabular-nums">{val.toFixed(3)}</span>
                                </div>
                                <p className="text-xs font-bold text-foreground leading-snug">{getLabel(val)}</p>
                                <div className="pt-1 flex items-center gap-2 text-[10px] text-muted-foreground italic">
                                  <Info className="size-3" />
                                  Values near 0 indicate independence.
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-auto pt-8 flex flex-col gap-4">
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-slate-100 to-rose-600 shadow-inner" />
          <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            <span className="text-blue-600">Diversification (-1.0)</span>
            <span>Neutral (0.0)</span>
            <span className="text-rose-600">Synchronization (+1.0)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}