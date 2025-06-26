/**
 * AI Agent Panel Component
 * Comprehensive panel for AI agent management, recommendations, actions, and settings
 * Features: Real-time recommendations, autonomous actions, performance tracking, proactive alerts
 */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Target,
  BarChart3,
  Users,
  Calendar,
  Bell,
  Pause,
  Play,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronRight,
  Info,
  Lightbulb,
  Shield,
  Gauge,
  Undo2,
  Download,
  ExternalLink,
  Search
} from 'lucide-react';

import { 
  AIAgent, 
  EnhancedAIRecommendation, 
  AutonomousAction, 
  ProactiveAlert,
  AIPerformanceMetrics,
  AlertSeverity 
} from '../../types';

interface AIAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AIAgent;
  recommendations: EnhancedAIRecommendation[];
  actions: AutonomousAction[];
  alerts: ProactiveAlert[];
  performance: AIPerformanceMetrics;
  onApplyRecommendation: (recommendationId: string, value?: number) => void;
  onDismissRecommendation: (recommendationId: string, reason?: string) => void;
  onApproveAction: (actionId: string) => void;
  onRejectAction: (actionId: string, reason: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onUpdateAgentSettings: (settings: Partial<AIAgent['settings']>) => void;
  isDark?: boolean;
}

type ActiveTab = 'recommendations' | 'actions' | 'alerts' | 'performance' | 'settings';

export function AIAgentPanel({
  isOpen,
  onClose,
  agent,
  recommendations,
  actions,
  alerts,
  performance,
  onApplyRecommendation,
  onDismissRecommendation,
  onApproveAction,
  onRejectAction,
  onAcknowledgeAlert,
  onUpdateAgentSettings,
  isDark = false
}: AIAgentPanelProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('recommendations');
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'learning': return 'text-blue-400';
      case 'maintenance': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const pendingRecommendations = recommendations.filter(r => r.status === 'pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active');
  const pendingActions = actions.filter(a => a.status === 'pending_approval');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        relative ml-auto w-[600px] h-full shadow-2xl border-l
        ${isDark 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-opacity-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">UNO AI Agent</h2>
              <div className="flex items-center gap-2 text-sm opacity-75">
                <span className={`capitalize ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
                <span>•</span>
                <span>v{agent.version}</span>
                <span>•</span>
                <span>Last analyzed: {agent.lastAnalysisAt.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 py-3 border-b border-opacity-20 overflow-x-auto">
          {[
            { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, count: pendingRecommendations.length },
            { id: 'actions', label: 'Actions', icon: Zap, count: pendingActions.length },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: criticalAlerts.length },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'hover:bg-gray-500/20'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs min-w-[20px] text-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-75">
                    {pendingRecommendations.length} pending
                  </span>
                  <button className="p-2 rounded-lg hover:bg-gray-500/20 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {pendingRecommendations.length === 0 ? (
                <div className="text-center py-12 opacity-75">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending recommendations</p>
                  <p className="text-sm mt-1">AI is monitoring your data for opportunities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRecommendations.map((recommendation) => (
                    <div
                      key={recommendation.id}
                      className={`p-4 rounded-xl border ${
                        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getPriorityColor(recommendation.priority)} bg-current/20`}>
                            {recommendation.category === 'pricing' && <TrendingUp className="w-4 h-4" />}
                            {recommendation.category === 'inventory' && <Target className="w-4 h-4" />}
                            {recommendation.category === 'restrictions' && <Shield className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {recommendation.category === 'pricing' && 'Rate Optimization'}
                              {recommendation.category === 'inventory' && 'Inventory Adjustment'}
                              {recommendation.category === 'restrictions' && 'Restriction Update'}
                            </h4>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <span className={`capitalize ${getPriorityColor(recommendation.priority)}`}>
                                {recommendation.priority}
                              </span>
                              <span>•</span>
                              <span>{Math.round(recommendation.confidence * 100)}% confidence</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleExpanded(recommendation.id)}
                          className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                        >
                          {expandedItems.has(recommendation.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </button>
                      </div>

                      <p className="text-sm mb-3 opacity-90">
                        {recommendation.reasoning.description}
                      </p>

                      {expandedItems.has(recommendation.id) && (
                        <div className="space-y-3 pt-3 border-t border-opacity-20">
                          {/* Impact Metrics */}
                          {recommendation.impactMetrics.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Expected Impact</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {recommendation.impactMetrics.slice(0, 4).map((metric, index) => (
                                  <div key={index} className="text-xs">
                                    <span className="opacity-75">{metric.label}:</span>
                                    <span className="ml-1 font-medium">
                                      {metric.change > 0 ? '+' : ''}{metric.change}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Events */}
                          {recommendation.relatedEvents && recommendation.relatedEvents.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Related Events</h5>
                              <div className="space-y-1">
                                {recommendation.relatedEvents.slice(0, 2).map((event, index) => (
                                  <div key={index} className="text-xs opacity-75 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {event.title} ({event.type})
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-opacity-20">
                        <button
                          onClick={() => onApplyRecommendation(recommendation.id, recommendation.suggestedValue)}
                          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Apply Suggestion
                        </button>
                        <button
                          onClick={() => onDismissRecommendation(recommendation.id)}
                          className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-sm font-medium rounded-lg transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Autonomous Actions</h3>
                <span className="text-sm opacity-75">
                  {pendingActions.length} pending approval
                </span>
              </div>

              {pendingActions.length === 0 ? (
                <div className="text-center py-12 opacity-75">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending actions</p>
                  <p className="text-sm mt-1">AI actions will appear here for approval</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingActions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-4 rounded-xl border ${
                        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium capitalize">
                            {action.type.replace('_', ' ')}
                          </h4>
                          <p className="text-sm opacity-75 mt-1">
                            Scheduled: {action.scheduledAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium opacity-75">
                            {Math.round(action.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <p className="text-sm mb-3 opacity-90">
                        {action.reasoning}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onApproveAction(action.id)}
                          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectAction(action.id, 'Manual rejection')}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Proactive Alerts</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'all')}
                    className={`px-3 py-1 rounded-lg text-sm border ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 opacity-75">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm mt-1">AI is monitoring for opportunities and risks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-current/20">
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-3">
                        {alert.message}
                      </p>
                      {alert.status === 'active' && (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-4 py-2 bg-current/20 hover:bg-current/30 text-sm font-medium rounded-lg transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">AI Performance Metrics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Accuracy Score</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(performance.accuracyScore * 100)}%
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Revenue Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    ₹{(performance.revenueDeltaGenerated / 1000).toFixed(1)}K
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">Acceptance Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    {Math.round((performance.acceptedRecommendations / performance.totalRecommendations) * 100)}%
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">Response Time</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {performance.responseTime}ms
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Recommendations</span>
                    <span className="font-medium">{performance.totalRecommendations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accepted</span>
                    <span className="font-medium text-green-400">{performance.acceptedRecommendations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dismissed</span>
                    <span className="font-medium text-red-400">{performance.dismissedRecommendations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-Applied</span>
                    <span className="font-medium text-blue-400">{performance.autoAppliedActions}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">AI Agent Settings</h3>
              
              {/* Auto-Apply Settings */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">Autonomous Actions</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.autoApplyRecommendations}
                      onChange={(e) => onUpdateAgentSettings({
                        autoApplyRecommendations: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Enable auto-apply for recommendations</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Auto-apply threshold ({agent.settings.autoApplyThreshold}%)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={agent.settings.autoApplyThreshold}
                      onChange={(e) => onUpdateAgentSettings({
                        autoApplyThreshold: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-75 mt-1">
                      <span>Conservative (50%)</span>
                      <span>Aggressive (95%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Settings */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">Analysis Scope</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.analysisScope.competitorTracking}
                      onChange={(e) => onUpdateAgentSettings({
                        analysisScope: {
                          ...agent.settings.analysisScope,
                          competitorTracking: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Competitor tracking</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.analysisScope.eventIntegration}
                      onChange={(e) => onUpdateAgentSettings({
                        analysisScope: {
                          ...agent.settings.analysisScope,
                          eventIntegration: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Event integration</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.analysisScope.weatherFactors}
                      onChange={(e) => onUpdateAgentSettings({
                        analysisScope: {
                          ...agent.settings.analysisScope,
                          weatherFactors: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Weather factors</span>
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.notifications.critical}
                      onChange={(e) => onUpdateAgentSettings({
                        notifications: {
                          ...agent.settings.notifications,
                          critical: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Critical alerts</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.notifications.recommendations}
                      onChange={(e) => onUpdateAgentSettings({
                        notifications: {
                          ...agent.settings.notifications,
                          recommendations: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">New recommendations</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={agent.settings.notifications.autoActions}
                      onChange={(e) => onUpdateAgentSettings({
                        notifications: {
                          ...agent.settings.notifications,
                          autoActions: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Auto-applied actions</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAgentPanel; 