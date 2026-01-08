import React, { useState, useMemo } from 'react';
import { AcademyTopic, AcademyStep } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useAcademyProgress } from '@/hooks/use-academy-progress';
import { AcademyQuiz } from './AcademyQuiz';
import { AcademyDiagrams } from './AcademyDiagrams';
import { 
  CheckCircle2, BookOpen, Clock, ChevronRight, ChevronLeft, 
  BarChart, PlayCircle, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
interface AcademyTopicDetailProps {
  topic: AcademyTopic;
}
export function AcademyTopicDetail({ topic }: AcademyTopicDetailProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const { isStepCompleted, completeStep } = useAcademyProgress();
  const currentStep = topic.steps[currentStepIdx];
  const progressPercent = ((currentStepIdx + 1) / topic.steps.length) * 100;
  const handleNext = () => {
    completeStep(topic.id, currentStep.id);
    if (currentStepIdx < topic.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-border/10 p-8 hidden lg:flex flex-col bg-card/40 backdrop-blur-md">
        <div className="space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-1 mb-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Curriculum</p>
            <h2 className="text-xl font-bold font-display leading-tight">{topic.title}</h2>
          </div>
          <div className="space-y-2">
            {topic.steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIdx(idx)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group",
                  currentStepIdx === idx 
                    ? "bg-foreground text-background shadow-lg" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] opacity-40">{idx + 1}</span>
                  <span className="truncate max-w-[140px]">{step.title}</span>
                </div>
                {isStepCompleted(topic.id, step.id) && (
                  <CheckCircle2 className={cn("size-4", currentStepIdx === idx ? "text-brand-teal" : "text-brand-teal")} />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-border/10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 rounded-full" />
        </div>
      </aside>
      {/* Main Lesson Content */}
      <main className="flex-1 overflow-y-auto bg-canvas p-8 md:p-12 lg:p-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto space-y-12"
          >
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-brand-blue/10 text-brand-blue border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase">
                  {currentStep.type}
                </Badge>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Step {currentStepIdx + 1} of {topic.steps.length}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground leading-tight">
                {currentStep.title}
              </h1>
            </header>
            <div className="prose prose-slate max-w-none prose-lg text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{currentStep.content}</p>
            </div>
            {currentStep.formula && (
              <Card className="bg-slate-900 text-slate-100 p-10 rounded-4xl border-none shadow-premium flex items-center justify-center font-mono text-2xl md:text-3xl italic tracking-wider">
                <div className="relative">
                  <span className="text-brand-teal mr-4">f(x) = </span>
                  {currentStep.formula}
                  <div className="absolute -top-6 -right-6">
                    <Info className="size-5 text-slate-700 hover:text-brand-teal cursor-help transition-colors" />
                  </div>
                </div>
              </Card>
            )}
            {currentStep.type === 'diagram' && currentStep.interactiveType && (
              <AcademyDiagrams type={currentStep.interactiveType} />
            )}
            {currentStep.type === 'quiz' && topic.quiz && (
              <AcademyQuiz questions={topic.quiz.questions} onComplete={() => completeStep(topic.id, currentStep.id)} />
            )}
            <footer className="pt-12 border-t border-border/10 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="rounded-xl h-12 px-6 font-bold gap-2 text-muted-foreground"
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-2xl h-14 px-10 bg-brand-blue text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20 gap-2"
              >
                {currentStepIdx === topic.steps.length - 1 ? 'Finish Lesson' : 'Continue'} <ChevronRight className="size-4" />
              </Button>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}