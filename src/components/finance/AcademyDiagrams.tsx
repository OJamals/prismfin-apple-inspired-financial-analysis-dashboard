import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
interface AcademyDiagramsProps {
  type: 'bell-curve' | 'sharpe-calc' | 'monte-carlo-sim' | 'corr-matrix';
  className?: string;
}
export function AcademyDiagrams({ type, className }: AcademyDiagramsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (type === 'bell-curve' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      // Clear
      ctx.clearRect(0, 0, width, height);
      const mean = width / 2;
      const stdDev = width / 8;
      // Draw Bell Curve
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#14B8A6';
      for (let x = 0; x < width; x++) {
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        const y = height - (height * 0.8 * Math.exp(exponent));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Shading for 1SD
      ctx.fillStyle = 'rgba(20, 184, 166, 0.1)';
      ctx.beginPath();
      for (let x = mean - stdDev; x <= mean + stdDev; x++) {
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        const y = height - (height * 0.8 * Math.exp(exponent));
        if (x === mean - stdDev) ctx.moveTo(x, height);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(mean + stdDev, height);
      ctx.fill();
      // Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('68% within 1 SD', mean, height - 10);
    }
  }, [type]);
  return (
    <Card className={cn("p-10 rounded-4xl border-none shadow-soft bg-white/60 flex items-center justify-center", className)}>
      {type === 'bell-curve' ? (
        <div className="space-y-6 w-full flex flex-col items-center">
          <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto max-w-lg" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
            Figure 1.1: The Normal Distribution (Gaussian Curve)
          </p>
        </div>
      ) : (
        <div className="p-20 text-center space-y-4">
          <div className="size-16 rounded-3xl bg-secondary mx-auto animate-pulse" />
          <p className="text-xs text-muted-foreground font-bold">Interactive diagram under audit...</p>
        </div>
      )}
    </Card>
  );
}