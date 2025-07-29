/**
 * Inventory Status Tooltip Component
 * Rich tooltip that appears when hovering over inventory status icons
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { InventoryStatus } from './InventoryStatusIcon';

interface InventoryStatusTooltipProps {
  status: InventoryStatus;
  inventory: number;
  roomType: string;
  date: string;
  config: any;
  position: { x: number; y: number };
  isVisible: boolean;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

const getFactorIcon = (factor: string) => {
  switch (factor) {
    case 'demandPace':
      return TrendingUp;
    case 'competitorPosition':
      return Target;
    case 'eventImpact':
      return Calendar;
    case 'seasonalTrend':
      return BarChart3;
    default:
      return Activity;
  }
};

const getFactorColor = (value: number | string, type: string, inventoryLevel?: string) => {
  if (type === 'demandPace' && typeof value === 'number') {
    // For critical inventory, even negative pace might not be terrible (less pressure)
    // For oversupply, positive pace is very good news
    if (inventoryLevel === 'critical') {
      return value > 5 ? 'text-red-400' : value > -5 ? 'text-yellow-400' : 'text-green-400';
    } else if (inventoryLevel === 'oversupply') {
      return value > 0 ? 'text-green-400' : value > -10 ? 'text-yellow-400' : 'text-red-400';
    } else {
      return value > 0 ? 'text-green-400' : 'text-red-400';
    }
  }
  if (type === 'competitorPosition') {
    return value === 'advantage' ? 'text-green-400' : 'text-orange-400';
  }
  if (type === 'eventImpact') {
    return value === 'positive' ? 'text-green-400' : 
           value === 'negative' ? 'text-red-400' : 'text-gray-400';
  }
  if (type === 'seasonalTrend') {
    return value === 'peak' ? 'text-green-400' : 
           value === 'shoulder' ? 'text-yellow-400' : 'text-orange-400'; // off-peak is concerning, not neutral
  }
  return 'text-gray-400';
};

const getFactorDisplayValue = (value: number | string, type: string) => {
  if (type === 'demandPace' && typeof value === 'number') {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value.toString();
};

const getFactorExplanation = (key: string, value: number | string, inventoryLevel: string) => {
  if (key === 'demandPace' && typeof value === 'number') {
    if (inventoryLevel === 'critical') {
      return value > 5 ? 'Very high demand pressure' : value > -5 ? 'Manageable demand' : 'Demand cooling off';
    } else if (inventoryLevel === 'oversupply') {
      return value > 0 ? 'Demand improving' : value > -10 ? 'Demand declining' : 'Demand very weak';
    } else {
      return value > 0 ? 'Growing demand' : 'Declining demand';
    }
  }
  if (key === 'competitorPosition') {
    return value === 'advantage' ? 'Better positioned vs competitors' : 'Competitors performing better';
  }
  if (key === 'eventImpact') {
    if (value === 'positive') return 'Events driving demand';
    if (value === 'negative') return 'Events hurting demand';
    return 'No significant events';
  }
  if (key === 'seasonalTrend') {
    if (value === 'peak') return 'Peak season demand';
    if (value === 'shoulder') return 'Moderate season';
    return 'Off-peak period';
  }
  return '';
};

export default function InventoryStatusTooltip({
  status,
  inventory,
  roomType,
  date,
  config,
  position,
  isVisible
}: InventoryStatusTooltipProps) {
  if (!isVisible) return null;

  const { Icon } = config;

  return (
    <div 
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: position.x > window.innerWidth / 2 ? 'translateX(-100%)' : 'none'
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-2xl border border-gray-700 p-4 min-w-[320px] max-w-[400px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-700">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${config.bgColor.replace('dark:bg-', 'bg-')}`}>
            <Icon className={`w-4 h-4 ${config.iconColor.replace('dark:text-', 'text-')}`} />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">
              {config.description}
            </div>
            <div className="text-xs text-gray-400">
              {roomType} • {formatDate(date)}
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
            <div className="text-gray-400 text-xs mb-1">Current</div>
            <div className="text-white font-bold text-xl">{inventory}</div>
            <div className="text-gray-500 text-xs">rooms</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
            <div className="text-gray-400 text-xs mb-1">Confidence</div>
            <div className="text-white font-bold text-xl">{status.confidence}%</div>
            <div className={`text-xs font-medium ${
              status.confidence >= 80 ? 'text-emerald-400' : 
              status.confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {status.confidence >= 80 ? 'HIGH' : 
               status.confidence >= 60 ? 'MEDIUM' : 'LOW'}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
            <div className="text-gray-400 text-xs mb-1">Urgency</div>
            <div className={`font-bold text-xl ${
              status.urgency === 'immediate' ? 'text-red-400' :
              status.urgency === 'monitor' ? 'text-yellow-400' :
              'text-emerald-400'
            }`}>
              {status.urgency === 'immediate' ? '⚠️' : 
               status.urgency === 'monitor' ? '👀' : '✅'}
            </div>
            <div className={`text-xs font-medium ${
              status.urgency === 'immediate' ? 'text-red-400' :
              status.urgency === 'monitor' ? 'text-yellow-400' :
              'text-emerald-400'
            }`}>
              {status.urgency.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Key Factors
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(status.factors).map(([key, value]) => {
              const FactorIcon = getFactorIcon(key);
              const color = getFactorColor(value, key, status.level);
              const displayValue = getFactorDisplayValue(value, key);
              const explanation = getFactorExplanation(key, value, status.level);
              
              return (
                <div key={key} className="flex items-start gap-2 text-xs">
                  <FactorIcon className={`w-3 h-3 ${color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className={`font-medium ${color}`}>
                        {displayValue}
                      </span>
                    </div>
                    {explanation && (
                      <div className="text-gray-500 text-xs mt-0.5 italic">
                        {explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Required */}
        {status.actionRequired && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Recommended Action
            </div>
            <div className={`text-xs px-3 py-2 rounded-lg border ${
              status.urgency === 'immediate' ? 'bg-red-900/30 border-red-700 text-red-200' :
              status.urgency === 'monitor' ? 'bg-yellow-900/30 border-yellow-700 text-yellow-200' :
              'bg-green-900/30 border-green-700 text-green-200'
            }`}>
              {status.actionRequired}
            </div>
          </div>
        )}

        {/* Key Insights */}
        {status.reasoning && status.reasoning.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Key Insights
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {status.reasoning.slice(0, 3).map((reason, index) => (
                <div key={index} className="text-xs text-gray-300 flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>{reason.replace(/📅|🎯|🏆|⚖️/g, '').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tooltip Arrow */}
        <div className="absolute -left-1 top-6 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45" />
      </div>
    </div>
  );
} 