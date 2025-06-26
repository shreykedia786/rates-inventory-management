/**
 * Proactive Alerts Panel Component
 * Displays critical situations, opportunities, and risks with bulk actions
 * Features: Real-time monitoring, filtering, bulk actions, and contextual recommendations
 */
'use client';

import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Check, 
  Clock, 
  Filter, 
  Search,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Zap,
  Target,
  Calendar,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

import { 
  ProactiveAlert, 
  AlertSeverity, 
  AlertType, 
  AlertStatus,
  EnhancedAIRecommendation 
} from '../../types';

interface ProactiveAlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ProactiveAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onSnoozeAlert: (alertId: string, until: Date) => void;
  onApplyRecommendation: (recommendationId: string) => void;
  onBulkAction: (alertIds: string[], action: 'acknowledge' | 'dismiss' | 'snooze') => void;
  isDark?: boolean;
  unreadCount?: number;
}

export function ProactiveAlertsPanel({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onDismissAlert,
  onSnoozeAlert,
  onApplyRecommendation,
  onBulkAction,
  isDark = false,
  unreadCount = 0
}: ProactiveAlertsPanelProps) {
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'time' | 'type'>('severity');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts.filter(alert => {
      const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
      const matchesType = filterType === 'all' || alert.type === filterType;
      const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
      const matchesSearch = searchQuery === '' || 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSeverity && matchesType && matchesStatus && matchesSearch;
    });

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'time':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [alerts, filterSeverity, filterType, filterStatus, searchQuery, sortBy]);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'anomaly': return <Activity className="w-4 h-4" />;
      case 'threshold_breach': return <Target className="w-4 h-4" />;
      case 'competitor_action': return <Users className="w-4 h-4" />;
      case 'event_impact': return <Calendar className="w-4 h-4" />;
      case 'performance_issue': return <TrendingDown className="w-4 h-4" />;
      case 'data_quality': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'acknowledged': return <Eye className="w-4 h-4 text-yellow-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'snoozed': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'expired': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const handleSelectAlert = (alertId: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId);
    } else {
      newSelected.add(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const handleSelectAll = () => {
    const visibleAlertIds = filteredAndSortedAlerts.map(alert => alert.id);
    setSelectedAlerts(new Set(visibleAlertIds));
  };

  const handleDeselectAll = () => {
    setSelectedAlerts(new Set());
  };

  const handleBulkAction = (action: 'acknowledge' | 'dismiss' | 'snooze') => {
    const alertIds = Array.from(selectedAlerts);
    onBulkAction(alertIds, action);
    setSelectedAlerts(new Set());
  };

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

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
        relative ml-auto w-[500px] h-full shadow-2xl border-l
        ${isDark 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-opacity-20">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-orange-500/20">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Proactive Alerts</h2>
              <p className="text-sm opacity-75">
                {filteredAndSortedAlerts.length} alerts ({alerts.filter(a => a.status === 'active').length} active)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-opacity-20 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg border
                ${isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
              `}
            />
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-2 text-sm">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'all')}
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as AlertType | 'all')}
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Types</option>
              <option value="opportunity">Opportunities</option>
              <option value="risk">Risks</option>
              <option value="anomaly">Anomalies</option>
              <option value="threshold_breach">Thresholds</option>
              <option value="competitor_action">Competitor</option>
              <option value="event_impact">Events</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'severity' | 'time' | 'type')}
              className={`px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              <option value="severity">Sort by Severity</option>
              <option value="time">Sort by Time</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedAlerts.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-sm font-medium">
                {selectedAlerts.size} selected
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => handleBulkAction('acknowledge')}
                  className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleBulkAction('dismiss')}
                  className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-xs font-medium rounded transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="p-1 hover:bg-gray-500/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedAlerts.length === 0 ? (
            <div className="text-center py-12 opacity-75">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alerts match your filters</p>
              <p className="text-sm mt-1">AI is monitoring for opportunities and risks</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredAndSortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`
                    p-4 rounded-xl border transition-all duration-200
                    ${getSeverityColor(alert.severity)}
                    ${selectedAlerts.has(alert.id) ? 'ring-2 ring-blue-500/50' : ''}
                    hover:shadow-lg
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedAlerts.has(alert.id)}
                      onChange={() => handleSelectAlert(alert.id)}
                      className="mt-1 rounded"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-current/20">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">{alert.title}</h4>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(alert.createdAt)}</span>
                              <span>•</span>
                              <span className={`flex items-center gap-1`}>
                                {getStatusIcon(alert.status)}
                                {alert.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-current/20">
                            {alert.severity.toUpperCase()}
                          </span>
                          <button
                            onClick={() => toggleExpanded(alert.id)}
                            className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                          >
                            {expandedAlerts.has(alert.id) ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>

                      <p className="text-sm opacity-90 mb-3 leading-relaxed">
                        {alert.message}
                      </p>

                      {/* Affected Entities */}
                      {alert.affectedEntities.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedEntities.slice(0, 3).map((entity, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-current/10 rounded text-xs font-medium"
                              >
                                {entity.name}
                              </span>
                            ))}
                            {alert.affectedEntities.length > 3 && (
                              <span className="px-2 py-1 bg-current/10 rounded text-xs">
                                +{alert.affectedEntities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expanded Content */}
                      {expandedAlerts.has(alert.id) && (
                        <div className="space-y-3 pt-3 border-t border-current/20">
                          {/* AI Recommendations */}
                          {alert.recommendations.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4" />
                                <span className="font-medium text-sm">AI Recommendations</span>
                              </div>
                              <div className="space-y-2">
                                {alert.recommendations.slice(0, 2).map((recommendation) => (
                                  <div
                                    key={recommendation.id}
                                    className="p-3 rounded-lg bg-current/10 border border-current/20"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <p className="text-sm font-medium">
                                        {recommendation.reasoning.description}
                                      </p>
                                      <span className="text-xs opacity-75">
                                        {Math.round(recommendation.confidence * 100)}%
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => onApplyRecommendation(recommendation.id)}
                                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded transition-colors"
                                    >
                                      Apply Suggestion
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Trigger Conditions */}
                          {alert.triggerConditions.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Trigger Conditions</h5>
                              <div className="space-y-1 text-xs opacity-75">
                                {alert.triggerConditions.map((condition, index) => (
                                  <div key={index}>
                                    {condition.metric} {condition.operator} {condition.value}
                                    {condition.timeframe && ` (${condition.timeframe})`}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {alert.status === 'active' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-current/20">
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="flex-1 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded transition-colors"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => onDismissAlert(alert.id)}
                            className="px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-xs font-medium rounded transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => onSnoozeAlert(alert.id, new Date(Date.now() + 3600000))} // 1 hour
                            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded transition-colors"
                          >
                            Snooze 1h
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-opacity-20">
          <div className="flex items-center justify-between text-sm opacity-75">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="hover:opacity-100 transition-opacity"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="hover:opacity-100 transition-opacity"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>Auto-refresh</span>
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProactiveAlertsPanel; 