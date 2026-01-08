import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}
interface GuidedTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
}
export function GuidedTour({ steps, onComplete, isOpen }: GuidedTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  useEffect(() => {
    if (!isOpen) return;
    const updateCoords = () => {
      const step = steps[currentStepIdx];
      if (!step) return;
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn(`GuidedTour: Element with id "${step.targetId}" not found.`);
      }
    };
    updateCoords();
    const timeoutId = setTimeout(updateCoords, 100);
    window.addEventListener('resize', updateCoords);
    return () => {
      window.removeEventListener('resize', updateCoords);
      clearTimeout(timeoutId);
    };
  }, [currentStepIdx, isOpen, steps]);
  if (!isOpen) return null;
  const step = steps[currentStepIdx];
  if (!step) return null;
  const getPopoverStyles = () => {
    const gap = 20;
    switch (step.position) {
      case 'bottom':
        return { top: coords.top + coords.height + gap, left: coords.left + coords.width / 2 };
      case 'top':
        return { top: coords.top - gap, left: coords.left + coords.width / 2, transform: 'translate(-50%, -100%)' };
      case 'left':
        return { top: coords.top + coords.height / 2, left: coords.left - gap, transform: 'translate(-100%, -50%)' };
      case 'right':
        return { top: coords.top + coords.height / 2, left: coords.left + coords.width + gap, transform: 'translate(0, -50%)' };
      default:
        return { top: coords.top, left: coords.left };
    }
  };
  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{
        clipPath: (coords.width > 0 && coords.height > 0) ? `polygon(0% 0%, 0% 100%, ${coords.left}px 100%, ${coords.left}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top}px, ${coords.left + coords.width}px ${coords.top + coords.height}px, ${coords.left}px ${coords.top + coords.height}px, ${coords.left}px 100%, 100% 100%, 100% 0%)` : 'none'
      }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIdx}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute pointer-events-auto"
          style={getPopoverStyles() as any}
        >
          <Card className="w-[320px] rounded-3xl border-none shadow-premium bg-card/90 backdrop-blur-xl p-6 ring-1 ring-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Step {currentStepIdx + 1} of {steps.length}
                </span>
              </div>
              <button onClick={onComplete} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <h4 className="text-lg font-bold font-display tracking-tight mb-2">{step.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {step.content}
            </p>
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                disabled={currentStepIdx === 0}
                className="rounded-xl text-xs font-bold"
              >
                <ChevronLeft className="size-4 mr-1" /> Prev
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
                className="rounded-xl bg-brand-blue text-white text-xs font-bold px-4"
              >
                {currentStepIdx === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}