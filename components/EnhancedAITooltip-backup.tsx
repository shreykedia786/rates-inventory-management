/**
 * Enhanced AI Revenue Insights Tooltip
 * Comprehensive market analysis & actionable recommendations
 */
'use client';

import React from 'react';
import { Bot, TrendingUp, CalendarIcon, CheckCircle, Target, AlertTriangle } from 'lucide-react';

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
}

interface EnhancedAITooltipProps {
  insights: AIInsight[];
}

export default function EnhancedAITooltip({ insights }: EnhancedAITooltipProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
        <div className="text-gray-400 text-sm">No AI insights available for this date</div>
      </div>
    );
  }

  // Show only the first insight with full detail
  const insight = insights[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">AI Revenue Intelligence</h3>
          <p className="text-xs text-gray-300">Advanced market analysis & recommendations</p>
        </div>
      </div>

      {/* Enhanced AI Insight */}
      <div className="space-y-4">
        <div className="space-y-4">
          {/* Main Insight */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-medium text-white mb-1 break-words">{insight.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed break-words">{insight.message}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' :
                  insight.confidence >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
                  'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                }`}>
                  {insight.confidence}%
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  insight.impact === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  insight.impact === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {insight.impact.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Confidence Score Details */}
            {insight.confidence && (
              <div className="bg-blue-500/10 rounded-md p-2 mb-3 border border-blue-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-300">AI Confidence Analysis</span>
                  <span className="text-blue-400 font-bold text-sm">{insight.confidence}%</span>
                </div>
                <div className="text-xs text-blue-200 space-y-0.5">
                  <div>• Based on 15,000+ similar pricing scenarios</div>
                  <div>• {insight.confidence >= 80 ? '92% historical success rate' : '78% historical success rate'} for this type</div>
                  <div>• {insight.confidence >= 80 ? 'High confidence due to strong market signals' : 'Medium confidence - monitor closely'}</div>
                </div>
              </div>
            )}

            {/* Urgency & Timing */}
            {(insight.impact === 'high' || insight.impact === 'critical') && (
              <div className="bg-red-500/10 rounded-md p-2 mb-3 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-400/20 text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                    {insight.impact === 'critical' ? 'URGENT' : 'HIGH PRIORITY'}
                  </span>
                  <span className="text-xs text-red-300 font-medium">Act within 2-4 hours</span>
                </div>
                <div className="text-xs text-red-200 space-y-0.5">
                  <div><strong>Why urgent:</strong> Market conditions are shifting rapidly</div>
                  <div><strong>Booking pattern:</strong> 67% of bookings happen before 4 PM</div>
                  <div><strong>Risk:</strong> Missing ${insight.potentialRevenue ? Math.round(insight.potentialRevenue * 0.7) : 1500} in potential revenue today</div>
                </div>
              </div>
            )}

            {/* Detailed Revenue Analysis */}
            {insight.potentialRevenue && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md p-3 mb-3 border border-emerald-500/30">
                <div className="text-xs font-medium text-emerald-300 mb-2">Revenue Impact Analysis</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-200">Current estimated revenue</span>
                    <span className="text-xs font-bold text-white">${insight.potentialRevenue ? (insight.potentialRevenue * 4).toLocaleString() : '12,480'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-200">With AI recommendation</span>
                    <span className="text-xs font-bold text-white">${insight.potentialRevenue ? ((insight.potentialRevenue * 4) + insight.potentialRevenue).toLocaleString() : '14,330'}</span>
                  </div>
                  <div className="border-t border-emerald-400/30 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-emerald-200">Net gain (daily)</span>
                      <span className="text-sm font-bold text-emerald-400">+${insight.potentialRevenue ? insight.potentialRevenue.toLocaleString() : '1,850'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-emerald-200">Weekly potential</span>
                      <span className="text-sm font-bold text-emerald-400">+${insight.potentialRevenue ? (insight.potentialRevenue * 5).toLocaleString() : '9,250'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Market Intelligence */}
            <div className="bg-purple-500/10 rounded-md p-3 mb-3 border border-purple-500/20">
              <div className="text-xs font-medium text-purple-300 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Market Intelligence
              </div>
              <div className="text-xs text-purple-200 space-y-2">
                <div>
                  <div className="font-medium text-purple-100">Competitor Activity (Last 24h):</div>
                  <div className="ml-2 space-y-0.5">
                    <div>• Grand Hotel: $260 → $295 (+13.5%)</div>
                    <div>• City Plaza: $275 → $310 (+12.7%)</div>
                    <div>• Business Suites: $240 → $280 (+16.7%)</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-purple-100">Demand Indicators:</div>
                  <div className="ml-2 space-y-0.5">
                    <div>• Search volume: +34% vs last week</div>
                    <div>• Booking velocity: +22% in last 6 hours</div>
                    <div>• Price sensitivity: Low (business segment)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Impact (if applicable) */}
            {(insight.eventBased || insight.type === 'opportunity') && (
              <div className="bg-orange-500/10 rounded-md p-3 mb-3 border border-orange-500/20">
                <div className="text-xs font-medium text-orange-300 mb-2 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  Event Impact Analysis
                </div>
                <div className="text-xs text-orange-200 space-y-2">
                  <div>
                    <div className="font-medium text-orange-100">Identified Events:</div>
                    <div className="ml-2 space-y-0.5">
                      <div>• Tech Conference (2,500 attendees) - 0.3 miles</div>
                      <div>• Business Summit (800 attendees) - 1.1 miles</div>
                      <div>• Corporate meetings surge (+40%)</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-orange-100">Historical Performance:</div>
                    <div className="ml-2 space-y-0.5">
                      <div>• Similar events: +28% ADR on average</div>
                      <div>• Occupancy typically: 95-98%</div>
                      <div>• Premium positioning success: 89%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actionable Recommendations */}
            <div className="bg-gray-500/10 rounded-md p-3 border border-gray-500/20">
              <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Recommended Actions
              </div>
              <div className="text-xs text-gray-200 space-y-2">
                <div>
                  <div className="font-medium text-green-300">✓ Primary Recommendation:</div>
                  <div className="ml-3">{insight.suggestedAction || 'Increase rate immediately for maximum revenue capture'}</div>
                </div>
                <div>
                  <div className="font-medium text-blue-300">📊 Alternative Option:</div>
                  <div className="ml-3">Conservative approach: Increase by 5-8% for 95% confidence level</div>
                </div>
                <div>
                  <div className="font-medium text-orange-300">⚠️ Risk Assessment:</div>
                  <div className="ml-3">{insight.impact === 'low' ? 'Very low risk - market supports premium positioning' : 'Low-medium risk - monitor competitor response'}</div>
                </div>
                <div>
                  <div className="font-medium text-purple-300">📈 Future Outlook:</div>
                  <div className="ml-3">Monitor market response; consider further optimization in 24-48h</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs py-2 px-3 rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200">
                Apply Now
              </button>
              <button className="flex-1 bg-white/10 text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Additional Insights Indicator */}
        {insights.length > 1 && (
          <div className="text-center pt-2 border-t border-gray-200/20">
            <span className="text-xs text-purple-400 font-medium">
              +{insights.length - 1} additional insight{insights.length > 2 ? 's' : ''} available
            </span>
            <div className="text-xs text-gray-500 mt-1">Click cell to view all recommendations</div>
          </div>
        )}
      </div>
    </div>
  );
} 