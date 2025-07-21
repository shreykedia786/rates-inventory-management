/**
 * Inventory Status Legend Component
 * Displays a legend explaining inventory status icons and their meanings
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity
} from 'lucide-react';
import { getStatusIconConfig, getUrgencyIcon } from './InventoryStatusIcon';

interface InventoryStatusLegendProps {
  isDark?: boolean;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

const statusLevels = [
  {
    level: 'critical' as const,
    description: 'Sellout Risk',
    meaning: 'Very low inventory with high demand. Immediate action required.',
    example: 'Under 5 rooms with strong booking pace'
  },
  {
    level: 'low' as const,
    description: 'Slow Pace',
    meaning: 'Below optimal inventory levels. Monitor closely.',
    example: '5-10 rooms with moderate demand'
  },
  {
    level: 'optimal' as const,
    description: 'Good Pace',
    meaning: 'Healthy inventory levels with good demand balance.',
    example: '10-20 rooms with steady booking pace'
  },
  {
    level: 'oversupply' as const,
    description: 'Poor Demand',
    meaning: 'High inventory with low demand. Consider pricing adjustments.',
    example: 'Over 20 rooms with slow booking pace'
  }
];

const urgencyLevels = [
  {
    urgency: 'immediate',
    icon: Zap,
    color: 'text-red-500',
    description: 'Immediate Action',
    meaning: 'Requires urgent attention within hours'
  },
  {
    urgency: 'monitor',
    icon: Activity,
    color: 'text-yellow-500',
    description: 'Monitor Closely',
    meaning: 'Keep close watch and be ready to act'
  },
  {
    urgency: 'stable',
    icon: CheckCircle,
    color: 'text-green-500',
    description: 'Stable Status',
    meaning: 'No immediate action required'
  }
];

export default function InventoryStatusLegend({
  isDark = false,
  isCollapsible = true,
  defaultCollapsed = false,
  className = ''
}: InventoryStatusLegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const mockStatus = (level: any) => ({
    level,
    displayText: '',
    colorClass: '',
    reasoning: [],
    urgency: 'stable' as const,
    confidence: 85,
    factors: {
      demandPace: 0,
      competitorPosition: 'advantage' as const,
      eventImpact: 'none' as const,
      seasonalTrend: 'shoulder' as const
    }
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Inventory Status Guide
            </h3>
          </div>
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={isCollapsed ? 'Expand legend' : 'Collapse legend'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Icons indicate inventory status and recommended actions
        </p>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Status Icons */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
              Status Indicators
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statusLevels.map((status) => {
                const config = getStatusIconConfig(mockStatus(status.level));
                const { Icon } = config;
                
                return (
                  <div 
                    key={status.level}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full shadow-sm border ${config.bgColor} ${config.borderColor} flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {status.description}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {status.meaning}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                        e.g., {status.example}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency Indicators */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
              Urgency Indicators
            </h4>
            <div className="space-y-2">
              {urgencyLevels.map((urgency) => {
                const { icon: UrgencyIcon, color } = urgency;
                
                return (
                  <div 
                    key={urgency.urgency}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <UrgencyIcon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {urgency.description}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                        - {urgency.meaning}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Indicators */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
              Additional Indicators
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Pulsing red dot = Immediate action required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Yellow dot = Lower confidence (&lt;70%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Hover any icon for detailed insights
                </span>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Pro Tips
                </div>
                <ul className="text-blue-800 dark:text-blue-300 space-y-1 text-xs">
                  <li>• Icons update in real-time based on booking pace and events</li>
                  <li>• Click inventory cells to edit, double-click for inline editing</li>
                  <li>• Hover icons for detailed analysis and recommendations</li>
                  <li>• Critical status icons flash when immediate action is needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 