/**
 * Custom hook for managing global news insights
 * Integrates with the existing revenue management system
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import newsIntegrationService, { GlobalNewsInsight } from '../services/news-integration';

interface UseGlobalNewsInsightsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  minImpactLevel?: 'low' | 'medium' | 'high' | 'critical';
  enableNotifications?: boolean;
}

interface UseGlobalNewsInsightsReturn {
  insights: GlobalNewsInsight[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    critical: number;
    actionable: number;
    autoApply: number;
  };
  refreshInsights: () => Promise<void>;
  applyInsight: (insight: GlobalNewsInsight) => Promise<void>;
  dismissInsight: (insight: GlobalNewsInsight) => Promise<void>;
  toggleAutoRefresh: () => void;
  isAutoRefreshEnabled: boolean;
}

/**
 * Hook for managing global news insights in the revenue management system
 * 
 * Features:
 * - Real-time news data fetching and analysis
 * - Auto-refresh capability with configurable intervals
 * - Integration with existing AI insights system
 * - Notification system for critical insights
 * - Performance metrics and statistics
 * 
 * @param options - Configuration options for the hook
 */
export function useGlobalNewsInsights(options: UseGlobalNewsInsightsOptions = {}): UseGlobalNewsInsightsReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
    minImpactLevel = 'medium',
    enableNotifications = true
  } = options;

  // State management
  const [insights, setInsights] = useState<GlobalNewsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(autoRefresh);
  
  // Refs for cleanup
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationPermissionRef = useRef<NotificationPermission>('default');

  // Initialize notification permissions
  useEffect(() => {
    if (enableNotifications && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission;
      });
    }
  }, [enableNotifications]);

  /**
   * Show browser notification for critical insights
   */
  const showNotification = useCallback((insight: GlobalNewsInsight) => {
    if (
      enableNotifications &&
      notificationPermissionRef.current === 'granted' &&
      insight.urgency === 'critical'
    ) {
      new Notification('Critical Market Insight', {
        body: insight.summary,
        icon: '/icons/news-alert.png',
        tag: `insight-${insight.id}`,
        requireInteraction: true
      });
    }
  }, [enableNotifications]);

  /**
   * Fetch and analyze global news insights
   */
  const fetchInsights = useCallback(async (): Promise<void> => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching global news insights...');
      
      // Use the singleton instance
      const newInsights = await newsIntegrationService.fetchGlobalNews();
      
      console.log(`✅ Fetched ${newInsights.length} insights from global news`);
      
      setInsights(newInsights);
      
      // Check for critical insights and show notifications
      const criticalInsights = newInsights.filter(
        insight => insight.impactAnalysis.impactLevel === 'critical'
      );
      
      if (criticalInsights.length > 0 && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Critical Market Alert', {
            body: `${criticalInsights.length} critical insights require immediate attention`,
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Critical Market Alert', {
                body: `${criticalInsights.length} critical insights require immediate attention`,
                icon: '/favicon.ico'
              });
            }
          });
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news insights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Apply an insight's recommendations to the revenue management system
   */
  const applyInsight = useCallback(async (insight: GlobalNewsInsight) => {
    try {
      setIsLoading(true);
      
      // Log the application attempt
      console.log(`🔄 Applying insight: ${insight.title}`);
      
      // Here you would integrate with your existing pricing/inventory system
      // Example integration points:
      
      // 1. Apply pricing changes
      const pricingChanges = {
        action: insight.impactAnalysis.pricingRecommendations.immediateAction,
        percentage: insight.impactAnalysis.pricingRecommendations.percentageChange,
        confidence: insight.confidence,
        source: 'global_news_ai',
        metadata: {
          newsArticles: insight.triggerEvents.map(event => ({
            title: event.title,
            source: event.source.name,
            url: event.url
          })),
          impactLevel: insight.impactAnalysis.impactLevel,
          affectedMarkets: insight.impactAnalysis.affectedMarkets
        }
      };
      
      // 2. Apply inventory restrictions
      const inventoryChanges = {
        action: insight.impactAnalysis.inventoryRecommendations.action,
        reasoning: insight.impactAnalysis.inventoryRecommendations.reasoning,
        channelStrategy: insight.impactAnalysis.inventoryRecommendations.channelSpecific,
        riskLevel: insight.impactAnalysis.impactLevel
      };

      // 3. Update insight status
      const updatedInsight = {
        ...insight,
        status: 'applied' as const,
        appliedAt: new Date(),
        appliedBy: 'current_user' // Replace with actual user context
      };

      // Update local state
      setInsights(prev => prev.map(i => 
        i.id === insight.id ? updatedInsight : i
      ));

      // Log successful application
      console.log(`✅ Applied insight successfully:`, {
        id: insight.id,
        title: insight.title,
        pricingAction: pricingChanges.action,
        inventoryAction: inventoryChanges.action,
        confidence: insight.confidence
      });

      // Show success notification
      if (enableNotifications && notificationPermissionRef.current === 'granted') {
        new Notification('Insight Applied Successfully', {
          body: `Applied ${insight.impactAnalysis.pricingRecommendations.immediateAction} pricing strategy`,
          icon: '/icons/success.png',
          tag: `applied-${insight.id}`
        });
      }

      // Here you would make actual API calls to your revenue management system
      // Examples:
      // await updatePricing(pricingChanges);
      // await updateInventoryRestrictions(inventoryChanges);
      // await logRevenueAction(updatedInsight);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply insight';
      setError(errorMessage);
      console.error('❌ Failed to apply insight:', err);
      
      // Show error notification
      if (enableNotifications && notificationPermissionRef.current === 'granted') {
        new Notification('Failed to Apply Insight', {
          body: errorMessage,
          icon: '/icons/error.png',
          tag: `error-${insight.id}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [enableNotifications]);

  /**
   * Dismiss an insight (mark as not relevant)
   */
  const dismissInsight = useCallback(async (insight: GlobalNewsInsight) => {
    try {
      const updatedInsight = {
        ...insight,
        status: 'dismissed' as const,
        appliedAt: new Date(),
        appliedBy: 'current_user'
      };

      setInsights(prev => prev.map(i => 
        i.id === insight.id ? updatedInsight : i
      ));

      console.log(`ℹ️ Dismissed insight: ${insight.title}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to dismiss insight';
      setError(errorMessage);
      console.error('❌ Failed to dismiss insight:', err);
    }
  }, []);

  /**
   * Toggle auto-refresh functionality
   */
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);

  // Initialize and start fetching on mount
  useEffect(() => {
    console.log('🚀 useGlobalNewsInsights hook initialized');
    fetchInsights();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefreshEnabled && refreshInterval > 0) {
      console.log(`⏰ Setting up auto-refresh every ${refreshInterval / 1000} seconds`);
      
      refreshIntervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refresh triggered');
        fetchInsights();
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }
  }, [isAutoRefreshEnabled, refreshInterval]);

  /**
   * Manual refresh function
   */
  const refreshInsights = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchInsights();
  }, []);

  // Calculate statistics
  const stats = {
    total: insights.length,
    critical: insights.filter(i => i.urgency === 'critical').length,
    actionable: insights.filter(i => i.actionRequired && i.status === 'active').length,
    autoApply: insights.filter(i => i.autoApplyEnabled && i.status === 'active').length
  };

  // Auto-apply high-confidence critical insights
  useEffect(() => {
    const autoApplyInsights = insights.filter(insight => 
      insight.autoApplyEnabled && 
      insight.status === 'active' &&
      insight.urgency === 'critical' &&
      insight.confidence > 0.9
    );

    autoApplyInsights.forEach(insight => {
      console.log(`🤖 Auto-applying critical insight: ${insight.title}`);
      applyInsight(insight);
    });
  }, [insights, applyInsight]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    insights,
    isLoading,
    error,
    stats,
    refreshInsights,
    applyInsight,
    dismissInsight,
    toggleAutoRefresh,
    isAutoRefreshEnabled
  };
}

// Utility hook for filtering insights
export function useFilteredInsights(
  insights: GlobalNewsInsight[],
  filters: {
    urgency?: GlobalNewsInsight['urgency'][];
    impactLevel?: ('low' | 'medium' | 'high' | 'critical')[];
    status?: GlobalNewsInsight['status'][];
    actionRequired?: boolean;
    autoApplyEnabled?: boolean;
  }
) {
  return insights.filter(insight => {
    if (filters.urgency?.length && !filters.urgency.includes(insight.urgency)) {
      return false;
    }
    
    if (filters.impactLevel?.length && !filters.impactLevel.includes(insight.impactAnalysis.impactLevel)) {
      return false;
    }
    
    if (filters.status?.length && !filters.status.includes(insight.status)) {
      return false;
    }
    
    if (filters.actionRequired !== undefined && insight.actionRequired !== filters.actionRequired) {
      return false;
    }
    
    if (filters.autoApplyEnabled !== undefined && insight.autoApplyEnabled !== filters.autoApplyEnabled) {
      return false;
    }
    
    return true;
  });
}

// Export hook for external usage
export default useGlobalNewsInsights; 