import React from 'react';
import { X, Filter, Home, CreditCard, DollarSign, Calendar, AlertTriangle, TrendingUp, Target, Sparkles } from 'lucide-react';

export interface FilterState {
  roomTypes: string[];
  productTypes: string[];
  priceRange: { min: number; max: number };
  dateRange: { start: string; end: string };
  hasRestrictions: boolean;
  hasAIInsights: boolean;
  hasEvents: boolean;
  riskLevel: string[];
  competitorPosition: string[];
  confidenceRange: { min: number; max: number };
}

interface FilterChipsProps {
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  roomTypeNames: Record<string, string>; // id -> name mapping
  ratePlanNames: Record<string, string>; // id -> name mapping
  onClearAll: () => void;
  isDark?: boolean;
}

/**
 * Filter Chips Component
 * 
 * Displays active filters as removable chips below the main toolbar.
 * Provides quick visibility and easy removal of applied filters.
 * Follows modern enterprise UX patterns with proper visual hierarchy.
 */
export function FilterChips({
  filters,
  setFilters,
  roomTypeNames,
  ratePlanNames,
  onClearAll,
  isDark = false
}: FilterChipsProps) {
  const chips: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    type: 'room' | 'rate' | 'price' | 'date' | 'boolean' | 'risk' | 'competitor' | 'confidence';
    color: string;
    onRemove: () => void;
  }> = [];

  // Room Type Chips
  filters.roomTypes.forEach(roomTypeId => {
    const roomName = roomTypeNames[roomTypeId] || roomTypeId;
    chips.push({
      id: `room-${roomTypeId}`,
      label: roomName,
      icon: <Home className="w-3 h-3" />,
      type: 'room',
      color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        roomTypes: prev.roomTypes.filter(id => id !== roomTypeId) 
      }))
    });
  });

  // Rate Plan Chips
  filters.productTypes.forEach(ratePlanId => {
    const rateName = ratePlanNames[ratePlanId] || ratePlanId;
    chips.push({
      id: `rate-${ratePlanId}`,
      label: rateName,
      icon: <CreditCard className="w-3 h-3" />,
      type: 'rate',
      color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        productTypes: prev.productTypes.filter(id => id !== ratePlanId) 
      }))
    });
  });

  // Price Range Chip
  if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) {
    chips.push({
      id: 'price-range',
      label: `₹${filters.priceRange.min.toLocaleString()} - ₹${filters.priceRange.max.toLocaleString()}`,
      icon: <DollarSign className="w-3 h-3" />,
      type: 'price',
      color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        priceRange: { min: 0, max: 50000 } 
      }))
    });
  }

  // Date Range Chip
  if (filters.dateRange.start || filters.dateRange.end) {
    const dateLabel = filters.dateRange.start && filters.dateRange.end 
      ? `${new Date(filters.dateRange.start).toLocaleDateString()} - ${new Date(filters.dateRange.end).toLocaleDateString()}`
      : filters.dateRange.start 
        ? `From ${new Date(filters.dateRange.start).toLocaleDateString()}`
        : `Until ${new Date(filters.dateRange.end).toLocaleDateString()}`;
    
    chips.push({
      id: 'date-range',
      label: dateLabel,
      icon: <Calendar className="w-3 h-3" />,
      type: 'date',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        dateRange: { start: '', end: '' } 
      }))
    });
  }

  // Boolean Filter Chips
  if (filters.hasRestrictions) {
    chips.push({
      id: 'has-restrictions',
      label: 'Has Restrictions',
      icon: <span className="text-xs">🚫</span>,
      type: 'boolean',
      color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
      onRemove: () => setFilters(prev => ({ ...prev, hasRestrictions: false }))
    });
  }

  if (filters.hasAIInsights) {
    chips.push({
      id: 'has-ai-insights',
      label: 'Has AI Insights',
      icon: <Sparkles className="w-3 h-3" />,
      type: 'boolean',
      color: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700',
      onRemove: () => setFilters(prev => ({ ...prev, hasAIInsights: false }))
    });
  }

  if (filters.hasEvents) {
    chips.push({
      id: 'has-events',
      label: 'Has Events',
      icon: <span className="text-xs">📅</span>,
      type: 'boolean',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700',
      onRemove: () => setFilters(prev => ({ ...prev, hasEvents: false }))
    });
  }

  // Risk Level Chips
  filters.riskLevel.forEach(risk => {
    chips.push({
      id: `risk-${risk}`,
      label: `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`,
      icon: <AlertTriangle className="w-3 h-3" />,
      type: 'risk',
      color: risk === 'high' 
        ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700'
        : risk === 'medium'
        ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700'
        : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        riskLevel: prev.riskLevel.filter(r => r !== risk) 
      }))
    });
  });

  // Competitor Position Chips
  filters.competitorPosition.forEach(position => {
    chips.push({
      id: `competitor-${position}`,
      label: `${position.charAt(0).toUpperCase() + position.slice(1)} vs Competitors`,
      icon: <TrendingUp className="w-3 h-3" />,
      type: 'competitor',
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        competitorPosition: prev.competitorPosition.filter(p => p !== position) 
      }))
    });
  });

  // Confidence Range Chip
  if (filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) {
    chips.push({
      id: 'confidence-range',
      label: `Confidence: ${filters.confidenceRange.min}% - ${filters.confidenceRange.max}%`,
      icon: <Target className="w-3 h-3" />,
      type: 'confidence',
      color: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-700',
      onRemove: () => setFilters(prev => ({ 
        ...prev, 
        confidenceRange: { min: 0, max: 100 } 
      }))
    });
  }

  // If no chips, don't render anything
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={`px-6 py-3 border-b ${
      isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
    }`}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter Icon and Label */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Active Filters:</span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map((chip) => (
            <div
              key={chip.id}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:shadow-sm ${chip.color}`}
            >
              {chip.icon}
              <span className="max-w-32 truncate">{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Clear All Button */}
        {chips.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium whitespace-nowrap ml-2"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
} 