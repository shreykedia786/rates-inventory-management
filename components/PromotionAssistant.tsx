/**
 * Revenue-Focused Promotion Assistant
 * Strategic promotion management interface designed for Revenue Managers
 * Clean, focused, and integrated with core revenue management workflows
 */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  X, 
  Check, 
  Edit3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  AlertTriangle,
  DollarSign,
  Percent,
  Calendar,
  Users,
  Zap,
  Globe,
  BarChart3,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Info
} from 'lucide-react';

/**
 * Revenue-focused interfaces
 */
interface RevenueImpact {
  adrChange: number; // Percentage change in ADR
  revparImpact: number; // Expected RevPAR impact
  occupancyBoost: number; // Expected occupancy lift
  cannibalizationRisk: 'low' | 'medium' | 'high';
  netRevenueChange: number; // After accounting for cannibalization
}

interface PromotionStrategy {
  id: string;
  title: string;
  description: string;
  channel: string;
  discount: number;
  revenueImpact: RevenueImpact;
  timing: {
    optimalStart: string;
    duration: number; // days
    reasoning: string;
  };
  marketContext: {
    competitorActivity: 'promoting' | 'holding' | 'raising';
    demandLevel: 'low' | 'medium' | 'high';
    recommendedAction: string;
  };
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
}

interface ActivePromotion {
  id: string;
  name: string;
  channel: string;
  discount: number;
  status: 'active' | 'scheduled' | 'ending';
  performance: {
    bookingsGenerated: number;
    revenueImpact: number;
    adrImpact: number;
    conversionRate: number;
  };
  endsIn: string;
}

interface PromotionAssistantProps {
  isDark?: boolean;
}

/**
 * Realistic revenue management data
 */
const ACTIVE_PROMOTIONS: ActivePromotion[] = [
  {
    id: '1',
    name: 'Direct Booking Bonus',
    channel: 'Direct',
    discount: 12,
    status: 'active',
    performance: {
      bookingsGenerated: 23,
      revenueImpact: 15600,
      adrImpact: -8.2,
      conversionRate: 14.5
    },
    endsIn: '3 days'
  },
  {
    id: '2',
    name: 'Weekend Flash Sale',
    channel: 'Booking.com',
    discount: 18,
    status: 'ending',
    performance: {
      bookingsGenerated: 41,
      revenueImpact: 22100,
      adrImpact: -12.8,
      conversionRate: 8.7
    },
    endsIn: '18 hours'
  }
];

const STRATEGIC_RECOMMENDATIONS: PromotionStrategy[] = [
  {
    id: 'strat-1',
    title: 'Counter-Competitive Direct Push',
    description: 'Competitors raising rates 8-12% - opportunity to capture share with targeted direct promotion',
    channel: 'Direct Website',
    discount: 15,
    revenueImpact: {
      adrChange: -12.5,
      revparImpact: 8.2,
      occupancyBoost: 18,
      cannibalizationRisk: 'low',
      netRevenueChange: 28400
    },
    timing: {
      optimalStart: 'Today',
      duration: 5,
      reasoning: 'Competitor rate increases effective tomorrow - narrow window to capture market share'
    },
    marketContext: {
      competitorActivity: 'raising',
      demandLevel: 'medium',
      recommendedAction: 'Act immediately to capitalize on competitor pricing gap'
    },
    confidence: 91,
    urgency: 'high',
    riskLevel: 'low'
  },
  {
    id: 'strat-2',
    title: 'Mid-Week Corporate Recovery',
    description: 'Tuesday-Thursday showing 23% demand gap vs. last year - targeted business promo',
    channel: 'Corporate Channels',
    discount: 8,
    revenueImpact: {
      adrChange: -6.8,
      revparImpact: 12.3,
      occupancyBoost: 21,
      cannibalizationRisk: 'low',
      netRevenueChange: 19200
    },
    timing: {
      optimalStart: 'Next Monday',
      duration: 21,
      reasoning: 'Corporate booking window typically 2-3 weeks out'
    },
    marketContext: {
      competitorActivity: 'holding',
      demandLevel: 'low',
      recommendedAction: 'Fill mid-week gap without impacting weekend premium rates'
    },
    confidence: 76,
    urgency: 'medium',
    riskLevel: 'low'
  }
];

/**
 * Clean, focused PromotionAssistant component
 */
export default function PromotionAssistant({ isDark = false }: PromotionAssistantProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [strategies, setStrategies] = useState<PromotionStrategy[]>([]);
  const [activePromotions] = useState<ActivePromotion[]>(ACTIVE_PROMOTIONS);
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders client-side content after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Fetch strategic recommendations
   */
  const fetchStrategies = async () => {
    setIsLoadingStrategies(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStrategies(STRATEGIC_RECOMMENDATIONS);
    setIsLoadingStrategies(false);
  };

  /**
   * Handle strategy acceptance
   */
  const handleAcceptStrategy = (strategy: PromotionStrategy) => {
    console.log('🎯 Implementing strategy:', strategy);
    alert(`Strategy "${strategy.title}" approved. Setting up promotion for ${strategy.channel} with ${strategy.discount}% discount.`);
    setStrategies(prev => prev.filter(s => s.id !== strategy.id));
  };

  /**
   * ESC key handler
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen]);

  /**
   * Get performance indicator styling
   */
  const getPerformanceColor = (value: number, isRevenue = false) => {
    if (isRevenue) return value > 0 ? 'text-emerald-600' : 'text-red-600';
    return value > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Clean Drawer Design */}
      <div className={`
        fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-out
        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
      `}>
        {/* Clean Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Revenue Strategy</h2>
            <p className="text-sm text-gray-500 mt-1">Promotion optimization & competitive intelligence</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Promotions - Clean Summary */}
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Active Promotions</h3>
              <span className="text-sm text-gray-500">{activePromotions.length} running</span>
            </div>

            <div className="space-y-3">
              {activePromotions.map((promo) => (
                <div key={promo.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{promo.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          promo.status === 'ending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {promo.status === 'ending' ? `Ends ${promo.endsIn}` : 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{promo.channel} • {promo.discount}% discount</p>
                    </div>
                  </div>

                  {/* Key Metrics - Revenue Manager Focus */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Bookings</div>
                      <div className="font-medium">{promo.performance.bookingsGenerated}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Revenue Impact</div>
                      <div className={`font-medium ${getPerformanceColor(promo.performance.revenueImpact, true)}`}>
                        ${promo.performance.revenueImpact.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ADR Impact</div>
                      <div className={`font-medium flex items-center gap-1 ${getPerformanceColor(promo.performance.adrImpact)}`}>
                        {promo.performance.adrImpact > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(promo.performance.adrImpact)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Conversion</div>
                      <div className="font-medium">{promo.performance.conversionRate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Strategic Opportunities</h3>
              <button 
                onClick={fetchStrategies}
                disabled={isLoadingStrategies}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Brain className={`w-4 h-4 ${isLoadingStrategies ? 'animate-pulse' : ''}`} />
                {isLoadingStrategies ? 'Analyzing...' : 'Analyze Market'}
              </button>
            </div>

            {/* Loading State */}
            {isLoadingStrategies && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-gray-300 rounded"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strategic Recommendations */}
            {strategies.length > 0 && !isLoadingStrategies && (
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{strategy.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(strategy.urgency)}`}>
                            {strategy.urgency} priority
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{strategy.description}</p>
                      </div>
                    </div>

                    {/* Revenue Impact - What RMs Care About */}
                    <div className="bg-purple-50 rounded-lg p-3 mb-3">
                      <div className="text-xs font-medium text-purple-800 mb-2">Revenue Impact Analysis</div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-gray-600">RevPAR Impact</div>
                          <div className={`font-bold ${getPerformanceColor(strategy.revenueImpact.revparImpact)}`}>
                            +{strategy.revenueImpact.revparImpact}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">ADR Change</div>
                          <div className={`font-bold ${getPerformanceColor(strategy.revenueImpact.adrChange)}`}>
                            {strategy.revenueImpact.adrChange}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Net Revenue</div>
                          <div className="font-bold text-emerald-600">
                            +${strategy.revenueImpact.netRevenueChange.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Market Context */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Competitors: {strategy.marketContext.competitorActivity}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Demand: {strategy.marketContext.demandLevel}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {strategy.confidence}% confidence
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => handleAcceptStrategy(strategy)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <Check className="w-4 h-4" />
                      Implement Strategy
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {strategies.length === 0 && !isLoadingStrategies && (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click "Analyze Market" for revenue optimization strategies</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 