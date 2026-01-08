import React from 'react';
import { cn } from '@/lib/utils';
interface SkeletonProps {
  className?: string;
}
export function KpiSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("h-32 rounded-4xl bg-card shadow-soft p-6 flex flex-col justify-between shimmer-fast border border-card/60", className)}>
      <div className="flex justify-between items-start">
        <div className="h-4 w-24 bg-muted/60 rounded-full" />
        <div className="h-6 w-16 bg-muted/40 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted/60 rounded-lg" />
        <div className="h-3 w-20 bg-muted/30 rounded-full" />
      </div>
    </div>
  );
}
export function HoldingsMetricsSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-48 rounded-4xl bg-card shadow-soft p-8 shimmer-fast border border-card/60 flex flex-col gap-4">
          <div className="h-10 w-10 bg-muted/40 rounded-2xl" />
          <div className="space-y-2 mt-2">
            <div className="h-4 w-24 bg-muted/50 rounded-md" />
            <div className="h-8 w-20 bg-muted/70 rounded-lg" />
            <div className="h-3 w-32 bg-muted/30 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("h-[400px] rounded-4xl bg-card shadow-soft p-8 shimmer-fast border border-card/60", className)}>
      <div className="space-y-2 mb-8">
        <div className="h-6 w-48 bg-muted/60 rounded-lg" />
        <div className="h-4 w-64 bg-muted/40 rounded-md" />
      </div>
      <div className="h-64 w-full flex items-end gap-2 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-muted/20 rounded-t-xl"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
export function TableSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-4xl bg-card shadow-soft overflow-hidden border border-card/60", className)}>
      <div className="p-8 pb-4">
        <div className="h-7 w-32 bg-muted/60 rounded-lg" />
      </div>
      <div className="px-8 pb-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-muted/20 shimmer-fast">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-muted/50 rounded-md" />
              <div className="h-3 w-16 bg-muted/30 rounded-md" />
            </div>
            <div className="flex gap-12">
              <div className="h-4 w-20 bg-muted/50 rounded-md" />
              <div className="h-6 w-16 bg-muted/30 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}