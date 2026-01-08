import { useState, useEffect, useCallback } from 'react';
const PROGRESS_KEY = 'prismfin_academy_progress';
interface AcademyProgressData {
  completedSteps: Record<string, string[]>; // topicId -> array of stepIds
}
export function useAcademyProgress() {
  const [progress, setProgress] = useState<AcademyProgressData>(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : { completedSteps: {} };
  });
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);
  const isStepCompleted = useCallback((topicId: string, stepId: string) => {
    return progress.completedSteps[topicId]?.includes(stepId) ?? false;
  }, [progress]);
  const completeStep = useCallback((topicId: string, stepId: string) => {
    setProgress((prev) => {
      const currentSteps = prev.completedSteps[topicId] ?? [];
      if (currentSteps.includes(stepId)) return prev;
      return {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [topicId]: [...currentSteps, stepId],
        },
      };
    });
  }, []);
  const getTopicProgress = useCallback((topicId: string, totalSteps: number) => {
    const completed = progress.completedSteps[topicId]?.length ?? 0;
    return totalSteps > 0 ? (completed / totalSteps) * 100 : 0;
  }, [progress]);
  const resetProgress = useCallback(() => {
    const fresh = { completedSteps: {} };
    setProgress(fresh);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(fresh));
  }, []);
  return {
    progress,
    isStepCompleted,
    completeStep,
    getTopicProgress,
    resetProgress,
  };
}