import { useState, useCallback } from 'react';
export function useTourState(tourId: string) {
  const [isOpen, setIsOpen] = useState(() => {
    const completed = localStorage.getItem(`prismfin-tour-${tourId}`);
    return !completed;
  });
  const startTour = useCallback(() => {
    setIsOpen(true);
  }, []);
  const completeTour = useCallback(() => {
    localStorage.setItem(`prismfin-tour-${tourId}`, 'true');
    setIsOpen(false);
  }, [tourId]);
  const resetTour = useCallback(() => {
    localStorage.removeItem(`prismfin-tour-${tourId}`);
    setIsOpen(true);
  }, [tourId]);
  return {
    isTourOpen: isOpen,
    startTour,
    completeTour,
    resetTour
  };
}