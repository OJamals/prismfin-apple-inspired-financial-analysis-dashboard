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
    if (val === 1) return 'bg-muted/50 text-muted-foreground';
    if (val > 0.8) return 'bg-rose-500 text-white';
    if (val > 0.6) return 'bg-rose-400 text-white';
    if (val > 0.4) return 'bg-rose-300 text-rose-950';
    if (val > 0.2) return 'bg-brand-blue/30 text-brand-blue';
    return 'bg-brand-blue/60 text-white';
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Asset Correlation</CardTitle>
        <p className="text-sm text-muted-foreground">Inter-asset price movement affinity</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="p-2"></th>
                {symbols.map(s => (
                  <th key={s} className="p-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symbols.map(s1 => (
                <tr key={s1}>
                  <td className="p-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right align-middle">
                    {s1}
                  </td>
                  {symbols.map(s2 => {
                    const val = matrix[s1][s2];
                    return (
                      <td key={`${s1}-${s2}`} className="p-0">
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "aspect-square w-full min-w-[40px] flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 cursor-default hover:scale-110 hover:z-10",
                                getCellColor(val)
                              )}>
                                {val.toFixed(2)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white/90 backdrop-blur-md border-none shadow-soft text-foreground p-2 rounded-xl">
                              <p className="text-xs font-semibold">{s1} & {s2}</p>
                              <p className="text-[10px] text-muted-foreground">Correlation: {val}</p>
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
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-rose-500" />
              <span className="text-[10px] text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-brand-blue/60" />
              <span className="text-[10px] text-muted-foreground">Negative</span>
            </div>
          </div>
          <p className="text-[10px] italic text-muted-foreground">Avg Portfolio Corr: 0.42</p>
        </div>
      </CardContent>
    </Card>
  );
}