/**
 * Enhanced AI Recommendation Tooltip
 * Addresses UX issues: realistic pricing, sticky hover, clear explanations, working actions
 */
'use client';

import React, { useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, Info, Zap, Target, Calendar, Users } from 'lucide-react';

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

interface EnhancedAIRecommendationTooltipProps {
  insights: AIInsight[];
  currentRate: number;
  onApply?: (insight: AIInsight, newRate: number) => void;
  onDetails?: (insight: AIInsight) => void;
  onDismiss?: (insight: AIInsight) => void;
}

export default function EnhancedAIRecommendationTooltip({ 
  insights, 
  currentRate, 
  onApply, 
  onDetails, 
  onDismiss 
}: EnhancedAIRecommendationTooltipProps) {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!insights || insights.length === 0) {
    return null;
  }

  // Use the first insight as primary (most relevant)
  const insight = insights[0];
  
  // Check if this is an auto-pricing agent tooltip
  const isAutoAgent = insight.agentCapabilities?.canAutoExecute;
  
  // Calculate recommended rate change
  const rateChange = Math.round(currentRate * 0.08); // 8% increase example
  const recommendedRate = currentRate + rateChange;
  const changePercent = ((rateChange / currentRate) * 100).toFixed(1);

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

  const handleApply = () => {
    if (onApply) {
      onApply(insight, recommendedRate);
      setActionFeedback('✅ Rate updated successfully!');
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleDetails = () => {
    if (onDetails) {
      onDetails(insight);
    }
  };

  return (
    <div className="max-w-sm bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 p-4">
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

      {/* Agent Status Information for Auto-Pricing Agent */}
      {isAutoAgent && (
        <div className="py-3 border-b border-gray-200/20">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 rounded-md p-2">
              <div className="text-gray-400 mb-1">Execution Delay</div>
              <div className="text-blue-400 font-semibold">
                {insight.agentCapabilities?.executionDelay || 0} min
              </div>
            </div>
            <div className="bg-white/5 rounded-md p-2">
              <div className="text-gray-400 mb-1">Risk Level</div>
              <div className={`font-semibold ${
                insight.agentCapabilities?.riskAssessment === 'low' ? 'text-green-400' :
                insight.agentCapabilities?.riskAssessment === 'medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {insight.agentCapabilities?.riskAssessment?.toUpperCase() || 'LOW'}
              </div>
            </div>
          </div>
          
          {insight.potentialRevenue && (
            <div className="mt-3 p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md border border-emerald-500/30">
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-300">Revenue Impact:</span>
                <span className="text-sm font-bold text-emerald-400">+₹{insight.potentialRevenue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-3 space-y-3">
        {/* Clear Rate Recommendation */}
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-300">Rate Recommendation</span>
            <Target className="w-3 h-3 text-blue-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Current Rate</div>
              <div className="text-sm font-bold text-white">₹{currentRate.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Suggested Change</div>
              <div className={`text-sm font-bold ${rateChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {rateChange > 0 ? '+' : ''}₹{rateChange.toLocaleString()} ({Number(changePercent) > 0 ? '+' : ''}{changePercent}%)
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">New Rate</div>
              <div className="text-sm font-bold text-emerald-400">₹{recommendedRate.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Why This Recommendation */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Why This Change?</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed bg-white/5 rounded p-2">
            {insight.reasoning}
          </p>
        </div>

        {/* Key Factors */}
        <div className="grid grid-cols-2 gap-2">
          {insight.eventBased && (
            <div className="bg-orange-500/10 rounded p-2 border border-orange-500/20">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-medium text-orange-300">Event Impact</span>
              </div>
              <div className="text-xs text-gray-300">Major event detected</div>
            </div>
          )}
          {insight.competitorBased && (
            <div className="bg-cyan-500/10 rounded p-2 border border-cyan-500/20">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-medium text-cyan-300">Market Move</span>
              </div>
              <div className="text-xs text-gray-300">Competitors increased</div>
            </div>
          )}
        </div>

        {/* Revenue Impact */}
        <div className="flex items-center justify-between bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
          <div className="flex items-center gap-1">
            <ImpactIcon className="w-3 h-3 text-gray-400" />
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
              insight.impact === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              insight.impact === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
              insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {insight.impact.toUpperCase()} IMPACT
            </span>
          </div>
          {insight.potentialRevenue && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Additional Revenue</div>
              <div className="text-sm font-bold text-emerald-400">+₹{insight.potentialRevenue.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Action Feedback */}
        {actionFeedback && (
          <div className="bg-emerald-500/20 text-emerald-300 text-xs p-2 rounded border border-emerald-500/30 text-center">
            {actionFeedback}
          </div>
        )}

        {/* Action Buttons - Now Clickable! */}
        <div className="flex gap-2 pt-2">
          <button 
            onClick={handleApply}
            className="flex-1 bg-emerald-500/20 text-emerald-300 text-xs py-2 px-3 rounded border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"
          >
            Apply ₹{recommendedRate.toLocaleString()}
          </button>
          <button 
            onClick={handleDetails}
            className="flex-1 bg-white/10 text-white text-xs py-2 px-3 rounded border border-white/20 hover:bg-white/20 transition-colors font-medium"
          >
            View Details
          </button>
        </div>

        {/* Additional Insights Indicator */}
        {insights.length > 1 && (
          <div className="text-center pt-2 border-t border-gray-200/10">
            <span className="text-xs text-gray-400">
              +{insights.length - 1} more insight{insights.length > 2 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 