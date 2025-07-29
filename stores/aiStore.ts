import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { generateId } from '@/lib/utils';
import type { AIRecommendation } from '@/types';

interface AIState {
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  generateRecommendations: (cellIds: string[]) => Promise<void>;
  acceptRecommendation: (recommendationId: string, value?: number) => void;
  dismissRecommendation: (recommendationId: string, reason: string) => void;
  provideFeedback: (recommendationId: string, feedback: string) => void;
}

export const useAIStore = create<AIState>()(
  devtools(
    (set, get) => ({
      recommendations: [],
      isLoading: false,
      error: null,

      generateRecommendations: async (cellIds) => {
        set({ isLoading: true, error: null });
        try {
          // In a real implementation, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockRecommendations: AIRecommendation[] = cellIds.map(cellId => ({
            id: generateId(),
            cellId,
            suggestedValue: 450,
            confidence: 85,
            factors: [
              { name: 'Market Demand', impact: 0.4 },
              { name: 'Competitor Pricing', impact: 0.3 },
              { name: 'Historical Performance', impact: 0.3 }
            ],
            status: 'pending' as const,
          }));

          set({ recommendations: mockRecommendations, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to generate recommendations', isLoading: false });
        }
      },

      acceptRecommendation: (recommendationId, value) => {
        set((state) => ({
          recommendations: state.recommendations.map(rec =>
            rec.id === recommendationId
              ? {
                  ...rec,
                  status: 'accepted',
                  suggestedValue: value ?? rec.suggestedValue,
                }
              : rec
          ),
        }));
      },

      dismissRecommendation: (recommendationId, reason) => {
        set((state) => ({
          recommendations: state.recommendations.map(rec =>
            rec.id === recommendationId
              ? {
                  ...rec,
                  status: 'dismissed',
                }
              : rec
          ),
        }));
      },

      provideFeedback: (recommendationId, feedback) => {
        // In a real implementation, this would send feedback to the AI system
        console.log(`Feedback for recommendation ${recommendationId}:`, feedback);
      },
    }),
    {
      name: 'ai-store',
    }
  )
); 