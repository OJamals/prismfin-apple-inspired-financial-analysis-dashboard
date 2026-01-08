import React, { useState } from 'react';
import { QuizQuestion } from '@shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
interface AcademyQuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}
export function AcademyQuiz({ questions, onComplete }: AcademyQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const currentQ = questions[currentIdx];
  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
  };
  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setSubmitted(true);
    if (selectedIdx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      toast.success('Correct Analysis');
    } else {
      toast.error('Factor Engine Discrepancy');
    }
  };
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setSubmitted(false);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };
  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="rounded-4xl bg-brand-teal text-white p-12 text-center space-y-8 shadow-premium border-none">
          <Trophy className="size-20 mx-auto opacity-80" />
          <div className="space-y-2">
            <h2 className="text-4xl font-bold font-display tracking-tight">Concept Validated</h2>
            <p className="text-lg opacity-80 font-medium">You scored {score} of {questions.length} on this module.</p>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60">Master Record Updated</p>
        </Card>
      </motion.div>
    );
  }
  return (
    <Card className="rounded-4xl border-none shadow-premium bg-card overflow-hidden">
      <div className="bg-secondary/50 p-6 flex items-center justify-between border-b border-border/5">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <HelpCircle className="size-3.5" /> Concept Check
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Question {currentIdx + 1} of {questions.length}</span>
      </div>
      <CardContent className="p-8 md:p-12 space-y-10">
        <h3 className="text-2xl font-bold font-display text-foreground leading-tight">
          {currentQ.question}
        </h3>
        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === currentQ.correctIndex;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;
            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group",
                  isSelected && !submitted && "border-brand-blue bg-brand-blue/5",
                  showCorrect && "border-gain-500 bg-gain-50 text-gain-700",
                  showWrong && "border-loss-500 bg-loss-50 text-loss-700",
                  !isSelected && !submitted && "border-border/10 hover:border-border/40 hover:bg-secondary/20"
                )}
              >
                <span className="font-bold text-sm">{option}</span>
                {showCorrect && <CheckCircle2 className="size-5" />}
                {showWrong && <XCircle className="size-5" />}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-6 rounded-3xl bg-secondary/30 space-y-3"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deep Insights</p>
              <p className="text-sm font-medium leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-end pt-8">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              className="rounded-2xl h-14 px-12 bg-foreground text-background font-black uppercase tracking-widest text-xs"
            >
              Submit Analysis
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="rounded-2xl h-14 px-12 bg-brand-blue text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-blue/20"
            >
              Next Step <ChevronRight className="size-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}