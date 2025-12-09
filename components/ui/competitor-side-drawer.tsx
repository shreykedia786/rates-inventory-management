import React, { useState, useRef, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Star, MapPin, Clock, ArrowUpDown, Search, Filter, ChevronDown, Lightbulb, Brain, Target, Zap, DollarSign, AlertTriangle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// Extended channel list with 20+ real channels
const CHANNELS = [
  'Direct Website', 'Booking.com', 'Expedia', 'Agoda', 'Hotels.com', 'Priceline', 
  'Kayak', 'Trivago', 'TripAdvisor', 'Google Hotel Ads', 'Airbnb', 'Vrbo',
  'Sabre GDS', 'Amadeus GDS', 'Travelport GDS', 'HRS', 'Lastminute.com',
  'Otel.com', 'eDreams', 'Opodo', 'GoToGate', 'Travelocity', 'Orbitz', 'CheapTickets'
];

interface CompetitorChannelRate {
  channel: string;
  rate: number;
  availability: number;
  commission: number;
  lastUpdated: Date;
  isActive: boolean;
  bookingPace?: 'fast' | 'moderate' | 'slow';
}

interface UserChannelRate {
  channel: string;
  rate: number;
  availability: number;
  commission: number;
  revenue: number;
  bookings: number;
  isActive: boolean;
  lastUpdated?: Date;
}

interface CompetitorInfo {
  name: string;
  rate: number;
  rating: number;
  distance: number;
  trend: 'up' | 'down' | 'stable';
  rooms?: number;
  brand?: string;
  marketShare?: number;
  avgDailyRate?: number;
  occupancyRate?: number;
  channels?: CompetitorChannelRate[];
}

interface CompetitorSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  competitors: CompetitorInfo[];
  userChannels: UserChannelRate[];
  currentDate: string;
  roomType: string;
  currentPrice?: number;
  onDateNavigate?: (direction: 'prev' | 'next') => void;
}

export const CompetitorSideDrawer: React.FC<CompetitorSideDrawerProps> = ({
  isOpen,
  onClose,
  competitors,
  userChannels,
  currentDate,
  roomType,
  currentPrice,
  onDateNavigate
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'competitors' | 'ai-insights'>('competitors');
  const [sortBy, setSortBy] = useState<'rate' | 'rating' | 'distance'>('rate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['all']);
  const [isChannelFilterOpen, setIsChannelFilterOpen] = useState(false);
  
  const [currentScrollLeft, setCurrentScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const userRatesScrollRef = useRef<HTMLDivElement>(null);
  const competitorScrollRefs = useRef<HTMLDivElement[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    competitorScrollRefs.current = competitorScrollRefs.current.slice(0, 5);
  }, []);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.channel-filter-dropdown')) {
        setIsChannelFilterOpen(false);
      }
    };

    if (isChannelFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChannelFilterOpen]);

  const generateChannelData = (baseRate: number, competitorName: string): CompetitorChannelRate[] => {
    return CHANNELS.map((channel, index) => {
      const rateVariation = 0.85 + (Math.random() * 0.3);
      const commissionRate = channel === 'Direct Website' ? 0 : 
                           channel.includes('GDS') ? 8 + Math.random() * 4 :
                           10 + Math.random() * 15;
      
      // Generate realistic scraping timestamps - different channels update at different frequencies
      const getScrapingTimestamp = (channelName: string) => {
        const now = new Date();
        let minutesAgo = 0;
        
        // Different channels have different update frequencies
        if (channelName === 'Direct Website') {
          minutesAgo = Math.random() * 15; // Very fresh, 0-15 minutes
        } else if (channelName.includes('Booking.com') || channelName.includes('Expedia')) {
          minutesAgo = Math.random() * 45 + 5; // 5-50 minutes ago
        } else if (channelName.includes('GDS')) {
          minutesAgo = Math.random() * 90 + 30; // 30-120 minutes ago
        } else if (channelName.includes('Agoda') || channelName.includes('Hotels.com')) {
          minutesAgo = Math.random() * 60 + 10; // 10-70 minutes ago
        } else {
          minutesAgo = Math.random() * 120 + 20; // 20-140 minutes ago for others
        }
        
        return new Date(now.getTime() - (minutesAgo * 60 * 1000));
      };
      
      // Determine if channel should be inactive based on realistic scenarios
      const shouldBeInactive = () => {
        // Some smaller competitors might not be on all channels
        if (channel.includes('Google Hotel Ads') || channel.includes('Trivago')) {
          return Math.random() > 0.9; // 10% chance of being inactive (rare)
        }
        // Some niche channels might have lower adoption
        if (channel.includes('GoToGate') || channel.includes('CheapTickets') || channel.includes('Otel.com')) {
          return Math.random() > 0.85; // 15% chance of being inactive
        }
        // Major channels are almost always active
        if (channel.includes('Booking.com') || channel.includes('Expedia') || channel === 'Direct Website') {
          return Math.random() > 0.98; // 2% chance of being inactive (very rare)
        }
        // Other channels have moderate chance
        return Math.random() > 0.95; // 5% chance of being inactive
      };

      const isChannelActive = !shouldBeInactive();
      const channelRate = isChannelActive ? Math.round(baseRate * rateVariation) : 0;
      const channelAvailability = isChannelActive ? Math.max(0, Math.round(50 + Math.random() * 50)) : 0;
      
      return {
        channel,
        rate: channelRate,
        availability: channelAvailability,
        commission: Math.round(commissionRate),
        lastUpdated: getScrapingTimestamp(channel),
        isActive: isChannelActive,
        bookingPace: isChannelActive ? (Math.random() > 0.7 ? 'fast' : Math.random() > 0.4 ? 'moderate' : 'slow') : undefined
      };
    });
  };

  const generateUserChannelData = (basePriceFromCell?: number): UserChannelRate[] => {
    const baseRate = basePriceFromCell || 8500;
    return CHANNELS.map((channel, index) => {
      const rateVariation = channel === 'Direct Website' ? 1.0 : 0.9 + (Math.random() * 0.2);
      const commissionRate = channel === 'Direct Website' ? 0 : 
                           channel.includes('GDS') ? 9 :
                           12 + Math.random() * 8;
      
      // Generate realistic last updated times for user channels (usually very recent)
      const getUserTimestamp = (channelName: string) => {
        const now = new Date();
        let minutesAgo = 0;
        
        if (channelName === 'Direct Website') {
          minutesAgo = Math.random() * 5; // Very fresh, 0-5 minutes
        } else {
          minutesAgo = Math.random() * 30; // 0-30 minutes ago for other channels
        }
        
        return new Date(now.getTime() - (minutesAgo * 60 * 1000));
      };
      
      return {
        channel,
        rate: Math.round(baseRate * rateVariation),
        availability: Math.max(5, Math.round(75 + Math.random() * 25)),
        commission: Math.round(commissionRate),
        revenue: Math.round(5000 + Math.random() * 15000),
        bookings: Math.round(5 + Math.random() * 20),
        isActive: true, // User channels are always active
        lastUpdated: getUserTimestamp(channel)
      };
    });
  };

  const ensureMinimumCompetitors = (comps: CompetitorInfo[]): CompetitorInfo[] => {
    const additionalCompetitors: CompetitorInfo[] = [
      {
        name: 'Grand Plaza Hotel',
        rate: 9200,
        rating: 4.5,
        distance: 1.2,
        trend: 'up' as const,
        brand: 'Grand Hotels'
      },
      {
        name: 'City Center Marriott',
        rate: 8950,
        rating: 4.6,
        distance: 0.8,
        trend: 'stable' as const,
        brand: 'Marriott'
      },
      {
        name: 'Hilton Garden Inn',
        rate: 8750,
        rating: 4.3,
        distance: 2.1,
        trend: 'down' as const,
        brand: 'Hilton'
      },
      {
        name: 'Hyatt Regency',
        rate: 9500,
        rating: 4.7,
        distance: 1.5,
        trend: 'up' as const,
        brand: 'Hyatt'
      },
      {
        name: 'InterContinental',
        rate: 10200,
        rating: 4.8,
        distance: 0.5,
        trend: 'stable' as const,
        brand: 'IHG'
      }
    ];
    
    const totalNeeded = Math.max(5, comps.length);
    const allCompetitors = [...comps];
    
    while (allCompetitors.length < totalNeeded) {
      allCompetitors.push(additionalCompetitors[allCompetitors.length % additionalCompetitors.length]);
    }
    
    return allCompetitors;
  };

  const baseCompetitors = ensureMinimumCompetitors(competitors);
  const enhancedCompetitors = baseCompetitors.map(comp => ({
    ...comp,
    channels: generateChannelData(comp.rate, comp.name)
  }));

  const userChannelData = userChannels.length > 0 ? userChannels : generateUserChannelData(currentPrice);

  const getCompetitorCheapestRate = (competitor: any) => {
    if (!competitor.channels || competitor.channels.length === 0) {
      return { rate: competitor.rate, channel: 'Direct Website' };
    }
    
    // Use filtered channels for cheapest rate calculation, but only include active channels
    const filteredChannels = getFilteredChannels(competitor.channels).filter(ch => ch.isActive && ch.rate > 0);
    if (filteredChannels.length === 0) {
      return { rate: competitor.rate, channel: 'No Active Channels' };
    }
    
    const cheapestChannel = filteredChannels.reduce((cheapest: any, current: any) => {
      return current.rate < cheapest.rate ? current : cheapest;
    });
    
    return {
      rate: cheapestChannel.rate,
      channel: cheapestChannel.channel
    };
  };

  const getUserCheapestRate = () => {
    if (!userChannelData || userChannelData.length === 0) {
      return { rate: currentPrice || 8500, channel: 'Direct Website' };
    }
    
    // Use filtered channels for cheapest rate calculation, only include active channels
    const filteredChannels = getFilteredUserChannels(userChannelData).filter(ch => ch.isActive && ch.rate > 0);
    if (filteredChannels.length === 0) {
      return { rate: currentPrice || 8500, channel: 'No Active Channels' };
    }
    
    const cheapestChannel = filteredChannels.reduce((cheapest, current) => {
      return current.rate < cheapest.rate ? current : cheapest;
    });
    
    return {
      rate: cheapestChannel.rate,
      channel: cheapestChannel.channel
    };
  };

  const filteredCompetitors = enhancedCompetitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competitor.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChannel = selectedChannels.includes('all') || 
                          selectedChannels.some(selectedChannel => 
                            competitor.channels.some((ch: any) => ch.channel === selectedChannel)
                          );
    
    return matchesSearch && matchesChannel;
  });

  const sortedCompetitors = [...filteredCompetitors].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'rate':
        return (a.rate - b.rate) * multiplier;
      case 'rating':
        return (a.rating - b.rating) * multiplier;
      case 'distance':
        return (a.distance - b.distance) * multiplier;
      default:
        return 0;
    }
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      default: return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getPaceColor = (pace?: string) => {
    switch (pace) {
      case 'fast': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'slow': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to format scraping timestamps
  const formatScrapingTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ${diffMinutes % 60}m ago`;
    } else {
      return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  };

  // Helper function to get freshness indicator color
  const getFreshnessColor = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 30) {
      return 'text-green-600 bg-green-100'; // Very fresh
    } else if (diffMinutes < 90) {
      return 'text-yellow-600 bg-yellow-100'; // Moderately fresh
    } else {
      return 'text-red-600 bg-red-100'; // Stale
    }
  };

  // Helper function to get freshness status
  const getFreshnessStatus = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 30) {
      return { status: 'Fresh', icon: '🟢' };
    } else if (diffMinutes < 90) {
      return { status: 'Recent', icon: '🟡' };
    } else {
      return { status: 'Stale', icon: '🔴' };
    }
  };

  const syncScrollPositions = (scrollLeft: number, sourceRef?: HTMLDivElement) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    setCurrentScrollLeft(scrollLeft);
    
    // Use requestAnimationFrame for smoother synchronization
    requestAnimationFrame(() => {
    if (userRatesScrollRef.current && userRatesScrollRef.current !== sourceRef) {
      userRatesScrollRef.current.scrollLeft = scrollLeft;
    }
    
    competitorScrollRefs.current.forEach((ref) => {
      if (ref && ref !== sourceRef) {
        ref.scrollLeft = scrollLeft;
      }
    });
    
      // Reset scrolling flag after a brief delay
      setTimeout(() => setIsScrolling(false), 50);
    });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>, sourceRef: HTMLDivElement) => {
    if (isScrolling) return;
    const scrollLeft = event.currentTarget.scrollLeft;
    
    // Debounce scroll events to reduce frequency
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
    syncScrollPositions(scrollLeft, sourceRef);
    }, 16); // ~60fps
  };

  // Handle channel filter selection
  const handleChannelToggle = (channel: string) => {
    if (channel === 'all') {
      setSelectedChannels(['all']);
    } else {
      setSelectedChannels(prev => {
        const withoutAll = prev.filter(ch => ch !== 'all');
        if (withoutAll.includes(channel)) {
          // Remove channel
          const newSelection = withoutAll.filter(ch => ch !== channel);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          // Add channel
          return [...withoutAll, channel];
        }
      });
    }
  };

  const getSelectedChannelText = () => {
    if (selectedChannels.includes('all')) {
      return 'All Channels';
    }
    if (selectedChannels.length === 1) {
      return selectedChannels[0];
    }
    return `${selectedChannels.length} Channels`;
  };

  // Generate AI-powered recommendations based on competitor data analysis
  const getAIRecommendations = () => {
    const userLowestRate = getUserCheapestRate().rate;
    const userChannel = getUserCheapestRate().channel;
    const competitorRates = sortedCompetitors.map(comp => getCompetitorCheapestRate(comp).rate);
    const avgCompetitorRate = competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length;
    const lowestCompetitorRate = Math.min(...competitorRates);
    const highestCompetitorRate = Math.max(...competitorRates);
    const rateSpread = highestCompetitorRate - lowestCompetitorRate;

    const recommendations = [];

    // AI Pricing Strategy Analysis
    if (userLowestRate < lowestCompetitorRate) {
      const potentialIncrease = Math.round(lowestCompetitorRate - userLowestRate);
      const confidence = potentialIncrease > 500 ? 92 : 78;
      recommendations.push({
        title: 'Revenue Optimization Opportunity',
        analysis: `AI analysis shows you're underpricing by ₹${potentialIncrease} compared to all competitors. Market conditions indicate strong pricing power with minimal demand elasticity risk.`,
        action: `Increase rates by ₹${Math.round(potentialIncrease * 0.7)} (70% of gap) over next 2 weeks to capture additional revenue while maintaining competitiveness.`,
        confidence,
        icon: <TrendingUp className="w-4 h-4 text-green-600" />
      });
    } else if (userLowestRate > avgCompetitorRate * 1.15) {
      recommendations.push({
        title: 'Premium Position Risk Alert',
        analysis: `Your rates are ${Math.round(((userLowestRate / avgCompetitorRate - 1) * 100))}% above market average. AI predicts potential booking volume decline if sustained without value differentiation.`,
        action: `Consider rate adjustment to within 10% of market average (₹${Math.round(avgCompetitorRate * 1.1).toLocaleString()}) or enhance value proposition messaging.`,
        confidence: 84,
        icon: <Target className="w-4 h-4 text-amber-600" />
      });
    }

    // Channel Performance Analysis
    const directWebsiteRate = userChannelData.find(ch => ch.channel === 'Direct Website')?.rate;
    const bookingComRate = userChannelData.find(ch => ch.channel === 'Booking.com')?.rate;
    
    if (directWebsiteRate && bookingComRate && directWebsiteRate >= bookingComRate) {
      recommendations.push({
        title: 'Channel Parity Strategy Issue',
        analysis: `AI detects rate parity violation: Direct website (₹${directWebsiteRate.toLocaleString()}) rates same/higher than OTA rates. This reduces direct booking incentive and commission optimization.`,
        action: `Reduce direct website rate by ₹200-400 to incentivize direct bookings and improve profit margins by avoiding OTA commissions.`,
        confidence: 88,
        icon: <Zap className="w-4 h-4 text-purple-600" />
      });
    }

    // Market Volatility Insights
    if (rateSpread > 1500) {
      recommendations.push({
        title: 'Dynamic Pricing Opportunity',
        analysis: `High market volatility detected (₹${Math.round(rateSpread)} spread). AI identifies optimal pricing windows for revenue maximization through strategic rate adjustments.`,
        action: `Implement dynamic pricing with ±₹300 daily adjustments based on competitor movements and demand signals.`,
        confidence: 76,
        icon: <DollarSign className="w-4 h-4 text-indigo-600" />
      });
    }

    // Competitor Weakness Analysis
    const weakCompetitors = sortedCompetitors.filter(comp => {
      const compRate = getCompetitorCheapestRate(comp).rate;
      return compRate > userLowestRate * 1.2;
    });

    if (weakCompetitors.length > 0) {
      recommendations.push({
        title: 'Market Share Capture Opportunity',
        analysis: `AI identifies ${weakCompetitors.length} competitors with rates 20%+ above yours. Their high pricing creates market share capture opportunity through strategic positioning.`,
        action: `Target their guest segments with focused marketing while gradually increasing rates to capture maximum value before competitors adjust.`,
        confidence: 82,
        icon: <Target className="w-4 h-4 text-emerald-600" />
      });
    }

    // Smart fallback recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Competitive Position Monitoring',
        analysis: `Your current pricing is well-balanced within market range. AI recommends maintaining position while monitoring for micro-opportunities.`,
        action: `Set up automated alerts for competitor rate changes >5% to enable rapid response and maintain competitive advantage.`,
        confidence: 71,
        icon: <Brain className="w-4 h-4 text-blue-600" />
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 AI recommendations
  };

  // Helper function to get filtered channels for display
  const getFilteredChannels = (channels: CompetitorChannelRate[]) => {
    if (selectedChannels.includes('all')) {
      return channels;
    }
    return channels.filter(channel => selectedChannels.includes(channel.channel));
  };

  // Helper function to get filtered user channels for display  
  const getFilteredUserChannels = (channels: UserChannelRate[]) => {
    if (selectedChannels.includes('all')) {
      return channels;
    }
    return channels.filter(channel => selectedChannels.includes(channel.channel));
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 transition-opacity duration-300 ease-in-out opacity-100"
        onClick={onClose}
      />
      
      <div className="absolute top-0 right-0 h-full w-full max-w-6xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col z-20 transform transition-all duration-300 ease-in-out translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Competitive Intelligence
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {roomType}
                  </span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-600">
                    {onDateNavigate && (
                      <button
                        onClick={() => onDateNavigate('prev')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150"
                        title="Previous day"
                      >
                        <ChevronLeft className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                    <div className="flex items-center gap-1 px-1">
                      <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
                        {new Date(currentDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {onDateNavigate && (
                      <button
                        onClick={() => onDateNavigate('next')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150"
                        title="Next day"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-600">
            <button
                onClick={() => setActiveTab('competitors')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'competitors'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Competitors
              </button>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'ai-insights'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <Brain className="w-4 h-4" />
                AI Insights
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'competitors' && (
            <>
          <div className="flex-shrink-0 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Rates</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Compare your pricing across all channels</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Live</span>
              </div>
              <div className="text-right flex gap-4">
                {currentPrice && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{currentPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Current Cell</div>
                  </div>
                )}
                <div className="text-center border-l border-gray-200 dark:border-gray-600 pl-4">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹{getUserCheapestRate().rate.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Your Lowest Rate
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    via {getUserCheapestRate().channel}
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              ref={userRatesScrollRef}
              className="overflow-x-auto pb-4 scroll-smooth"
              onScroll={(e) => handleScroll(e, userRatesScrollRef.current!)}
            >
              <div className="flex gap-4 min-w-max">
                {getFilteredUserChannels(userChannelData).map((userChannel, index) => (
                  <div
                    key={userChannel.channel}
                    className={`flex-shrink-0 w-48 p-4 rounded-lg border-2 transition-all duration-200 ${
                      userChannel.isActive 
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 truncate">
                        {userChannel.channel}
                      </h4>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        ₹{userChannel.rate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {userChannel.availability} rooms • {userChannel.commission}% comm.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Competitors
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Average rates vs. their best available prices</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{sortedCompetitors.length} Properties</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search competitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-48"
                    />
                  </div>
                  
                  <div className="relative channel-filter-dropdown">
                    <button
                      onClick={() => setIsChannelFilterOpen(!isChannelFilterOpen)}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white w-48"
                    >
                      <span className="truncate">{getSelectedChannelText()}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform duration-200 ${isChannelFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isChannelFilterOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                        {/* All Channels Option */}
                        <div
                          onClick={() => handleChannelToggle('all')}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedChannels.includes('all')}
                            onChange={() => {}} // Handled by onClick
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-900 dark:text-white font-medium">All Channels</span>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-600"></div>
                        
                        {/* Individual Channel Options */}
                        {CHANNELS.map(channel => (
                          <div
                            key={channel}
                            onClick={() => handleChannelToggle(channel)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedChannels.includes(channel)}
                              onChange={() => {}} // Handled by onClick
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">{channel}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 pb-6">
                {sortedCompetitors.map((competitor, compIndex) => (
                  <div key={`${competitor.name}-${compIndex}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {competitor.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{competitor.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{competitor.distance} km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{competitor.rate.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Average Rate</div>
                          </div>
                          <div className="text-center border-l border-gray-200 dark:border-gray-600 pl-4">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ₹{getCompetitorCheapestRate(competitor).rate.toLocaleString()}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Lowest Rate
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              via {getCompetitorCheapestRate(competitor).channel}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div 
                        ref={(el) => {
                          if (el) competitorScrollRefs.current[compIndex] = el;
                        }}
                        className="overflow-x-auto pb-4 scroll-smooth"
                        onScroll={(e) => {
                          const ref = competitorScrollRefs.current[compIndex];
                          if (ref) handleScroll(e, ref);
                        }}
                      >
                        <div className="flex gap-3 min-w-max">
                          {getFilteredChannels(competitor.channels).map((channel, channelIndex) => {
                            const cheapestRate = getCompetitorCheapestRate(competitor);
                            const isLowestPrice = channel.rate === cheapestRate.rate;
                            return (
                              <div
                                key={`${competitor.name}-${channel.channel}-${channelIndex}`}
                                className={`flex-shrink-0 w-48 p-3 rounded-lg border transition-all duration-200 ${
                                  channel.isActive 
                                    ? isLowestPrice 
                                      ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/30 ring-2 ring-green-200 dark:ring-green-700'
                                      : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                                    : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 opacity-60'
                                }`}
                              >
                                <div className="text-center">
                                  <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-2 truncate">
                                    {channel.channel}
                                  </h5>
                                  {channel.isActive ? (
                                    <>
                                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    ₹{channel.rate.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-2">
                                    {channel.availability} rooms
                                  </div>
                                  <div className="flex items-center justify-center gap-1 mb-2">
                                    <span className={`text-xs font-medium ${
                                      channel.commission > 15 ? 'text-red-600' : 
                                      channel.commission > 10 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                      {channel.commission.toFixed(1)}% comm.
                                    </span>
                                  </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-lg font-bold text-gray-400 dark:text-gray-500 mb-1">
                                        Not Available
                                      </div>
                                      <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                                        No pricing data
                                      </div>
                                      <div className="flex items-center justify-center gap-1 mb-2">
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                                          Inactive
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  
                                  {/* Scraping Timestamp - Only show for active channels */}
                                  {channel.isActive && (
                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-xs">{getFreshnessStatus(channel.lastUpdated).icon}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getFreshnessColor(channel.lastUpdated)}`}>
                                          {getFreshnessStatus(channel.lastUpdated).status}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Scraped: {formatScrapingTime(channel.lastUpdated)}
                                      </div>
                                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                        {channel.lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
          )}

          {activeTab === 'ai-insights' && (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Strategic Intelligence for Revenue Managers */}
              <div className="space-y-6">

                {/* Strategic Market Positioning */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
            </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategic Market Positioning</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI-driven competitive strategy analysis</p>
                    </div>
                  </div>
                  
                  {(() => {
                    const userLowestRate = getUserCheapestRate().rate;
                    const competitorRates = sortedCompetitors.map(comp => getCompetitorCheapestRate(comp).rate).filter(rate => rate > 0);
                    const avgCompetitorRate = competitorRates.length > 0 ? competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length : 0;
                    const allRates = [userLowestRate, ...competitorRates].sort((a, b) => a - b);
                    const userPosition = allRates.indexOf(userLowestRate) + 1;
                    const diffFromAvg = avgCompetitorRate > 0 ? ((userLowestRate - avgCompetitorRate) / avgCompetitorRate) * 100 : 0;
                    const totalProperties = allRates.length;
                    const lowestRate = Math.min(...allRates);
                    const highestRate = Math.max(...allRates);
                    const rateSpread = highestRate - lowestRate;
                    
                    // Strategic Analysis
                    let strategicPosition = '';
                    let strategicAction = '';
                    let riskLevel = '';
                    let opportunityType = '';
                    
                    if (userPosition <= Math.ceil(totalProperties * 0.25)) {
                      strategicPosition = 'Value Leader';
                      strategicAction = 'Capture market share through aggressive value positioning';
                      riskLevel = 'Low risk of customer attrition, high volume opportunity';
                      opportunityType = 'Market Share Expansion';
                    } else if (userPosition <= Math.ceil(totalProperties * 0.5)) {
                      strategicPosition = 'Competitive Parity';
                      strategicAction = 'Differentiate through service quality and unique value propositions';
                      riskLevel = 'Moderate risk, balanced positioning required';
                      opportunityType = 'Quality Differentiation';
                    } else if (userPosition <= Math.ceil(totalProperties * 0.75)) {
                      strategicPosition = 'Premium Positioning';
                      strategicAction = 'Justify premium through superior amenities and service excellence';
                      riskLevel = 'Higher price sensitivity, focus on high-value segments';
                      opportunityType = 'Premium Segment Capture';
                    } else {
                      strategicPosition = 'Luxury/Ultra-Premium';
                      strategicAction = 'Target affluent guests, emphasize exclusivity and exceptional experiences';
                      riskLevel = 'Very high price sensitivity, limited market size';
                      opportunityType = 'Luxury Market Dominance';
                    }
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-indigo-200 dark:border-indigo-700">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{userPosition}</div>
                              <div className="text-xs text-gray-500 mt-1">Market Ranking</div>
                              <div className="text-xs text-gray-400 mt-0.5">{strategicPosition}</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-indigo-200 dark:border-indigo-700">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${diffFromAvg > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {diffFromAvg > 0 ? '+' : ''}{diffFromAvg.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 mt-1">vs. Market Average</div>
                              <div className="text-xs text-gray-400 mt-0.5">₹{Math.round(avgCompetitorRate).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-indigo-200 dark:border-indigo-700">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                ₹{Math.round(rateSpread).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Market Spread</div>
                              <div className="text-xs text-gray-400 mt-0.5">{rateSpread > 2000 ? 'High Volatility' : rateSpread > 1000 ? 'Moderate' : 'Stable Market'}</div>
          </div>
        </div>
      </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strategic Recommendation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{strategicAction}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Risk Assessment:</span>
                            <span className="text-gray-700 dark:text-gray-300">{riskLevel}</span>
              </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-500">Opportunity:</span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">{opportunityType}</span>
              </div>
              </div>
            </div>
                    );
                  })()}
          </div>

                {/* Strategic Revenue Management Framework */}
            <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Strategic Revenue Management Framework
                  </h3>
                  
                  {(() => {
                    const userLowestRate = getUserCheapestRate().rate;
                    const competitorRates = sortedCompetitors.map(comp => getCompetitorCheapestRate(comp).rate).filter(rate => rate > 0);
                    const avgCompetitorRate = competitorRates.length > 0 ? competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length : 0;
                    const diffFromAvg = avgCompetitorRate > 0 ? ((userLowestRate - avgCompetitorRate) / avgCompetitorRate) * 100 : 0;
                    const allRates = [userLowestRate, ...competitorRates].sort((a, b) => a - b);
                    const userPosition = allRates.indexOf(userLowestRate) + 1;
                    const totalProperties = allRates.length;
                    const rateSpread = Math.max(...allRates) - Math.min(...allRates);
                    
                    const strategies = [];

                    // Competitive Strategy Analysis
                    if (diffFromAvg > 20) {
                      strategies.push({
                        category: "Premium Strategy Risk Management",
                        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
                        severity: "High Priority",
                        analysis: "Your premium positioning (20%+ above market) creates significant revenue risk. While premium strategies can drive higher RevPAR, they require exceptional value delivery and targeted guest segments.",
                        strategy: "Implement a three-tier strategy: (1) Audit and enhance premium amenities to justify pricing, (2) Target high-value corporate and luxury leisure segments through specialized packages, (3) Create rate elasticity testing with gradual 5-8% reductions to find optimal price-demand balance.",
                        expectedImpact: "Potential 15-25% increase in occupancy with 8-12% revenue optimization",
                        timeframe: "Implement over 6-8 weeks",
                        keyMetrics: "Monitor: ADR retention, booking conversion rates, competitor response timing"
                      });
                    } else if (diffFromAvg < -20) {
                      strategies.push({
                        category: "Value Leadership Expansion",
                        icon: <TrendingUp className="w-5 h-5 text-green-600" />,
                        severity: "Revenue Opportunity", 
                        analysis: "Your value positioning creates significant market share capture opportunity. You're underutilizing pricing power with 20%+ below-market rates.",
                        strategy: "Execute strategic price ladder approach: (1) Increase rates by ₹400-600 immediately on high-demand periods, (2) Implement dynamic pricing with 10-15% market premium during peak times, (3) Bundle services to increase effective ADR without direct rate increases.",
                        expectedImpact: "Projected 18-30% revenue increase with maintained occupancy levels",
                        timeframe: "Phased implementation over 4-6 weeks",
                        keyMetrics: "Track: Revenue per available room, price elasticity response, market share retention"
                      });
                    }

                    // Channel Strategy
                    const directWebsiteRate = userChannelData.find(ch => ch.channel === 'Direct Website')?.rate;
                    const otaRates = userChannelData.filter(ch => ch.channel.includes('.com') || ch.channel.includes('GDS')).map(ch => ch.rate);
                    const avgOtaRate = otaRates.length > 0 ? otaRates.reduce((sum, rate) => sum + rate, 0) / otaRates.length : 0;
                    
                    if (directWebsiteRate && avgOtaRate && directWebsiteRate >= avgOtaRate) {
                      strategies.push({
                        category: "Channel Strategy Optimization",
                        icon: <Zap className="w-5 h-5 text-purple-600" />,
                        severity: "Immediate Action",
                        analysis: "Rate parity violation detected. Direct website rates equal/exceed OTA rates, eliminating incentive for commission-free bookings and reducing profitability.",
                        strategy: "Implement Best Rate Guarantee strategy: (1) Reduce direct rates by 8-12% below OTA rates, (2) Create exclusive direct booking benefits (free WiFi, late checkout, welcome amenities), (3) Launch 'Members Save More' program with additional 5% discount for repeat guests.",
                        expectedImpact: "Target 25-35% increase in direct bookings, saving 12-18% in OTA commissions",
                        timeframe: "Deploy within 2-3 weeks",
                        keyMetrics: "Monitor: Direct booking percentage, commission savings, guest loyalty metrics"
                      });
                    }

                    // Market Volatility Strategy
                    if (rateSpread > 2000) {
                      strategies.push({
                        category: "Dynamic Pricing Mastery",
                        icon: <Target className="w-5 h-5 text-indigo-600" />,
                        severity: "Strategic Advantage",
                        analysis: "High market volatility (₹2,000+ spread) indicates pricing inefficiencies and opportunity for sophisticated revenue optimization.",
                        strategy: "Deploy advanced dynamic pricing: (1) Implement real-time competitor monitoring with hourly rate adjustments, (2) Create demand-based pricing tiers with 3-4 rate levels per room type, (3) Use AI-driven length-of-stay pricing to capture extended bookings during competitor high-rate periods.",
                        expectedImpact: "Potential 20-40% revenue optimization through superior market timing",
                        timeframe: "Full deployment over 8-10 weeks",
                        keyMetrics: "Track: Revenue per available room, rate change frequency, competitor response lag"
                      });
                    }

                    // Competitive Intelligence Strategy
                    if (userPosition <= 2) {
                      strategies.push({
                        category: "Market Leadership Consolidation",
                        icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
                        severity: "Strategic Positioning",
                        analysis: "Your top-2 market position provides pricing leadership opportunity. Competitors often follow your rate changes, giving you market influence.",
                        strategy: "Leverage market leadership: (1) Test price leadership by implementing strategic rate increases during high-demand periods, (2) Create premium packages that competitors cannot easily replicate, (3) Use your position to drive market rates upward while maintaining competitive advantage.",
                        expectedImpact: "Potential to influence overall market rates 5-15% higher, benefiting entire competitive set",
                        timeframe: "Strategic implementation over 12-16 weeks",
                        keyMetrics: "Monitor: Competitor rate response, market share retention, overall market rate movement"
                      });
                    }

                    // Ensure we always have at least one strategic recommendation
                    if (strategies.length === 0) {
                      strategies.push({
                        category: "Competitive Intelligence & Market Positioning",
                        icon: <Target className="w-5 h-5 text-blue-600" />,
                        severity: "Optimization Focus",
                        analysis: "Your current market positioning is well-balanced but requires strategic fine-tuning to maximize revenue potential in this competitive landscape.",
                        strategy: "Implement precision revenue management: (1) Conduct weekly competitor rate analysis to identify micro-opportunities, (2) Test incremental rate increases of ₹200-300 during high-demand periods, (3) Develop guest value perception surveys to identify pricing tolerance and service gap opportunities.",
                        expectedImpact: "Expected 8-15% revenue optimization through strategic positioning refinements",
                        timeframe: "Continuous optimization over 6-8 weeks",
                        keyMetrics: "Track: Guest satisfaction scores, rate acceptance levels, competitive response patterns"
                      });
                    }

                    return strategies.map((strategy, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                            {strategy.icon}
                    </div>
                    <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-900 dark:text-white text-lg">{strategy.category}</h4>
                              <span className={`px-3 py-1 text-xs rounded-full font-bold border ${
                                strategy.severity === 'High Priority' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' :
                                strategy.severity === 'Immediate Action' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700' :
                                strategy.severity === 'Revenue Opportunity' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700' :
                                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700'
                              }`}>
                                {strategy.severity}
                        </span>
                      </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Strategic Analysis</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{strategy.analysis}</p>
                      </div>
                              
                              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4" />
                                  Implementation Strategy
                                </h5>
                                <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed mb-3">{strategy.strategy}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                  <div className="bg-white/70 dark:bg-gray-800/70 p-2 rounded border border-purple-200 dark:border-purple-600">
                                    <span className="font-semibold text-purple-900 dark:text-purple-100">Expected Impact:</span>
                                    <div className="text-purple-800 dark:text-purple-200 mt-1">{strategy.expectedImpact}</div>
                            </div>
                                  <div className="bg-white/70 dark:bg-gray-800/70 p-2 rounded border border-purple-200 dark:border-purple-600">
                                    <span className="font-semibold text-purple-900 dark:text-purple-100">Timeframe:</span>
                                    <div className="text-purple-800 dark:text-purple-200 mt-1">{strategy.timeframe}</div>
                          </div>
                                  <div className="bg-white/70 dark:bg-gray-800/70 p-2 rounded border border-purple-200 dark:border-purple-600">
                                    <span className="font-semibold text-purple-900 dark:text-purple-100">Key Metrics:</span>
                                    <div className="text-purple-800 dark:text-purple-200 mt-1">{strategy.keyMetrics}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                        </div>
                      </div>
                    ));
                  })()}
            </div>

                                {/* Executive Revenue Dashboard */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Executive Revenue Intelligence Dashboard</h4>
              </div>
                  
                  {(() => {
                    const userLowestRate = getUserCheapestRate().rate;
                    const competitorRates = sortedCompetitors.map(comp => getCompetitorCheapestRate(comp).rate).filter(rate => rate > 0);
                    const avgCompetitorRate = competitorRates.length > 0 ? competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length : 0;
                    const allRates = [userLowestRate, ...competitorRates].sort((a, b) => a - b);
                    const userPosition = allRates.indexOf(userLowestRate) + 1;
                    const minRate = Math.min(...competitorRates);
                    const maxRate = Math.max(...competitorRates);
                    const rateSpread = maxRate - minRate;
                    
                    // Calculate market efficiency metrics
                    const marketEfficiency = rateSpread < 1000 ? 'High' : rateSpread < 2000 ? 'Moderate' : 'Low';
                    const pricingOpportunity = rateSpread > 1500 ? 'Significant' : rateSpread > 800 ? 'Moderate' : 'Limited';
                    
                    // Revenue optimization potential
                    const revenueGapToAverage = Math.abs(userLowestRate - avgCompetitorRate);
                    const monthlyRoomNights = 900; // Approximate for demonstration
                    const potentialMonthlyImpact = Math.round(revenueGapToAverage * monthlyRoomNights * 0.75); // 75% occupancy assumption
                    
                    // Market share analysis
                    const totalMarketRooms = sortedCompetitors.length * 120; // Estimated market size
                    const estimatedMarketShare = Math.round((120 / totalMarketRooms) * 100 * 10) / 10; // Your estimated share
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            <div className="text-center">
                              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{Math.round(potentialMonthlyImpact / 100000 * 100) / 100}L</div>
                              <div className="text-xs text-gray-500 mt-1">Monthly Revenue Gap</div>
                              <div className="text-xs text-gray-400 mt-0.5">To market average</div>
                </div>
                </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            <div className="text-center">
                              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{estimatedMarketShare}%</div>
                              <div className="text-xs text-gray-500 mt-1">Est. Market Share</div>
                              <div className="text-xs text-gray-400 mt-0.5">Room inventory basis</div>
                </div>
              </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                marketEfficiency === 'High' ? 'text-green-600 dark:text-green-400' :
                                marketEfficiency === 'Moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>{marketEfficiency}</div>
                              <div className="text-xs text-gray-500 mt-1">Market Efficiency</div>
                              <div className="text-xs text-gray-400 mt-0.5">Pricing coordination</div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700">
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                pricingOpportunity === 'Significant' ? 'text-purple-600 dark:text-purple-400' :
                                pricingOpportunity === 'Moderate' ? 'text-blue-600 dark:text-blue-400' :
                                'text-gray-600 dark:text-gray-400'
                              }`}>{pricingOpportunity}</div>
                              <div className="text-xs text-gray-500 mt-1">Pricing Opportunity</div>
                              <div className="text-xs text-gray-400 mt-0.5">Optimization potential</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Strategic Market Position</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Current Ranking</span>
                                <span className="font-medium text-gray-900 dark:text-white">#{userPosition} of {sortedCompetitors.length + 1}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Rate Premium/Discount</span>
                                <span className={`font-medium ${
                                  userLowestRate > avgCompetitorRate ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                }`}>
                                  {userLowestRate > avgCompetitorRate ? '+' : ''}₹{Math.round(userLowestRate - avgCompetitorRate).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Market Spread Analysis</span>
                                <span className="font-medium text-gray-900 dark:text-white">₹{Math.round(rateSpread).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Competitive Intensity</span>
                                <span className={`font-medium ${
                                  sortedCompetitors.length >= 8 ? 'text-red-600 dark:text-red-400' :
                                  sortedCompetitors.length >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-green-600 dark:text-green-400'
                                }`}>
                                  {sortedCompetitors.length >= 8 ? 'Very High' : sortedCompetitors.length >= 5 ? 'High' : 'Moderate'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Revenue Optimization Metrics</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Channel Distribution</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {selectedChannels.includes('all') ? 'Omnichannel' : `${selectedChannels.length} channels`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Price Elasticity Zone</span>
                                <span className={`font-medium ${
                                  rateSpread > 2000 ? 'text-purple-600 dark:text-purple-400' :
                                  rateSpread > 1000 ? 'text-blue-600 dark:text-blue-400' :
                                  'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {rateSpread > 2000 ? 'High Elasticity' : rateSpread > 1000 ? 'Moderate' : 'Low Elasticity'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Data Freshness</span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} Live
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Analysis Confidence</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">94% High</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                          <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Executive Summary</h5>
                          <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                            {(() => {
                              if (userPosition === 1) {
                                return `You are the market leader with significant pricing power. Focus on maintaining premium positioning while testing price elasticity to maximize revenue without losing market share.`;
                              } else if (userPosition <= 3) {
                                return `Strong competitive position in top tier. Opportunity to implement strategic rate increases of ₹${Math.round(revenueGapToAverage * 0.3)}-${Math.round(revenueGapToAverage * 0.5)} to capture additional revenue while maintaining market position.`;
                              } else if (userLowestRate < avgCompetitorRate * 0.8) {
                                return `Significant underpricing detected. Your rates are ${Math.round((1 - userLowestRate/avgCompetitorRate) * 100)}% below market - immediate opportunity for ₹${Math.round(revenueGapToAverage * 0.6)} rate increases with minimal demand risk.`;
                              } else {
                                return `Well-positioned in competitive market. Focus on value differentiation and selective premium pricing on high-demand periods to optimize revenue mix.`;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorSideDrawer;