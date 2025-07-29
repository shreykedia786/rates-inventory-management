/**
 * Enhanced Apply Handler for AI Recommendations
 * Implements comprehensive apply button flow with feedback, tracking, and error handling
 */
'use client';

import { format } from 'date-fns';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'education' | 'opportunity' | 'automation' | 'prediction';
  title: string;
  message: string;
  reasoning: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  eventBased?: boolean;
  competitorBased?: boolean;
  potentialRevenue?: number;
  agentCapabilities?: {
    canAutoExecute: boolean;
    requiresApproval: boolean;
    executionDelay?: number;
    learningPattern?: string;
    adaptiveConfidence?: number;
    riskAssessment?: 'low' | 'medium' | 'high';
  };
}

interface Change {
  id: string;
  type: 'price' | 'inventory';
  room: string;
  product?: string;
  date: string;
  oldValue: number;
  newValue: number;
  timestamp: Date;
  source?: string;
  insightId?: string;
  confidence?: number;
  reasoning?: string;
}

interface EventLog {
  id: string;
  timestamp: Date;
  eventType: string;
  category: 'pricing' | 'inventory' | 'restrictions' | 'ai' | 'system' | 'user';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: 'user' | 'ai_agent' | 'system' | 'api' | 'integration';
  description: string;
  roomType?: string;
  dateAffected?: string;
  oldValue?: number;
  newValue?: number;
  changeAmount?: number;
  changePercentage?: number;
  aiConfidence?: number;
  aiReasoning?: string;
  potentialRevenue?: number;
  errorDetails?: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
}

interface EnhancedApplyHandlerProps {
  setChanges: React.Dispatch<React.SetStateAction<Change[]>>;
  logEvent: (eventData: Omit<EventLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'ipAddress'>) => void;
  dates: Array<{ dateStr: string }>;
  setRichTooltip: React.Dispatch<React.SetStateAction<any>>;
}

export function createEnhancedApplyHandler({
  setChanges,
  logEvent,
  dates,
  setRichTooltip
}: EnhancedApplyHandlerProps) {
  
  const handleApplyInsight = async (insight: AIInsight, recommendedRate?: number): Promise<void> => {
    try {
      console.log('🚀 Applying AI Insight:', {
        id: insight.id,
        title: insight.title,
        type: insight.type,
        confidence: insight.confidence,
        recommendedRate
      });

      // Simulate realistic API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a change record for tracking
      if (recommendedRate) {
        const change: Change = {
          id: Date.now().toString(),
          type: 'price',
          room: 'Deluxe King Room', // In real app, get from context
          product: 'BAR', // In real app, get from context  
          date: dates[0]?.dateStr || format(new Date(), 'yyyy-MM-dd'),
          oldValue: 7800, // In real app, get current rate
          newValue: recommendedRate,
          timestamp: new Date(),
          source: 'ai_recommendation',
          insightId: insight.id,
          confidence: insight.confidence,
          reasoning: insight.reasoning
        };
        
        setChanges(prev => [...prev, change]);
      }

      // Log the successful application
      logEvent({
        eventType: 'ai_recommendation_applied',
        category: 'pricing',
        severity: 'medium',
        source: 'ai_agent',
        description: `Applied AI recommendation: ${insight.title}`,
        roomType: 'Deluxe King Room',
        dateAffected: dates[0]?.dateStr || format(new Date(), 'yyyy-MM-dd'),
        oldValue: 7800,
        newValue: recommendedRate || 0,
        changeAmount: (recommendedRate || 0) - 7800,
        changePercentage: recommendedRate ? ((recommendedRate - 7800) / 7800) * 100 : 0,
        aiConfidence: insight.confidence,
        aiReasoning: insight.reasoning,
        potentialRevenue: insight.potentialRevenue
      });

      // Show success notification
      alert(`✅ AI Recommendation Applied Successfully!

📊 Rate Update:
• Previous Rate: ₹7,800
• New Rate: ₹${recommendedRate?.toLocaleString() || 'N/A'}
• Confidence: ${insight.confidence}%

💰 Expected Impact:
• Revenue Potential: +₹${insight.potentialRevenue?.toLocaleString() || 'N/A'}

⏰ Undo Available: 30 minutes
📈 Changes will be published with your next publish action.`);

    } catch (error) {
      console.error('❌ Failed to apply AI insight:', error);
      
      // Log the error
      logEvent({
        eventType: 'ai_recommendation_failed',
        category: 'pricing',
        severity: 'high',
        source: 'ai_agent',
        description: `Failed to apply AI recommendation: ${insight.title} - ${error instanceof Error ? error.message : 'Unknown error'}`,
        roomType: 'Deluxe King Room',
        dateAffected: dates[0]?.dateStr || format(new Date(), 'yyyy-MM-dd'),
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      });

      // Re-throw error for component to handle
      throw error;
    }
  };

  const handleDetailsInsight = (insight: AIInsight): void => {
    const details = `🤖 AI Recommendation Details

${insight.title}

WHY THIS CHANGE?
${insight.reasoning}

📊 INSIGHT ANALYSIS:
• Type: ${insight.type.toUpperCase()}
• Confidence: ${insight.confidence}%
• Impact Level: ${insight.impact.toUpperCase()}
${insight.eventBased ? '• Event-Based: Yes' : ''}
${insight.competitorBased ? '• Competitor-Based: Yes' : ''}

🎯 SUGGESTED ACTION:
${insight.suggestedAction || insight.message}

💰 REVENUE POTENTIAL:
${insight.potentialRevenue ? `+₹${insight.potentialRevenue.toLocaleString()}` : 'Not specified'}

${insight.agentCapabilities?.canAutoExecute ? `
🤖 AUTO-AGENT CAPABILITIES:
• Can Auto-Execute: Yes
• Requires Approval: ${insight.agentCapabilities.requiresApproval ? 'Yes' : 'No'}
• Execution Delay: ${insight.agentCapabilities.executionDelay || 0} minutes
• Risk Assessment: ${insight.agentCapabilities.riskAssessment?.toUpperCase() || 'UNKNOWN'}
` : ''}

---
💡 TIP: This recommendation is based on real-time market analysis and historical performance data.`;

    alert(details);
  };

  const handleDismissInsight = (insight: AIInsight): void => {
    console.log('🚫 Dismissing AI Insight:', insight.id);
    
    // Log the dismissal
    logEvent({
      eventType: 'ai_recommendation_dismissed',
      category: 'ai',
      severity: 'low',
      source: 'user',
      description: `Dismissed AI recommendation: ${insight.title}`,
      aiConfidence: insight.confidence,
      aiReasoning: insight.reasoning
    });

    alert(`🚫 AI Recommendation Dismissed

"${insight.title}" has been dismissed.

You can always access AI recommendations again from the AI Insights panel.`);
  };

  return {
    handleApplyInsight,
    handleDetailsInsight,
    handleDismissInsight
  };
} 