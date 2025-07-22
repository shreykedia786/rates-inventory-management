/**
 * Consistency Demo Component
 * Shows before/after comparison of data consistency
 */
'use client';

import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useConsistentRateData } from '../hooks/useConsistentRateData';

// Mock legacy product data
const mockLegacyData = {
  rate: 5200,
  originalRate: 5000,
  isChanged: true,
  lastModified: new Date(),
  aiInsights: [
    {
      id: 'insight_1',
      type: 'recommendation',
      title: 'Rate Optimization',
      message: 'Competitor analysis suggests 4% increase for optimal revenue',
      reasoning: 'Based on market analysis and demand forecast',
      confidence: 92,
      impact: 'high',
      suggestedAction: 'Increase rate to ₹5,200',
      potentialRevenue: 15000
    }
  ],
  confidenceScore: 92,
  aiApplied: true,
  aiSuggested: true,
  undoAvailable: true,
  undoExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  isActive: true,
  competitorData: {
    averageRate: 5150,
    marketPosition: 'competitive'
  }
};

export function ConsistencyDemo() {
  const [showComparison, setShowComparison] = useState(false);
  
  // Use the consistent rate data hook
  const { getDisplayValues } = useConsistentRateData(mockLegacyData);
  const { tooltipData, modalData, badgeConfig } = getDisplayValues();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Data Consistency Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare inconsistent vs consistent data display across components
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showComparison ? 'Hide' : 'Show'} Comparison
        </button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Brain className="w-4 h-4" />
          <span>AI Recommendation: ₹5,200 with {tooltipData.aiConfidence}% confidence</span>
        </div>
      </div>

      {showComparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BEFORE - Inconsistent */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <X className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-600">Before: Inconsistent</h3>
            </div>

            {/* Tooltip Simulation - Old Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tooltip Shows:</h4>
              <div className="text-sm space-y-1">
                <div>Rate: ₹{mockLegacyData.rate}</div>
                <div>AI Confidence: {mockLegacyData.confidenceScore}%</div>
                <div>Source: {mockLegacyData.aiApplied ? 'AI Applied' : 'Manual'}</div>
              </div>
            </div>

            {/* Modal Simulation - Old Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Modal Shows:</h4>
              <div className="text-sm space-y-1">
                <div>Current Rate: ₹{mockLegacyData.rate}</div>
                <div>AI Confidence: 85%</div>  {/* ← Different! */}
                <div>Last Modified: Just now</div>
              </div>
            </div>

            {/* Badge Simulation - Old Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Badge Shows:</h4>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-sm">AI: 88% confidence</span>  {/* ← Different again! */}
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Issues Found</span>
              </div>
              <ul className="text-xs text-red-600 mt-2 space-y-1 ml-6">
                <li>• Confidence: 92%, 85%, 88% (all different!)</li>
                <li>• CEO sees conflicting information</li>
                <li>• Lost credibility during demo</li>
              </ul>
            </div>
          </div>

          {/* AFTER - Consistent */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-green-600">After: Consistent</h3>
            </div>

            {/* Tooltip Simulation - New Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tooltip Shows:</h4>
              <div className="text-sm space-y-1">
                <div>Rate: ₹{tooltipData.currentRate}</div>
                <div>AI Confidence: {tooltipData.aiConfidence}%</div>
                <div>Source: {tooltipData.rateSource}</div>
                <div>Can Undo: {tooltipData.canUndo ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Modal Simulation - New Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Modal Shows:</h4>
              <div className="text-sm space-y-1">
                <div>Current Rate: ₹{modalData.currentRate}</div>
                <div>AI Confidence: {modalData.aiRecommendation?.confidence}%</div>
                <div>Base Rate: ₹{modalData.baseRate}</div>
                <div>Final Rate: ₹{modalData.finalRate}</div>
              </div>
            </div>

            {/* Badge Simulation - New Way */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Badge Shows:</h4>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-sm">AI: {badgeConfig.confidence}% confidence</span>
                {badgeConfig.showUndoBadge && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Undo Available
                  </span>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Perfect Consistency</span>
              </div>
              <ul className="text-xs text-green-600 mt-2 space-y-1 ml-6">
                <li>• Confidence: {tooltipData.aiConfidence}% everywhere</li>
                <li>• Single source of truth</li>
                <li>• CEO-ready transparency</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Demo Actions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Ready for CEO Demo</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All components now show identical data - perfect transparency
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Test Tooltip
            </button>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              Test Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 