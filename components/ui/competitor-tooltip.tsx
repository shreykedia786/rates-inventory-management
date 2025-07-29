/**
 * Competitor Tooltip Component
 * Enhanced competitive intelligence display for pricing cells
 * 
 * Features:
 * - Real-time competitor rates and availability
 * - Market positioning analysis with visual indicators
 * - Individual competitor breakdowns with trends
 * - Interactive tooltips with hover states
 * - Mobile-responsive design
 * 
 * Usage:
 * This component is integrated into the main pricing cells in app/page.tsx
 * It displays a dedicated competitor icon below each price with rich tooltip data
 */

import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export interface CompetitorInfo {
  name: string;
  rate: number;
  availability: number;
  distance: number;
  rating: number;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated?: Date;
  roomType?: string;
}

export interface CompetitorData {
  competitors: CompetitorInfo[];
  marketPosition: 'premium' | 'competitive' | 'value';
  priceAdvantage: number;
  averageRate?: number;
  lowestRate?: number;
  highestRate?: number;
  marketShare?: number;
}

export interface CompetitorTooltipData {
  indicator: 'higher' | 'lower' | 'competitive';
  details: CompetitorData;
}

/**
 * Competitor Icon Component
 * Displays a color-coded icon with competitor count below pricing cells
 * 
 * @param competitorData - Competitor information and metrics
 * @param indicator - Market position indicator (higher/lower/competitive)
 * @param onHover - Callback for tooltip display
 * @param onLeave - Callback for tooltip hide
 */
export const CompetitorIcon: React.FC<{
  competitorData: CompetitorData;
  indicator: 'higher' | 'lower' | 'competitive';
  onHover: (e: React.MouseEvent) => void;
  onLeave: () => void;
}> = ({ competitorData, indicator, onHover, onLeave }) => {
  const getIconStyles = () => {
    switch (indicator) {
      case 'higher':
        return {
          container: 'bg-emerald-100 dark:bg-emerald-900/30 group-hover/competitor:bg-emerald-200 dark:group-hover/competitor:bg-emerald-900/50',
          icon: 'text-emerald-600 dark:text-emerald-400',
          text: 'text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500'
        };
      case 'competitive':
        return {
          container: 'bg-yellow-100 dark:bg-yellow-900/30 group-hover/competitor:bg-yellow-200 dark:group-hover/competitor:bg-yellow-900/50',
          icon: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-yellow-700 dark:text-yellow-300',
          dot: 'bg-yellow-500'
        };
      default: // 'lower'
        return {
          container: 'bg-red-100 dark:bg-red-900/30 group-hover/competitor:bg-red-200 dark:group-hover/competitor:bg-red-900/50',
          icon: 'text-red-600 dark:text-red-400',
          text: 'text-red-700 dark:text-red-300',
          dot: 'bg-red-500'
        };
    }
  };

  const styles = getIconStyles();

  return (
    <div className="flex items-center justify-center mb-2">
      <div 
        className="tooltip-icon-area group/competitor cursor-pointer"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${styles.container}`}>
          <TrendingUp className={`w-3 h-3 ${styles.icon}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Competitor Tooltip Content
 * Rich tooltip displaying detailed competitor analysis
 * 
 * Features:
 * - Market position summary with visual indicators
 * - Rate range visualization
 * - Individual competitor cards with trends
 * - Real-time update timestamps
 * - Quick action buttons
 */
export const CompetitorTooltipContent: React.FC<{
  data: CompetitorTooltipData;
}> = ({ data }) => {
  const { indicator, details } = data;

  return (
    <div className="space-y-4 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Competitive Intelligence</h3>
          <p className="text-xs text-gray-300">Real-time market positioning & rates</p>
        </div>
      </div>

      {/* Market Position Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Market Position:</span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            indicator === 'higher' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' :
            indicator === 'competitive' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
            'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
          }`}>
            {indicator === 'higher' ? '🏆 PREMIUM' :
             indicator === 'competitive' ? '⚡ COMPETITIVE' : '💰 VALUE'}
          </span>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/5 rounded-md p-2 text-center">
            <div className="text-gray-400 text-xs mb-1">Price Advantage</div>
            <div className={`font-bold text-sm ${
              details.priceAdvantage > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {details.priceAdvantage > 0 ? '+' : ''}{details.priceAdvantage}%
            </div>
          </div>
          <div className="bg-white/5 rounded-md p-2 text-center">
            <div className="text-gray-400 text-xs mb-1">Market Share</div>
            <div className="text-blue-400 font-bold text-sm">{details.marketShare || 23}%</div>
          </div>
          <div className="bg-white/5 rounded-md p-2 text-center">
            <div className="text-gray-400 text-xs mb-1">Avg Rate</div>
            <div className="text-purple-400 font-bold text-sm">₹{details.averageRate || 425}</div>
          </div>
        </div>

        {/* Rate Range Visualization */}
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md border border-blue-500/20">
          <div className="text-center">
            <div className="text-xs text-gray-400">Lowest</div>
            <div className="text-emerald-400 font-semibold">₹{details.lowestRate || 385}</div>
          </div>
          <div className="flex-1 mx-3">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Highest</div>
            <div className="text-red-400 font-semibold">₹{details.highestRate || 485}</div>
          </div>
        </div>
      </div>

      {/* Individual Competitors */}
      {details.competitors && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
            <span className="text-xs font-medium text-cyan-300">Competitor Breakdown</span>
          </div>
          
          {details.competitors.slice(0, 4).map((competitor: CompetitorInfo, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    competitor.trend === 'up' ? 'bg-emerald-500' :
                    competitor.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-medium text-white text-sm">{competitor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold text-sm">₹{competitor.rate.toLocaleString()}</span>
                  {competitor.trend && (
                    <div className={`flex items-center ${
                      competitor.trend === 'up' ? 'text-emerald-400' :
                      competitor.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {competitor.trend === 'up' ? <ArrowUp className="w-3 h-3" /> :
                       competitor.trend === 'down' ? <ArrowDown className="w-3 h-3" /> :
                       <div className="w-3 h-0.5 bg-yellow-400 rounded"></div>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-400">Availability</div>
                  <div className={`font-medium ${competitor.availability > 70 ? 'text-emerald-400' : competitor.availability > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {competitor.availability}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Distance</div>
                  <div className="text-blue-400 font-medium">{competitor.distance}km</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Rating</div>
                  <div className="text-purple-400 font-medium">{competitor.rating}★</div>
                </div>
              </div>
              
              {competitor.lastUpdated && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="text-xs text-gray-400">
                    Updated {competitor.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Footer */}
      <div className="pt-3 border-t border-gray-200/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Last updated: 2 min ago</span>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            View Full Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitorTooltipContent; 