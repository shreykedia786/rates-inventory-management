/**
 * Tutorial Button Component
 * Floating button to trigger the AI pricing tutorial
 */
'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';
import { useTutorial } from '../hooks/useTutorial';

export default function TutorialButton() {
  const { isTutorialOpen, showTutorial, closeTutorial, handleTutorialComplete } = useTutorial();

  return (
    <>
      {/* Tutorial Button */}
      <div className="fixed bottom-6 right-24 z-50">
        <button 
          onClick={showTutorial}
          className="group relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          title="Show AI Pricing Tutorial"
        >
          <BookOpen className="w-5 h-5" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            AI Pricing Tutorial
          </div>
        </button>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay 
        isOpen={isTutorialOpen}
        onClose={closeTutorial}
        onComplete={handleTutorialComplete}
      />
    </>
  );
} 