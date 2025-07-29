/**
 * Hook for managing consistent rate data across all components
 * Ensures tooltips, modals, and grid show identical information
 */
import { useMemo, useCallback } from 'react';
import { 
  StandardizedRateData, 
  AIRateRecommendation 
} from '../types/rate-consistency';

// Legacy ProductData interface for compatibility
interface LegacyProductData {
  rate: number;
  originalRate?: number;
  isChanged?: boolean;
  lastModified?: Date;
  aiInsights: any[];
  confidenceScore: number;
  aiApplied?: boolean;
  autoApplied?: boolean;
  aiSuggested?: boolean;
  undoAvailable?: boolean;
  undoExpiresAt?: Date;
  isActive: boolean;
  competitorData?: any;
}

/**
 * Convert legacy ProductData to standardized format
 */
function toStandardizedRateData(legacyData: LegacyProductData): {
  rateData: StandardizedRateData;
  aiRecommendation?: AIRateRecommendation;
} {
  const rateData: StandardizedRateData = {
    baseRate: legacyData.originalRate || legacyData.rate,
    currentRate: legacyData.rate,
    finalRate: legacyData.rate,
    rateSource: legacyData.aiApplied ? 'ai_recommendation' : 
                legacyData.autoApplied ? 'ai_auto_applied' : 'base_rate',
    lastModified: legacyData.lastModified || new Date(),
    modifiedBy: legacyData.aiApplied ? 'ai_system' : 'user',
    isActive: legacyData.isActive,
    hasUnsavedChanges: legacyData.isChanged || false,
    rateHistory: []
  };

  const aiRecommendation: AIRateRecommendation | undefined = legacyData.aiSuggested ? {
    id: `recommendation_${Date.now()}`,
    cellId: `cell_${Math.random().toString(36).substr(2, 9)}`,
    currentRate: legacyData.rate,
    baseRate: legacyData.originalRate || legacyData.rate,
    aiRecommendedRate: legacyData.rate,
    confidence: legacyData.confidenceScore,
    reasoning: legacyData.aiInsights[0]?.message || 'AI-powered rate optimization',
    marketFactors: {
      competitorAverage: legacyData.competitorData?.averageRate || legacyData.rate,
      marketTrend: 'stable' as const,
      demandLevel: 'medium' as const,
      positionVsCompetitors: 50
    },
    status: legacyData.aiApplied ? 'accepted' : 'pending',
    createdAt: new Date(),
    projectedImpact: {
      dailyRevenue: 0,
      monthlyRevenue: 0,
      occupancyChange: 0,
      revenueChange: 0
    },
    undoAvailable: legacyData.undoAvailable || false,
    undoExpiresAt: legacyData.undoExpiresAt
  } : undefined;

  return { rateData, aiRecommendation };
}

export function useConsistentRateData(productData: LegacyProductData) {
  const { rateData, aiRecommendation } = useMemo(() => {
    return toStandardizedRateData(productData);
  }, [productData]);

  const getDisplayValues = useCallback(() => {
    return {
      // For Grid Cell Display
      displayRate: rateData.finalRate,
      hasAIRecommendation: !!aiRecommendation && aiRecommendation.status === 'pending',
      hasUnsavedChanges: rateData.hasUnsavedChanges,
      rateSource: rateData.rateSource,
      
      // For Tooltips (CONSISTENT DATA - SINGLE SOURCE OF TRUTH)
      tooltipData: {
        currentRate: rateData.currentRate,
        aiRecommendedRate: aiRecommendation?.aiRecommendedRate,
        aiConfidence: aiRecommendation?.confidence, // ← KEY: Same everywhere
        lastModified: rateData.lastModified,
        modifiedBy: rateData.modifiedBy,
        canUndo: aiRecommendation?.undoAvailable || false,
        rateSource: rateData.rateSource,
        appliedAt: aiRecommendation?.appliedAt,
        appliedBy: aiRecommendation?.appliedBy
      },
      
      // For Modals (CONSISTENT DATA - SINGLE SOURCE OF TRUTH)  
      modalData: {
        baseRate: rateData.baseRate,
        currentRate: rateData.currentRate,
        finalRate: rateData.finalRate,
        hasOverride: !!rateData.manualOverrideRate,
        overrideReason: rateData.overrideReason,
        aiRecommendation: aiRecommendation
      },
      
      // For Badges (CONSISTENT DATA - SINGLE SOURCE OF TRUTH)
      badgeConfig: {
        showAIBadge: !!aiRecommendation && aiRecommendation.status === 'pending',
        showAppliedBadge: aiRecommendation?.status === 'accepted',
        showChangeBadge: rateData.hasUnsavedChanges,
        showUndoBadge: aiRecommendation?.undoAvailable || false,
        confidence: aiRecommendation?.confidence, // ← KEY: Same as tooltip
        status: aiRecommendation?.status
      }
    };
  }, [rateData, aiRecommendation]);

  return {
    rateData,
    aiRecommendation,
    getDisplayValues
  };
} 