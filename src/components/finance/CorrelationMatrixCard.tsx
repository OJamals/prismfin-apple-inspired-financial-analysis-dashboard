import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationData } from '@shared/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
interface CorrelationMatrixCardProps {
  data: CorrelationData;
}
export function CorrelationMatrixCard({ data }: CorrelationMatrixCardProps) {
  const { symbols, matrix } = data;
  const getCellColor = (val: number) => {
    if (val === 1) return 'bg-slate-100 text-muted-foreground/40';
    if (val > 0.8) return 'bg-rose-600 text-white';
    if (val > 0.6) return 'bg-rose-400 text-white';
    if (val > 0.3) return 'bg-rose-200 text-rose-900';
    if (val > 0) return 'bg-brand-blue/20 text-brand-blue';
    if (val > -0.3) return 'bg-brand-blue/40 text-white';
    return 'bg-brand-blue/70 text-white';
  };
  const getLabel = (val: number) => {
    if (val === 1) return "Self Correlation";
    if (val > 0.7) return "Strong Positive";
    if (val > 0.4) return "Moderate Positive";
    if (val > 0) return "Weak Positive";
    return "Negative Correlation";
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Asset Correlation</CardTitle>
        <p className="text-sm text-muted-foreground">Inter-asset price movement affinity</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <table className="w-full min-w-[500px] border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="p-2"></th>
                {symbols.map(s => (
                  <th key={s} className="p-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center font-display">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symbols.map(s1 => (
                <tr key={s1}>
                  <td className="p-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right align-middle font-display">
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
                                "aspect-square w-full min-w-[48px] flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 cursor-default hover:scale-110 hover:shadow-lg hover:z-10",
                                getCellColor(val)
                              )}>
                                {val.toFixed(2)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-card/95 backdrop-blur-xl border border-border/20 shadow-xl text-foreground p-3 rounded-2xl min-w-[140px]">
                              <p className="text-xs font-bold mb-1">{s1} + {s2}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{getLabel(val)}</p>
                              <div className="mt-2 text-lg font-display font-bold text-brand-blue">
                                {val.toFixed(3)}
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
        <div className="mt-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-rose-500 shadow-sm" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">High Corr</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-brand-blue/60 shadow-sm" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">Diversifier</span>
            </div>
          </div>
          <p className="text-[10px] font-mono italic text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-md">
            Avg Portfolio ρ: 0.42
          </p>
        </div>
      </CardContent>
    </Card>
  );
}