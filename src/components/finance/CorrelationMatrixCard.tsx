import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationData } from '@shared/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface CorrelationMatrixCardProps {
  data: CorrelationData;
}
export function CorrelationMatrixCard({ data }: CorrelationMatrixCardProps) {
  const { symbols, matrix } = data;
  const getCellColor = (val: number) => {
    if (val === 1) return 'bg-slate-100/50 text-slate-300';
    // Positive Correlation (Red)
    if (val > 0.8) return 'bg-rose-600 text-white';
    if (val > 0.5) return 'bg-rose-400 text-white';
    if (val > 0.2) return 'bg-rose-100 text-rose-800';
    // Neutral (White)
    if (val >= -0.2 && val <= 0.2) return 'bg-white text-slate-500 ring-1 ring-inset ring-slate-100';
    // Negative Correlation (Blue)
    if (val < -0.8) return 'bg-blue-600 text-white';
    if (val < -0.5) return 'bg-blue-400 text-white';
    return 'bg-blue-100 text-blue-800';
  };
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full flex flex-col overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-xl font-bold font-display tracking-tight text-foreground">Correlation Matrix</CardTitle>
        <p className="text-sm text-muted-foreground font-medium">Heatmap of asset affinity (-1 Blue to +1 Red)</p>
      </CardHeader>
      <CardContent className="flex-1 p-8 pt-2">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <table className="min-w-max w-full border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="p-2"></th>
                {symbols.map(s => (
                  <th key={s} className="p-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symbols.map(s1 => (
                <tr key={s1}>
                  <td className="p-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">
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
                                "aspect-square w-14 flex items-center justify-center rounded-xl text-[11px] font-extrabold transition-all duration-300 cursor-help hover:scale-105 hover:shadow-lg",
                                getCellColor(val)
                              )}>
                                {val === 1 ? '1.0' : val.toFixed(2)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="glass-premium border-white/20 p-4 rounded-2xl shadow-premium min-w-[180px]">
                              <div className="space-y-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s1} × {s2}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-black">{val.toFixed(3)}</span>
                                  <span className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                                    val > 0.5 ? "bg-rose-50 text-rose-600" : val < -0.5 ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500"
                                  )}>
                                    {val > 0.7 ? 'Sync' : val < -0.7 ? 'Diversifier' : 'Independent'}
                                  </span>
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
        <div className="mt-10 space-y-3">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-600 via-slate-100 to-rose-600" />
          <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
            <span className="text-blue-600">Inverse (-1.0)</span>
            <span>Neutral (0.0)</span>
            <span className="text-rose-600">Co-linear (+1.0)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}