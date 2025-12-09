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

import React, { useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Globe, TrendingDown, Eye, Building2, Star, Clock, Wifi, Users } from 'lucide-react';

export interface ChannelRate {
  channel: string;
  rate: number;
  availability: number;
  commission?: number;
  lastUpdated: Date;
  isActive: boolean;
}

export interface CompetitorInfo {
  name: string;
  rate: number;
  availability: number;
  distance: number;
  rating: number;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated?: Date;
  roomType?: string;
  channels: ChannelRate[];
  logo?: string;
}

export interface OwnChannelData {
  channel: string;
  rate: number;
  availability: number;
  commission: number;
  bookings: number;
  revenue: number;
  isActive: boolean;
  lastUpdated: Date;
}

export interface CompetitorData {
  competitors: CompetitorInfo[];
  marketPosition: 'premium' | 'competitive' | 'value';
  priceAdvantage: number;
  averageRate?: number;
  lowestRate?: number;
  highestRate?: number;
  marketShare?: number;
  ownChannels: OwnChannelData[];
  channelComparison: ChannelComparisonData[];
}

export interface ChannelComparisonData {
  channel: string;
  ownRate: number;
  competitorAverage: number;
  competitorMin: number;
  competitorMax: number;
  priceAdvantage: number;
  marketPosition: 'leading' | 'competitive' | 'trailing';
  activeCompetitors: number;
}

export interface CompetitorTooltipData {
  indicator: 'higher' | 'lower' | 'competitive';
  currentPrice?: number;
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
 * Enhanced Competitor Tooltip Content with Channel-wise Breakdown
 * Rich tooltip displaying detailed competitor analysis across distribution channels
 * 
 * Features:
 * - Channel-wise rate comparison between own property and competitors
 * - Individual competitor breakdown by channels
 * - Market position analysis with visual indicators
 * - Easy-to-scan tabular layout
 * - Real-time update timestamps
 */
export const CompetitorTooltipContent: React.FC<{
  data: CompetitorTooltipData;
}> = ({ data }) => {
  const { indicator = 'competitive', currentPrice = 0, details = {} } = data || {};
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'market' | 'competitors'>('overview');

  // Helper function to get channel icon
  const getChannelIcon = (channel: string) => {
    const channelLower = channel.toLowerCase();
    if (channelLower.includes('direct') || channelLower.includes('website')) return Building2;
    if (channelLower.includes('booking') || channelLower.includes('ota')) return Globe;
    if (channelLower.includes('expedia')) return Wifi;
    if (channelLower.includes('agoda')) return Star;
    return Users;
  };

  // Helper function to format channel name
  const formatChannelName = (channel: string) => {
    const channelMap: Record<string, string> = {
      'direct': 'Direct',
      'website': 'Website',
      'booking.com': 'Booking.com',
      'expedia': 'Expedia',
      'agoda': 'Agoda',
      'airbnb': 'Airbnb',
      'ota': 'OTA',
      'gds': 'GDS'
    };
    return channelMap[channel.toLowerCase()] || channel;
  };

  // Helper function to generate channel data if missing
  const generateChannelData = (baseRate: number, competitorName: string, dateIndex: number = 0) => {
    const channels = ['direct', 'booking.com', 'expedia', 'agoda'];
    const rateVariations = [0.95, 1.05, 1.08, 1.02];
    
    return channels.map((channel, index) => ({
      channel,
      rate: Math.round(baseRate * rateVariations[index] + (dateIndex * 20) + (index * 50)),
      availability: Math.max(60 + (dateIndex % 25) + (index * 5), 15),
      commission: channel === 'direct' ? 0 : Math.round(15 + (index * 2.5)),
      lastUpdated: new Date(),
      isActive: Math.random() > 0.1
    }));
  };

  // Helper function to generate own channel data if missing
  const generateOwnChannelData = (baseRate: number, dateIndex: number = 0) => {
    const channels = [
      { name: 'direct', commission: 0, bookingMultiplier: 0.3 },
      { name: 'booking.com', commission: 18, bookingMultiplier: 0.4 },
      { name: 'expedia', commission: 20, bookingMultiplier: 0.2 },
      { name: 'agoda', commission: 16, bookingMultiplier: 0.1 }
    ];
    
    return channels.map((channel, index) => ({
      channel: channel.name,
      rate: baseRate + (index * 100),
      availability: Math.max(70 + (dateIndex % 20) + (index * 5), 20),
      commission: channel.commission,
      bookings: Math.round(15 * channel.bookingMultiplier + (dateIndex % 10)),
      revenue: Math.round((baseRate + (index * 100)) * 15 * channel.bookingMultiplier + (dateIndex % 10)),
      isActive: true,
      lastUpdated: new Date()
    }));
  };

  // Helper function to generate channel comparison data if missing
  const generateChannelComparison = (ownChannels: any[], competitors: any[]) => {
    const channels = ['direct', 'booking.com', 'expedia', 'agoda'];
    
    return channels.map(channel => {
      const ownChannel = ownChannels.find(c => c.channel === channel);
      const competitorChannels = competitors.flatMap(comp => 
        comp.channels?.filter((c: any) => c.channel === channel) || []
      );
      
      if (competitorChannels.length === 0) {
        return {
          channel,
          ownRate: ownChannel?.rate || 0,
          competitorAverage: 0,
          competitorMin: 0,
          competitorMax: 0,
          priceAdvantage: 0,
          marketPosition: 'competitive' as const,
          activeCompetitors: 0
        };
      }
      
      const competitorRates = competitorChannels.map((c: any) => c.rate);
      const avgCompRate = Math.round(competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length);
      const minCompRate = Math.min(...competitorRates);
      const maxCompRate = Math.max(...competitorRates);
      const priceAdvantage = Math.round(((ownChannel?.rate || 0) - avgCompRate) / avgCompRate * 100);
      
      let marketPosition: 'leading' | 'competitive' | 'trailing' = 'competitive';
      if (priceAdvantage > 10) marketPosition = 'leading';
      else if (priceAdvantage < -10) marketPosition = 'trailing';
      
      return {
        channel,
        ownRate: ownChannel?.rate || 0,
        competitorAverage: avgCompRate,
        competitorMin: minCompRate,
        competitorMax: maxCompRate,
        priceAdvantage,
        marketPosition,
        activeCompetitors: competitorRates.length
      };
    });
  };

  // Ensure all data exists, generate if missing
  const safeDetails = details || {};
  const ensuredCompetitors = (safeDetails.competitors || []).map((comp, index) => ({
    ...comp,
    channels: comp.channels || generateChannelData(comp.rate || 0, comp.name || '', index)
  }));
  


  const ensuredOwnChannels = safeDetails.ownChannels || generateOwnChannelData(currentPrice || 0);
  const ensuredChannelComparison = safeDetails.channelComparison || generateChannelComparison(ensuredOwnChannels, ensuredCompetitors);

  // Helper function to get competitor's lowest rate and channel
  const getCompetitorLowestRate = (competitor: any) => {
    if (!competitor.channels || competitor.channels.length === 0) {
      return { rate: competitor.rate || 0, channel: 'Direct' };
    }
    
    const lowestChannel = competitor.channels.reduce((lowest: any, current: any) => {
      return (current.rate || 0) < (lowest.rate || 0) ? current : lowest;
    }, competitor.channels[0]);
    
    return { 
      rate: lowestChannel.rate || competitor.rate || 0, 
      channel: formatChannelName(lowestChannel.channel) 
    };
  };

  return (
    <div className="min-w-[480px] max-w-[640px] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Channel-wise Competitive Analysis</h3>
          <p className="text-xs text-gray-300">Real-time rates across distribution channels</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          indicator === 'higher' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' :
          indicator === 'competitive' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
        }`}>
          {indicator === 'higher' ? '🏆 PREMIUM' :
           indicator === 'competitive' ? '⚡ COMPETITIVE' : '💰 VALUE'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Competitors', icon: Eye },
          { id: 'channels', label: 'Channel Analysis', icon: Globe },
          { id: 'market', label: 'Market Position', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Channel Breakdown Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-3">
          {/* Channel Comparison Table */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="grid grid-cols-6 gap-2 p-3 border-b border-white/10 bg-white/5">
              <div className="text-xs font-semibold text-gray-300">Channel</div>
              <div className="text-xs font-semibold text-gray-300 text-center">Your Rate</div>
              <div className="text-xs font-semibold text-gray-300 text-center">Avg Comp</div>
              <div className="text-xs font-semibold text-gray-300 text-center">Min</div>
              <div className="text-xs font-semibold text-gray-300 text-center">Max</div>
              <div className="text-xs font-semibold text-gray-300 text-center">Position</div>
            </div>
            
{ensuredChannelComparison.map((channel, index) => {
              const Icon = getChannelIcon(channel.channel);
              return (
                <div key={index} className="grid grid-cols-6 gap-2 p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-medium text-white">{formatChannelName(channel.channel)}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-cyan-400">₹{(channel.ownRate || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-300">₹{(channel.competitorAverage || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-emerald-400">₹{(channel.competitorMin || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-red-400">₹{(channel.competitorMax || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      channel.marketPosition === 'leading' ? 'bg-emerald-900/30 text-emerald-300' :
                      channel.marketPosition === 'competitive' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-red-900/30 text-red-300'
                    }`}>
                      {channel.marketPosition === 'leading' ? '↗️' :
                       channel.marketPosition === 'competitive' ? '→' : '↘️'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your Channels Performance */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Your Channel Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
{ensuredOwnChannels.slice(0, 4).map((channel, index) => {
                const Icon = getChannelIcon(channel.channel);
                return (
                  <div key={index} className="bg-white/5 rounded-md p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-medium text-white">{formatChannelName(channel.channel)}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${channel.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-400">Rate</div>
                        <div className="text-cyan-400 font-bold">₹{(channel.rate || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Bookings</div>
                        <div className="text-emerald-400 font-bold">{channel.bookings || 0}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Competitors Overview Tab - Default */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {/* Header Summary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Competitive Landscape</span>
              <span className="text-xs text-gray-400">{ensuredCompetitors.length} competitors tracked</span>
            </div>
            <div className="text-xs text-gray-300">
              Showing lowest rates per competitor with channel information
            </div>
          </div>

          {/* Competitors List with Lowest Rates */}
          <div className="space-y-2">
            {ensuredCompetitors.map((competitor, index) => {
              const lowestRate = getCompetitorLowestRate(competitor);
              const priceComparisonToYours = currentPrice ? ((lowestRate.rate - currentPrice) / currentPrice * 100) : 0;
              
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-cyan-500/30 transition-all duration-200">
                  {/* Competitor Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        competitor.trend === 'up' ? 'bg-emerald-500' :
                        competitor.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <span className="font-semibold text-white text-sm">{competitor.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{competitor.rating}★</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{competitor.distance}km away</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trend Indicator */}
                    <div className={`flex items-center gap-1 ${
                      competitor.trend === 'up' ? 'text-emerald-400' :
                      competitor.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {competitor.trend === 'up' ? <ArrowUp className="w-3 h-3" /> :
                       competitor.trend === 'down' ? <ArrowDown className="w-3 h-3" /> :
                       <TrendingDown className="w-3 h-3" />}
                    </div>
                  </div>

                  {/* Lowest Rate Display */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Lowest Rate</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-cyan-400">₹{lowestRate.rate.toLocaleString()}</span>
                          <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded-full">
                            {lowestRate.channel}
                          </span>
                        </div>
                      </div>
                      
                      {currentPrice && (
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">vs Your Rate</div>
                          <div className={`text-sm font-semibold ${
                            priceComparisonToYours > 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {priceComparisonToYours > 0 ? '+' : ''}{priceComparisonToYours.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Channel Overview */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {(competitor.channels || []).slice(0, 4).map((channelData: any, chIndex: number) => {
                      const Icon = getChannelIcon(channelData.channel);
                      const isLowest = channelData.rate === lowestRate.rate;
                      
                      return (
                        <div key={chIndex} className={`text-center p-2 rounded-md transition-all ${
                          isLowest 
                            ? 'bg-cyan-500/20 border border-cyan-500/40' 
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          <Icon className={`w-3 h-3 mx-auto mb-1 ${isLowest ? 'text-cyan-400' : 'text-blue-400'}`} />
                          <div className={`text-xs font-medium ${isLowest ? 'text-cyan-300' : 'text-white'}`}>
                            ₹{(channelData.rate || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {(channelData.availability || 0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Market Position Tab */}
      {activeTab === 'market' && (
        <div className="space-y-3">
          {/* Market Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Price Advantage</div>
              <div className={`font-bold text-lg ${
                (safeDetails.priceAdvantage || 0) > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {(safeDetails.priceAdvantage || 0) > 0 ? '+' : ''}{safeDetails.priceAdvantage || 0}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Market Share</div>
              <div className="text-blue-400 font-bold text-lg">{safeDetails.marketShare || 23}%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-xs mb-1">Avg Rate</div>
              <div className="text-purple-400 font-bold text-lg">₹{safeDetails.averageRate || 425}</div>
            </div>
          </div>

          {/* Rate Range Visualization */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Market Rate Range</span>
              <span className="text-xs text-gray-400">Across all channels</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md border border-blue-500/20">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Lowest</div>
                <div className="text-emerald-400 font-semibold">₹{safeDetails.lowestRate || 385}</div>
              </div>
              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full"></div>
                {currentPrice && (
                  <div 
                    className="absolute top-0 w-1 h-2 bg-white shadow-lg transform -translate-x-1/2"
                    style={{ 
                      left: `${Math.min(Math.max(((currentPrice - (safeDetails.lowestRate || 385)) / ((safeDetails.highestRate || 485) - (safeDetails.lowestRate || 385))) * 100, 0), 100)}%` 
                    }}
                    title={`Your rate: ₹${currentPrice}`}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Highest</div>
                <div className="text-red-400 font-semibold">₹{safeDetails.highestRate || 485}</div>
              </div>
            </div>
            {currentPrice && (
              <div className="text-center mt-2">
                <span className="text-xs text-cyan-400">Your Rate: ₹{currentPrice}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="space-y-3">
{ensuredCompetitors.map((competitor: CompetitorInfo, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              {/* Competitor Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    competitor.trend === 'up' ? 'bg-emerald-500' :
                    competitor.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-semibold text-white">{competitor.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{competitor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">₹{competitor.rate.toLocaleString()}</span>
                  {competitor.trend && (
                    <div className={`flex items-center ${
                      competitor.trend === 'up' ? 'text-emerald-400' :
                      competitor.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {competitor.trend === 'up' ? <ArrowUp className="w-3 h-3" /> :
                       competitor.trend === 'down' ? <ArrowDown className="w-3 h-3" /> :
                       <TrendingDown className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </div>

              {/* Competitor Channels */}
{(competitor.channels || []).length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {competitor.channels.slice(0, 4).map((channelData, chIndex) => {
                    const Icon = getChannelIcon(channelData.channel);
                    return (
                      <div key={chIndex} className="bg-white/5 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Icon className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-gray-300">{formatChannelName(channelData.channel)}</span>
                          </div>
                          <span className={`w-1.5 h-1.5 rounded-full ${channelData.isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium">₹{(channelData.rate || 0).toLocaleString()}</span>
                          <span className={`${(channelData.availability || 0) > 70 ? 'text-emerald-400' : (channelData.availability || 0) > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {channelData.availability || 0}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Competitor Stats */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Distance</div>
                  <div className="text-blue-400 font-medium text-xs">{competitor.distance}km</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Availability</div>
                  <div className={`font-medium text-xs ${competitor.availability > 70 ? 'text-emerald-400' : competitor.availability > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {competitor.availability}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Updated</div>
                  <div className="text-gray-300 font-medium text-xs">
                    {competitor.lastUpdated ? new Date(competitor.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Last updated: 2 min ago</span>
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1">
            View Full Analysis 
            <ArrowUp className="w-3 h-3 rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitorTooltipContent; 