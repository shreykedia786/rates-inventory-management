/**
 * Tutorial Management Hook
 * Handles tutorial state and auto-show logic for first-time users
 */
import { useState, useEffect } from 'react';

export function useTutorial() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Auto-show tutorial for first-time users
  useEffect(() => {
    const hasSeenTutorialBefore = localStorage.getItem('rates-tutorial-seen');
    if (!hasSeenTutorialBefore && !hasSeenTutorial) {
      // Show tutorial after a short delay for better UX
      const timer = setTimeout(() => {
        setIsTutorialOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const handleTutorialComplete = () => {
    setHasSeenTutorial(true);
    localStorage.setItem('rates-tutorial-seen', 'true');
    setIsTutorialOpen(false);
  };

  const showTutorial = () => {
    setIsTutorialOpen(true);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
  };

  return {
    isTutorialOpen,
    showTutorial,
    closeTutorial,
    handleTutorialComplete,
    hasSeenTutorial
  };
} 