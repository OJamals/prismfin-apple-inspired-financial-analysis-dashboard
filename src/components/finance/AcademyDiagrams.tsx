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
    const canvas = canvasRef.current;
    if (!canvas || type !== 'bell-curve') return;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = (rect.width * 0.5) * dpr;
      drawChart();
    };
    const drawChart = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      // Clear with absolute precision
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.scale(dpr, dpr);
      const logicalWidth = width / dpr;
      const logicalHeight = height / dpr;
      const mean = logicalWidth / 2;
      const stdDev = logicalWidth / 8;
      // Dynamic theme variable extraction
      const rootStyle = getComputedStyle(document.documentElement);
      const mutedForeground = rootStyle.getPropertyValue('--muted-foreground').trim() || '#64748b';
      const gainColor = rootStyle.getPropertyValue('--brand-teal').trim() || '#14B8A6';
      // Construct RGBA for shading based on theme
      const fillStyle = gainColor.startsWith('#') 
        ? `${gainColor}20` 
        : gainColor.replace('rgb', 'rgba').replace(')', ', 0.1)');
      // Draw Bell Curve Path
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = gainColor;
      for (let x = 0; x < logicalWidth; x++) {
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        const y = logicalHeight - (logicalHeight * 0.8 * Math.exp(exponent));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Shading for Central Tendency (1 SD)
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.moveTo(mean - stdDev, logicalHeight);
      for (let x = mean - stdDev; x <= mean + stdDev; x++) {
        const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
        const y = logicalHeight - (logicalHeight * 0.8 * Math.exp(exponent));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(mean + stdDev, logicalHeight);
      ctx.closePath();
      ctx.fill();
      // Institutional Labels
      ctx.fillStyle = mutedForeground;
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('68% Probability (±1 SD)', mean, logicalHeight - 12);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Observer for theme changes
    const observer = new MutationObserver(drawChart);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [type]);
  return (
    <Card className={cn("p-10 rounded-4xl border-none shadow-soft bg-card/60 flex items-center justify-center overflow-hidden", className)}>
      {type === 'bell-curve' ? (
        <div className="space-y-6 w-full flex flex-col items-center">
          <canvas ref={canvasRef} className="w-full h-auto max-w-lg cursor-crosshair" />
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center opacity-60">
            <span className="flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-brand-teal" /> Market Model</span>
            <span className="flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-brand-teal/20" /> Confidence Interval</span>
          </div>
        </div>
      ) : (
        <div className="p-20 text-center space-y-4">
          <div className="size-16 rounded-3xl bg-secondary mx-auto animate-pulse" />
          <p className="text-xs text-muted-foreground font-bold">Interactive diagram engine loading...</p>
        </div>
      )}
    </Card>
  );
}