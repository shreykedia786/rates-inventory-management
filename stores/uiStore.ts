import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AIRecommendation } from '@/types';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  
  // Modal states
  bulkOperationsOpen: boolean;
  aiModalOpen: boolean;
  activeAIRecommendation: AIRecommendation | null;
  
  // Actions
  toggleSidebar: () => void;
  openBulkOperations: () => void;
  closeBulkOperations: () => void;
  openAIModal: (recommendation: AIRecommendation) => void;
  closeAIModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      bulkOperationsOpen: false,
      aiModalOpen: false,
      activeAIRecommendation: null,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      openBulkOperations: () => set({ bulkOperationsOpen: true }),
      closeBulkOperations: () => set({ bulkOperationsOpen: false }),

      openAIModal: (recommendation) => set({
        aiModalOpen: true,
        activeAIRecommendation: recommendation,
      }),
      closeAIModal: () => set({
        aiModalOpen: false,
        activeAIRecommendation: null,
      }),
    }),
    {
      name: 'ui-store',
    }
  )
); 