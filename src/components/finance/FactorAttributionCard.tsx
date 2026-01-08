import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FactorAttribution } from '@shared/types';
interface FactorAttributionCardProps {
  factors: FactorAttribution[];
}
export function FactorAttributionCard({ factors }: FactorAttributionCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Factor Attribution</CardTitle>
        <p className="text-sm text-muted-foreground">Return drivers by equity factor</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {factors.map((factor) => (
          <div key={factor.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="size-2.5 rounded-full" 
                  style={{ backgroundColor: factor.color }} 
                />
                <span className="font-medium text-foreground">{factor.label}</span>
              </div>
              <span className="text-muted-foreground font-semibold">{factor.value}%</span>
            </div>
            <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
               <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${factor.value}%`, 
                  backgroundColor: factor.color 
                }}
               />
            </div>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t border-muted">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Analysis insight
          </p>
          <p className="text-xs text-foreground mt-1 leading-relaxed">
            Portfolio maintains a significant tilt towards <span className="font-bold">Quality</span> and <span className="font-bold">Growth</span>, explaining 65% of recent alpha.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}