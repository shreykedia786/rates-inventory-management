/**
 * Global News Insights Component
 * Displays AI-powered insights from global news analysis for inventory and pricing decisions
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, TrendingUp, TrendingDown, AlertTriangle, Clock, Target, BarChart3, Users, MapPin, ExternalLink, RefreshCw, Filter, ChevronDown, ChevronRight, Eye, EyeOff, Play, Pause, Settings, Bell, BellRing, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { GlobalNewsInsight, NewsArticle, MarketImpactAnalysis } from '../services/news-integration';

interface GlobalNewsInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  insights: GlobalNewsInsight[];
  isDark: boolean;
  onApplyInsight: (insight: GlobalNewsInsight) => void;
  onDismissInsight: (insight: GlobalNewsInsight) => void;
  onRefreshInsights: () => Promise<void>;
  isLoading?: boolean;
}

interface FilterState {
  urgency: ('low' | 'medium' | 'high' | 'critical')[];
  impactLevel: ('low' | 'medium' | 'high' | 'critical')[];
  impactType: ('demand_increase' | 'demand_decrease' | 'price_pressure_up' | 'price_pressure_down' | 'capacity_constraint')[];
  status: ('active' | 'applied' | 'expired' | 'dismissed')[];
  autoApplyEnabled: boolean | null;
  actionRequired: boolean | null;
}

/**
 * GlobalNewsInsights - Main component for displaying AI-powered news insights
 * 
 * This component provides:
 * - Real-time global news analysis
 * - AI-driven pricing and inventory recommendations
 * - Predictive scenario modeling
 * - Automated insight application
 * - Risk assessment and competitor analysis
 * 
 * @param props - Component props including insights data and event handlers
 */
export default function GlobalNewsInsights({
  isOpen,
  onClose,
  insights,
  isDark,
  onApplyInsight,
  onDismissInsight,
  onRefreshInsights,
  isLoading = false
}: GlobalNewsInsightsProps) {
  // Debug logging
  useEffect(() => {
    console.log('📊 GlobalNewsInsights render state:', {
      isOpen,
      insightsCount: insights.length,
      isLoading,
      insights: insights.map(i => ({ id: i.id, title: i.title, urgency: i.urgency }))
    });
  }, [isOpen, insights, isLoading]);

  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [selectedInsight, setSelectedInsight] = useState<GlobalNewsInsight | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    urgency: ['high', 'critical'],
    impactLevel: ['medium', 'high', 'critical'],
    impactType: [],
    status: ['active'],
    autoApplyEnabled: null,
    actionRequired: null
  });

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        onRefreshInsights();
      }, 5 * 60 * 1000); // Refresh every 5 minutes
      setRefreshInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, onRefreshInsights]);

  // Filter insights based on current filter state
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      // Urgency filter
      if (filters.urgency.length > 0 && !filters.urgency.includes(insight.urgency)) {
        return false;
      }

      // Impact level filter
      if (filters.impactLevel.length > 0 && !filters.impactLevel.includes(insight.impactAnalysis.impactLevel)) {
        return false;
      }

      // Impact type filter
      if (filters.impactType.length > 0 && !filters.impactType.includes(insight.impactAnalysis.impactType)) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(insight.status)) {
        return false;
      }

      // Auto-apply filter
      if (filters.autoApplyEnabled !== null && insight.autoApplyEnabled !== filters.autoApplyEnabled) {
        return false;
      }

      // Action required filter
      if (filters.actionRequired !== null && insight.actionRequired !== filters.actionRequired) {
        return false;
      }

      return true;
    });
  }, [insights, filters]);

  // Statistics for header display
  const stats = useMemo(() => {
    const totalInsights = insights.length;
    const criticalInsights = insights.filter(i => i.urgency === 'critical').length;
    const actionableInsights = insights.filter(i => i.actionRequired && i.status === 'active').length;
    const autoApplyInsights = insights.filter(i => i.autoApplyEnabled && i.status === 'active').length;

    return {
      total: totalInsights,
      critical: criticalInsights,
      actionable: actionableInsights,
      autoApply: autoApplyInsights
    };
  }, [insights]);

  const toggleInsightExpansion = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const getUrgencyColor = (urgency: GlobalNewsInsight['urgency']) => {
    const colors = {
      low: isDark ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50',
      medium: isDark ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-50',
      high: isDark ? 'text-orange-400 bg-orange-900/20' : 'text-orange-600 bg-orange-50',
      critical: isDark ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50'
    };
    return colors[urgency];
  };

  const getImpactLevelColor = (level: MarketImpactAnalysis['impactLevel']) => {
    const colors = {
      low: isDark ? 'text-blue-400' : 'text-blue-600',
      medium: isDark ? 'text-yellow-400' : 'text-yellow-600',
      high: isDark ? 'text-orange-400' : 'text-orange-600',
      critical: isDark ? 'text-red-400' : 'text-red-600'
    };
    return colors[level];
  };

  const getImpactTypeIcon = (type: MarketImpactAnalysis['impactType']) => {
    const icons = {
      demand_increase: <TrendingUp className="w-4 h-4" />,
      demand_decrease: <TrendingDown className="w-4 h-4" />,
      price_pressure_up: <TrendingUp className="w-4 h-4" />,
      price_pressure_down: <TrendingDown className="w-4 h-4" />,
      capacity_constraint: <AlertTriangle className="w-4 h-4" />
    };
    return icons[type];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const FilterPanel = () => (
    <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Urgency Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Urgency
          </label>
          <div className="space-y-1">
            {(['low', 'medium', 'high', 'critical'] as const).map(urgency => (
              <label key={urgency} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.urgency.includes(urgency)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        urgency: [...prev.urgency, urgency]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        urgency: prev.urgency.filter(u => u !== urgency)
                      }));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className={`ml-2 text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {urgency}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Impact Level Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Impact Level
          </label>
          <div className="space-y-1">
            {(['low', 'medium', 'high', 'critical'] as const).map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.impactLevel.includes(level)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        impactLevel: [...prev.impactLevel, level]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        impactLevel: prev.impactLevel.filter(l => l !== level)
                      }));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className={`ml-2 text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <div className="space-y-1">
            {(['active', 'applied', 'expired', 'dismissed'] as const).map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        status: [...prev.status, status]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        status: prev.status.filter(s => s !== status)
                      }));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className={`ml-2 text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Toggle Filters */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Options
          </label>
          <div className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.actionRequired === true}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    actionRequired: e.target.checked ? true : null
                  }));
                }}
                className="rounded border-gray-300"
              />
              <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Action Required
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.autoApplyEnabled === true}
                onChange={(e) => {
                  setFilters(prev => ({
                    ...prev,
                    autoApplyEnabled: e.target.checked ? true : null
                  }));
                }}
                className="rounded border-gray-300"
              />
              <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Auto-Apply Enabled
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const InsightCard = ({ insight }: { insight: GlobalNewsInsight }) => {
    const isExpanded = expandedInsights.has(insight.id);
    const analysis = insight.impactAnalysis;

    return (
      <div className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'} hover:shadow-lg transition-all duration-200`}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(insight.urgency)}`}>
                  {insight.urgency.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactLevelColor(analysis.impactLevel)} ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {analysis.impactLevel.toUpperCase()} IMPACT
                </span>
                {insight.autoApplyEnabled && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-50'}`}>
                    AUTO-APPLY
                  </span>
                )}
              </div>
              
              <h3 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {insight.title}
              </h3>
              
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {insight.summary}
              </p>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  {getImpactTypeIcon(analysis.impactType)}
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {analysis.impactType.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {analysis.affectedMarkets.slice(0, 2).join(', ')}{analysis.affectedMarkets.length > 2 && '...'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {formatTimeAgo(insight.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => toggleInsightExpansion(insight.id)}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {insight.status === 'active' && (
            <div className="flex gap-2 mt-3">
              {insight.actionRequired && (
                <button
                  onClick={() => onApplyInsight(insight)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Apply Recommendation
                </button>
              )}
              
              <button
                onClick={() => onDismissInsight(insight)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className={`border-t p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pricing Recommendations */}
              <div>
                <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Pricing Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Action:</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.pricingRecommendations.immediateAction.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Change:</span>
                    <span className={`text-sm font-medium ${analysis.pricingRecommendations.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analysis.pricingRecommendations.percentageChange >= 0 ? '+' : ''}{analysis.pricingRecommendations.percentageChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Confidence:</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {(analysis.pricingRecommendations.confidenceLevel * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventory Recommendations */}
              <div>
                <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Inventory Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Action:</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.inventoryRecommendations.action.toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {analysis.inventoryRecommendations.reasoning}
                  </p>
                </div>
              </div>

              {/* Predictive Scenarios */}
              <div className="md:col-span-2">
                <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Predictive Scenarios
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {insight.predictiveScenarios.map((scenario, index) => (
                    <div key={index} className={`p-3 rounded border ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {scenario.name}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {(scenario.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`text-xs mb-1 ${scenario.revenueImpact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {scenario.revenueImpact >= 0 ? '+' : ''}{scenario.revenueImpact.toFixed(1)}% Revenue
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {scenario.timeframe}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related News Articles */}
              <div className="md:col-span-2">
                <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Related News Sources
                </h4>
                <div className="space-y-2">
                  {insight.triggerEvents.slice(0, 3).map((article, index) => (
                    <div key={index} className={`p-2 rounded border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className={`text-xs font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {article.title.slice(0, 80)}...
                          </h5>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {article.source.name}
                            </span>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {formatTimeAgo(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(article.url, '_blank')}
                          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div className={`relative ml-auto h-full w-full max-w-4xl ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-xl overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold">Global News Insights</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered market intelligence from global news analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Stats */}
            <div className="flex items-center gap-4 mr-4">
              <div className="text-center">
                <div className="text-lg font-bold">{stats.total}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-500">{stats.critical}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">{stats.actionable}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Action</div>
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${autoRefresh ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onRefreshInsights}
              disabled={isLoading}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && <FilterPanel />}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Loading global insights...
                </span>
              </div>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Globe className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No insights found
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {insights.length === 0 
                    ? 'No global news insights available. Try refreshing to fetch the latest data.'
                    : 'No insights match your current filters. Try adjusting the filter criteria.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredInsights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 