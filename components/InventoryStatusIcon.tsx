/**
 * Inventory Status Icon Component
 * Displays inventory status as icons with rich tooltips instead of text labels
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Activity,
  Zap
} from 'lucide-react';

export interface InventoryStatus {
  level: 'critical' | 'low' | 'optimal' | 'oversupply';
  displayText: string;
  colorClass: string;
  actionRequired?: string;
  reasoning: string[];
  urgency: 'immediate' | 'monitor' | 'stable';
  confidence: number;
  factors: {
    demandPace: number;
    competitorPosition: 'advantage' | 'disadvantage';
    eventImpact: 'none' | 'positive' | 'negative';
    seasonalTrend: 'peak' | 'shoulder' | 'off-peak';
  };
}

interface InventoryStatusIconProps {
  status: InventoryStatus;
  inventory: number;
  roomType: string;
  date: string;
  onHover?: (e: React.MouseEvent, tooltipData: any) => void;
  onHoverEnd?: () => void;
  className?: string;
}

const getStatusIconConfig = (status: InventoryStatus) => {
  switch (status.level) {
    case 'critical':
      return {
        Icon: AlertTriangle,
        bgColor: 'bg-red-100 dark:bg-red-900/40',
        borderColor: 'border-red-200 dark:border-red-700',
        iconColor: 'text-red-600 dark:text-red-400',
        pulseColor: 'bg-red-500',
        description: 'Sellout Risk',
        urgencyIndicator: true
      };
    case 'low':
      return {
        Icon: Clock,
        bgColor: 'bg-orange-100 dark:bg-orange-900/40',
        borderColor: 'border-orange-200 dark:border-orange-700',
        iconColor: 'text-orange-600 dark:text-orange-400',
        pulseColor: 'bg-orange-500',
        description: 'Slow Pace',
        urgencyIndicator: false
      };
    case 'optimal':
      return {
        Icon: CheckCircle,
        bgColor: 'bg-green-100 dark:bg-green-900/40',
        borderColor: 'border-green-200 dark:border-green-700',
        iconColor: 'text-green-600 dark:text-green-400',
        pulseColor: 'bg-green-500',
        description: 'Good Pace',
        urgencyIndicator: false
      };
    case 'oversupply':
      return {
        Icon: TrendingDown,
        bgColor: 'bg-purple-100 dark:bg-purple-900/40',
        borderColor: 'border-purple-200 dark:border-purple-700',
        iconColor: 'text-purple-600 dark:text-purple-400',
        pulseColor: 'bg-purple-500',
        description: 'Poor Demand',
        urgencyIndicator: false
      };
    default:
      return {
        Icon: Target,
        bgColor: 'bg-gray-100 dark:bg-gray-900/40',
        borderColor: 'border-gray-200 dark:border-gray-700',
        iconColor: 'text-gray-600 dark:text-gray-400',
        pulseColor: 'bg-gray-500',
        description: 'Unknown',
        urgencyIndicator: false
      };
  }
};

const getUrgencyIcon = (urgency: string) => {
  switch (urgency) {
    case 'immediate':
      return { Icon: Zap, color: 'text-red-500' };
    case 'monitor':
      return { Icon: Activity, color: 'text-yellow-500' };
    default:
      return { Icon: CheckCircle, color: 'text-green-500' };
  }
};

export default function InventoryStatusIcon({
  status,
  inventory,
  roomType,
  date,
  onHover,
  onHoverEnd,
  className = ''
}: InventoryStatusIconProps) {
  const config = getStatusIconConfig(status);
  const { Icon } = config;
  const urgencyConfig = getUrgencyIcon(status.urgency);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (onHover) {
      const tooltipData = {
        status,
        inventory,
        roomType,
        date,
        config
      };
      onHover(e, tooltipData);
    }
  };

  return (
    <div 
      className={`
        relative w-6 h-6 flex items-center justify-center rounded-full shadow-sm cursor-help 
        transition-all duration-200 hover:scale-110 hover:shadow-md border
        ${config.bgColor} ${config.borderColor} ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      title={`${config.description} - ${status.confidence}% confidence`}
      role="button"
      aria-label={`Inventory status: ${config.description}. ${status.actionRequired || ''}`}
      tabIndex={0}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      
      {/* Urgency indicator */}
      {config.urgencyIndicator && status.urgency === 'immediate' && (
        <div className={`absolute -top-1 -right-1 w-2 h-2 ${config.pulseColor} rounded-full animate-ping`} />
      )}
      
      {/* Confidence indicator */}
      {status.confidence < 70 && (
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full" 
             title={`${status.confidence}% confidence`} />
      )}
    </div>
  );
}

// Export the status icon config for use in legends
export { getStatusIconConfig, getUrgencyIcon }; 