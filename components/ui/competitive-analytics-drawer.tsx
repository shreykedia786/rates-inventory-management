import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown, BarChart3, LineChart, Calendar, AlertTriangle, Target, Brain, Zap, DollarSign, Award, Eye, Filter, Download, Maximize2, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

interface RatePlan {
  id: string;
  name: string;
  category: 'Standard' | 'Premium' | 'Luxury' | 'Suite' | 'Package' | 'Corporate' | 'Group' | 'Promotional';
  description: string;
  baseRate: number;
  isActive: boolean;
}

interface ChannelRate {
  channel: string;
  channelType: 'direct' | 'ota' | 'gds' | 'wholesale' | 'meta';
  rate: number;
  commission: number;
  available: boolean;
  lastUpdated: Date;
  netRevenue: number; // Rate minus commission
}

interface DailyChannelData {
  date: string;
  ratePlans: {
    [ratePlanId: string]: {
      directRate: number; // Hotel's direct booking engine rate
      channels: ChannelRate[];
    };
  };
}

interface ParityAlert {
  date: string;
  ratePlan: string;
  channel: string;
  channelRate: number;
  directRate: number;
  difference: number;
  differencePercent: number;
  type: 'rate_leak' | 'rate_win' | 'exact_parity' | 'commission_loss';
  impact: 'critical' | 'high' | 'medium' | 'low';
  revenueImpact: number; // Estimated daily revenue impact
  recommendation: string;
}

interface AIInsight {
  id: string;
  type: 'channel_optimization' | 'commission_savings' | 'rate_integrity' | 'direct_booking_opportunity' | 'revenue_leakage';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  expectedSavings: number;
  expectedRevenue: number;
  timeframe: string;
  affectedRatePlans: string[];
  affectedChannels: string[];
  confidence: number;
}

interface CompetitiveAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive rate plans for large hotels
const RATE_PLANS: RatePlan[] = [
  // Standard Rooms
  { id: 'std-single', name: 'Standard Single', category: 'Standard', description: 'Single occupancy room', baseRate: 3500, isActive: true },
  { id: 'std-double', name: 'Standard Double', category: 'Standard', description: 'Double occupancy room', baseRate: 4200, isActive: true },
  { id: 'std-twin', name: 'Standard Twin', category: 'Standard', description: 'Twin bed room', baseRate: 4000, isActive: true },
  
  // Premium Rooms
  { id: 'prem-deluxe', name: 'Deluxe Room', category: 'Premium', description: 'Premium room with city view', baseRate: 5800, isActive: true },
  { id: 'prem-superior', name: 'Superior Room', category: 'Premium', description: 'Superior room with enhanced amenities', baseRate: 6500, isActive: true },
  { id: 'prem-balcony', name: 'Balcony Room', category: 'Premium', description: 'Room with private balcony', baseRate: 7200, isActive: true },
  
  // Luxury Rooms
  { id: 'lux-junior', name: 'Junior Suite', category: 'Luxury', description: 'Spacious junior suite', baseRate: 9500, isActive: true },
  { id: 'lux-exec', name: 'Executive Suite', category: 'Luxury', description: 'Executive suite with lounge access', baseRate: 12000, isActive: true },
  { id: 'lux-presidential', name: 'Presidential Suite', category: 'Luxury', description: 'Ultimate luxury suite', baseRate: 25000, isActive: true },
  
  // Suites
  { id: 'suite-family', name: 'Family Suite', category: 'Suite', description: 'Large family accommodation', baseRate: 8500, isActive: true },
  { id: 'suite-honeymoon', name: 'Honeymoon Suite', category: 'Suite', description: 'Romantic suite for couples', baseRate: 15000, isActive: true },
  { id: 'suite-penthouse', name: 'Penthouse Suite', category: 'Suite', description: 'Top floor penthouse', baseRate: 35000, isActive: true },
  
  // Package Deals
  { id: 'pkg-breakfast', name: 'Bed & Breakfast', category: 'Package', description: 'Room with breakfast included', baseRate: 5200, isActive: true },
  { id: 'pkg-halfboard', name: 'Half Board', category: 'Package', description: 'Room with breakfast and dinner', baseRate: 7800, isActive: true },
  { id: 'pkg-allincl', name: 'All Inclusive', category: 'Package', description: 'All meals and beverages included', baseRate: 12500, isActive: true },
  { id: 'pkg-spa', name: 'Spa Package', category: 'Package', description: 'Room with spa treatments', baseRate: 9800, isActive: true },
  
  // Corporate Rates
  { id: 'corp-standard', name: 'Corporate Rate', category: 'Corporate', description: 'Standard corporate rate', baseRate: 4800, isActive: true },
  { id: 'corp-extended', name: 'Extended Stay', category: 'Corporate', description: 'Long-term corporate stay', baseRate: 4200, isActive: true },
  { id: 'corp-executive', name: 'Corporate Executive', category: 'Corporate', description: 'Executive corporate rate', baseRate: 7500, isActive: true },
  
  // Group Rates
  { id: 'grp-conference', name: 'Conference Group', category: 'Group', description: 'Conference attendee rate', baseRate: 3800, isActive: true },
  { id: 'grp-wedding', name: 'Wedding Block', category: 'Group', description: 'Wedding party rate', baseRate: 4500, isActive: true },
  { id: 'grp-tour', name: 'Tour Group', category: 'Group', description: 'Tour operator rate', baseRate: 3200, isActive: true },
  
  // Promotional Rates
  { id: 'promo-early', name: 'Early Bird', category: 'Promotional', description: 'Advance booking discount', baseRate: 3800, isActive: true },
  { id: 'promo-lastmin', name: 'Last Minute', category: 'Promotional', description: 'Last minute booking deal', baseRate: 3600, isActive: true },
  { id: 'promo-weekend', name: 'Weekend Special', category: 'Promotional', description: 'Weekend promotion', baseRate: 4800, isActive: true }
];

// Hotel's distribution channels with commission structures
const DISTRIBUTION_CHANNELS = [
  { name: 'Direct Website', type: 'direct' as const, commission: 0, priority: 1 },
  { name: 'Phone Reservations', type: 'direct' as const, commission: 0, priority: 2 },
  { name: 'Walk-in', type: 'direct' as const, commission: 0, priority: 3 },
  
  { name: 'Booking.com', type: 'ota' as const, commission: 15, priority: 4 },
  { name: 'Expedia', type: 'ota' as const, commission: 18, priority: 5 },
  { name: 'Agoda', type: 'ota' as const, commission: 15, priority: 6 },
  { name: 'Hotels.com', type: 'ota' as const, commission: 18, priority: 7 },
  { name: 'Priceline', type: 'ota' as const, commission: 20, priority: 8 },
  
  { name: 'Amadeus GDS', type: 'gds' as const, commission: 10, priority: 9 },
  { name: 'Sabre GDS', type: 'gds' as const, commission: 10, priority: 10 },
  { name: 'Travelport', type: 'gds' as const, commission: 12, priority: 11 },
  
  { name: 'Google Hotel Ads', type: 'meta' as const, commission: 8, priority: 12 },
  { name: 'TripAdvisor', type: 'meta' as const, commission: 12, priority: 13 },
  { name: 'Trivago', type: 'meta' as const, commission: 5, priority: 14 },
  
  { name: 'Wholesale Partner A', type: 'wholesale' as const, commission: 25, priority: 15 },
  { name: 'Wholesale Partner B', type: 'wholesale' as const, commission: 22, priority: 16 }
];

// Generate yearly channel rate data for the past 365 days
const generateYearlyChannelData = (): DailyChannelData[] => {
  const data: DailyChannelData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Market factors affecting rates
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonalFactor = 1 + 0.25 * Math.sin((dayOfYear / 365) * 2 * Math.PI); // Seasonal demand
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const weekendFactor = isWeekend ? 1.12 : 1.0;
    const isSpecialPeriod = dayOfYear > 355 || dayOfYear < 10 || (dayOfYear > 160 && dayOfYear < 170);
    const specialFactor = isSpecialPeriod ? 1.3 : 1.0;
    
    const combinedFactor = seasonalFactor * weekendFactor * specialFactor;
    
    const ratePlansData: DailyChannelData['ratePlans'] = {};
    
    RATE_PLANS.forEach(ratePlan => {
      if (!ratePlan.isActive) return;
      
      // Direct booking engine rate (hotel's base rate)
      const directRate = Math.round(ratePlan.baseRate * combinedFactor * (0.98 + Math.random() * 0.04));
      
      // Generate channel rates with realistic variations
      const channels: ChannelRate[] = DISTRIBUTION_CHANNELS.map(channel => {
        let channelRate = directRate;
        let available = true;
        
        // Rate logic based on channel type and business strategy
        if (channel.type === 'direct') {
          // Direct channels should have the base rate
          channelRate = directRate;
        } else if (channel.type === 'ota') {
          // OTAs often have rate parity issues - some higher, some lower
          const parityVariation = Math.random();
          if (parityVariation < 0.15) {
            // 15% chance of rate leak (OTA rate lower than direct)
            channelRate = Math.round(directRate * (0.92 + Math.random() * 0.05));
          } else if (parityVariation < 0.25) {
            // 10% chance of rate higher than direct (good)
            channelRate = Math.round(directRate * (1.02 + Math.random() * 0.08));
          } else {
            // 75% chance of exact parity or very close
            channelRate = Math.round(directRate * (0.995 + Math.random() * 0.01));
          }
        } else if (channel.type === 'gds') {
          // GDS rates typically stable with small markup
          channelRate = Math.round(directRate * (1.01 + Math.random() * 0.02));
        } else if (channel.type === 'meta') {
          // Meta search should redirect to direct or OTA rates
          channelRate = directRate + Math.round((Math.random() - 0.5) * 100);
        } else if (channel.type === 'wholesale') {
          // Wholesale rates are typically lower but with higher commission
          channelRate = Math.round(directRate * (0.85 + Math.random() * 0.1));
        }
        
        // Calculate net revenue after commission
        const commission = channel.commission;
        const netRevenue = Math.round(channelRate * (1 - commission / 100));
        
        // Some channels might be unavailable
        if (Math.random() < 0.03) { // 3% chance of unavailability
          available = false;
          channelRate = 0;
        }
        
        return {
          channel: channel.name,
          channelType: channel.type,
          rate: channelRate,
          commission: commission,
          available: available,
          lastUpdated: new Date(currentDate.getTime() - Math.random() * 4 * 60 * 60 * 1000), // Updated within last 4 hours
          netRevenue: available ? netRevenue : 0
        };
      });
      
      ratePlansData[ratePlan.id] = {
        directRate,
        channels
      };
    });
    
    data.push({
      date: dateStr,
      ratePlans: ratePlansData
    });
  }
  
  return data;
};

// Detect rate parity alerts - comparing your channels vs your direct rate
const detectParityAlerts = (data: DailyChannelData[]): ParityAlert[] => {
  const alerts: ParityAlert[] = [];
  
  data.forEach(dayData => {
    RATE_PLANS.forEach(ratePlan => {
      if (!ratePlan.isActive) return;
      
      const ratePlanData = dayData.ratePlans[ratePlan.id];
      if (!ratePlanData) return;
      
      const directRate = ratePlanData.directRate;
      
      ratePlanData.channels.forEach(channelData => {
        if (!channelData.available || channelData.channelType === 'direct') return;
        
        const channelRate = channelData.rate;
        const difference = channelRate - directRate;
        const differencePercent = (difference / directRate) * 100;
        
        let type: ParityAlert['type'];
        let impact: ParityAlert['impact'];
        let recommendation: string;
        let revenueImpact = 0;
        
        // Estimate daily revenue impact (assuming 10 bookings per day average)
        const estimatedDailyBookings = 10;
        const commissionLoss = channelData.commission;
        
        if (Math.abs(differencePercent) <= 0.5) {
          type = 'exact_parity';
          impact = 'medium';
          recommendation = `Exact rate parity with direct channel. Consider offering direct booking incentives (free WiFi, late checkout) to drive direct bookings and save ${commissionLoss}% commission.`;
          revenueImpact = estimatedDailyBookings * directRate * (commissionLoss / 100);
        } else if (difference < -50) { // Channel rate significantly lower than direct
          type = 'rate_leak';
          impact = difference < -200 ? 'critical' : 'high';
          recommendation = `Major rate leak detected! ${channelData.channel} is selling ₹${Math.abs(difference)} below your direct rate. This undermines your direct channel and creates negative arbitrage. Immediate rate correction required.`;
          revenueImpact = estimatedDailyBookings * Math.abs(difference) + (estimatedDailyBookings * channelRate * (commissionLoss / 100));
        } else if (difference < -10) { // Channel rate lower than direct
          type = 'rate_leak';
          impact = 'medium';
          recommendation = `Rate leak on ${channelData.channel}. Selling ₹${Math.abs(difference)} below direct rate. Adjust channel rate to maintain rate integrity.`;
          revenueImpact = estimatedDailyBookings * Math.abs(difference);
        } else if (difference > 100) { // Channel rate much higher than direct (good for revenue)
          type = 'rate_win';
          impact = 'low';
          recommendation = `Excellent rate positioning on ${channelData.channel}. Customers pay ₹${difference} premium vs direct rate while you maintain ${commissionLoss}% commission. Consider promoting this channel.`;
          revenueImpact = -estimatedDailyBookings * difference * 0.8; // Positive impact
        } else if (channelData.netRevenue < directRate * 0.9) { // Commission eating into profit
          type = 'commission_loss';
          impact = 'high';
          recommendation = `High commission impact on ${channelData.channel}. Net revenue ₹${channelData.netRevenue} vs direct ₹${directRate}. Consider renegotiating commission or adjusting rates.`;
          revenueImpact = estimatedDailyBookings * (directRate - channelData.netRevenue);
        } else {
          return; // No alert needed
        }
        
        alerts.push({
          date: dayData.date,
          ratePlan: ratePlan.name,
          channel: channelData.channel,
          channelRate,
          directRate,
          difference,
          differencePercent,
          type,
          impact,
          revenueImpact,
          recommendation
        });
      });
    });
  });
  
  return alerts;
};

// Generate AI insights focused on channel optimization and revenue protection
const generateAIInsights = (data: DailyChannelData[], parityAlerts: ParityAlert[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Critical rate leaks
  const rateLeaks = parityAlerts.filter(alert => alert.type === 'rate_leak' && alert.impact === 'critical');
  if (rateLeaks.length > 0) {
    const totalDailyLoss = rateLeaks.reduce((sum, alert) => sum + alert.revenueImpact, 0);
    const affectedChannels = Array.from(new Set(rateLeaks.map(alert => alert.channel)));
    
    insights.push({
      id: 'critical_rate_leaks',
      type: 'rate_integrity',
      priority: 'critical',
      title: 'Critical Rate Leaks Detected - Immediate Action Required',
      description: `${rateLeaks.length} critical rate leaks found across ${affectedChannels.length} channels. Daily revenue loss: ₹${Math.round(totalDailyLoss).toLocaleString()}`,
      actionItems: [
        'Immediately adjust channel rates to match or exceed direct rates',
        'Implement automated rate parity monitoring',
        'Contact channel managers to explain rate integrity policy',
        'Consider temporary channel restrictions until rates are corrected'
      ],
      expectedSavings: totalDailyLoss * 30, // Monthly savings
      expectedRevenue: totalDailyLoss * 365, // Annual impact
      timeframe: 'Within 24-48 hours',
      affectedRatePlans: Array.from(new Set(rateLeaks.map(alert => RATE_PLANS.find(rp => rp.name === alert.ratePlan)?.id || ''))),
      affectedChannels,
      confidence: 95
    });
  }
  
  // Commission optimization opportunity
  const highCommissionAlerts = parityAlerts.filter(alert => alert.type === 'commission_loss');
  if (highCommissionAlerts.length > 5) {
    const totalCommissionLoss = highCommissionAlerts.reduce((sum, alert) => sum + alert.revenueImpact, 0);
    
    insights.push({
      id: 'commission_optimization',
      type: 'commission_savings',
      priority: 'high',
      title: 'High Commission Impact - Optimization Opportunity',
      description: `${highCommissionAlerts.length} rate plans are losing significant revenue to commissions. Potential daily savings: ₹${Math.round(totalCommissionLoss).toLocaleString()}`,
      actionItems: [
        'Increase rates on high-commission channels to compensate',
        'Renegotiate commission rates with underperforming channels',
        'Promote direct booking channels with incentives',
        'Implement commission-adjusted pricing strategy'
      ],
      expectedSavings: totalCommissionLoss * 30,
      expectedRevenue: totalCommissionLoss * 365 * 0.7, // Assuming 70% recovery
      timeframe: '2-4 weeks implementation',
      affectedRatePlans: Array.from(new Set(highCommissionAlerts.map(alert => RATE_PLANS.find(rp => rp.name === alert.ratePlan)?.id || ''))),
      affectedChannels: Array.from(new Set(highCommissionAlerts.map(alert => alert.channel))),
      confidence: 82
    });
  }
  
  // Direct booking opportunity
  const parityAlerts_ = parityAlerts.filter(alert => alert.type === 'exact_parity');
  if (parityAlerts_.length > 10) {
    const potentialCommissionSavings = parityAlerts_.reduce((sum, alert) => sum + alert.revenueImpact, 0);
    
    insights.push({
      id: 'direct_booking_opportunity',
      type: 'direct_booking_opportunity',
      priority: 'medium',
      title: 'Direct Booking Growth Opportunity',
      description: `${parityAlerts_.length} instances of rate parity create opportunity to drive direct bookings with incentives.`,
      actionItems: [
        'Create "Best Rate Guarantee" with 5% discount for direct bookings',
        'Offer exclusive perks: free WiFi, late checkout, room upgrades',
        'Implement loyalty program with direct booking bonuses',
        'Launch targeted email campaigns to past guests'
      ],
      expectedSavings: potentialCommissionSavings * 0.3, // 30% conversion assumption
      expectedRevenue: potentialCommissionSavings * 12, // Annual savings potential
      timeframe: '4-6 weeks to implement',
      affectedRatePlans: Array.from(new Set(parityAlerts_.map(alert => RATE_PLANS.find(rp => rp.name === alert.ratePlan)?.id || ''))),
      affectedChannels: Array.from(new Set(parityAlerts_.map(alert => alert.channel))),
      confidence: 75
    });
  }
  
  // Channel performance analysis
  const recentData = data.slice(-30);
  const channelPerformance: { [channel: string]: { totalRevenue: number, bookings: number, netRevenue: number } } = {};
  
  recentData.forEach(day => {
    RATE_PLANS.forEach(ratePlan => {
      const planData = day.ratePlans[ratePlan.id];
      if (!planData) return;
      
      planData.channels.forEach(channel => {
        if (!channel.available) return;
        
        if (!channelPerformance[channel.channel]) {
          channelPerformance[channel.channel] = { totalRevenue: 0, bookings: 0, netRevenue: 0 };
        }
        
        const estimatedBookings = channel.channelType === 'direct' ? 15 : 5; // Assumption
        channelPerformance[channel.channel].totalRevenue += channel.rate * estimatedBookings;
        channelPerformance[channel.channel].bookings += estimatedBookings;
        channelPerformance[channel.channel].netRevenue += channel.netRevenue * estimatedBookings;
      });
    });
  });
  
  // Find underperforming channels
  const underperformingChannels = Object.entries(channelPerformance)
    .filter(([channel, perf]) => {
      const efficiency = perf.netRevenue / perf.totalRevenue;
      return efficiency < 0.8 && perf.totalRevenue > 50000; // Less than 80% efficiency on significant revenue
    })
    .map(([channel]) => channel);
  
  if (underperformingChannels.length > 0) {
    insights.push({
      id: 'channel_optimization',
      type: 'channel_optimization',
      priority: 'medium',
      title: 'Channel Portfolio Optimization Required',
      description: `${underperformingChannels.length} channels showing poor revenue efficiency. Consider rebalancing channel mix.`,
      actionItems: [
        'Analyze booking patterns and customer acquisition costs',
        'Renegotiate terms with underperforming channels',
        'Redirect marketing spend to higher-efficiency channels',
        'Consider reducing inventory allocation to poor performers'
      ],
      expectedSavings: 0,
      expectedRevenue: 150000, // Estimated annual optimization benefit
      timeframe: '6-8 weeks analysis and implementation',
      affectedRatePlans: [],
      affectedChannels: underperformingChannels,
      confidence: 68
    });
  }
  
  return insights;
};

export default function CompetitiveAnalyticsDrawer({ isOpen, onClose }: CompetitiveAnalyticsDrawerProps) {
  const [selectedRatePlans, setSelectedRatePlans] = useState<string[]>(['all']);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['all']);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '365d'>('90d');
  const [activeTab, setActiveTab] = useState<'overview' | 'parity' | 'insights' | 'channel-performance'>('overview');
  
  const yearlyData = useMemo(() => generateYearlyChannelData(), []);
  const parityAlerts = useMemo(() => detectParityAlerts(yearlyData), [yearlyData]);
  const aiInsights = useMemo(() => generateAIInsights(yearlyData, parityAlerts), [yearlyData, parityAlerts]);
  
  const filteredData = useMemo(() => {
    const days = selectedTimeframe === '30d' ? 30 : selectedTimeframe === '90d' ? 90 : 365;
    return yearlyData.slice(-days);
  }, [yearlyData, selectedTimeframe]);
  
  const filteredParityAlerts = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (selectedTimeframe === '30d' ? 30 : selectedTimeframe === '90d' ? 90 : 365));
    const alerts = parityAlerts.filter(alert => new Date(alert.date) >= cutoffDate);
    
    // Filter by selected rate plans and channels
    return alerts.filter(alert => {
      const ratePlanMatch = selectedRatePlans.includes('all') || selectedRatePlans.some(rpId => 
        RATE_PLANS.find(rp => rp.id === rpId)?.name === alert.ratePlan
      );
      const channelMatch = selectedChannels.includes('all') || selectedChannels.includes(alert.channel);
      return ratePlanMatch && channelMatch;
    });
  }, [parityAlerts, selectedTimeframe, selectedRatePlans, selectedChannels]);
  
  const activeRatePlans = useMemo(() => {
    if (selectedRatePlans.includes('all')) {
      return RATE_PLANS.filter(rp => rp.isActive);
    }
    return RATE_PLANS.filter(rp => rp.isActive && selectedRatePlans.includes(rp.id));
  }, [selectedRatePlans]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-[95vw] bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Channel Revenue Intelligence</h1>
                <p className="text-blue-100 mt-1">Rate parity monitoring & commission optimization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Monitoring</span>
              </div>
              <div className="text-sm text-white/80">
                {filteredParityAlerts.filter(a => a.impact === 'critical').length} Critical Alerts
              </div>
              <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-3 bg-white/10 rounded-xl hover:bg-red-500/80">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Streamlined Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white/30"
                >
                  <option value="30d" className="text-gray-900">Last 30 Days</option>
                  <option value="90d" className="text-gray-900">Last 90 Days</option>
                  <option value="365d" className="text-gray-900">Full Year</option>
                </select>
              </div>
              
              {/* Live Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">{activeRatePlans.length} Rate Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80">{DISTRIBUTION_CHANNELS.length} Channels</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-300 font-medium">
                    {filteredParityAlerts.filter(a => a.type === 'rate_leak').length} Rate Leaks
                  </span>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'parity', label: 'Rate Parity', icon: AlertTriangle },
                { id: 'insights', label: 'AI Insights', icon: Brain },
                { id: 'channel-performance', label: 'Channels', icon: Target }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'parity' && filteredParityAlerts.filter(a => a.impact === 'critical').length > 0 && (
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-1"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {activeTab === 'overview' && (
            <OverviewTab 
              data={filteredData} 
              ratePlans={activeRatePlans}
              alerts={filteredParityAlerts}
            />
          )}
          
          {activeTab === 'parity' && (
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">Rate Parity content has been moved to the Overview tab.</p>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <AIInsightsTab 
              insights={aiInsights}
              filteredInsights={aiInsights.filter(insight => 
                selectedRatePlans.includes('all') || 
                insight.affectedRatePlans.some(rp => selectedRatePlans.includes(rp)) ||
                selectedChannels.includes('all') ||
                insight.affectedChannels.some(ch => selectedChannels.includes(ch))
              )}
            />
          )}
          
          {activeTab === 'channel-performance' && (
            <ChannelPerformanceTab 
              data={filteredData}
              ratePlans={activeRatePlans}
              channels={DISTRIBUTION_CHANNELS}
              alerts={filteredParityAlerts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// World-Class Overview Dashboard with Visual Analytics
function OverviewTab({ 
  data, 
  ratePlans, 
  alerts 
}: { 
  data: DailyChannelData[], 
  ratePlans: RatePlan[], 
  alerts: ParityAlert[]
}) {
  const calculateDashboardMetrics = () => {
    const recentData = data.slice(-30); // Last 30 days
    let totalRevenueLoss = 0;
    let totalCommissionLoss = 0;
    let totalDirectRevenue = 0;
    let totalChannelRevenue = 0;
    let criticalAlerts = 0;
    
    // Calculate comprehensive metrics
    alerts.forEach(alert => {
      if (alert.type === 'rate_leak') totalRevenueLoss += alert.revenueImpact;
      if (alert.type === 'commission_loss') totalCommissionLoss += alert.revenueImpact;
      if (alert.impact === 'critical') criticalAlerts++;
    });
    
    // Calculate revenue trends
    recentData.forEach(day => {
      ratePlans.forEach(ratePlan => {
        const planData = day.ratePlans[ratePlan.id];
        if (!planData) return;
        
        const directChannel = planData.channels.find(c => c.channelType === 'direct');
        const otherChannels = planData.channels.filter(c => c.channelType !== 'direct');
        
        if (directChannel) totalDirectRevenue += directChannel.rate * 3; // Estimated bookings
        otherChannels.forEach(channel => {
          if (channel.available) totalChannelRevenue += channel.netRevenue * 2; // Estimated bookings
        });
      });
    });
    
    // Channel performance distribution
    const channelTypes = {
      direct: 0, ota: 0, gds: 0, meta: 0, wholesale: 0
    };
    
    DISTRIBUTION_CHANNELS.forEach(channel => {
      channelTypes[channel.type as keyof typeof channelTypes]++;
    });
    
    return {
      totalRevenueLoss: totalRevenueLoss * 30, // Monthly projection
      totalCommissionLoss: totalCommissionLoss * 30,
      totalDirectRevenue,
      totalChannelRevenue,
      criticalAlerts,
      totalAlerts: alerts.length,
      channelTypes,
      revenueEfficiency: totalChannelRevenue / (totalDirectRevenue + totalChannelRevenue) * 100
    };
  };

  const metrics = calculateDashboardMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Executive KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{metrics.criticalAlerts}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Rate Leaks</div>
              <div className="text-xs text-red-500 mt-1">Immediate action required</div>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Revenue Loss */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                ₹{Math.round(metrics.totalRevenueLoss / 1000)}K
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue Loss</div>
              <div className="text-xs text-orange-500 mt-1">From rate leaks & commissions</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Revenue Efficiency */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.revenueEfficiency.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Efficiency</div>
              <div className="text-xs text-blue-500 mt-1">Channel vs Direct performance</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active Monitoring */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{ratePlans.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Rate Plans Monitored</div>
              <div className="text-xs text-green-500 mt-1">Across {DISTRIBUTION_CHANNELS.length} channels</div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rate Parity Analysis Section */}
      <ParityAnalysisSection alerts={alerts} ratePlans={ratePlans} />
    </div>
  );
}

// Rate Parity Analysis Section moved from ParityAlertsTab
function ParityAnalysisSection({ alerts, ratePlans }: { alerts: ParityAlert[], ratePlans: RatePlan[] }) {
  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<{ point: any, x: number, y: number } | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced hover handlers for interactive tooltips
  const handlePointEnter = (e: React.MouseEvent, point: any) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    if (point.hasViolations) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredPoint({
        point: {
          date: point.date,
          violations: point.totalViolations,
          totalImpact: point.totalImpact,
          avgViolationAmount: point.avgViolationAmount,
          alertsByChannel: point.alertsByChannel,
          isCritical: point.isCritical
        },
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handlePointLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isTooltipHovered) {
        setHoveredPoint(null);
      }
    }, 150);
  };

  const handleTooltipEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsTooltipHovered(true);
  };

  const handleTooltipLeave = () => {
    setIsTooltipHovered(false);
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Group alerts by rate plan/room type
  const alertsByRatePlan = useMemo(() => {
    return alerts.reduce((acc, alert) => {
      const key = alert.ratePlan;
      if (!acc[key]) {
        acc[key] = {
          ratePlan: alert.ratePlan,
          totalViolations: 0,
          dateRange: { start: alert.date, end: alert.date },
          channels: {} as Record<string, ParityAlert[]>,
          criticalDays: [] as string[]
        };
      }
      
      acc[key].totalViolations++;
      
      if (new Date(alert.date) < new Date(acc[key].dateRange.start)) {
        acc[key].dateRange.start = alert.date;
      }
      if (new Date(alert.date) > new Date(acc[key].dateRange.end)) {
        acc[key].dateRange.end = alert.date;
      }
      
      if (!acc[key].channels[alert.channel]) {
        acc[key].channels[alert.channel] = [];
      }
      acc[key].channels[alert.channel].push(alert);
      
      if (alert.impact === 'critical') {
        acc[key].criticalDays.push(alert.date);
      }
      
      return acc;
    }, {} as Record<string, any>);
  }, [alerts]);

  // Generate date range
  const dateRange = useMemo(() => {
    const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
  }, [selectedDateRange]);

  return (
    <div className="space-y-6" style={{ overflow: 'visible' }}>
      {/* Date Range Selector & Quick Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Parity Trends by Room Type</h3>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedDateRange(range as any)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedDateRange === range
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {alerts.filter(a => a.type === 'rate_leak').length} Rate Leaks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {alerts.filter(a => a.impact === 'critical').length} Critical
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Last {selectedDateRange === '7d' ? '7' : selectedDateRange === '30d' ? '30' : '90'} days
          </div>
        </div>
      </div>

      {/* Room-Grouped View with Trend Graphs */}
      <div className="space-y-6" style={{ overflow: 'visible' }}>
        {Object.values(alertsByRatePlan).map((group: any, index) => {
          const allChannels = new Set<string>();
          Object.values(group.channels).flat().forEach((alert: any) => {
            allChannels.add(alert.channel);
          });
          
          const trendData = dateRange.map(date => {
            const dayAlerts = Object.values(group.channels).flat().filter((alert: any) => alert.date === date);
            
            const alertsByChannel = dayAlerts.reduce((acc: any, alert: any) => {
              if (!acc[alert.channel]) {
                acc[alert.channel] = {
                  alerts: [],
                  totalImpact: 0,
                  violationCount: 0
                };
              }
              acc[alert.channel].alerts.push(alert);
              acc[alert.channel].totalImpact += Math.abs(alert.difference);
              acc[alert.channel].violationCount += 1;
              return acc;
            }, {});
            
            const totalImpact = dayAlerts.reduce((sum: number, alert: any) => sum + Math.abs(alert.difference), 0);
            const totalViolations = dayAlerts.length;
            const avgViolationAmount = totalViolations > 0 ? totalImpact / totalViolations : 0;
            const isCritical = dayAlerts.some((alert: any) => alert.impact === 'critical');
            
            return {
              date,
              totalImpact,
              totalViolations,
              avgViolationAmount,
              isCritical,
              hasViolations: totalViolations > 0,
              alertsByChannel
            };
          });
          
          const maxImpact = Math.max(...trendData.map(d => d.totalImpact));
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {group.ratePlan}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedDateRange === '7d' ? '7-Day' : selectedDateRange === '30d' ? '30-Day' : '90-Day'} Parity Violation Trend
                    </p>
                  </div>
                </div>
              </div>

              {/* Modern Trendy Chart */}
              <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-2xl backdrop-blur-sm overflow-hidden">
                <div className="relative h-72 p-6">
                  <div className="absolute left-16 right-6 top-10 bottom-16 opacity-10">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                        style={{ top: `${(i * 100) / 5}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="absolute left-1 top-10 bottom-16 flex flex-col justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact).toLocaleString()}</span>
                    <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.75).toLocaleString()}</span>
                    <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.5).toLocaleString()}</span>
                    <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.25).toLocaleString()}</span>
                    <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹0</span>
                  </div>
                  
                  <div className="absolute left-16 right-6 top-6 bottom-16 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent">
                    <div className="relative h-full" style={{ width: `${Math.max(trendData.length * 80, 800)}px` }}>
                      
                      <div className="absolute inset-0 w-full h-full">
                        <svg 
                          className="w-full h-full" 
                          viewBox="0 0 100 100" 
                          preserveAspectRatio="none"
                          style={{ overflow: 'visible' }}
                        >
                          <defs>
                            <linearGradient id={`area-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.4" />
                              <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                            </linearGradient>
                            
                            <linearGradient id={`line-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgb(147, 51, 234)" />
                              <stop offset="50%" stopColor="rgb(236, 72, 153)" />
                              <stop offset="100%" stopColor="rgb(59, 130, 246)" />
                            </linearGradient>
                          </defs>
                          
                          <path
                            d={`M ${trendData.map((point, idx) => {
                              const x = (idx / (trendData.length - 1)) * 100;
                              const height = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                              const y = 90 - height;
                              return `${idx === 0 ? '' : 'L '}${x} ${y}`;
                            }).join(' ')} L 100 90 L 0 90 Z`}
                            fill={`url(#area-gradient-${index})`}
                            className="opacity-60"
                          />
                          
                          <path
                            d={trendData.map((point, idx) => {
                              const x = (idx / (trendData.length - 1)) * 100;
                              const height = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                              const y = 90 - height;
                              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            stroke={`url(#line-gradient-${index})`}
                            strokeWidth="2"
                            fill="none"
                            className="drop-shadow-lg"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                      
                      {trendData.map((point, pointIndex) => {
                        const heightPercent = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                        const isToday = point.date === new Date().toISOString().split('T')[0];
                        const xPercent = (pointIndex / (trendData.length - 1)) * 100;
                        
                        return (
                          <div 
                            key={pointIndex} 
                            className="absolute"
                            style={{ 
                              left: `${xPercent}%`,
                              bottom: `${10 + heightPercent}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div 
                              className="relative flex flex-col items-center cursor-pointer group"
                              onMouseEnter={(e) => handlePointEnter(e, point)}
                              onMouseLeave={handlePointLeave}
                            >
                              {point.totalViolations > 0 && (
                                <div className="mb-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                                  {point.totalViolations > 9 ? '9+' : point.totalViolations}
                                </div>
                              )}
                              
                              <div 
                                className={`relative w-4 h-4 rounded-full transition-all duration-300 shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-125 ${
                                  point.totalViolations === 0 
                                    ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50' 
                                    : point.isCritical 
                                      ? 'bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 shadow-red-500/50' 
                                      : 'bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-500 shadow-purple-500/50'
                                } ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                              >
                                <div className="absolute inset-0.5 rounded-full bg-white/30 group-hover:bg-white/50 transition-all duration-300"></div>
                              </div>
                              
                              <div className="absolute inset-0 w-6 h-6 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-all duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {trendData.map((point, pointIndex) => {
                        const isToday = point.date === new Date().toISOString().split('T')[0];
                        const xPercent = (pointIndex / (trendData.length - 1)) * 100;
                        
                        return (
                          <div 
                            key={`date-${pointIndex}`}
                            className="absolute bottom-0"
                            style={{ 
                              left: `${xPercent}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div className={`text-xs font-medium px-2 py-1 rounded-md shadow-sm transition-all duration-200 ${
                              isToday 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30' 
                                : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                            }`}>
                              {new Date(point.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 right-4 text-xs text-purple-400 dark:text-purple-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                    <span>Scroll to see more</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {trendData.filter(p => p.totalViolations > 0).length}
                        </div>
                        <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Days with Violations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/30 dark:to-red-900/30 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                          ₹{Math.round(trendData.reduce((sum, p) => sum + p.totalImpact, 0) / 1000)}K
                        </div>
                        <div className="text-xs font-medium text-pink-600 dark:text-pink-400">
                          Total Impact ({selectedDateRange === '7d' ? '7d' : selectedDateRange === '30d' ? '30d' : '90d'})
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {Math.round(trendData.reduce((sum, p) => sum + p.totalViolations, 0) / trendData.length * 10) / 10}
                        </div>
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Avg Violations/Day</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Tooltip */}
      {hoveredPoint && (
        <TooltipPortal show={true}>
          <div 
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-[99999] transform -translate-x-1/2"
            style={{ 
              left: hoveredPoint.x, 
              top: hoveredPoint.y,
              pointerEvents: 'auto',
              cursor: 'auto'
            }}
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
          >
            <div className="flex flex-col max-h-[500px]">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {new Date(hoveredPoint.point.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total Violations:</span>
                    <span className="ml-1 font-medium text-red-600 dark:text-red-400">{hoveredPoint.point.violations}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total Impact:</span>
                    <span className="ml-1 font-medium text-red-600 dark:text-red-400">₹{Math.round(hoveredPoint.point.totalImpact).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Channel Breakdown:</div>
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  <div className="space-y-2">
                    {Object.keys(hoveredPoint.point.alertsByChannel as Record<string, any>)
                      .sort((a: string, b: string) => {
                        const aData = (hoveredPoint.point.alertsByChannel as Record<string, any>)[a];
                        const bData = (hoveredPoint.point.alertsByChannel as Record<string, any>)[b];
                        return (bData?.totalImpact || 0) - (aData?.totalImpact || 0);
                      })
                      .map((channel: string, idx: number) => {
                        const channelData = (hoveredPoint.point.alertsByChannel as Record<string, any>)[channel];
                        const totalLoss = channelData?.totalImpact || 0;
                        
                        return (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium text-gray-900 dark:text-white">{String(channel)}</span>
                              <span className="text-red-600 dark:text-red-400 font-bold">₹{Math.round(totalLoss).toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {channelData?.violationCount || 0} violation{(channelData?.violationCount || 0) !== 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">↕ Scroll for more channels</div>
                </div>
              </div>
            </div>
          </div>
        </TooltipPortal>
      )}
    </div>
  );
}

// Tooltip Component with Portal
function TooltipPortal({ children, show }: { children: React.ReactNode, show: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !show) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99999 }}>
      {children}
    </div>,
    document.body
  );
}

// Original ParityAlertsTab - Content moved to ParityAnalysisSection in Overview
// This function is kept for reference but no longer used
function OriginalParityAlertsTab({ alerts, ratePlans }: { 
  alerts: ParityAlert[], 
  ratePlans: RatePlan[] 
}) {
  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<{ point: any, x: number, y: number } | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced hover handlers for interactive tooltips
  const handlePointEnter = (e: React.MouseEvent, point: any) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    if (point.hasViolations) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredPoint({
        point: {
          date: point.date,
          violations: point.totalViolations,
          totalImpact: point.totalImpact,
          avgViolationAmount: point.avgViolationAmount,
          alertsByChannel: point.alertsByChannel,
          isCritical: point.isCritical
        },
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handlePointLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isTooltipHovered) {
        setHoveredPoint(null);
      }
    }, 150); // 150ms delay before hiding
  };

  const handleTooltipEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsTooltipHovered(true);
  };

  const handleTooltipLeave = () => {
    setIsTooltipHovered(false);
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(null);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Group alerts by rate plan/room type with date information
  const alertsByRatePlan = useMemo(() => {
    return alerts.reduce((acc, alert) => {
      const key = alert.ratePlan;
      if (!acc[key]) {
        acc[key] = {
          ratePlan: alert.ratePlan,
          totalViolations: 0,
          dateRange: { start: alert.date, end: alert.date },
          channels: {} as Record<string, ParityAlert[]>,
          criticalDays: [] as string[]
        };
      }
      
      acc[key].totalViolations++;
      
      // Track date range
      if (new Date(alert.date) < new Date(acc[key].dateRange.start)) {
        acc[key].dateRange.start = alert.date;
      }
      if (new Date(alert.date) > new Date(acc[key].dateRange.end)) {
        acc[key].dateRange.end = alert.date;
      }
      
      // Group by channel
      if (!acc[key].channels[alert.channel]) {
        acc[key].channels[alert.channel] = [];
      }
      acc[key].channels[alert.channel].push(alert);
      
      // Track critical violation days
      if (alert.impact === 'critical') {
        acc[key].criticalDays.push(alert.date);
      }
      
      return acc;
    }, {} as Record<string, any>);
  }, [alerts]);

  // Generate date range based on selection
  const dateRange = useMemo(() => {
    const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
  }, [selectedDateRange]);

  // Get violations by date for timeline
  const violationsByDate = useMemo(() => {
    return alerts.reduce((acc, alert) => {
      if (!acc[alert.date]) acc[alert.date] = [];
      acc[alert.date].push(alert);
      return acc;
    }, {} as Record<string, ParityAlert[]>);
  }, [alerts]);

  return (
    <div className="space-y-6" style={{ overflow: 'visible' }}>
      {/* Date Range Selector & Quick Stats */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Parity Trends by Room Type</h3>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedDateRange('7d')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDateRange === '7d'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedDateRange('30d')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDateRange === '30d'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedDateRange('90d')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDateRange === '90d'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {alerts.filter(a => a.type === 'rate_leak').length} Rate Leaks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {alerts.filter(a => a.impact === 'critical').length} Critical
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Last {selectedDateRange === '7d' ? '7' : selectedDateRange === '30d' ? '30' : '90'} days
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Room-Grouped View with Trend Graphs */}
        <div className="space-y-6" style={{ overflow: 'visible' }}>
          {Object.values(alertsByRatePlan).map((group: any, index) => {
            // Collect all channels for this rate plan
            const allChannels = new Set<string>();
            Object.values(group.channels).flat().forEach((alert: any) => {
              allChannels.add(alert.channel);
            });
            
            // Generate simplified trend data - one point per date with average violation
            const trendData = dateRange.map(date => {
              const dayAlerts = Object.values(group.channels).flat().filter((alert: any) => alert.date === date);
              
              // Group alerts by channel for detailed breakdown
              const alertsByChannel = dayAlerts.reduce((acc: any, alert: any) => {
                if (!acc[alert.channel]) {
                  acc[alert.channel] = {
                    alerts: [],
                    totalImpact: 0,
                    violationCount: 0
                  };
                }
                acc[alert.channel].alerts.push(alert);
                acc[alert.channel].totalImpact += Math.abs(alert.difference);
                acc[alert.channel].violationCount += 1;
                return acc;
              }, {});
              
              const totalImpact = dayAlerts.reduce((sum: number, alert: any) => sum + Math.abs(alert.difference), 0);
              const totalViolations = dayAlerts.length;
              const avgViolationAmount = totalViolations > 0 ? totalImpact / totalViolations : 0;
              const isCritical = dayAlerts.some((alert: any) => alert.impact === 'critical');
              
              return {
                date,
                totalImpact,
                totalViolations,
                avgViolationAmount,
                isCritical,
                alertsByChannel,
                hasViolations: totalViolations > 0
              };
            });

              const maxImpact = Math.max(...trendData.map(d => d.totalImpact), 1);
              const totalImpact = Object.values(group.channels).flat().reduce((sum: number, alert: any) => sum + alert.revenueImpact, 0);
              
              // Channel colors for consistent visualization
              const channelColors = [
                '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
                '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
                '#6366f1', '#8b5a3c', '#64748b', '#dc2626', '#7c3aed'
              ];
              const channelColorMap = Array.from(allChannels).reduce((acc, channel, idx) => {
                acc[channel] = channelColors[idx % channelColors.length];
                return acc;
              }, {} as Record<string, string>);
              
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow" style={{ overflow: 'visible' }}>
                  {/* Rate Plan Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{group.ratePlan}</h3>
                        <div className="flex items-center gap-6 mt-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-400">
                              <strong>{group.totalViolations}</strong> violations
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${group.criticalDays.length > 0 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <span className="text-gray-600 dark:text-gray-400">
                              <strong>{group.criticalDays.length}</strong> critical days
                            </span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            <strong>{Object.keys(group.channels).length}</strong> channels affected
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                          ₹{Math.round(totalImpact).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Daily Revenue Impact</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Trend Graph */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedDateRange === '7d' ? '7-Day' : selectedDateRange === '30d' ? '30-Day' : '90-Day'} Parity Violation Trend
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Hover over points to see violation details and recommendations</p>
                    </div>
                    

                    
                    {/* Modern Trendy Chart */}
                    <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-2xl backdrop-blur-sm overflow-hidden">
                      {/* Chart Container */}
                      <div className="relative h-72 p-6">
                        {/* Modern Grid Background */}
                        <div className="absolute left-16 right-6 top-6 bottom-16 opacity-10">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div 
                              key={i} 
                              className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                              style={{ top: `${(i * 100) / 5}%` }}
                            ></div>
                          ))}
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-1 top-6 bottom-16 flex flex-col justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                          <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact).toLocaleString()}</span>
                          <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.75).toLocaleString()}</span>
                          <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.5).toLocaleString()}</span>
                          <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹{Math.round(maxImpact * 0.25).toLocaleString()}</span>
                          <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg shadow-lg border border-purple-200 dark:border-purple-700">₹0</span>
                        </div>
                        
                        {/* Chart Area */}
                        <div className="absolute left-16 right-6 top-6 bottom-16 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent">
                          <div className="relative h-full" style={{ width: `${Math.max(trendData.length * 80, 800)}px` }}>
                            
                            {/* SVG Chart */}
                            <div className="absolute inset-0 w-full h-full">
                              <svg 
                                className="w-full h-full" 
                                viewBox="0 0 100 100" 
                                preserveAspectRatio="none"
                                style={{ overflow: 'visible' }}
                              >
                                <defs>
                                  {/* Gradient for area fill */}
                                  <linearGradient id={`area-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.4" />
                                    <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                                  </linearGradient>
                                  
                                  {/* Gradient for line */}
                                  <linearGradient id={`line-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgb(147, 51, 234)" />
                                    <stop offset="50%" stopColor="rgb(236, 72, 153)" />
                                    <stop offset="100%" stopColor="rgb(59, 130, 246)" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Area Fill */}
                                <path
                                  d={`M ${trendData.map((point, idx) => {
                                    const x = (idx / (trendData.length - 1)) * 100;
                                    const height = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                                    const y = 90 - height;
                                    return `${idx === 0 ? '' : 'L '}${x} ${y}`;
                                  }).join(' ')} L 100 90 L 0 90 Z`}
                                  fill={`url(#area-gradient-${index})`}
                                  className="opacity-60"
                                />
                                
                                {/* Main Line */}
                                <path
                                  d={trendData.map((point, idx) => {
                                    const x = (idx / (trendData.length - 1)) * 100;
                                    const height = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                                    const y = 90 - height;
                                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                  }).join(' ')}
                                  stroke={`url(#line-gradient-${index})`}
                                  strokeWidth="2"
                                  fill="none"
                                  className="drop-shadow-lg"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </div>
                            
                            {/* Data Points and Labels */}
                            {trendData.map((point, pointIndex) => {
                              const heightPercent = maxImpact > 0 ? (point.totalImpact / maxImpact) * 70 : 0;
                              const isToday = point.date === new Date().toISOString().split('T')[0];
                              const xPercent = (pointIndex / (trendData.length - 1)) * 100;
                              
                              return (
                                <div 
                                  key={pointIndex} 
                                  className="absolute"
                                  style={{ 
                                    left: `${xPercent}%`,
                                    bottom: `${10 + heightPercent}%`,
                                    transform: 'translateX(-50%)'
                                  }}
                                >
                                  {/* Data Point - Always Show */}
                                  <div 
                                    className="relative flex flex-col items-center cursor-pointer group"
                                    onMouseEnter={(e) => handlePointEnter(e, point)}
                                    onMouseLeave={handlePointLeave}
                                  >
                                    {/* Violation Count Badge - Only if violations exist */}
                                    {point.totalViolations > 0 && (
                                      <div className="mb-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                                        {point.totalViolations > 9 ? '9+' : point.totalViolations}
                                      </div>
                                    )}
                                    
                                    {/* Main Data Point - Always Show */}
                                    <div 
                                      className={`relative w-4 h-4 rounded-full transition-all duration-300 shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-125 ${
                                        point.totalViolations === 0 
                                          ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50' 
                                          : point.isCritical 
                                            ? 'bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 shadow-red-500/50' 
                                            : 'bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-500 shadow-purple-500/50'
                                      } ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                                    >
                                      {/* Inner Shine */}
                                      <div className="absolute inset-0.5 rounded-full bg-white/30 group-hover:bg-white/50 transition-all duration-300"></div>
                                    </div>
                                    
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-all duration-300 pointer-events-none"></div>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {/* Date Labels at Bottom */}
                            {trendData.map((point, pointIndex) => {
                              const isToday = point.date === new Date().toISOString().split('T')[0];
                              const xPercent = (pointIndex / (trendData.length - 1)) * 100;
                              
                              return (
                                <div 
                                  key={`date-${pointIndex}`}
                                  className="absolute bottom-0"
                                  style={{ 
                                    left: `${xPercent}%`,
                                    transform: 'translateX(-50%)'
                                  }}
                                >
                                  <div className={`text-xs font-medium px-2 py-1 rounded-md shadow-sm transition-all duration-200 ${
                                    isToday 
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30' 
                                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                  }`}>
                                    {new Date(point.date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Scroll Indicator */}
                      <div className="absolute bottom-2 right-4 text-xs text-purple-400 dark:text-purple-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                        <span>Scroll to see more</span>
                      </div>
                    </div>
                    
                    {/* Modern Summary Cards */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {trendData.filter(p => p.totalViolations > 0).length}
                            </div>
                            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Days with Violations</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/30 dark:to-red-900/30 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                              ₹{Math.round(trendData.reduce((sum, p) => sum + p.totalImpact, 0) / 1000)}K
                            </div>
                            <div className="text-xs font-medium text-pink-600 dark:text-pink-400">
                              Total Impact ({selectedDateRange === '7d' ? '7d' : selectedDateRange === '30d' ? '30d' : '90d'})
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingDown className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              {Math.round(trendData.reduce((sum, p) => sum + p.totalViolations, 0) / trendData.length * 10) / 10}
                            </div>
                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Avg Violations/Day</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
      
      {/* Tooltip Portal */}
      <TooltipPortal show={!!hoveredPoint}>
        {hoveredPoint && (
          <div 
            className="absolute pointer-events-none"
            style={{ 
              left: hoveredPoint.x,
              top: hoveredPoint.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div 
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[380px] max-w-[450px] max-h-[500px] backdrop-blur-sm overflow-hidden flex flex-col cursor-auto"
              onMouseEnter={handleTooltipEnter}
              onMouseLeave={handleTooltipLeave}
              style={{ pointerEvents: 'auto' }}
            >
              {/* Beautiful Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className={`w-3 h-3 rounded-full ${
                  hoveredPoint.point.violations === 0 ? 'bg-green-500' :
                  hoveredPoint.point.isCritical ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>
                <div className="font-semibold text-lg">
                  {new Date(hoveredPoint.point.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="space-y-4">
                  {/* Average Violation Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-3 rounded-lg">
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">Total Violations</div>
                      <div className="text-xl font-bold text-red-700 dark:text-red-300">{hoveredPoint.point.violations}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-3 rounded-lg">
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Avg Violation</div>
                      <div className="text-xl font-bold text-orange-700 dark:text-orange-300">₹{Math.round(hoveredPoint.point.avgViolationAmount).toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Impact</div>
                      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">₹{Math.round(hoveredPoint.point.totalImpact).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* Channel-Specific Breakdown */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">📊 Channel Breakdown ({Object.keys(hoveredPoint.point.alertsByChannel).length} channels)</div>
                    <div className="space-y-2">
                      {Object.entries(hoveredPoint.point.alertsByChannel)
                        .sort(([,a], [,b]) => (b as any).totalImpact - (a as any).totalImpact)
                        .map(([channel, data]: [string, any]) => {
                          // Simple color assignment for channel identification
                          const channelColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
                          const channelIndex = Object.keys(hoveredPoint.point.alertsByChannel).indexOf(channel);
                          const channelColor = channelColors[channelIndex % channelColors.length];
                          
                          return (
                            <div key={channel} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0" 
                                  style={{ backgroundColor: channelColor }}
                                ></div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{channel}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {data.violationCount} violation{data.violationCount > 1 ? 's' : ''} • Exact amount
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                  ₹{Math.round(data.totalImpact).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Total violation loss
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Interactive Scroll Hint */}
                    {Object.keys(hoveredPoint.point.alertsByChannel).length > 4 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 flex items-center justify-center gap-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border border-blue-200 dark:border-blue-800">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">💡 Hover over tooltip and scroll to see all {Object.keys(hoveredPoint.point.alertsByChannel).length} channels</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Priority Actions */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">🎯 Immediate Actions</div>
                    <div className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
                      {/* Show top 2 channels by impact */}
                      {Object.entries(hoveredPoint.point.alertsByChannel)
                        .sort(([,a], [,b]) => (b as any).totalImpact - (a as any).totalImpact)
                        .slice(0, 2)
                        .map(([channel, data]) => (
                          <div key={channel}>• 📞 <strong>{channel}:</strong> Contact channel manager (₹{Math.round((data as any).totalImpact).toLocaleString()} exact loss)</div>
                        ))
                      }
                      <div>• 📧 <strong>Update:</strong> Send rate correction requests to all channels</div>
                      <div>• 📊 <strong>Monitor:</strong> Track compliance within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Beautiful Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
                <div className="w-4 h-4 bg-white dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </TooltipPortal>
    </div>
  );
}

// AI Insights Tab - Channel Optimization Intelligence
function AIInsightsTab({ insights, filteredInsights }: { 
  insights: AIInsight[], 
  filteredInsights: AIInsight[] 
}) {
  const priorityConfig = {
    critical: { label: 'Critical', color: 'red', bg: 'from-red-600 to-pink-600' },
    high: { label: 'High Priority', color: 'orange', bg: 'from-orange-600 to-red-600' },
    medium: { label: 'Medium Priority', color: 'blue', bg: 'from-blue-600 to-indigo-600' },
    low: { label: 'Low Priority', color: 'gray', bg: 'from-gray-600 to-slate-600' }
  };

  return (
    <div className="p-6 space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Revenue Optimization Intelligence</h2>
            <p className="text-purple-100">AI-powered channel management & commission optimization</p>
          </div>
        </div>
      </div>

      {filteredInsights.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Insights Available</h3>
          <p className="text-gray-500 dark:text-gray-400">AI is analyzing your data. Check back soon for personalized recommendations.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInsights.map(insight => {
            const config = priorityConfig[insight.priority];
            return (
              <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className={`bg-gradient-to-r ${config.bg} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium bg-white/20`}>
                          {insight.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-white/80">
                          {insight.priority} priority
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">{insight.title}</h4>
                      <p className="text-white/90 leading-relaxed">{insight.description}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 ml-4">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Actions</h5>
                      <ul className="space-y-2">
                        {insight.actionItems.map((action, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <div className="text-sm font-medium text-green-700 dark:text-green-400">Expected Savings</div>
                          <div className="text-lg font-bold text-green-800 dark:text-green-300">
                            ₹{(insight.expectedSavings / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Revenue Impact</div>
                          <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                            ₹{(insight.expectedRevenue / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Implementation Timeline</div>
                        <div className="text-gray-900 dark:text-white font-medium">{insight.timeframe}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Affected Areas</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {insight.affectedRatePlans.length > 0 && `${insight.affectedRatePlans.length} rate plans`}
                          {insight.affectedRatePlans.length > 0 && insight.affectedChannels.length > 0 && ' • '}
                          {insight.affectedChannels.length > 0 && `${insight.affectedChannels.length} channels`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Channel Performance Tab
function ChannelPerformanceTab({ 
  data, 
  ratePlans, 
  channels, 
  alerts 
}: { 
  data: DailyChannelData[], 
  ratePlans: RatePlan[], 
  channels: any[],
  alerts: ParityAlert[]
}) {
  const recentData = data.slice(-30);
  
  const channelStats = channels.map(channel => {
    let totalRevenue = 0;
    let totalBookings = 0;
    let rateIssues = 0;
    
    recentData.forEach(day => {
      ratePlans.forEach(ratePlan => {
        const planData = day.ratePlans[ratePlan.id];
        if (!planData) return;
        
        const channelData = planData.channels.find(c => c.channel === channel.name);
        if (!channelData || !channelData.available) return;
        
        const estimatedBookings = channel.type === 'direct' ? 8 : 3;
        totalRevenue += channelData.netRevenue * estimatedBookings;
        totalBookings += estimatedBookings;
        
        const alertsForChannel = alerts.filter(a => a.channel === channel.name && a.ratePlan === ratePlan.name);
        rateIssues += alertsForChannel.length;
      });
    });
    
    return {
      ...channel,
      totalRevenue,
      totalBookings,
      rateIssues,
      efficiency: totalRevenue > 0 ? (totalRevenue / (totalRevenue / (1 - channel.commission / 100))) : 0
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Channel Performance Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">30-day revenue and efficiency metrics</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue (30d)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {channelStats.map((channel, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{channel.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      channel.type === 'direct' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      channel.type === 'ota' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      channel.type === 'gds' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      channel.type === 'meta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {channel.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{channel.commission}%</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ₹{Math.round(channel.totalRevenue / 1000)}K
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{channel.totalBookings}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      channel.rateIssues > 5 ? 'text-red-600 dark:text-red-400' :
                      channel.rateIssues > 0 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {channel.rateIssues}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        channel.efficiency > 0.9 ? 'bg-green-500' :
                        channel.efficiency > 0.8 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {(channel.efficiency * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
