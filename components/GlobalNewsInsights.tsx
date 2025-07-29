/**
 * Global News Insights Component - Enhanced Agentic AI Dashboard
 * Deep granular insights with room-specific and rate-plan-specific recommendations
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, TrendingUp, TrendingDown, AlertTriangle, Clock, Target, BarChart3, Users, MapPin, ExternalLink, RefreshCw, Filter, ChevronDown, ChevronRight, Eye, EyeOff, Play, Pause, Settings, Bell, BellRing, CheckCircle, XCircle, AlertCircle, Info, Calendar, Building, DollarSign, Activity, Zap, Brain, Sparkles, ChevronUp, ArrowRight, Star, Shield, LineChart, PieChart, Gauge, Bot, Cpu, MessageSquare, Database, Layers, TrendingUp as TrendUp, Search, BookOpen, FileText, Monitor, Bed, CreditCard, Percent, BarChart2, TrendingUpIcon, Hash, Wifi, Phone, Mail } from 'lucide-react';
import { generateGranularInsights, generateAnalyticsData, generateAutomationData, type EnhancedInsight, type AnalyticsData, type AutomationRule } from '../services/enhanced-insights-data';

interface GlobalNewsInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  insights: any[];
  isDark: boolean;
  onApplyInsight: (insight: any) => void;
  onDismissInsight: (insight: any) => void;
  onRefreshInsights: () => Promise<void>;
  isLoading?: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'insights' | 'analytics' | 'automation' | 'settings'>('insights');
  const [selectedInsight, setSelectedInsight] = useState<EnhancedInsight | null>(null);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  // Get enhanced data
  const enhancedInsights = useMemo(() => generateGranularInsights(), []);
  const analyticsData = useMemo(() => generateAnalyticsData(), []);
  const automationRules = useMemo(() => generateAutomationData(), []);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const toggleActionExpansion = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
  };

  const getActionTypeIcon = (type: string) => {
    const icons = {
      price_increase: <TrendingUp className="w-4 h-4" />,
      price_decrease: <TrendingDown className="w-4 h-4" />,
      inventory_open: <Bed className="w-4 h-4" />,
      inventory_close: <Bed className="w-4 h-4" />,
      channel_adjust: <BarChart3 className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Settings className="w-4 h-4" />;
  };

  const getActionTypeColor = (type: string) => {
    const colors = {
      price_increase: 'text-green-600 bg-green-100',
      price_decrease: 'text-red-600 bg-red-100',
      inventory_open: 'text-blue-600 bg-blue-100',
      inventory_close: 'text-orange-600 bg-orange-100',
      channel_adjust: 'text-purple-600 bg-purple-100'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  // Enhanced Insights Tab with Granular Details
  const EnhancedInsightsTab = () => (
    <div className="p-6 space-y-6">
      {enhancedInsights.map((insight) => (
        <div key={insight.id} className={`rounded-xl border transition-all duration-300 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } hover:shadow-lg`}>
          
          {/* Insight Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    insight.urgency === 'critical' ? 'bg-red-100 text-red-600' :
                    insight.urgency === 'high' ? 'bg-orange-100 text-orange-600' :
                    insight.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    insight.urgency === 'critical' ? 'bg-red-500 text-white' :
                    insight.urgency === 'high' ? 'bg-orange-500 text-white' :
                    insight.urgency === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {insight.urgency.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700`}>
                    {insight.confidence}% Confidence
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {insight.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {insight.summary}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{insight.revenueImpact.total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Impact</div>
              </div>
            </div>
            
            {/* Revenue Impact Breakdown */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-lg font-bold text-green-600">
                  ₹{insight.revenueImpact.shortTerm.amount.toLocaleString()}
                </div>
                <div className="text-xs opacity-75">{insight.revenueImpact.shortTerm.timeframe}</div>
                <div className="text-xs text-green-600">{insight.revenueImpact.shortTerm.probability}% probability</div>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-lg font-bold text-blue-600">
                  ₹{insight.revenueImpact.mediumTerm.amount.toLocaleString()}
                </div>
                <div className="text-xs opacity-75">{insight.revenueImpact.mediumTerm.timeframe}</div>
                <div className="text-xs text-blue-600">{insight.revenueImpact.mediumTerm.probability}% probability</div>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-lg font-bold text-purple-600">
                  ₹{insight.revenueImpact.longTerm.amount.toLocaleString()}
                </div>
                <div className="text-xs opacity-75">{insight.revenueImpact.longTerm.timeframe}</div>
                <div className="text-xs text-purple-600">{insight.revenueImpact.longTerm.probability}% probability</div>
              </div>
            </div>
          </div>

          {/* Granular Actions */}
          <div className="p-6">
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎯 Specific Actions Required
            </h4>
            
            <div className="space-y-3">
              {insight.granularActions.map((action, index) => (
                <div key={action.id} className={`border rounded-lg transition-all duration-200 ${
                  isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getActionTypeColor(action.type)}`}>
                          {getActionTypeIcon(action.type)}
                        </div>
                        <div>
                          <div className="font-semibold">
                            Priority {action.priority}: {action.type.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-sm opacity-75">
                            {action.roomType} • {action.ratePlan}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₹{action.expectedRevenue.toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${getRiskColor(action.risk)}`}>
                          {action.risk.toUpperCase()} RISK
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {action.currentPrice && (
                        <div>
                          <div className="text-sm font-medium">Price Change</div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">₹{action.currentPrice}</span>
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-lg font-bold text-green-600">₹{action.recommendedPrice}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              (action.priceChange || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {(action.priceChange || 0) > 0 ? '+' : ''}{action.priceChange}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {action.currentInventory && (
                        <div>
                          <div className="text-sm font-medium">Inventory Change</div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{action.currentInventory} rooms</span>
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-lg font-bold text-blue-600">{action.recommendedInventory} rooms</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              (action.inventoryChange || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {(action.inventoryChange || 0) > 0 ? '+' : ''}{action.inventoryChange}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <strong>Reasoning:</strong> {action.reasoning}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <strong>Timeline:</strong> {action.timeframe} • 
                        <strong> Dates:</strong> {action.dates.slice(0, 3).join(', ')}{action.dates.length > 3 && '...'}
                      </div>
                      
                      <button
                        onClick={() => onApplyInsight(action)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Action
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Type Analysis */}
          {insight.affectedRoomTypes.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🏨 Room Type Performance Analysis
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insight.affectedRoomTypes.map((room) => (
                  <div key={room.roomType} className={`p-4 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold">{room.roomType}</h5>
                      <div className={`px-2 py-1 rounded text-xs ${
                        room.performanceScore >= 85 ? 'bg-green-100 text-green-700' :
                        room.performanceScore >= 75 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {room.performanceScore}/100
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="opacity-75">Current ADR</div>
                        <div className="font-bold">₹{room.currentADR}</div>
                      </div>
                      <div>
                        <div className="opacity-75">Optimal ADR</div>
                        <div className="font-bold text-green-600">₹{room.optimalADR}</div>
                      </div>
                      <div>
                        <div className="opacity-75">Current Occ</div>
                        <div className="font-bold">{room.currentOccupancy}%</div>
                      </div>
                      <div>
                        <div className="opacity-75">Optimal Occ</div>
                        <div className="font-bold text-blue-600">{room.optimalOccupancy}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded">
                      <div className="text-sm">
                        <strong>RevPAR Opportunity:</strong> ₹{room.revPAR} → ₹{room.optimalRevPAR}
                        <span className="text-green-600 ml-2">
                          (+₹{(room.optimalRevPAR - room.revPAR).toFixed(0)})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Enhanced Analytics Tab
  const AnalyticsTab = () => (
    <div className="p-6 space-y-6">
      {/* Revenue Analysis */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Revenue Performance Analysis
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-green-600">₹{(analyticsData.revenueAnalysis.actualRevenue / 1000000).toFixed(1)}M</div>
            <div className="text-sm opacity-75">Actual Revenue</div>
            <div className="text-xs text-green-600">+{analyticsData.revenueAnalysis.variance.toFixed(1)}% vs forecast</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.revenueAnalysis.growthRate.toFixed(1)}%</div>
            <div className="text-sm opacity-75">Growth Rate</div>
            <div className="text-xs text-blue-600">YoY comparison</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-purple-600">₹{(analyticsData.revenueAnalysis.forecastRevenue / 1000000).toFixed(1)}M</div>
            <div className="text-sm opacity-75">Forecast</div>
            <div className="text-xs text-purple-600">Target achieved</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-sm opacity-75">Segments</div>
            <div className="text-xs text-orange-600">Active revenue streams</div>
          </div>
        </div>

        {/* Segment Breakdown */}
        <h4 className="text-lg font-semibold mb-3">Revenue by Segment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.revenueAnalysis.segmentBreakdown.map((segment) => (
            <div key={segment.segment} className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{segment.segment}</span>
                <span className="text-lg font-bold">₹{(segment.revenue / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full ${
                      segment.segment === 'Leisure' ? 'bg-green-500' :
                      segment.segment === 'Corporate' ? 'bg-blue-500' :
                      segment.segment === 'Group' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${segment.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{segment.percentage}%</span>
              </div>
              <div className={`text-sm ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {segment.growth > 0 ? '+' : ''}{segment.growth.toFixed(1)}% growth
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Performance */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bed className="w-6 h-6 text-green-600" />
          Room Type Performance Matrix
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left p-3">Room Type</th>
                <th className="text-center p-3">Current ADR</th>
                <th className="text-center p-3">Optimal ADR</th>
                <th className="text-center p-3">Occupancy</th>
                <th className="text-center p-3">RevPAR</th>
                <th className="text-center p-3">Performance</th>
                <th className="text-center p-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.roomPerformance.map((room) => (
                <tr key={room.roomType} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="p-3 font-medium">{room.roomType}</td>
                  <td className="text-center p-3">₹{room.currentADR}</td>
                  <td className="text-center p-3 text-green-600 font-medium">₹{room.optimalADR}</td>
                  <td className="text-center p-3">{room.currentOccupancy}%</td>
                  <td className="text-center p-3">₹{room.revPAR}</td>
                  <td className="text-center p-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      room.performanceScore >= 85 ? 'bg-green-100 text-green-700' :
                      room.performanceScore >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {room.performanceScore}/100
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className={`inline-flex items-center gap-1 ${
                      room.trend === 'improving' ? 'text-green-600' :
                      room.trend === 'stable' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {room.trend === 'improving' ? <TrendingUp className="w-4 h-4" /> :
                       room.trend === 'stable' ? <ArrowRight className="w-4 h-4" /> : 
                       <TrendingDown className="w-4 h-4" />}
                      <span className="capitalize text-xs">{room.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitive Intelligence */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-red-600" />
          Competitive Intelligence Dashboard
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left p-3">Property</th>
                <th className="text-center p-3">ADR</th>
                <th className="text-center p-3">Occupancy</th>
                <th className="text-center p-3">RevPAR</th>
                <th className="text-center p-3">Market Share</th>
                <th className="text-center p-3">Rate Position</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.competitiveIntelligence.map((comp, index) => (
                <tr key={comp.property} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${
                  comp.property === 'Your Property' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}>
                  <td className="p-3 font-medium">{comp.property}</td>
                  <td className="text-center p-3">₹{comp.adr}</td>
                  <td className="text-center p-3">{comp.occupancy}%</td>
                  <td className="text-center p-3">₹{comp.revpar}</td>
                  <td className="text-center p-3">{comp.marketShare}%</td>
                  <td className="text-center p-3">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      comp.ratePosition === 1 ? 'bg-yellow-100 text-yellow-800' :
                      comp.ratePosition <= 3 ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      #{comp.ratePosition}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecast Data */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LineChart className="w-6 h-6 text-purple-600" />
          AI Forecast Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.forecastData.map((forecast) => (
            <div key={forecast.period} className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">{forecast.period}</h4>
                <div className={`px-2 py-1 rounded text-xs ${
                  forecast.confidence >= 90 ? 'bg-green-100 text-green-700' :
                  forecast.confidence >= 80 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {forecast.confidence}% confidence
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div>
                  <div className="opacity-75">ADR</div>
                  <div className="font-bold">₹{forecast.predictedADR}</div>
                </div>
                <div>
                  <div className="opacity-75">Occupancy</div>
                  <div className="font-bold">{forecast.predictedOccupancy}%</div>
                </div>
                <div>
                  <div className="opacity-75">RevPAR</div>
                  <div className="font-bold">₹{forecast.predictedRevPAR}</div>
                </div>
              </div>
              
              <div className="text-xs opacity-75">
                <strong>Key Factors:</strong> {forecast.factors.slice(0, 2).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Automation Tab
  const AutomationTab = () => (
    <div className="p-6 space-y-6">
      {/* Automation Overview */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          AI Automation Status Dashboard
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-green-600">{automationRules.filter(r => r.status === 'active').length}</div>
            <div className="text-sm opacity-75">Active Rules</div>
            <div className="text-xs text-green-600">Running automatically</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-blue-600">
              {automationRules.reduce((sum, rule) => sum + rule.performance.timesTriggered, 0)}
            </div>
            <div className="text-sm opacity-75">Total Triggers</div>
            <div className="text-xs text-blue-600">This month</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-purple-600">
              {(automationRules.reduce((sum, rule) => sum + rule.performance.successRate, 0) / automationRules.length).toFixed(1)}%
            </div>
            <div className="text-sm opacity-75">Success Rate</div>
            <div className="text-xs text-purple-600">Average across rules</div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-orange-600">
              ₹{(automationRules.reduce((sum, rule) => sum + rule.performance.revenueImpact, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-75">Revenue Impact</div>
            <div className="text-xs text-orange-600">Generated by AI</div>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600" />
          Active Automation Rules
        </h3>
        
        <div className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      rule.type === 'pricing' ? 'bg-green-100 text-green-600' :
                      rule.type === 'inventory' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {rule.type === 'pricing' ? <DollarSign className="w-4 h-4" /> :
                       rule.type === 'inventory' ? <Bed className="w-4 h-4" /> :
                       <BarChart3 className="w-4 h-4" />}
                    </div>
                    <h4 className="font-semibold">{rule.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      rule.status === 'active' ? 'bg-green-100 text-green-700' :
                      rule.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {rule.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="text-sm mb-2">
                    <strong>Trigger:</strong> {rule.trigger}
                  </div>
                  <div className="text-sm mb-2">
                    <strong>Action:</strong> {rule.action}
                  </div>
                  <div className="text-sm mb-2">
                    <strong>Applies to:</strong> {rule.roomTypes.slice(0, 2).join(', ')}{rule.roomTypes.length > 2 && '...'} • {rule.ratePlans.slice(0, 2).join(', ')}{rule.ratePlans.length > 2 && '...'}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ₹{rule.performance.revenueImpact.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-75">Revenue generated</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="opacity-75">Times Triggered</div>
                  <div className="font-bold">{rule.performance.timesTriggered}</div>
                </div>
                <div>
                  <div className="opacity-75">Success Rate</div>
                  <div className="font-bold text-green-600">{rule.performance.successRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="opacity-75">Last Triggered</div>
                  <div className="font-bold">{rule.performance.lastTriggered.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="opacity-75">Status</div>
                  <div className={`font-bold ${
                    rule.status === 'active' ? 'text-green-600' :
                    rule.status === 'paused' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {rule.status === 'active' ? 'Running' : rule.status === 'paused' ? 'Paused' : 'Testing'}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                <strong>Conditions:</strong> {rule.conditions.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-600" />
          Automation Performance Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-semibold mb-2">Top Performing Rule</h4>
            <div className="text-lg font-bold text-green-600">Weekend Premium Pricing</div>
            <div className="text-sm opacity-75">89.3% success rate</div>
            <div className="text-sm text-green-600">₹485,000 generated</div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-semibold mb-2">Most Active Rule</h4>
            <div className="text-lg font-bold text-blue-600">Weekend Premium Pricing</div>
            <div className="text-sm opacity-75">28 triggers this month</div>
            <div className="text-sm text-blue-600">Every 1.1 days average</div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-semibold mb-2">Testing Phase</h4>
            <div className="text-lg font-bold text-yellow-600">Channel Optimization</div>
            <div className="text-sm opacity-75">60% success rate</div>
            <div className="text-sm text-yellow-600">Needs refinement</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`absolute right-0 top-0 h-full w-full max-w-7xl transform transition-transform duration-700 ease-out ${
        animateIn ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="relative h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 shadow-2xl">
          
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-lg">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Brain className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Enhanced Agentic AI</h1>
                    <p className="text-blue-100 mt-1">Granular Revenue Intelligence</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                  
                  <button onClick={onRefreshInsights} className="p-3 bg-white/10 rounded-xl hover:bg-white/20">
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button onClick={onClose} className="p-3 bg-white/10 rounded-xl hover:bg-red-500/80">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6">
                <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
                  {[
                    { id: 'insights', label: 'Deep Insights', icon: Brain },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'automation', label: 'Automation', icon: Bot }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-lg'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-200px)] overflow-y-auto">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Processing granular analytics...</p>
                </div>
              </div>
            )}

            {activeTab === 'insights' && <EnhancedInsightsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'automation' && <AutomationTab />}
          </div>
        </div>
      </div>
    </div>
  );
} 