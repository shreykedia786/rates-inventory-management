/**
 * MainPageFixes - Collection of components and utilities for the main page
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Package
} from 'lucide-react';

// Interface for Smart Inventory Status
interface SmartInventoryStatus {
  level: 'critical' | 'low' | 'optimal' | 'oversupply';
  reasoning: string[];
  urgency: 'immediate' | 'monitor' | 'routine';
  confidence: number;
  factors: {
    demandPace: number;
    competitorPosition: 'advantage' | 'parity' | 'disadvantage';
    eventImpact: 'none' | 'positive' | 'negative';
    seasonalTrend: 'peak' | 'shoulder' | 'valley';
  };
  displayText: string;
  colorClass: string;
  actionRequired?: string;
}

// Props for InventoryStatusIconInline
interface InventoryStatusIconInlineProps {
  status: SmartInventoryStatus;
  inventory: number;
  onMouseEnter?: (e: React.MouseEvent, tooltipData: any) => void;
  onMouseLeave?: () => void;
  className?: string;
}

// Inline inventory status icon component
export function InventoryStatusIconInline({
  status,
  inventory,
  onMouseEnter,
  onMouseLeave,
  className = ''
}: InventoryStatusIconInlineProps) {
  const getStatusConfig = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          Icon: AlertTriangle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        };
      case 'low':
        return {
          Icon: Clock,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30'
        };
      case 'optimal':
        return {
          Icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        };
      case 'oversupply':
        return {
          Icon: TrendingDown,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        };
      default:
        return {
          Icon: Package,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30'
        };
    }
  };

  const config = getStatusConfig(status.level);
  const { Icon } = config;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (onMouseEnter) {
      const tooltipData = {
        status,
        inventory,
        config
      };
      onMouseEnter(e, tooltipData);
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-1 cursor-help ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      title={`${status.displayText} - ${status.confidence}% confidence`}
    >
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className="text-xs font-medium">{inventory}</span>
      {status.urgency === 'immediate' && (
        <div className="w-1 h-1 bg-red-500 rounded-full animate-ping ml-1" />
      )}
    </div>
  );
}

// Competitor data interface
interface CompetitorData {
  competitors: Array<{
    name: string;
    rate: number;
    availability: number;
    distance: number;
    rating: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  marketPosition: 'premium' | 'competitive' | 'value';
  priceAdvantage: number;
  averageRate?: number;
  marketShare?: number;
}

// Fixed competitor data function
export function getFixedCompetitorData(baseRate: number): CompetitorData {
  return {
    competitors: [
      {
        name: 'Grand Plaza Hotel',
        rate: Math.round(baseRate * 0.95),
        availability: 65,
        distance: 0.8,
        rating: 4.2,
        trend: 'stable' as const
      },
      {
        name: 'City Center Inn',
        rate: Math.round(baseRate * 0.88),
        availability: 78,
        distance: 1.2,
        rating: 3.9,
        trend: 'down' as const
      },
      {
        name: 'Business Hotel',
        rate: Math.round(baseRate * 1.1),
        availability: 45,
        distance: 0.6,
        rating: 4.0,
        trend: 'stable' as const
      },
      {
        name: 'Luxury Suites',
        rate: Math.round(baseRate * 1.25),
        availability: 30,
        distance: 1.5,
        rating: 4.5,
        trend: 'up' as const
      }
    ],
    marketPosition: 'competitive' as const,
    priceAdvantage: 5,
    averageRate: Math.round(baseRate * 1.02),
    marketShare: 23
  };
}

// Export the components and utilities
export default { InventoryStatusIconInline, getFixedCompetitorData }; 