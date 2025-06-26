/**
 * AI Suggestion Badge Component
 * Displays AI recommendations on grid cells with tooltips and actions
 * Supports different states: pending, applied, dismissed
 */
'use client';

import React, { useState, useRef } from 'react';
import { 
  Brain, 
  CheckCircle, 
  X, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Clock,
  Undo2,
  Info,
  Zap,
  Target,
  Calendar,
  Users,
  Activity,
  Package,
  Lock
} from 'lucide-react';
import { EnhancedAIRecommendation, Event, CompetitorContext, RiskAssessment } from '../../types';

interface AISuggestionBadgeProps {
  recommendation: EnhancedAIRecommendation;
  onApply: (recommendationId: string, value?: number) => void;
  onDismiss: (recommendationId: string, reason?: string) => void;
  onUndo?: (recommendationId: string) => void;
  onExplain?: (recommendationId: string) => void;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function AISuggestionBadge({
  recommendation,
  onApply,
  onDismiss,
  onUndo,
  onExplain,
  isDark = false,
  size = 'md',
  showTooltip = true,
  className = ''
}: AISuggestionBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (!badgeRef.current || !tooltipRef.current) return;
    
    const badgeRect = badgeRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = badgeRect.left + (badgeRect.width / 2) - (tooltipRect.width / 2);
    let y = badgeRect.top - tooltipRect.height - 8;
    
    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, y);
    
    setTooltipPosition({ x, y });
  };

  const getBadgeVariant = () => {
    switch (recommendation.status) {
      case 'pending':
        return recommendation.priority === 'critical' 
          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
          : recommendation.priority === 'high'
          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
          : recommendation.priority === 'medium'
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'dismissed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30 opacity-60';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getBadgeIcon = () => {
    if (recommendation.status === 'accepted' && recommendation.appliedAt) {
      return <CheckCircle className="w-3 h-3" />;
    }
    
    switch (recommendation.category) {
      case 'pricing':
        return recommendation.suggestedValue > 0 ? 
          <TrendingUp className="w-3 h-3" /> : 
          <TrendingDown className="w-3 h-3" />;
      case 'inventory':
        return <Package className="w-3 h-3" />;
      case 'restrictions':
        return <Lock className="w-3 h-3" />;
      case 'strategy':
        return <Target className="w-3 h-3" />;
      default:
        return <Brain className="w-3 h-3" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <div
        ref={badgeRef}
        className={`
          relative inline-flex items-center gap-1 rounded-full border backdrop-blur-sm font-medium cursor-pointer
          transition-all duration-200 hover:scale-105 hover:shadow-lg
          ${getBadgeVariant()}
          ${getSizeClasses()}
          ${className}
        `}
        onMouseEnter={() => {
          if (showTooltip) {
            setIsTooltipVisible(true);
            setTimeout(updateTooltipPosition, 0);
          }
        }}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={() => onExplain?.(recommendation.id)}
      >
        {getBadgeIcon()}
        <span className="truncate">
          {recommendation.status === 'accepted' ? 'Applied' : 'AI'}
        </span>
        
        {recommendation.status === 'pending' && recommendation.priority === 'critical' && (
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* Enhanced Tooltip */}
      {isTooltipVisible && showTooltip && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-[9999] w-80 p-4 rounded-xl shadow-2xl border backdrop-blur-xl
            animate-in fade-in-0 zoom-in-95 duration-200
            ${isDark 
              ? 'bg-gray-900/95 border-gray-700 text-white' 
              : 'bg-white/95 border-gray-200 text-gray-900'
            }
          `}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${getBadgeVariant().split(' ')[0]}`}>
                {getBadgeIcon()}
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {recommendation.category === 'pricing' 
                    ? `Rate ${recommendation.suggestedValue > 0 ? 'Increase' : 'Decrease'}`
                    : recommendation.category === 'inventory'
                    ? 'Inventory Adjustment'
                    : recommendation.category === 'restrictions'
                    ? 'Restriction Change'
                    : 'Strategy Optimization'
                  }
                </h4>
                <div className="flex items-center gap-2 text-xs opacity-75">
                  <span className="capitalize">{recommendation.priority} priority</span>
                  <span>•</span>
                  <span className="capitalize">{recommendation.timeframe.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <div className={`text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                {Math.round(recommendation.confidence * 100)}%
              </div>
            </div>
          </div>

          {/* Suggestion */}
          <div className="mb-3 p-3 rounded-lg bg-opacity-50 bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm">AI Suggests</span>
            </div>
            <p className="text-sm">
              {recommendation.category === 'pricing' && 
                `${recommendation.suggestedValue > 0 ? 'Increase' : 'Decrease'} rate by ${formatCurrency(Math.abs(recommendation.suggestedValue))}`
              }
              {recommendation.category === 'inventory' && 
                `Adjust inventory to ${recommendation.suggestedValue} units`
              }
              {recommendation.category === 'restrictions' && 
                recommendation.reasoning.description
              }
            </p>
          </div>

          {/* Reasoning */}
          <div className="mb-3 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 opacity-60" />
              <span className="font-medium opacity-75">Why</span>
            </div>
            <p className="text-xs opacity-75 leading-relaxed">
              {recommendation.reasoning.description}
            </p>
          </div>

          {/* Impact Metrics */}
          {recommendation.impactMetrics.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 opacity-60" />
                <span className="font-medium text-sm opacity-75">Expected Impact</span>
              </div>
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

          {/* Events */}
          {recommendation.relatedEvents && recommendation.relatedEvents.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 opacity-60" />
                <span className="font-medium text-sm opacity-75">Events</span>
              </div>
              <div className="text-xs opacity-75">
                {recommendation.relatedEvents.slice(0, 2).map((event: Event, index: number) => (
                  <div key={index} className="truncate">
                    {event.title} ({event.type})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 opacity-60" />
              <span className="font-medium text-sm opacity-75">Risk Level</span>
            </div>
            <div className={`text-xs font-medium ${getRiskColor(recommendation.riskAssessment.level)}`}>
              {recommendation.riskAssessment.level.toUpperCase()}
              {recommendation.riskAssessment.reversible && (
                <span className="ml-2 opacity-60">(Reversible)</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-opacity-20">
            {recommendation.status === 'pending' && (
              <>
                <button
                  onClick={() => onApply(recommendation.id, recommendation.suggestedValue)}
                  className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => onDismiss(recommendation.id)}
                  className="px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-xs font-medium rounded-lg transition-colors"
                >
                  Dismiss
                </button>
              </>
            )}
            
            {recommendation.status === 'accepted' && recommendation.undoAvailable && onUndo && (
              <button
                onClick={() => onUndo(recommendation.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-medium rounded-lg transition-colors"
              >
                <Undo2 className="w-3 h-3" />
                Undo
              </button>
            )}
            
            {onExplain && (
              <button
                onClick={() => onExplain(recommendation.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-xs font-medium rounded-lg transition-colors"
              >
                <Info className="w-3 h-3" />
                Explain
              </button>
            )}
          </div>

          {/* Tooltip arrow */}
          <div
            className={`absolute w-3 h-3 rotate-45 ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } border-t border-l bottom-[-6px] left-1/2 transform -translate-x-1/2`}
          />
        </div>
      )}
    </>
  );
}

export default AISuggestionBadge; 