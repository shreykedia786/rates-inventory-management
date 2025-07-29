/**
 * Enhanced Auto-Pricing Agent Tooltip with Sticky Hover and Working Apply Flow
 * Fixes: Tooltip disappearing on hover, implements proper apply button functionality
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Info, Zap, Target, Calendar, Users, Clock, DollarSign, Brain } from 'lucide-react';

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

interface EnhancedAutoAgentTooltipProps {
  insights: AIInsight[];
  currentRate: number;
  onApply: (insight: AIInsight, recommendedRate: number) => Promise<void>;
  onDetails: (insight: AIInsight) => void;
  onDismiss: (insight: AIInsight) => void;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function EnhancedAutoAgentTooltip({ 
  insights, 
  currentRate, 
  onApply, 
  onDetails, 
  onDismiss,
  position,
  onClose
}: EnhancedAutoAgentTooltipProps) {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedInsights, setAppliedInsights] = useState<Set<string>>(new Set());
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!insights || insights.length === 0) {
    return null;
  }

  // Use the first insight as primary (most relevant)
  const insight = insights[0];
  
  // Check if this is an auto-pricing agent tooltip
  const isAutoAgent = insight.agentCapabilities?.canAutoExecute;
  
  // Calculate realistic recommended rate based on insight type
  const calculateRecommendedRate = () => {
    if (insight.type === 'automation' && insight.eventBased) {
      // Event-based: 15-20% increase (realistic for events)
      const increasePercent = insight.confidence > 80 ? 0.20 : 0.15;
      return Math.round(currentRate * (1 + increasePercent));
    } else if (insight.competitorBased) {
      // Competitor-based: 12% increase (market-driven)
      return Math.round(currentRate * 1.12);
    } else {
      // General optimization: 8% increase (conservative)
      return Math.round(currentRate * 1.08);
    }
  };

  const recommendedRate = calculateRecommendedRate();
  const rateChange = recommendedRate - currentRate;
  const changePercent = Math.round((rateChange / currentRate) * 100);

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'critical':
        return { 
          color: 'from-red-500 to-red-600', 
          icon: AlertTriangle,
          text: 'CRITICAL IMPACT',
          description: 'Immediate action required'
        };
      case 'high':
        return { 
          color: 'from-orange-500 to-red-500', 
          icon: TrendingUp,
          text: 'HIGH IMPACT',
          description: 'Significant revenue opportunity'
        };
      case 'medium':
        return { 
          color: 'from-yellow-400 to-orange-500', 
          icon: Target,
          text: 'MEDIUM IMPACT',
          description: 'Moderate optimization potential'
        };
      default:
        return { 
          color: 'from-blue-500 to-indigo-600', 
          icon: Info,
          text: 'LOW IMPACT',
          description: 'Minor adjustment suggested'
        };
    }
  };

  const impactStyle = getImpactStyle(insight.impact);
  const ImpactIcon = impactStyle.icon;

  const handleApply = async () => {
    if (!onApply || isApplying || appliedInsights.has(insight.id)) return;
    
    try {
      setIsApplying(true);
      setActionFeedback('⏳ Applying recommendation...');
      
      await onApply(insight, recommendedRate);
      
      setAppliedInsights(prev => new Set(Array.from(prev).concat(insight.id)));
      setActionFeedback('✅ Rate updated successfully!');
      
      // Show success for 3 seconds then close tooltip
      setTimeout(() => {
        setActionFeedback(null);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to apply insight:', error);
      setActionFeedback('❌ Failed to apply recommendation');
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDetails = () => {
    if (onDetails) {
      onDetails(insight);
    }
  };

  // Calculate optimal positioning to prevent tooltip from going off-screen
  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 400; // tooltip width
    const tooltipHeight = 350; // estimated height
    const spacing = 8;
    
    let x = position.x;
    let y = position.y;
    
    // Adjust horizontal position
    if (x + spacing + tooltipWidth > viewportWidth - 20) {
      x = position.x - spacing - tooltipWidth; // Flip to left
    } else {
      x = position.x + spacing; // Keep on right
    }
    
    // Adjust vertical position
    y = position.y - (tooltipHeight / 2); // Center vertically
    
    // Ensure tooltip stays within viewport bounds
    if (y < 20) {
      y = 20;
    } else if (y + tooltipHeight > viewportHeight - 20) {
      y = viewportHeight - tooltipHeight - 20;
    }
    
    return { x, y };
  };

  const { x, y } = calculatePosition();

  return (
    <div 
      ref={tooltipRef}
      className="fixed z-[9999] pointer-events-auto"
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseEnter={() => {
        // Keep tooltip visible when hovering over it
      }}
      onMouseLeave={() => {
        // Add delay before hiding to allow users to move between elements
        setTimeout(() => {
          onClose();
        }, 300);
      }}
    >
      <div className="max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 p-4 word-tooltip">
        {/* Header with Auto-Agent Badge */}
        <div className="flex items-center gap-2 pb-3 border-b border-gray-200/20">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">{isAutoAgent ? 'Auto-Pricing Agent' : insight.title}</h3>
            {isAutoAgent && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full mt-1">
                <Zap className="w-3 h-3" />
                Auto-Agent Ready
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              insight.confidence >= 80 ? 'bg-emerald-500/20 text-emerald-300' :
              insight.confidence >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {insight.confidence}%
            </span>
          </div>
        </div>

        {/* Rate Recommendation Section */}
        <div className="py-3 border-b border-gray-200/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Rate Recommendation</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">Current</div>
              <div className="text-sm font-semibold text-white">₹{currentRate.toLocaleString()}</div>
            </div>
            <div className="bg-emerald-500/20 rounded-md p-2 border border-emerald-500/30">
              <div className="text-xs text-emerald-300 mb-1">Change</div>
              <div className="text-sm font-semibold text-emerald-400">+{changePercent}%</div>
            </div>
            <div className="bg-white/5 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">New Rate</div>
              <div className="text-sm font-semibold text-white">₹{recommendedRate.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Insight Message */}
        <div className="py-3 border-b border-gray-200/20">
          <h4 className="text-sm font-medium text-white mb-2">{insight.title}</h4>
          <p className="text-xs text-gray-300 leading-relaxed">{insight.message}</p>
          
          {insight.potentialRevenue && (
            <div className="mt-2 p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Revenue Impact:
                </span>
                <span className="text-sm font-bold text-emerald-400">+₹{insight.potentialRevenue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Feedback */}
        {actionFeedback && (
          <div className={`py-2 px-3 rounded-lg text-xs text-center mb-3 ${
            actionFeedback.includes('✅') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            actionFeedback.includes('❌') ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {actionFeedback}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleApply}
            disabled={isApplying || appliedInsights.has(insight.id)}
            className={`flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
              appliedInsights.has(insight.id)
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : isApplying
                ? 'bg-blue-500/20 text-blue-300 cursor-wait'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {appliedInsights.has(insight.id) 
              ? '✅ Applied' 
              : isApplying 
              ? '⏳ Applying...'
              : `Apply ₹${recommendedRate.toLocaleString()}`
            }
          </button>
          <button 
            onClick={handleDetails}
            className="flex-1 bg-white/10 text-white text-xs py-2 px-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors font-medium"
          >
            View Details
          </button>
        </div>

        {/* Additional insights indicator */}
        {insights.length > 1 && (
          <div className="text-center pt-2 border-t border-gray-200/10 mt-3">
            <span className="text-xs text-gray-400">
              +{insights.length - 1} more insight{insights.length > 2 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 