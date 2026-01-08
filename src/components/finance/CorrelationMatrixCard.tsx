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
    if (val === 1) return 'bg-slate-50 text-muted-foreground/30';
    // Positive Correlation Scale (Warm)
    if (val > 0.85) return 'bg-rose-600 text-white';
    if (val > 0.65) return 'bg-rose-400 text-white';
    if (val > 0.45) return 'bg-rose-200 text-rose-900';
    // Diversifiers (Cool)
    if (val > 0.15) return 'bg-brand-blue/10 text-brand-blue';
    if (val > -0.15) return 'bg-brand-teal/20 text-brand-teal font-extrabold';
    if (val > -0.5) return 'bg-brand-blue/40 text-white shadow-inner';
    return 'bg-brand-blue/70 text-white shadow-inner';
  };
  const getLabel = (val: number) => {
    if (val === 1) return "Self Correlation";
    if (val > 0.7) return "Strong Positive";
    if (val > 0.4) return "Moderate Positive";
    if (val > 0.1) return "Weak Positive";
    if (val > -0.1) return "Pure Diversifier";
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
          <table className="min-w-max w-full border-separate border-spacing-1.5">
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
                                "aspect-square w-12 flex items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-300 cursor-default hover:scale-110 hover:shadow-lg hover:z-10",
                                getCellColor(val)
                              )}>
                                {val.toFixed(2)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-card/95 backdrop-blur-2xl border border-white/20 shadow-premium text-foreground p-4 rounded-2xl min-w-[160px]">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{s1} × {s2}</p>
                              <p className="text-xs font-bold text-foreground mb-2">{getLabel(val)}</p>
                              <div className="text-2xl font-display font-bold text-brand-blue tabular-nums">
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
              <div className="size-2 rounded-full bg-rose-500 shadow-sm" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-brand-teal shadow-sm" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Alpha Edge</span>
            </div>
          </div>
          <p className="text-[10px] font-mono font-bold text-brand-blue bg-brand-blue/5 border border-brand-blue/10 px-3 py-1 rounded-full uppercase tracking-widest">
            Portfolio ρ: 0.42
          </p>
        </div>
      </CardContent>
    </Card>
  );
}