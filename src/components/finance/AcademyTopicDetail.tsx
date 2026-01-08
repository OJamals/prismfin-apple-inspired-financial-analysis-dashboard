import React, { useState } from 'react';
import { AcademyTopic } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, BookOpen, Clock, PlayCircle, RotateCcw, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
interface AcademyTopicDetailProps {
  topic: AcademyTopic;
}
export function AcademyTopicDetail({ topic }: AcademyTopicDetailProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [sharpeInputs, setSharpeInputs] = useState({ return: 12, riskFree: 3, vol: 15 });
  const calculateSharpe = () => {
    const sharpe = sharpeInputs.vol > 0 ? (sharpeInputs.return - sharpeInputs.riskFree) / sharpeInputs.vol : 0;
    return sharpe.toFixed(2);
  };
  return (
    <div className="p-8 md:p-12 space-y-12 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-muted pb-12">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <BookOpen className="size-6 text-brand-blue" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{topic.category} Curriculum</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">{topic.title}</h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">{topic.description}</p>
        </div>
        <div className="flex items-center gap-8 shrink-0 bg-secondary/30 p-6 rounded-3xl border border-white/40 ring-1 ring-black/5">
          <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Time</p>
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="size-4 text-brand-blue" />
              {topic.readingTimeMin}m
            </div>
          </div>
          <div className="w-px h-8 bg-muted" />
          <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Level</p>
            <p className="font-bold">{topic.difficulty}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold font-display mb-6">Foundational Concepts</h3>
            <p className="text-muted-foreground leading-loose text-lg whitespace-pre-wrap">
              {topic.content}
            </p>
            <p className="text-muted-foreground leading-loose text-lg mt-6">
              In professional finance, mastering this concept allows for superior capital allocation. By isolating risk components, one can construct portfolios that satisfy specific risk mandates while maximizing capture of market premiums.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-8 space-y-8">
            {topic.interactiveType === 'sharpe-calc' && (
              <Card className="rounded-4xl border-none shadow-premium bg-brand-blue text-white overflow-hidden p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <PlayCircle className="size-6" />
                    <h4 className="text-xl font-bold font-display">Interactive Simulator</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-80">Annual Return (%)</Label>
                      <Input 
                        type="number" 
                        value={sharpeInputs.return} 
                        onChange={e => setSharpeInputs({...sharpeInputs, return: +e.target.value})}
                        className="bg-white/10 border-white/20 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-80">Risk Free Rate (%)</Label>
                      <Input 
                        type="number" 
                        value={sharpeInputs.riskFree} 
                        onChange={e => setSharpeInputs({...sharpeInputs, riskFree: +e.target.value})}
                        className="bg-white/10 border-white/20 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-80">Volatility σ (%)</Label>
                      <Input 
                        type="number" 
                        value={sharpeInputs.vol} 
                        onChange={e => setSharpeInputs({...sharpeInputs, vol: +e.target.value})}
                        className="bg-white/10 border-white/20 text-white rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Calculated Sharpe</p>
                      <p className="text-5xl font-bold font-display tracking-tighter tabular-nums mt-1">{calculateSharpe()}</p>
                    </div>
                    <Button variant="ghost" className="rounded-xl hover:bg-white/10" onClick={() => setSharpeInputs({return:12, riskFree:3, vol:15})}>
                      <RotateCcw className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            {!topic.interactiveType && (
              <Card className="rounded-4xl border border-muted bg-muted/20 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="size-16 rounded-3xl bg-white flex items-center justify-center shadow-soft">
                  <BarChart className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">Interactive simulation for this topic is currently in quantitative audit.</p>
              </Card>
            )}
            <div className="p-8 rounded-4xl border border-muted bg-card shadow-soft space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold font-display">Module Progress</h4>
                <span className="text-xs font-bold text-brand-blue">{isCompleted ? '100%' : '65%'}</span>
              </div>
              <Progress value={isCompleted ? 100 : 65} className="h-2 rounded-full" />
              <Button 
                onClick={() => setIsCompleted(!isCompleted)}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold transition-all gap-2",
                  isCompleted ? "bg-gain-500 hover:bg-gain-600 text-white" : "bg-foreground hover:bg-foreground/90 text-background"
                )}
              >
                {isCompleted ? <CheckCircle2 className="size-5" /> : null}
                {isCompleted ? 'Completed' : 'Mark as Finished'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}