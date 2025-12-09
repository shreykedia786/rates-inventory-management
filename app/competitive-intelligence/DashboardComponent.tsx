/**
 * Competitive Intelligence Dashboard Component
 * Premium, actionable analytics dashboard for revenue managers
 * Focus: Clear insights with specific action recommendations
 * Enhanced with Demand Intelligence: Flights, Events, Market Signals
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Target, DollarSign, BarChart3, 
  Activity, AlertTriangle, CheckCircle, 
  ArrowUp, ArrowDown, Minus, Users, Building2, Globe, 
  Filter, Download, RefreshCw, Zap, Brain, 
  Award, Eye, Sparkles, ArrowLeft, ArrowRight, AlertCircle, ChevronRight,
  Calendar, Clock, Percent, IndianRupee, Plane, MapPin, Music, 
  Briefcase, Trophy, Star, CloudSun, Flame, ThermometerSun, Wind,
  CalendarDays, TrendingUp as TrendUp
} from 'lucide-react';
import Link from 'next/link';
import { 
  getDemandIntelligence, 
  type RealFlightData, 
  type RealEventData, 
  type DemandForecast 
} from '@/services/demandIntelligenceService';

// Room Types and Rate Plans
const ROOM_TYPES = [
  { id: 'std-ocean', name: 'Standard Ocean View', code: 'STD-OV' },
  { id: 'prem-ocean', name: 'Premium Ocean View', code: 'PREM-OV' },
  { id: 'suite-ocean', name: 'Suite Ocean Front', code: 'SUITE-OF' },
  { id: 'villa-beach', name: 'Beach Villa', code: 'VILLA-BH' },
  { id: 'pent-sky', name: 'Penthouse Sky', code: 'PENT-SKY' }
];

const RATE_PLANS = [
  { id: 'bbb', name: 'Best Flexible Rate', code: 'BBB' },
  { id: 'corp', name: 'Corporate Rate', code: 'CORP' },
  { id: 'early-bird', name: 'Early Bird Special', code: 'EARLY' },
  { id: 'last-min', name: 'Last Minute Deal', code: 'LASTMIN' },
  { id: 'group', name: 'Group Rate', code: 'GROUP' }
];

// Helper functions
const formatCurrency = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Base rate calculation
const getBaseRate = (roomTypeId: string, ratePlanId: string): number => {
  const roomMultipliers: Record<string, number> = {
    'std-ocean': 1.0, 'prem-ocean': 1.5, 'suite-ocean': 2.2, 'villa-beach': 3.0, 'pent-sky': 4.5
  };
  const planMultipliers: Record<string, number> = {
    'bbb': 1.0, 'corp': 0.85, 'early-bird': 0.90, 'last-min': 0.95, 'group': 0.80
  };
  return Math.round(4500 * (roomMultipliers[roomTypeId] || 1.0) * (planMultipliers[ratePlanId] || 1.0));
};

// Seeded random for consistency
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ============================================================================
// PRICE SPIKE DETECTION (Uses competitor rate history)
// ============================================================================

/**
 * Competitor price spike detection
 */
interface PriceSpikeAlert {
  competitorId: string;
  competitorName: string;
  date: string;
  displayDate: string;
  previousRate: number;
  newRate: number;
  changePercent: number;
  reason?: string;
  detectedAt: string;
  actionRecommendation: string;
}

/**
 * Detect competitor price spikes from rate history
 */
const generatePriceSpikeAlerts = (
  rateHistory: any[],
  competitors: any[],
  seedBase: number
): PriceSpikeAlert[] => {
  const alerts: PriceSpikeAlert[] = [];
  const reasons = [
    'Detected high event demand',
    'Weekend surge pricing',
    'Last-minute rate increase',
    'Seasonal adjustment',
    'Low availability - high demand',
    'Market-wide price correction'
  ];

  // Check each competitor for significant price changes
  competitors.forEach((comp, compIndex) => {
    for (let i = 1; i < Math.min(rateHistory.length, 14); i++) {
      const prevRate = rateHistory[i - 1].competitorRates?.find((cr: any) => cr.competitorId === comp.id)?.rate || 0;
      const currRate = rateHistory[i].competitorRates?.find((cr: any) => cr.competitorId === comp.id)?.rate || 0;
      
      if (prevRate > 0 && currRate > 0) {
        const changePercent = Math.round(((currRate - prevRate) / prevRate) * 100);
        
        // Alert if price increased by more than 10%
        if (changePercent >= 10) {
          const reasonIndex = Math.floor(seededRandom(seedBase + i * 67 + compIndex * 13) * reasons.length);
          alerts.push({
            competitorId: comp.id,
            competitorName: comp.name,
            date: rateHistory[i].date,
            displayDate: rateHistory[i].displayDate,
            previousRate: prevRate,
            newRate: currRate,
            changePercent,
            reason: reasons[reasonIndex],
            detectedAt: 'Today',
            actionRecommendation: changePercent >= 20 
              ? `Consider raising your rate by ${Math.round(changePercent * 0.6)}% to capitalize on market conditions`
              : `Monitor closely - ${comp.name} sees elevated demand`
          });
        }
      }
    }
  });

  // Sort by change percent descending, limit to top 10
  return alerts.sort((a, b) => b.changePercent - a.changePercent).slice(0, 10);
};

/**
 * Generate demand-based pricing recommendations from real data
 */
const generateDemandInsightsFromRealData = (
  forecasts: DemandForecast[],
  events: RealEventData[],
  flights: RealFlightData[],
  priceSpikes: PriceSpikeAlert[],
  currentRate: number
): Array<{
  type: 'opportunity' | 'warning' | 'success' | 'action';
  title: string;
  description: string;
  action: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  demandContext?: string;
}> => {
  const insights: Array<{
    type: 'opportunity' | 'warning' | 'success' | 'action';
    title: string;
    description: string;
    action: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
    demandContext?: string;
  }> = [];

  // High demand dates
  const highDemandDates = forecasts.filter(d => d.riskLevel === 'high-demand');
  if (highDemandDates.length > 0) {
    const topDate = highDemandDates[0];
    const dateEvent = events.find(e => e.date <= topDate.date && (e.endDate || e.date) >= topDate.date);
    const dateFlight = flights.find(f => f.date === topDate.date);
    
    insights.push({
      type: 'opportunity',
      title: `🔥 High Demand: ${topDate.displayDate} (${topDate.dayName})`,
      description: `Demand score ${topDate.overallScore}/100. ${topDate.keyDrivers.slice(0, 2).join(', ')}. ${dateEvent ? `"${dateEvent.title}" - ${dateEvent.description}` : ''}`,
      action: `Increase rate by ${topDate.suggestedPriceAdjustment}% to ${formatCurrency(currentRate * (1 + topDate.suggestedPriceAdjustment / 100))}`,
      impact: `Potential additional revenue: ${formatCurrency(currentRate * (topDate.suggestedPriceAdjustment / 100) * 15)}/day`,
      priority: 'high',
      demandContext: `Flights: ${dateFlight?.totalArrivals || 'N/A'} arrivals | ${dateFlight?.estimatedPassengers?.toLocaleString() || 'N/A'} passengers`
    });
  }

  // Upcoming major events (real Indian holidays/festivals)
  const majorEvents = events.filter(e => e.expectedImpact === 'high').slice(0, 2);
  majorEvents.forEach(event => {
    insights.push({
      type: 'opportunity',
      title: `📅 ${event.title}`,
      description: `${event.description}. Location: ${event.location}. This ${event.category} event historically drives ${event.priceRecommendation}% rate premium.`,
      action: `Set premium rate at ${formatCurrency(currentRate * (1 + event.priceRecommendation / 100))} for ${formatDate(event.date)}${event.endDate ? ` - ${formatDate(event.endDate)}` : ''}`,
      impact: `Market typically sees ${event.priceRecommendation}% rate increase during ${event.title}`,
      priority: 'high',
      demandContext: `Category: ${event.category} | Source: ${event.source} | ${event.isNational ? 'National Holiday' : 'Local Event'}`
    });
  });

  // Competitor price spikes
  if (priceSpikes.length > 0) {
    const topSpike = priceSpikes[0];
    insights.push({
      type: 'action',
      title: `⚡ Competitor Alert: ${topSpike.competitorName}`,
      description: `${topSpike.competitorName} increased rates by ${topSpike.changePercent}% on ${topSpike.displayDate}. ${topSpike.reason}.`,
      action: topSpike.actionRecommendation,
      impact: `Current competitor rate: ${formatCurrency(topSpike.newRate)} - market signaling higher demand`,
      priority: topSpike.changePercent >= 20 ? 'high' : 'medium',
      demandContext: `Rate change: ${formatCurrency(topSpike.previousRate)} → ${formatCurrency(topSpike.newRate)}`
    });
  }

  // Flight surge detection
  const highFlightDays = flights.filter(f => f.trend === 'high').slice(0, 2);
  if (highFlightDays.length > 0) {
    const flightDay = highFlightDays[0];
    insights.push({
      type: 'success',
      title: `✈️ High Flight Arrivals: ${flightDay.displayDate}`,
      description: `${flightDay.totalArrivals} flights expected with ${flightDay.estimatedPassengers.toLocaleString()} passengers. Peak: ${flightDay.peakHour}. Top routes: ${flightDay.topOrigins.slice(0, 3).map(r => r.city).join(', ')}`,
      action: `Consider dynamic pricing window during ${flightDay.peakHour}`,
      impact: `${flightDay.domesticArrivals} domestic + ${flightDay.internationalArrivals} international arrivals`,
      priority: 'medium',
      demandContext: `Demand score: ${flightDay.demandScore}/100`
    });
  }

  // Low demand warning
  const lowDemandDates = forecasts.filter(d => d.riskLevel === 'low-demand');
  if (lowDemandDates.length > 5) {
    insights.push({
      type: 'warning',
      title: `📉 ${lowDemandDates.length} Low Demand Days Ahead`,
      description: `${lowDemandDates.length} dates have demand scores below 40. This may be monsoon season or mid-week slow periods. Consider promotional strategies.`,
      action: 'Create last-minute deals, packages, or OTA promotions to drive occupancy',
      impact: `Consider ${Math.abs(lowDemandDates[0]?.suggestedPriceAdjustment || 10)}% rate reduction to protect occupancy`,
      priority: 'medium',
      demandContext: 'Proactive action recommended before booking window closes'
    });
  }

  return insights;
};

// Generate realistic competitive data with configurable start date
const generateCompetitiveData = (roomTypeId: string, ratePlanId: string, startDate: Date = new Date(), daysToShow: number = 30) => {
  const competitors = [
    { id: '1', name: 'Paradise Resort', brand: 'Grand Hotels', rating: 4.2, stars: 4 },
    { id: '2', name: 'Azure Waters Hotel', brand: 'Azure Group', rating: 3.9, stars: 4 },
    { id: '3', name: 'Coral Bay Resort', brand: 'Coral Hospitality', rating: 4.0, stars: 4 },
    { id: '4', name: 'Sunset Villa Resort', brand: 'Sunset Hotels', rating: 4.5, stars: 5 },
    { id: '5', name: 'Ocean Breeze Hotel', brand: 'Ocean Group', rating: 4.3, stars: 4 },
    { id: '6', name: 'Tropical Paradise', brand: 'Tropical Resorts', rating: 4.1, stars: 4 }
  ];

  // Use provided start date
  const today = new Date(startDate);
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      dayName: dayNames[date.getDay()],
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    };
  });

  const baseRate = getBaseRate(roomTypeId, ratePlanId);
  const channels = ['Direct Website', 'Booking.com', 'Expedia', 'Agoda', 'Hotels.com', 'Priceline', 'Trivago'];
  const seedBase = roomTypeId.charCodeAt(0) + ratePlanId.charCodeAt(0);

  const rateHistory = dates.map((date, dayIndex) => {
    const weekendMultiplier = date.isWeekend ? 1.18 : 1.0;
    const demandFactor = 0.7 + (Math.sin(dayIndex / 5) * 0.3);
    
    // User rates across channels
    const userChannelRates = channels.map((channel, chIndex) => {
      const channelMultiplier = channel === 'Direct Website' ? 0.98 : 
                               channel === 'Booking.com' ? 1.05 :
                               channel === 'Expedia' ? 1.08 : 1.02 + (chIndex * 0.01);
      return {
        channel,
        rate: Math.round(baseRate * channelMultiplier * weekendMultiplier),
        commission: channel === 'Direct Website' ? 0 : 15 + (chIndex % 5)
      };
    });
    
    // Competitor rates - now with per-channel rates and BAR identification
    // Each competitor has a different "preferred" channel where they offer lowest rates
    const competitorRates = competitors.map((comp, compIndex) => {
      const compBaseRate = baseRate * (0.88 + (compIndex * 0.06));
      const seed = seedBase + dayIndex * 100 + compIndex * 10;
      const variation = 0.92 + (seededRandom(seed) * 0.16);
      
      // Each competitor has a different channel strategy based on their index
      // This creates variety - some are cheapest on Direct, others on Booking, Agoda, etc.
      const preferredChannelIndex = (compIndex + Math.floor(dayIndex / 3)) % channels.length;
      
      // Generate rates per channel for this competitor with varied pricing
      const channelRates = channels.map((channel, chIndex) => {
        // Base channel variation - this competitor's preferred channel gets lowest rate
        let channelVariation;
        if (chIndex === preferredChannelIndex) {
          // This is their preferred/cheapest channel
          channelVariation = 0.92 + (seededRandom(seed + chIndex) * 0.03);
        } else {
          // Other channels are more expensive with some randomness
          const distanceFromPreferred = Math.abs(chIndex - preferredChannelIndex);
          channelVariation = 0.98 + (distanceFromPreferred * 0.02) + (seededRandom(seed + chIndex * 7) * 0.05);
        }
        
        return {
          channel,
          rate: Math.round(compBaseRate * variation * weekendMultiplier * channelVariation)
        };
      });
      
      // Find the BAR (lowest rate) and which channel it's from
      const barChannel = channelRates.reduce((min, curr) => 
        curr.rate < min.rate ? curr : min, channelRates[0]);
      
      return {
        competitorId: comp.id,
        competitorName: comp.name,
        rate: barChannel.rate, // BAR rate
        barChannel: barChannel.channel, // Which channel has BAR
        channelRates, // All channel rates for this competitor
        stars: comp.stars
      };
    });

    const userRate = userChannelRates[0].rate;
    const avgCompetitorRate = Math.round(competitorRates.reduce((sum, r) => sum + r.rate, 0) / competitorRates.length);
    const minCompetitorRate = Math.min(...competitorRates.map(r => r.rate));
    const maxCompetitorRate = Math.max(...competitorRates.map(r => r.rate));
    
    const userOccupancy = Math.min(95, Math.max(35, Math.round(65 + (demandFactor * 25) - (dayIndex * 0.3))));
    
    return {
      date: date.date,
      dayName: date.dayName,
      displayDate: date.displayDate,
      isWeekend: date.isWeekend,
      userRate,
      avgCompetitorRate,
      minCompetitorRate,
      maxCompetitorRate,
      competitorRates,
      userChannelRates,
      priceGap: userRate - avgCompetitorRate,
      priceGapPercent: Math.round(((userRate - avgCompetitorRate) / avgCompetitorRate) * 100),
      userOccupancy,
      marketPosition: userRate < avgCompetitorRate * 0.97 ? 'underpriced' : 
                     userRate > avgCompetitorRate * 1.03 ? 'premium' : 'competitive'
    };
  });

  // Calculate summary stats
  const todayData = rateHistory[0];
  const avgUserRate = Math.round(rateHistory.reduce((sum, d) => sum + d.userRate, 0) / rateHistory.length);
  const avgCompetitorRate = Math.round(rateHistory.reduce((sum, d) => sum + d.avgCompetitorRate, 0) / rateHistory.length);
  const avgUserOccupancy = Math.round(rateHistory.reduce((sum, d) => sum + d.userOccupancy, 0) / rateHistory.length);
  
  // Find opportunities
  const underpricedDays = rateHistory.filter(d => d.marketPosition === 'underpriced');
  const premiumDays = rateHistory.filter(d => d.marketPosition === 'premium');
  const weekendOpportunities = rateHistory.filter(d => d.isWeekend && d.priceGapPercent < 5);
  
  // Revenue opportunity calculation
  const potentialIncrease = underpricedDays.reduce((sum, d) => sum + Math.abs(d.priceGap) * 0.6, 0);
  
  // Channel performance - Focus on Rate Parity (no fake revenue)
  // Compare each channel's rate against your direct/base rate and market average
  const directRate = Math.round(rateHistory.reduce((sum, d) => sum + d.userChannelRates[0].rate, 0) / rateHistory.length);
  
  const channelPerformance = channels.map((channel, idx) => {
    const avgRate = Math.round(rateHistory.reduce((sum, d) => sum + d.userChannelRates[idx].rate, 0) / rateHistory.length);
    const commission = channel === 'Direct Website' ? 0 : 15 + (idx % 5);
    
    // Calculate parity against your direct rate (not competitor rate)
    // Positive gap = channel priced higher than direct = good (Win)
    // Negative gap = channel undercutting direct = bad (Loss)
    const parityGapVsDirect = avgRate - directRate;
    const parityGapVsMarket = avgRate - avgCompetitorRate;
    
    // Net effective rate after commission
    const netEffectiveRate = Math.round(avgRate * (1 - commission / 100));
    
    // Parity score: How well is this channel aligned with your strategy?
    // 100 = perfect parity with direct, lower = undercutting
    const parityScore = Math.max(0, Math.min(100, 100 - Math.abs(parityGapVsDirect) / 50));
    
    // Determine status based on gap vs direct rate
    let parityStatus: 'win' | 'meet' | 'loss';
    if (Math.abs(parityGapVsDirect) < 100) {
      parityStatus = 'meet'; // Within ₹100 of direct = parity maintained
    } else if (parityGapVsDirect > 0) {
      parityStatus = 'win'; // Channel priced higher = direct is competitive
    } else {
      parityStatus = 'loss'; // Channel undercutting = parity violation
    }
    
    return {
      name: channel,
      rate: avgRate,
      directRate,
      commission,
      netEffectiveRate,
      parityGapVsDirect,
      parityGapVsMarket,
      parityScore,
      parityStatus,
      // Is this channel competitive vs market?
      vsMarket: avgRate > avgCompetitorRate ? 'above' : avgRate < avgCompetitorRate ? 'below' : 'at'
    };
  });

  // Competitor positioning with ACTIONABLE insights
  const competitorPositioning = competitors.map(comp => {
    // Get all rates for this competitor
    const allRates = rateHistory.map(d => ({
      date: d.date,
      displayDate: d.displayDate,
      dayName: d.dayName,
      isWeekend: d.isWeekend,
      compRate: d.competitorRates.find(r => r.competitorId === comp.id)?.rate || 0,
      userRate: d.userRate
    }));
    
    // Today's rate (most actionable)
    const todayRate = allRates[0].compRate;
    const todayUserRate = allRates[0].userRate;
    
    // Next 7 days average (tactical planning)
    const next7Days = allRates.slice(0, 7);
    const avg7Day = Math.round(next7Days.reduce((sum, d) => sum + d.compRate, 0) / 7);
    const userAvg7Day = Math.round(next7Days.reduce((sum, d) => sum + d.userRate, 0) / 7);
    
    // Weekend vs Weekday rates
    const weekendRates = allRates.filter(d => d.isWeekend);
    const weekdayRates = allRates.filter(d => !d.isWeekend);
    const avgWeekend = weekendRates.length > 0 
      ? Math.round(weekendRates.reduce((sum, d) => sum + d.compRate, 0) / weekendRates.length) 
      : 0;
    const avgWeekday = weekdayRates.length > 0
      ? Math.round(weekdayRates.reduce((sum, d) => sum + d.compRate, 0) / weekdayRates.length)
      : 0;
    
    // Rate trend (are they getting more aggressive?)
    const first7Avg = Math.round(allRates.slice(0, 7).reduce((sum, d) => sum + d.compRate, 0) / 7);
    const last7Avg = Math.round(allRates.slice(-7).reduce((sum, d) => sum + d.compRate, 0) / 7);
    const trendPercent = Math.round(((first7Avg - last7Avg) / last7Avg) * 100);
    const trend = trendPercent > 2 ? 'increasing' : trendPercent < -2 ? 'decreasing' : 'stable';
    
    // Find HIGH-RISK dates (where competitor is significantly cheaper than you)
    const undercuttingDates = allRates
      .filter(d => d.userRate - d.compRate > 200) // Competitor is 200+ cheaper
      .slice(0, 5) // Top 5 concerning dates
      .map(d => ({
        date: d.displayDate,
        dayName: d.dayName,
        gap: d.userRate - d.compRate,
        compRate: d.compRate,
        userRate: d.userRate
      }));
    
    // Calculate threat level
    const threatLevel = undercuttingDates.length >= 3 ? 'high' : 
                       undercuttingDates.length >= 1 ? 'medium' : 'low';
    
    return {
      ...comp,
      todayRate,
      todayDiff: todayRate - todayUserRate,
      avg7Day,
      diff7Day: avg7Day - userAvg7Day,
      avgWeekend,
      avgWeekday,
      trend,
      trendPercent,
      undercuttingDates,
      threatLevel,
      // For sorting - use today's rate for immediate relevance
      sortRate: todayRate
    };
  }).sort((a, b) => a.todayRate - b.todayRate);

  // ============================================================================
  // DEMAND INTELLIGENCE DATA - Using Real Data Service
  // ============================================================================
  
  // Get demand intelligence from the service (uses real events/holidays data)
  const demandIntel = getDemandIntelligence(today, daysToShow);
  
  // Generate price spike alerts from competitor data
  const priceSpikeAlerts = generatePriceSpikeAlerts(rateHistory, competitors, seedBase);
  
  // Generate demand-based insights using real data
  const demandInsights = generateDemandInsightsFromRealData(
    demandIntel.forecasts,
    demandIntel.events,
    demandIntel.flightData,
    priceSpikeAlerts,
    todayData.userRate
  );
  
  // Merge regular insights with demand insights
  const allInsights = [
    ...demandInsights,
    ...generateInsights(todayData, rateHistory, underpricedDays, competitorPositioning, avgUserOccupancy)
  ].sort((a, b) => {
    // Sort by priority (high first)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return {
    rateHistory,
    dailyPriceStats: rateHistory.map(d => ({
      date: d.date,
      displayDate: d.displayDate,
      dayName: d.dayName,
      isWeekend: d.isWeekend,
      userRate: d.userRate,
      minCompetitorRate: d.minCompetitorRate,
      maxCompetitorRate: d.maxCompetitorRate,
      avgCompetitorRate: d.avgCompetitorRate
    })),
    kpis: {
      currentRate: todayData.userRate,
      currentDate: todayData.date,
      avgCompetitorRate,
      avgUserRate,
      priceGap: todayData.priceGap,
      priceGapPercent: todayData.priceGapPercent,
      marketPosition: todayData.marketPosition,
      avgUserOccupancy,
      potentialRevenue: Math.round(potentialIncrease),
      underpricedDays: underpricedDays.length,
      premiumDays: premiumDays.length,
      weekendOpportunities: weekendOpportunities.length
    },
    channels: channelPerformance,
    competitorPositioning,
    competitors,
    insights: allInsights,
    roomType: ROOM_TYPES.find(rt => rt.id === roomTypeId)?.name || 'All Room Types',
    ratePlan: RATE_PLANS.find(rp => rp.id === ratePlanId)?.name || 'All Rate Plans',
    // DEMAND INTELLIGENCE - Using Real Data
    demandIntelligence: {
      flightData: demandIntel.flightData,
      events: demandIntel.events,
      forecasts: demandIntel.forecasts,
      priceSpikeAlerts,
      summary: demandIntel.summary,
      topOpportunities: demandIntel.topOpportunities
    }
  };
};

// Generate actionable insights
const generateInsights = (
  todayData: any, 
  rateHistory: any[], 
  underpricedDays: any[],
  competitors: any[],
  occupancy: number
) => {
  const insights: Array<{
    type: 'opportunity' | 'warning' | 'success' | 'action';
    title: string;
    description: string;
    action: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];

  // Check if underpriced
  if (todayData.marketPosition === 'underpriced') {
    insights.push({
      type: 'opportunity',
      title: 'Immediate Rate Increase Opportunity',
      description: `Today's rate (${formatCurrency(todayData.userRate)}) is ${Math.abs(todayData.priceGapPercent)}% below market average (${formatCurrency(todayData.avgCompetitorRate)}). You're leaving money on the table.`,
      action: `Increase today's rate by ${formatCurrency(Math.round(Math.abs(todayData.priceGap) * 0.7))} to ${formatCurrency(todayData.userRate + Math.round(Math.abs(todayData.priceGap) * 0.7))}`,
      impact: `Potential additional revenue: ${formatCurrency(Math.round(Math.abs(todayData.priceGap) * 0.7 * 15))} per day`,
      priority: 'high'
    });
  }

  // Check for underpriced future dates
  if (underpricedDays.length > 5) {
    const nextUnderpriced = underpricedDays.slice(0, 3);
    insights.push({
      type: 'opportunity',
      title: `${underpricedDays.length} Future Dates Need Rate Adjustment`,
      description: `Multiple upcoming dates are priced below market: ${nextUnderpriced.map(d => formatDate(d.date)).join(', ')} and ${underpricedDays.length - 3} more.`,
      action: 'Open Bulk Rate Editor → Select underpriced dates → Apply market-aligned rates',
      impact: `Potential monthly revenue increase: ${formatCurrency(underpricedDays.reduce((sum, d) => sum + Math.abs(d.priceGap) * 10, 0))}`,
      priority: 'high'
    });
  }

  // Weekend pricing check
  const weekendDays = rateHistory.filter(d => d.isWeekend);
  const underpricedWeekends = weekendDays.filter(d => d.priceGapPercent < 3);
  if (underpricedWeekends.length > 2) {
    insights.push({
      type: 'warning',
      title: 'Weekend Pricing Below Competition',
      description: `${underpricedWeekends.length} of ${weekendDays.length} weekends are priced at or below competitors. Weekends typically command 15-20% premium.`,
      action: 'Review weekend rates and increase by 10-15% where demand supports',
      impact: `Weekend revenue opportunity: ${formatCurrency(underpricedWeekends.length * 5000)}`,
      priority: 'medium'
    });
  }

  // Occupancy-based insight
  if (occupancy > 80) {
    insights.push({
      type: 'success',
      title: 'High Demand - Consider Rate Increase',
      description: `Current occupancy at ${occupancy}% indicates strong demand. This is an ideal time to optimize rates.`,
      action: 'Increase rates by 5-10% for next 7 days to maximize RevPAR',
      impact: 'Potential RevPAR increase: 8-12%',
      priority: 'high'
    });
  } else if (occupancy < 50) {
    insights.push({
      type: 'warning',
      title: 'Low Occupancy Alert',
      description: `Occupancy at ${occupancy}% is below optimal. Consider promotional strategies.`,
      action: 'Review competitor rates and consider targeted promotions or rate adjustments',
      impact: 'Focus on filling rooms before optimizing rates',
      priority: 'high'
    });
  }

  // Competitor watch
  const cheapestCompetitor = competitors[0];
  if (cheapestCompetitor && cheapestCompetitor.avgRate < todayData.userRate * 0.85) {
    insights.push({
      type: 'action',
      title: `Monitor ${cheapestCompetitor.name}`,
      description: `${cheapestCompetitor.name} is pricing ${Math.round(((todayData.userRate - cheapestCompetitor.avgRate) / todayData.userRate) * 100)}% below you at ${formatCurrency(cheapestCompetitor.avgRate)}. This may impact price-sensitive bookings.`,
      action: 'Set up rate alert for this competitor to track sudden changes',
      impact: 'Stay competitive without unnecessary rate drops',
      priority: 'medium'
    });
  }

  return insights;
};

/**
 * Premium KPI Card with actionable context
 */
const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  gradient = 'cyan',
  format = 'number',
  actionHint
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: any;
  gradient?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' | 'blue';
  format?: 'number' | 'currency' | 'percent';
  actionHint?: string;
}) => {
  const gradientStyles = {
    cyan: { border: 'from-cyan-500/40 to-cyan-600/40', icon: 'from-cyan-500 to-cyan-600', glow: 'shadow-cyan-500/20' },
    emerald: { border: 'from-emerald-500/40 to-emerald-600/40', icon: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/20' },
    violet: { border: 'from-violet-500/40 to-violet-600/40', icon: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/20' },
    amber: { border: 'from-amber-500/40 to-amber-600/40', icon: 'from-amber-500 to-amber-600', glow: 'shadow-amber-500/20' },
    rose: { border: 'from-rose-500/40 to-rose-600/40', icon: 'from-rose-500 to-rose-600', glow: 'shadow-rose-500/20' },
    blue: { border: 'from-blue-500/40 to-blue-600/40', icon: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/20' }
  };

  const style = gradientStyles[gradient];
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percent') return `${val}%`;
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="group relative">
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${style.border} rounded-2xl opacity-50 group-hover:opacity-100 blur-sm transition-all duration-300`} />
      <div className={`relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-white/5 ${style.glow} shadow-xl`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${style.icon} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.value > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
              trend.value < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
            }`}>
              {trend.value > 0 ? <ArrowUp className="w-3 h-3" /> : 
               trend.value < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        <p className="text-slate-400 text-xs font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white mb-1">{formatValue(value)}</p>
        {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        {actionHint && (
          <p className="text-cyan-400 text-xs mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {actionHint}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Actionable Insight Card - Enhanced with demand context
 */
const InsightCard = ({ insight }: { insight: any }) => {
  const typeStyles = {
    opportunity: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: TrendingUp, iconColor: 'text-emerald-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-400' },
    success: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: CheckCircle, iconColor: 'text-cyan-400' },
    action: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', icon: Eye, iconColor: 'text-violet-400' }
  };
  
  const style = typeStyles[insight.type as keyof typeof typeStyles];
  const IconComponent = style.icon;

  // Check if this is a demand-related insight
  const isDemandInsight = insight.demandContext !== undefined;

  return (
    <div className={`p-4 rounded-xl ${style.bg} border ${style.border}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className={`text-sm font-semibold ${style.iconColor}`}>{insight.title}</p>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              insight.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
              insight.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-slate-500/20 text-slate-400'
            }`}>
              {insight.priority} priority
            </span>
            {isDemandInsight && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Demand Signal
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-3">{insight.description}</p>
          
          {/* Demand context info */}
          {isDemandInsight && insight.demandContext && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 mb-3">
              <p className="text-xs text-blue-300 flex items-center gap-1">
                <Plane className="w-3 h-3" />
                {insight.demandContext}
              </p>
            </div>
          )}
          
          <div className="bg-slate-800/50 rounded-lg p-3 mb-2">
            <p className="text-xs text-slate-300 font-medium mb-1">📋 Recommended Action:</p>
            <p className="text-xs text-white">{insight.action}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-cyan-400" />
            <p className="text-xs text-cyan-400">{insight.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * UNIFIED ACTIONABLE RECOMMENDATIONS SECTION
 * Combines pricing opportunities + insights into one scannable view
 */

/**
 * Action Card - Compact, scannable action item for stakeholder presentations
 */
const ActionCard = ({ 
  type,
  date,
  title,
  impact,
  currentRate,
  suggestedRate,
  adjustment,
  drivers,
  priority,
  demandScore
}: {
  type: 'increase' | 'decrease' | 'hold' | 'alert';
  date: string;
  title: string;
  impact: string;
  currentRate: number;
  suggestedRate: number;
  adjustment: number;
  drivers: string[];
  priority: 'high' | 'medium' | 'low';
  demandScore: number;
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'increase': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500', icon: TrendingUp, iconColor: 'text-emerald-400', action: 'INCREASE RATE' };
      case 'decrease': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500', icon: TrendingDown, iconColor: 'text-amber-400', action: 'REDUCE RATE' };
      case 'alert': return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', badge: 'bg-rose-500', icon: AlertTriangle, iconColor: 'text-rose-400', action: 'ATTENTION' };
      default: return { bg: 'bg-slate-800/50', border: 'border-white/10', badge: 'bg-slate-500', icon: Minus, iconColor: 'text-slate-400', action: 'HOLD' };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;
  
  // Calculate potential revenue impact (assuming 20 rooms affected)
  const revenueImpact = Math.abs(adjustment) > 0 ? Math.round((suggestedRate - currentRate) * 20) : 0;
  
  // Format date nicely
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className={`p-4 rounded-xl ${styles.bg} border ${styles.border} hover:border-white/20 transition-all group`}>
      <div className="flex items-start gap-4">
        {/* Left: Date & Priority */}
        <div className="flex-shrink-0 text-center">
          <div className={`w-16 p-2 rounded-lg bg-slate-800/80 border border-white/10`}>
            <p className="text-[10px] text-slate-500 uppercase">{dayOfWeek}</p>
            <p className="text-xl font-bold text-white">{dateObj.getDate()}</p>
            <p className="text-[10px] text-slate-400 uppercase">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</p>
          </div>
          <div className={`mt-2 px-2 py-1 rounded text-[9px] font-bold tracking-wide ${
            priority === 'high' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/30' :
            priority === 'medium' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/30' :
            'bg-slate-700/50 text-slate-400 border border-slate-600/30'
          }`}>
            {priority === 'high' ? '🔥 URGENT' : priority === 'medium' ? '⚡ REVIEW' : '📋 NOTE'}
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${styles.iconColor} flex-shrink-0`} />
            <h4 className="text-sm font-bold text-white">{title}</h4>
          </div>
          
          {/* Impact description */}
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">{impact}</p>
          
          {/* Drivers tags */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {drivers.slice(0, 3).map((driver, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                i === 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20' : 
                'bg-slate-700/50 text-slate-400'
              }`}>
                {driver}
              </span>
            ))}
          </div>
          
          {/* Demand meter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] text-slate-500 w-12">Demand</span>
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden max-w-32">
                <div 
                  className={`h-full rounded-full transition-all ${
                    demandScore >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                    demandScore >= 50 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                    demandScore >= 35 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 
                    'bg-gradient-to-r from-rose-500 to-rose-400'
                  }`}
                  style={{ width: `${demandScore}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${
                demandScore >= 70 ? 'text-emerald-400' :
                demandScore >= 50 ? 'text-cyan-400' :
                demandScore >= 35 ? 'text-amber-400' : 'text-rose-400'
              }`}>{demandScore}/100</span>
            </div>
          </div>
        </div>

        {/* Right: Price Action */}
        <div className="flex-shrink-0 text-right min-w-[120px]">
          {adjustment !== 0 ? (
            <div className={`p-3 rounded-lg ${adjustment > 0 ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              <p className={`text-3xl font-black ${adjustment > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {adjustment > 0 ? '+' : ''}{adjustment}%
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-slate-500">Current</p>
                <p className="text-xs text-slate-400 line-through">{formatCurrency(currentRate)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Suggested</p>
                <p className="text-sm font-bold text-white">{formatCurrency(suggestedRate)}</p>
              </div>
              {revenueImpact > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-[9px] text-slate-500">Est. Daily Impact</p>
                  <p className={`text-xs font-bold ${adjustment > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {adjustment > 0 ? '+' : '-'}{formatCurrency(revenueImpact)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-sm text-slate-400">Hold Rate</p>
              <p className="text-lg font-bold text-white mt-1">{formatCurrency(currentRate)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Quick Action Button - For immediate actions
 */
const QuickActionButton = ({ 
  label, 
  value, 
  subtext, 
  color = 'cyan',
  onClick 
}: { 
  label: string; 
  value: string; 
  subtext: string;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}) => {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/50',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/50',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 hover:border-rose-500/50',
  };

  const textColors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  };

  return (
    <button 
      className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} border transition-all cursor-pointer hover:scale-[1.02]`}
      onClick={onClick}
    >
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${textColors[color]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </button>
  );
};

/**
 * Compact Flight Summary
 */
const FlightSummaryCard = ({ flights }: { flights: RealFlightData[] }) => {
  const todayFlights = flights[0];
  const next7Days = flights.slice(0, 7);
  const totalPassengers = next7Days.reduce((sum, f) => sum + f.estimatedPassengers, 0);
  const peakDay = next7Days.reduce((max, f) => f.estimatedPassengers > max.estimatedPassengers ? f : max, next7Days[0]);
  const highDemandDays = next7Days.filter(f => f.trend === 'high').length;

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Plane className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Flight Arrivals</h4>
          <p className="text-xs text-slate-500">Goa International Airport (GOI)</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <p className="text-lg font-bold text-white">{todayFlights?.totalArrivals || 0}</p>
          <p className="text-[10px] text-slate-500">Today</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <p className="text-lg font-bold text-cyan-400">{(totalPassengers / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-slate-500">7d PAX</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <p className="text-lg font-bold text-emerald-400">{highDemandDays}</p>
          <p className="text-[10px] text-slate-500">Peak Days</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-center">
          <p className="text-sm font-bold text-amber-400">{peakDay?.displayDate}</p>
          <p className="text-[10px] text-slate-500">Busiest</p>
        </div>
      </div>

      {/* Top routes */}
      {todayFlights?.topOrigins && (
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Top Routes Today</p>
          <div className="flex flex-wrap gap-1">
            {todayFlights.topOrigins.slice(0, 4).map((route, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300">
                {route.city} <span className="text-blue-400">({route.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Events Summary Card
 */
const EventsSummaryCard = ({ events }: { events: RealEventData[] }) => {
  const highImpactEvents = events.filter(e => e.expectedImpact === 'high');
  const upcomingCount = events.length;

  const getEventIcon = (category: RealEventData['category']) => {
    switch (category) {
      case 'holiday': return CalendarDays;
      case 'sports': return Trophy;
      case 'entertainment': return Music;
      case 'business': return Briefcase;
      case 'cultural': return Star;
      case 'religious': return Star;
      default: return Calendar;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/20">
            <CalendarDays className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Events & Holidays</h4>
            <p className="text-xs text-slate-500">{upcomingCount} events in period</p>
          </div>
        </div>
        {highImpactEvents.length > 0 && (
          <span className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold">
            {highImpactEvents.length} High Impact
          </span>
        )}
      </div>

      {/* Event list */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {events.slice(0, 5).map((event) => {
          const Icon = getEventIcon(event.category);
          return (
            <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                event.expectedImpact === 'high' ? 'text-rose-400' :
                event.expectedImpact === 'medium' ? 'text-amber-400' : 'text-slate-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{event.title}</p>
                <p className="text-[10px] text-slate-500">{formatDate(event.date)} • {event.location}</p>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                event.expectedImpact === 'high' ? 'bg-rose-500/20 text-rose-400' :
                event.expectedImpact === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-700 text-slate-400'
              }`}>
                +{event.priceRecommendation}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Competitor Price Spike Alerts - Simplified
 */
const PriceSpikeAlertsCard = ({ alerts }: { alerts: PriceSpikeAlert[] }) => {
  if (alerts.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
        <div className="flex items-center gap-2 text-slate-500">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">No significant competitor price changes detected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-white">Competitor Price Spikes</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
          {alerts.length} alerts
        </span>
      </div>
      
      <div className="space-y-2">
        {alerts.slice(0, 5).map((alert, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-800/50 border border-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{alert.competitorName}</span>
              <span className="text-lg font-bold text-amber-400">+{alert.changePercent}%</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
              <span>{alert.displayDate}</span>
              <span>{formatCurrency(alert.previousRate)} → {formatCurrency(alert.newRate)}</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{alert.reason}</p>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300">
                <span className="font-medium">💡 Action: </span>
                {alert.actionRecommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Available channels for filtering
 */
const CHANNELS = [
  { id: 'bar', name: 'Best Available Rate (BAR)', shortName: 'BAR' },
  { id: 'direct', name: 'Direct Website', shortName: 'Direct' },
  { id: 'booking', name: 'Booking.com', shortName: 'Booking' },
  { id: 'expedia', name: 'Expedia', shortName: 'Expedia' },
  { id: 'agoda', name: 'Agoda', shortName: 'Agoda' },
  { id: 'hotels', name: 'Hotels.com', shortName: 'Hotels' },
  { id: 'priceline', name: 'Priceline', shortName: 'Priceline' },
  { id: 'trivago', name: 'Trivago', shortName: 'Trivago' }
];

/**
 * Multi-Line Chart - Shows your rate + all competitor rates OR channel rates
 * Dates on X-axis (left to right), Prices on Y-axis
 * Now with View Toggle: Competitor View vs Channel View
 */
const MultiLineChart = ({ 
  rateHistory, 
  competitors 
}: { 
  rateHistory: any[];
  competitors: any[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'competitors' | 'channels'>('competitors');
  const [selectedChannel, setSelectedChannel] = useState<string>('bar');
  const [isTooltipLocked, setIsTooltipLocked] = useState(false);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Use refs to track current values for event handlers (avoids stale closure issues)
  const currentIndexRef = React.useRef<number | null>(null);
  const currentPositionRef = React.useRef({ x: 0, y: 0 });
  
  // Keep refs in sync with state
  React.useEffect(() => {
    currentIndexRef.current = hoveredIndex;
    currentPositionRef.current = tooltipPosition;
  }, [hoveredIndex, tooltipPosition]);
  
  // The actual index to display
  const displayIndex = hoveredIndex;
  const displayPosition = tooltipPosition;
  
  // Handle chart mouse leave with delay for tooltip interaction
  const handleChartMouseLeave = () => {
    if (isTooltipLocked) return; // Don't close if locked
    
    // Give user time to move mouse to tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      if (!isTooltipLocked) {
        setHoveredIndex(null);
      }
    }, 200);
  };

  // Handle tooltip mouse enter - LOCK the current state
  const handleTooltipMouseEnter = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setIsTooltipLocked(true);
  };

  // Handle tooltip mouse leave
  const handleTooltipMouseLeave = () => {
    setIsTooltipLocked(false);
    // Small delay before hiding to allow re-entering chart
    setTimeout(() => {
      if (!isTooltipLocked) {
        setHoveredIndex(null);
      }
    }, 100);
  };
  
  if (!rateHistory || rateHistory.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-500">
        No data available
      </div>
    );
  }

  // Color palettes
  const competitorColors = [
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#6366f1', // indigo
    '#84cc16', // lime
  ];

  const channelColors: Record<string, string> = {
    'Direct Website': '#06b6d4',   // cyan (your base)
    'Booking.com': '#0066ff',      // booking blue
    'Expedia': '#fbbf24',          // expedia yellow
    'Agoda': '#dc2626',            // agoda red
    'Hotels.com': '#dc2626',       // hotels red
    'Priceline': '#1e40af',        // priceline blue
    'Trivago': '#f97316'           // trivago orange
  };

  // Get user rate based on selected channel
  const getUserRateForChannel = (day: any) => {
    if (selectedChannel === 'bar') {
      // BAR = lowest rate across all channels
      return Math.min(...day.userChannelRates.map((cr: any) => cr.rate));
    }
    const channelIndex = CHANNELS.findIndex(c => c.id === selectedChannel);
    if (channelIndex > 0 && day.userChannelRates[channelIndex - 1]) {
      return day.userChannelRates[channelIndex - 1].rate;
    }
    return day.userRate;
  };

  // Get all values to calculate scale based on view mode
  const allValues: number[] = [];
  rateHistory.forEach(day => {
    if (viewMode === 'competitors') {
      allValues.push(getUserRateForChannel(day));
      day.competitorRates?.forEach((cr: any) => allValues.push(cr.rate));
    } else {
      // Channel view - show all your channel rates
      day.userChannelRates?.forEach((cr: any) => allValues.push(cr.rate));
    }
  });
  
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const padding = (maxValue - minValue) * 0.1;
  const chartMin = minValue - padding;
  const chartMax = maxValue + padding;
  const chartRange = chartMax - chartMin || 1;

  // Chart dimensions - Using viewBox for full space utilization
  const chartHeight = 350;
  const viewBoxWidth = 1000; // Virtual coordinate system width
  const viewBoxHeight = chartHeight;
  const leftPadding = 50; // Virtual units for Y-axis labels
  const rightPadding = 15; // Virtual units for right edge
  const topPadding = 20;
  const bottomPadding = 40;
  const chartAreaWidth = viewBoxWidth - leftPadding - rightPadding;

  // Convert value to Y position (inverted because SVG Y goes down)
  const getY = (value: number) => {
    return topPadding + ((chartMax - value) / chartRange) * (chartHeight - topPadding - bottomPadding);
  };

  // Convert index to X position - spans full chart area
  const getX = (index: number) => {
    if (rateHistory.length <= 1) return leftPadding + chartAreaWidth / 2;
    return leftPadding + (index / (rateHistory.length - 1)) * chartAreaWidth;
  };

  // Y-axis labels
  const yAxisSteps = 5;
  const yLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => {
    return Math.round(chartMin + (chartRange * i / yAxisSteps));
  }).reverse();

  // Generate path for a line
  const generatePath = (rates: number[]) => {
    return rates.map((rate, i) => {
      const x = getX(i);
      const y = getY(rate);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // User rate path based on selected channel
  const userRates = rateHistory.map(d => getUserRateForChannel(d));
  const userPath = generatePath(userRates);

  // Competitor paths (for competitor view) - uses selected channel or BAR
  const competitorPaths = competitors.map((comp, compIndex) => {
    const rates = rateHistory.map(day => {
      const compData = day.competitorRates?.find((cr: any) => cr.competitorId === comp.id);
      
      if (selectedChannel === 'bar') {
        // Use BAR rate (lowest rate)
        return compData?.rate || 0;
      } else {
        // Use specific channel rate
        const channelName = CHANNELS.find(c => c.id === selectedChannel)?.name || 'Direct Website';
        const channelRate = compData?.channelRates?.find((cr: any) => cr.channel === channelName);
        return channelRate?.rate || compData?.rate || 0;
      }
    });
    return {
      id: comp.id,
      name: comp.name,
      path: generatePath(rates),
      color: competitorColors[compIndex % competitorColors.length],
      rates
    };
  });

  // Channel paths (for channel view)
  const channelPaths = rateHistory[0]?.userChannelRates?.map((ch: any, chIndex: number) => {
    const rates = rateHistory.map(day => day.userChannelRates[chIndex]?.rate || 0);
    return {
      id: ch.channel,
      name: ch.channel,
      path: generatePath(rates),
      color: channelColors[ch.channel] || competitorColors[chIndex % competitorColors.length],
      rates,
      commission: ch.commission
    };
  }) || [];

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    // Don't update if tooltip is locked (user is scrolling in tooltip)
    if (isTooltipLocked) return;
    
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Convert mouse position to viewBox coordinates
    const viewBoxX = (mouseX / rect.width) * viewBoxWidth;
    
    // Calculate position within the chart area (accounting for padding)
    const chartX = viewBoxX - leftPadding;
    const relativeX = chartX / chartAreaWidth;
    const index = Math.round(relativeX * (rateHistory.length - 1));
    
    if (index >= 0 && index < rateHistory.length) {
      setHoveredIndex(index);
      setTooltipPosition({ x: mouseX, y: e.clientY - rect.top });
    }
  };

  // Get selected channel name
  const selectedChannelName = CHANNELS.find(c => c.id === selectedChannel)?.name || 'BAR';

  // Get lines based on view mode
  const linesToRender = viewMode === 'competitors' ? competitorPaths : channelPaths;

  return (
    <div className="relative">
      {/* CHART CONTROLS */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">View:</span>
          <div className="flex items-center bg-slate-800/80 rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setViewMode('competitors')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'competitors'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Competitor View
            </button>
            <button
              onClick={() => setViewMode('channels')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'channels'
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Channel View
            </button>
          </div>
        </div>

        {/* Channel/Rate Source Filter (only for competitor view) */}
        {viewMode === 'competitors' && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Your Rate Source:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-1.5 bg-slate-800/80 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
            >
              {CHANNELS.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Channel view info */}
        {viewMode === 'channels' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <Globe className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-300">Comparing your rates across all distribution channels</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div 
        ref={chartRef}
        className="relative"
        style={{ height: `${chartHeight}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid lines */}
          {yLabels.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={leftPadding}
                  y1={y}
                  x2={viewBoxWidth - rightPadding}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4,4"
                />
                <text
                  x={leftPadding - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  className="fill-slate-500"
                >
                  ₹{(val / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}

          {/* Lines based on view mode */}
          {linesToRender.map((line: any) => (
            <path
              key={line.id}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth={viewMode === 'channels' ? 2 : 1.5}
              strokeOpacity={viewMode === 'channels' ? 0.9 : 0.6}
              className="transition-opacity"
              style={{ opacity: hoveredIndex !== null ? 0.5 : (viewMode === 'channels' ? 0.9 : 0.6) }}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* User rate line (only for competitor view, thicker, on top) */}
          {viewMode === 'competitors' && (
            <path
              d={userPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="drop-shadow-lg"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Hover line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={topPadding}
              x2={getX(hoveredIndex)}
              y2={chartHeight - bottomPadding}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="4,4"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Data points on hover */}
          {hoveredIndex !== null && (
            <>
              {/* User point (for competitor view) */}
              {viewMode === 'competitors' && (
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(userRates[hoveredIndex])}
                  r="5"
                  fill="#06b6d4"
                  stroke="white"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {/* Other points */}
              {linesToRender.map((line: any) => (
                <circle
                  key={line.id}
                  cx={getX(hoveredIndex)}
                  cy={getY(line.rates[hoveredIndex])}
                  r={viewMode === 'channels' ? 4 : 3}
                  fill={line.color}
                  stroke="white"
                  strokeWidth={viewMode === 'channels' ? 1.5 : 1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </>
          )}

          {/* X-axis labels - dynamically spaced based on data points */}
          {rateHistory.map((day, i) => {
            // Calculate optimal label interval based on number of data points
            const labelInterval = rateHistory.length <= 14 ? 2 : 
                                  rateHistory.length <= 30 ? 5 : 
                                  rateHistory.length <= 60 ? 7 : 10;
            // Show label at intervals or first/last
            if (i !== 0 && i !== rateHistory.length - 1 && i % labelInterval !== 0) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-500"
              >
                {day.displayDate}
              </text>
            );
          })}
        </svg>

        {/* Tooltip - Interactive for scrolling */}
        {displayIndex !== null && rateHistory[displayIndex] && (
          <div 
            className="absolute z-50"
            style={{ 
              left: Math.min(displayPosition.x + 15, chartRef.current?.offsetWidth ? chartRef.current.offsetWidth - 340 : 0),
              top: Math.max(displayPosition.y - 20, 0)
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className={`bg-slate-900/95 backdrop-blur-sm border rounded-xl p-4 shadow-2xl w-80 ${
              isTooltipLocked ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-white/10'
            }`}>
              {/* Scroll hint when tooltip is locked */}
              {isTooltipLocked && (
                <div className="text-[10px] text-cyan-400 mb-2 flex items-center gap-1">
                  <span>📌 Tooltip locked - scroll to view all competitors</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <span className="text-sm font-semibold text-white">
                  {rateHistory[displayIndex].displayDate}
                </span>
                <span className="text-xs text-slate-400">
                  {rateHistory[displayIndex].dayName}
                  {rateHistory[displayIndex].isWeekend && ' (Weekend)'}
                </span>
              </div>
              
              {/* Competitor View Tooltip */}
              {viewMode === 'competitors' && (
                <>
                  {/* BAR indicator */}
                  {selectedChannel === 'bar' && (
                    <div className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      BAR = Best Available Rate (lowest across all channels)
                    </div>
                  )}
                  
                  {/* Your rate - highlighted with channel info */}
                  <div className="flex items-center justify-between p-2 bg-cyan-500/10 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <div>
                        <span className="text-sm font-medium text-cyan-400">Your Rate</span>
                        <span className="text-xs text-slate-500 ml-1">
                          ({selectedChannel === 'bar' ? 'BAR - Direct' : selectedChannelName})
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(userRates[displayIndex])}
                    </span>
                  </div>
                  
                  {/* Competitors header */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 px-1">
                    <span>COMPETITOR</span>
                    <span>RATE / DIFF</span>
                  </div>
                  
                  {/* Competitors with channel info - Scrollable */}
                  <div 
                    className="space-y-1 max-h-56 overflow-y-auto pr-1"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#475569 transparent'
                    }}
                  >
                    {competitorPaths.map((comp) => {
                      // Get competitor data for this day
                      const competitorData = rateHistory[displayIndex].competitorRates?.find(
                        (cr: any) => cr.competitorId === comp.id
                      );
                      
                      // Determine which rate and channel to show based on selected filter
                      let displayRate: number;
                      let displayChannel: string;
                      
                      if (selectedChannel === 'bar') {
                        // Show BAR (lowest rate) and its channel
                        displayRate = competitorData?.rate || comp.rates[displayIndex];
                        displayChannel = competitorData?.barChannel || 'OTA';
                      } else {
                        // Show specific channel rate
                        const channelName = CHANNELS.find(c => c.id === selectedChannel)?.name || 'Direct Website';
                        const channelIndex = rateHistory[displayIndex].userChannelRates?.findIndex(
                          (cr: any) => cr.channel === channelName
                        );
                        // Get this competitor's rate on the selected channel
                        const channelRate = competitorData?.channelRates?.find(
                          (cr: any) => cr.channel === channelName
                        );
                        displayRate = channelRate?.rate || comp.rates[displayIndex];
                        displayChannel = channelName;
                      }
                      
                      const diff = displayRate - userRates[displayIndex];
                      const shortChannel = displayChannel === 'Direct Website' ? 'Direct' : 
                                          displayChannel === 'Booking.com' ? 'Booking' :
                                          displayChannel === 'Hotels.com' ? 'Hotels' :
                                          displayChannel === 'Priceline' ? 'Priceline' :
                                          displayChannel === 'Expedia' ? 'Expedia' :
                                          displayChannel === 'Agoda' ? 'Agoda' :
                                          displayChannel === 'Trivago' ? 'Trivago' :
                                          displayChannel;
                      
                      return (
                        <div key={comp.id} className="flex items-center justify-between text-xs py-2 px-2 rounded-lg bg-slate-800/50 hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: comp.color }}
                            />
                            <div className="flex flex-col">
                              <span className="text-slate-200 font-medium">{comp.name}</span>
                              <span className="text-[10px] text-slate-500">
                                via <span className="text-slate-400">{shortChannel}</span>
                                {selectedChannel === 'bar' && <span className="text-amber-400 ml-1">(BAR)</span>}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-white font-semibold">{formatCurrency(displayRate)}</span>
                            <span className={`text-[10px] font-medium ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                              {diff > 0 ? '↑ ' : diff < 0 ? '↓ ' : ''}{diff > 0 ? '+' : ''}{formatCurrency(diff)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Summary */}
                  <div className="mt-3 pt-2 border-t border-white/10 text-xs text-slate-400">
                    Market Avg: {formatCurrency(rateHistory[displayIndex].avgCompetitorRate)}
                    <span className={`ml-2 ${
                      userRates[displayIndex] < rateHistory[displayIndex].avgCompetitorRate 
                        ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      ({userRates[displayIndex] < rateHistory[displayIndex].avgCompetitorRate ? 'Below' : 'Above'} avg)
                    </span>
                  </div>
                </>
              )}

              {/* Channel View Tooltip */}
              {viewMode === 'channels' && (
                <>
                  <div className="text-xs text-violet-400 mb-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Your rates across channels
                  </div>
                  
                  {/* Channels */}
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {channelPaths.map((ch: any) => {
                      const rate = ch.rates[displayIndex];
                      const directRate = channelPaths[0]?.rates[displayIndex] || rate;
                      const diff = rate - directRate;
                      return (
                        <div key={ch.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/5">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: ch.color }}
                            />
                            <span className="text-slate-300">{ch.name}</span>
                            {ch.commission > 0 && (
                              <span className="text-slate-500">({ch.commission}% comm.)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{formatCurrency(rate)}</span>
                            {ch.name !== 'Direct Website' && (
                              <span className={`text-xs ${diff > 0 ? 'text-amber-400' : diff < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Net Revenue Comparison */}
                  <div className="mt-3 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-2">Net Revenue (after commission):</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-cyan-500/10">
                        <p className="text-slate-400">Direct (0%)</p>
                        <p className="text-cyan-400 font-bold">{formatCurrency(channelPaths[0]?.rates[displayIndex] || 0)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <p className="text-slate-400">Booking (~17%)</p>
                        <p className="text-amber-400 font-bold">
                          {formatCurrency((channelPaths[1]?.rates[displayIndex] || 0) * 0.83)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend - Dynamic based on view mode */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5">
        {viewMode === 'competitors' ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-cyan-500 rounded" />
              <span className="text-xs text-slate-400 font-medium">Your Property ({selectedChannelName})</span>
            </div>
            {competitors.slice(0, 6).map((comp, i) => (
              <div key={comp.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-1 rounded" 
                  style={{ backgroundColor: competitorColors[i % competitorColors.length] }}
                />
                <span className="text-xs text-slate-500">{comp.name}</span>
              </div>
            ))}
            {competitors.length > 6 && (
              <span className="text-xs text-slate-500">+{competitors.length - 6} more</span>
            )}
          </>
        ) : (
          <>
            {channelPaths.map((ch: any) => (
              <div key={ch.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-1 rounded" 
                  style={{ backgroundColor: ch.color }}
                />
                <span className="text-xs text-slate-400">{ch.name}</span>
                {ch.commission > 0 && (
                  <span className="text-xs text-slate-600">({ch.commission}%)</span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Channel Performance Row - Rate Parity Focus
 * Uses Win/Meet/Loss terminology for rate parity status
 * - Win: Channel priced higher than direct (green) - your direct rate is competitive
 * - Meet: Rates within ₹100 parity (cyan) - parity maintained
 * - Loss: Channel undercutting direct (red) - parity violation, needs attention
 * 
 * Key Metrics Shown:
 * - Channel Rate vs Direct Rate
 * - Commission %
 * - Net Effective Rate (after commission)
 * - Parity Score (0-100)
 */
const ChannelRow = ({ channel, index }: { channel: any; index: number }) => {
  const statusConfig = {
    win: { bg: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400', label: 'Win', icon: '✓' },
    meet: { bg: 'bg-cyan-500', badge: 'bg-cyan-500/20 text-cyan-400', label: 'Meet', icon: '=' },
    loss: { bg: 'bg-rose-500', badge: 'bg-rose-500/20 text-rose-400', label: 'Loss', icon: '!' }
  };
  const config = statusConfig[channel.parityStatus as keyof typeof statusConfig] || statusConfig.meet;
  const isDirect = channel.name === 'Direct Website';

  return (
    <div className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all ${
      channel.parityStatus === 'loss' ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-slate-800/50'
    }`}>
      {/* Status indicator */}
      <div className={`w-1.5 h-8 rounded-full ${config.bg}`} />
      
      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{channel.name}</span>
          {!isDirect && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${config.badge}`}>
              {config.icon} {config.label}
            </span>
          )}
          {isDirect && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-400">
              BASE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
          <span className="text-white font-medium">{formatCurrency(channel.rate)}</span>
          {!isDirect && (
            <>
              <span className={channel.parityGapVsDirect > 0 ? 'text-emerald-400' : channel.parityGapVsDirect < 0 ? 'text-rose-400' : 'text-slate-400'}>
                {channel.parityGapVsDirect > 0 ? '+' : ''}{formatCurrency(channel.parityGapVsDirect)} vs direct
              </span>
              <span>{channel.commission}% comm</span>
            </>
          )}
          {isDirect && <span className="text-emerald-400">0% commission</span>}
        </div>
      </div>
      
      {/* Right side metrics */}
      <div className="text-right">
        {!isDirect ? (
          <>
            <p className="text-xs text-slate-400">Net Rate</p>
            <p className={`text-sm font-bold ${channel.netEffectiveRate < channel.directRate ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(channel.netEffectiveRate)}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-400">Your Rate</p>
            <p className="text-sm font-bold text-cyan-400">{formatCurrency(channel.rate)}</p>
          </>
        )}
      </div>
      
      {/* Parity score indicator */}
      {!isDirect && (
        <div className="w-10 text-center">
          <div className={`text-xs font-bold ${
            channel.parityScore >= 80 ? 'text-emerald-400' :
            channel.parityScore >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {Math.round(channel.parityScore)}
          </div>
          <div className="text-[9px] text-slate-600">score</div>
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced Competitor Card - Shows actionable competitive intelligence
 */
const CompetitorCard = ({ competitor, userTodayRate, expanded, onToggle }: { 
  competitor: any; 
  userTodayRate: number;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const isCheaper = competitor.todayRate < userTodayRate;
  const diffToday = competitor.todayRate - userTodayRate;
  
  return (
    <div className={`rounded-xl border transition-all ${
      competitor.threatLevel === 'high' ? 'bg-rose-500/5 border-rose-500/20' :
      competitor.threatLevel === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
      'bg-slate-800/30 border-white/5'
    }`}>
      {/* Main row - always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-white/5 transition-all"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {/* Threat indicator */}
          <div className={`w-2 h-full min-h-[40px] rounded-full ${
            competitor.threatLevel === 'high' ? 'bg-rose-500' :
            competitor.threatLevel === 'medium' ? 'bg-amber-500' :
            'bg-emerald-500'
          }`} />
          
          {/* Competitor info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{competitor.name}</p>
              {competitor.threatLevel !== 'low' && (
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  competitor.threatLevel === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {competitor.undercuttingDates.length} dates at risk
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{competitor.brand} • {competitor.stars}★</p>
          </div>
          
          {/* Today's rate comparison */}
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">Today</p>
            <p className="text-lg font-bold text-white">{formatCurrency(competitor.todayRate)}</p>
            <p className={`text-xs font-medium ${isCheaper ? 'text-rose-400' : 'text-emerald-400'}`}>
              {diffToday > 0 ? '+' : ''}{formatCurrency(diffToday)} vs you
            </p>
          </div>
          
          {/* 7-day trend */}
          <div className="text-right px-3 border-l border-white/5">
            <p className="text-xs text-slate-500 mb-0.5">Next 7 Days</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(competitor.avg7Day)}</p>
            <p className={`text-xs flex items-center justify-end gap-1 ${
              competitor.trend === 'increasing' ? 'text-rose-400' : 
              competitor.trend === 'decreasing' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {competitor.trend === 'increasing' ? <TrendingUp className="w-3 h-3" /> : 
               competitor.trend === 'decreasing' ? <TrendingDown className="w-3 h-3" /> : 
               <Minus className="w-3 h-3" />}
              {competitor.trend}
            </p>
          </div>
          
          {/* Expand indicator */}
          <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      
      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5">
          {/* Rate breakdown */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">Weekday Avg</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(competitor.avgWeekday)}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">Weekend Avg</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(competitor.avgWeekend)}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">Trend</p>
              <p className={`text-sm font-semibold ${
                competitor.trendPercent > 0 ? 'text-rose-400' : 
                competitor.trendPercent < 0 ? 'text-emerald-400' : 'text-white'
              }`}>
                {competitor.trendPercent > 0 ? '+' : ''}{competitor.trendPercent}%
              </p>
            </div>
          </div>
          
          {/* High-risk dates */}
          {competitor.undercuttingDates.length > 0 && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <p className="text-xs font-semibold text-rose-400">
                  Dates where {competitor.name} is significantly cheaper:
                </p>
              </div>
              <div className="space-y-2">
                {competitor.undercuttingDates.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{d.date} ({d.dayName})</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">Their rate: {formatCurrency(d.compRate)}</span>
                      <span className="text-rose-400 font-medium">You're {formatCurrency(d.gap)} higher</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-rose-500/20">
                <p className="text-xs text-slate-400">
                  <span className="text-rose-400 font-medium">Recommended:</span> Review rates for these dates. 
                  Consider matching or justifying premium with value-adds.
                </p>
              </div>
            </div>
          )}
          
          {/* No threat - good standing */}
          {competitor.undercuttingDates.length === 0 && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-emerald-400">
                  Your rates are competitive against {competitor.name} across all dates.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Simple row for compact view
const CompetitorRowSimple = ({ competitor, userTodayRate }: { competitor: any; userTodayRate: number }) => {
  const diffToday = competitor.todayRate - userTodayRate;
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-all">
      <div className={`w-2 h-2 rounded-full ${
        competitor.threatLevel === 'high' ? 'bg-rose-500' :
        competitor.threatLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
      }`} />
      <span className="text-sm text-white flex-1">{competitor.name}</span>
      <span className="text-sm font-semibold text-white">{formatCurrency(competitor.todayRate)}</span>
      <span className={`text-xs ${diffToday < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
        {diffToday > 0 ? '+' : ''}{formatCurrency(diffToday)}
      </span>
    </div>
  );
};

/**
 * Main Dashboard Component
 */
function CompetitiveIntelligenceDashboard() {
  // Get today's date normalized to start of day
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(getToday);
  const [daysToShow, setDaysToShow] = useState<number>(30);
  const [selectedRoomType, setSelectedRoomType] = useState<string>(ROOM_TYPES[0].id);
  const [selectedRatePlan, setSelectedRatePlan] = useState<string>(RATE_PLANS[0].id);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);
  
  // Calculate end date for display
  const endDate = useMemo(() => {
    const end = new Date(selectedStartDate);
    end.setDate(end.getDate() + daysToShow - 1);
    return end;
  }, [selectedStartDate, daysToShow]);
  
  // Quick navigation functions
  const goToToday = () => setSelectedStartDate(getToday());
  const goToTomorrow = () => {
    const tomorrow = getToday();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedStartDate(tomorrow);
  };
  const goToNextWeek = () => {
    const nextWeek = getToday();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedStartDate(nextWeek);
  };
  const goToNextMonth = () => {
    const nextMonth = getToday();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedStartDate(nextMonth);
  };
  const goBack = () => {
    const newDate = new Date(selectedStartDate);
    newDate.setDate(newDate.getDate() - daysToShow);
    setSelectedStartDate(newDate);
  };
  const goForward = () => {
    const newDate = new Date(selectedStartDate);
    newDate.setDate(newDate.getDate() + daysToShow);
    setSelectedStartDate(newDate);
  };
  
  // Check if viewing today
  const isViewingToday = useMemo(() => {
    const today = getToday();
    return selectedStartDate.getTime() === today.getTime();
  }, [selectedStartDate]);
  
  // Format date for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const data = useMemo(() => {
    return generateCompetitiveData(selectedRoomType, selectedRatePlan, selectedStartDate, daysToShow);
  }, [selectedRoomType, selectedRatePlan, selectedStartDate, daysToShow, refreshKey]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <Link href="/" className="p-2 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 transition-all">
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </Link>
                <div>
                  <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    Competitive Intelligence
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Room Type */}
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="px-3 py-2 bg-slate-800/50 border border-white/5 rounded-xl text-sm focus:outline-none"
                >
                  {ROOM_TYPES.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                </select>
                
                {/* Rate Plan */}
                <select
                  value={selectedRatePlan}
                  onChange={(e) => setSelectedRatePlan(e.target.value)}
                  className="px-3 py-2 bg-slate-800/50 border border-white/5 rounded-xl text-sm focus:outline-none"
                >
                  {RATE_PLANS.map(rp => <option key={rp.id} value={rp.id}>{rp.name}</option>)}
                </select>

                {/* Separator */}
                <div className="h-6 w-px bg-white/10" />
                
                {/* Duration Selector */}
                <div className="flex items-center bg-slate-800/50 rounded-xl border border-white/5 p-0.5">
                  {[7, 14, 30, 60, 90].map(days => (
                    <button
                      key={days}
                      onClick={() => setDaysToShow(days)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        daysToShow === days
                          ? 'bg-cyan-500 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  className="p-2 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 transition-all"
                >
                  <RefreshCw className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
          
          {/* Priority Insights Banner */}
          {data.insights.filter(i => i.priority === 'high').length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <p className="text-sm text-amber-200">
                  <span className="font-semibold">{data.insights.filter(i => i.priority === 'high').length} High Priority Actions</span>
                  {' '}require your attention. Potential revenue impact: {formatCurrency(data.kpis.potentialRevenue)}/month
                </p>
                <ChevronRight className="w-4 h-4 text-amber-400 ml-auto" />
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <KPICard
              title={isViewingToday ? "Today's Rate" : `Rate on ${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              value={data.kpis.currentRate}
              format="currency"
              icon={DollarSign}
              gradient="cyan"
              trend={{ value: data.kpis.priceGapPercent, label: '' }}
              subtitle={`Market avg: ${formatCurrency(data.kpis.avgCompetitorRate)}`}
              actionHint={data.kpis.priceGapPercent < -3 ? 'Opportunity to increase' : undefined}
            />
            
            <KPICard
              title="Market Position"
              value={data.kpis.marketPosition === 'underpriced' ? 'Below Market' : 
                     data.kpis.marketPosition === 'premium' ? 'Premium' : 'Competitive'}
              icon={Target}
              gradient={data.kpis.marketPosition === 'underpriced' ? 'emerald' : 
                       data.kpis.marketPosition === 'premium' ? 'amber' : 'cyan'}
              subtitle={`${Math.abs(data.kpis.priceGapPercent)}% ${data.kpis.priceGapPercent < 0 ? 'below' : 'above'} avg`}
            />
            
            <KPICard
              title="Occupancy"
              value={data.kpis.avgUserOccupancy}
              format="percent"
              icon={Activity}
              gradient={data.kpis.avgUserOccupancy > 75 ? 'emerald' : data.kpis.avgUserOccupancy > 50 ? 'cyan' : 'amber'}
              subtitle={`${daysToShow}-day average`}
              actionHint={data.kpis.avgUserOccupancy > 80 ? 'High demand - raise rates' : undefined}
            />
            
            <KPICard
              title="Underpriced Days"
              value={data.kpis.underpricedDays}
              icon={TrendingUp}
              gradient={data.kpis.underpricedDays > 5 ? 'emerald' : 'cyan'}
              subtitle={`In selected ${daysToShow} days`}
              actionHint={data.kpis.underpricedDays > 3 ? 'Review these dates' : undefined}
            />
            
            <KPICard
              title="Parity Score"
              value={Math.round(data.channels.reduce((sum, c) => sum + (c.parityScore || 100), 0) / data.channels.length)}
              icon={CheckCircle}
              gradient={
                Math.round(data.channels.reduce((sum, c) => sum + (c.parityScore || 100), 0) / data.channels.length) >= 80 
                  ? 'emerald' 
                  : Math.round(data.channels.reduce((sum, c) => sum + (c.parityScore || 100), 0) / data.channels.length) >= 50 
                    ? 'amber' 
                    : 'rose'
              }
              subtitle={`${data.channels.filter(c => c.parityStatus === 'win' || c.parityStatus === 'meet').length}/${data.channels.length} channels OK`}
              actionHint={data.channels.filter(c => c.parityStatus === 'loss').length > 0 
                ? `${data.channels.filter(c => c.parityStatus === 'loss').length} parity violations` 
                : undefined}
            />
            
            <KPICard
              title="Demand Index"
              value={data.demandIntelligence?.summary?.avgDemandScore || 50}
              icon={Flame}
              gradient={
                (data.demandIntelligence?.summary?.avgDemandScore || 50) >= 70 
                  ? 'rose' 
                  : (data.demandIntelligence?.summary?.avgDemandScore || 50) >= 50 
                    ? 'amber' 
                    : 'cyan'
              }
              subtitle={`${data.demandIntelligence?.summary?.highDemandDays || 0} high demand days`}
              actionHint={
                (data.demandIntelligence?.summary?.avgDemandScore || 50) >= 70 
                  ? 'Strong demand - premium pricing' 
                  : (data.demandIntelligence?.summary?.avgDemandScore || 50) <= 40 
                    ? 'Low demand - consider promos'
                    : undefined
              }
            />
          </div>

          {/* UNIFIED ACTIONABLE RECOMMENDATIONS SECTION */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Actionable Recommendations</h3>
                    <p className="text-sm text-slate-500">Demand-based pricing actions • Flights, events & market signals</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="px-6 py-4 bg-slate-800/30 border-b border-white/5">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <QuickActionButton 
                  label="High Demand Days"
                  value={String(data.demandIntelligence.summary.highDemandDays)}
                  subtext="Raise rates"
                  color="emerald"
                />
                <QuickActionButton 
                  label="Upcoming Events"
                  value={String(data.demandIntelligence.summary.upcomingEvents)}
                  subtext={`Peak: ${data.demandIntelligence.summary.peakDays?.split(',')[0] || 'N/A'}`}
                  color="amber"
                />
                <QuickActionButton 
                  label="Avg Demand Score"
                  value={`${data.demandIntelligence.summary.avgDemandScore}/100`}
                  subtext={data.demandIntelligence.summary.avgDemandScore >= 60 ? 'Strong demand' : 'Moderate'}
                  color="cyan"
                />
                <QuickActionButton 
                  label="Expected Passengers"
                  value={`${(data.demandIntelligence.summary.totalExpectedPassengers / 1000).toFixed(0)}k`}
                  subtext="GOA arrivals"
                  color="cyan"
                />
                <QuickActionButton 
                  label="Revenue Potential"
                  value={formatCurrency(data.kpis.potentialRevenue)}
                  subtext="From optimization"
                  color="emerald"
                />
              </div>
            </div>
            
            <div className="p-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Context Cards */}
                <div className="space-y-4">
                  <FlightSummaryCard flights={data.demandIntelligence.flightData} />
                  <EventsSummaryCard events={data.demandIntelligence.events} />
                  
                  {/* Price Spike Alerts */}
                  {data.demandIntelligence.priceSpikeAlerts.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Flame className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-semibold text-white">Competitor Alerts</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">{data.demandIntelligence.priceSpikeAlerts.length}</span>
                      </div>
                      {data.demandIntelligence.priceSpikeAlerts.slice(0, 2).map((alert, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-800/50 mb-2 last:mb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white font-medium">{alert.competitorName}</span>
                            <span className="text-xs font-bold text-amber-400">+{alert.changePercent}%</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{alert.displayDate} • {alert.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Right Column: Action Cards */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-400" />
                      Priority Actions
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Increase
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> Adjust
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500" /> Alert
                      </span>
                    </div>
                  </div>
                  
                  {/* Priority Actions - Realistic, stakeholder-ready data */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {(() => {
                      // Build realistic action items from actual data
                      const actionItems: Array<{
                        type: 'increase' | 'decrease' | 'alert';
                        date: string;
                        title: string;
                        impact: string;
                        adjustment: number;
                        drivers: string[];
                        priority: 'high' | 'medium' | 'low';
                        demandScore: number;
                        eventDetails?: string;
                      }> = [];
                      
                      // Get forecasts with events for realistic data
                      data.demandIntelligence.forecasts.forEach((forecast) => {
                        const dayEvents = data.demandIntelligence.events.filter(e => {
                          const eventStart = e.date;
                          const eventEnd = e.endDate || e.date;
                          return forecast.date >= eventStart && forecast.date <= eventEnd;
                        });
                        
                        const dayFlights = data.demandIntelligence.flightData.find(f => f.date === forecast.date);
                        
                        // Only create action items for meaningful situations
                        if (dayEvents.length > 0 || forecast.overallScore >= 65 || forecast.overallScore <= 35 || forecast.isWeekend) {
                          const highImpactEvent = dayEvents.find(e => e.expectedImpact === 'high');
                          const mediumImpactEvent = dayEvents.find(e => e.expectedImpact === 'medium');
                          const mainEvent = highImpactEvent || mediumImpactEvent || dayEvents[0];
                          
                          let title = '';
                          let impact = '';
                          let adjustment = forecast.suggestedPriceAdjustment;
                          let priority: 'high' | 'medium' | 'low' = 'low';
                          
                          // Build flight info string
                          const flightInfo = dayFlights 
                            ? `${dayFlights.totalArrivals} flights • ${dayFlights.estimatedPassengers.toLocaleString()} passengers arriving`
                            : null;
                          
                          if (mainEvent) {
                            // Event-driven action
                            title = mainEvent.title;
                            if (mainEvent.expectedImpact === 'high') {
                              impact = flightInfo 
                                ? `${mainEvent.priceRecommendation}% premium opportunity • ${flightInfo}`
                                : `${mainEvent.priceRecommendation}% premium opportunity • ${mainEvent.description}`;
                              adjustment = mainEvent.priceRecommendation;
                              priority = 'high';
                            } else if (mainEvent.expectedImpact === 'medium') {
                              impact = flightInfo
                                ? `Expected ${Math.round(mainEvent.priceRecommendation * 0.7)}% ADR lift • ${flightInfo}`
                                : `Expected ${Math.round(mainEvent.priceRecommendation * 0.7)}% ADR lift • ${mainEvent.location}`;
                              adjustment = Math.round(mainEvent.priceRecommendation * 0.7);
                              priority = 'medium';
                            } else {
                              impact = flightInfo
                                ? `Minor demand boost • ${flightInfo}`
                                : `Minor demand boost • ${mainEvent.location}`;
                              adjustment = mainEvent.priceRecommendation;
                              priority = 'low';
                            }
                          } else if (forecast.overallScore >= 70) {
                            // High demand day without specific event
                            title = forecast.isWeekend ? 'Peak Weekend' : 'High Demand Period';
                            impact = flightInfo 
                              ? `Strong booking pace • ${flightInfo}`
                              : 'Strong booking pace • Peak season demand';
                            priority = forecast.overallScore >= 80 ? 'high' : 'medium';
                          } else if (forecast.overallScore <= 35) {
                            // Low demand - need promotions
                            title = 'Low Demand Alert';
                            impact = flightInfo
                              ? `Consider flash sale • Only ${flightInfo}`
                              : 'Consider flash sale or OTA visibility boost • Protect occupancy';
                            priority = 'medium';
                          } else if (forecast.isWeekend) {
                            title = 'Weekend Premium';
                            impact = flightInfo 
                              ? `Leisure travel peak • ${flightInfo}`
                              : 'Leisure travel peak • Standard weekend uplift';
                            priority = 'low';
                          } else {
                            return; // Skip unremarkable days
                          }
                          
                          // Build drivers list
                          const drivers: string[] = [];
                          if (mainEvent) {
                            drivers.push(mainEvent.category.charAt(0).toUpperCase() + mainEvent.category.slice(1));
                            if (mainEvent.isNational) drivers.push('National Holiday');
                          }
                          // Always show flight info in drivers if available
                          if (dayFlights) {
                            drivers.push(`✈️ ${dayFlights.totalArrivals} flights`);
                          }
                          if (forecast.isWeekend) drivers.push('Weekend');
                          if (forecast.factors.seasonality >= 80) drivers.push('Peak Season');
                          
                          actionItems.push({
                            type: adjustment > 0 ? 'increase' : adjustment < 0 ? 'decrease' : 'increase',
                            date: forecast.date,
                            title,
                            impact,
                            adjustment,
                            drivers: drivers.slice(0, 3),
                            priority,
                            demandScore: forecast.overallScore,
                            eventDetails: mainEvent?.description
                          });
                        }
                      });
                      
                      // Sort by DATE first (chronological), then by priority within same date
                      const sortedActions = actionItems
                        .sort((a, b) => {
                          // First sort by date (chronological)
                          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                          if (dateCompare !== 0) return dateCompare;
                          // Then by priority within same date
                          const priorityOrder = { high: 0, medium: 1, low: 2 };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        })
                        .slice(0, 12);
                      
                      return sortedActions.map((action, i) => (
                        <ActionCard
                          key={`action-${i}`}
                          type={action.type}
                          date={action.date}
                          title={action.title}
                          impact={action.impact}
                          currentRate={data.kpis.currentRate}
                          suggestedRate={Math.round(data.kpis.currentRate * (1 + action.adjustment / 100))}
                          adjustment={action.adjustment}
                          drivers={action.drivers}
                          priority={action.priority}
                          demandScore={action.demandScore}
                        />
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chart Section - Multi-Line Rate Comparison */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Rate Comparison Chart
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' • '}Toggle between Competitor View and Channel View • Hover for details
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-300">{data.roomType} • {data.ratePlan}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <MultiLineChart 
                rateHistory={data.rateHistory} 
                competitors={data.competitors} 
              />
              
              {/* Summary stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="text-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-xs text-slate-400 mb-1">Your Avg Rate</p>
                  <p className="text-xl font-bold text-cyan-400">{formatCurrency(data.kpis.avgUserRate)}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Market Avg</p>
                  <p className="text-xl font-bold text-emerald-400">{formatCurrency(data.kpis.avgCompetitorRate)}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Lowest Competitor</p>
                  <p className="text-xl font-bold text-amber-400">
                    {formatCurrency(Math.min(...data.dailyPriceStats.map(d => d.minCompetitorRate)))}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">Highest Competitor</p>
                  <p className="text-xl font-bold text-rose-400">
                    {formatCurrency(Math.max(...data.dailyPriceStats.map(d => d.maxCompetitorRate)))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Combined: Competitor Watch + Channel Performance - Optimized Layout */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            {/* Unified Header */}
            <div className="p-4 border-b border-white/5 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Competitor Watch</span>
                    {data.competitorPositioning.filter(c => c.threatLevel !== 'low').length > 0 && (
                      <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded font-medium">
                        {data.competitorPositioning.filter(c => c.threatLevel === 'high').length} at risk
                      </span>
                    )}
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Channel Performance</span>
                    <div className="flex items-center gap-2 text-[10px] ml-2">
                      <span className="flex items-center gap-1 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Win</span>
                      <span className="flex items-center gap-1 text-cyan-400"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />Meet</span>
                      <span className="flex items-center gap-1 text-rose-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" />Loss</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-400">Direct Rate:</span>
                    <span className="text-sm font-bold text-cyan-400">{formatCurrency(data.channels[0]?.rate || data.kpis.currentRate)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="text-xs text-slate-400">Parity:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {data.channels.filter(c => c.parityStatus === 'meet' || c.parityStatus === 'win').length}/{data.channels.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-white/5">
              {/* LEFT: Competitor Watch */}
              <div>
                {/* Your property mini-bar */}
                <div className="px-4 py-2 bg-cyan-500/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">{data.roomType}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isViewingToday ? "Today" : selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' • '}<span className="text-cyan-400">{data.competitorPositioning.filter(c => c.todayRate < data.kpis.currentRate).length}/{data.competitorPositioning.length}</span> below you
                  </p>
                </div>
                
                <div className="p-2 space-y-1.5 max-h-[280px] overflow-y-auto">
                  {data.competitorPositioning.map((comp) => (
                    <CompetitorCard 
                      key={comp.id} 
                      competitor={comp}
                      userTodayRate={data.kpis.currentRate}
                      expanded={expandedCompetitor === comp.id}
                      onToggle={() => setExpandedCompetitor(
                        expandedCompetitor === comp.id ? null : comp.id
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT: Channel Performance */}
              <div>
                {/* Channel Rate Parity Summary - Win/Meet/Loss */}
                <div className="px-4 py-2 bg-slate-800/30 border-b border-white/5">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-emerald-400">{data.channels.filter(c => c.parityStatus === 'win').length}</p>
                      <p className="text-[9px] text-slate-500">Win ✓</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan-400">{data.channels.filter(c => c.parityStatus === 'meet').length}</p>
                      <p className="text-[9px] text-slate-500">Meet =</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-400">{data.channels.filter(c => c.parityStatus === 'loss').length}</p>
                      <p className="text-[9px] text-slate-500">Loss !</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {Math.round(data.channels.reduce((sum, c) => sum + (c.parityScore || 0), 0) / data.channels.length)}
                      </p>
                      <p className="text-[9px] text-slate-500">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-400">
                        {Math.round(data.channels.slice(1).reduce((sum, c) => sum + c.commission, 0) / (data.channels.length - 1))}%
                      </p>
                      <p className="text-[9px] text-slate-500">Avg Comm</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 space-y-0.5 max-h-[280px] overflow-y-auto">
                  {data.channels.map((channel, i) => (
                    <ChannelRow key={channel.name} channel={channel} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Combined Footer Insights - Rate Parity Focus */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-800/30 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                <Zap className="w-3 h-3 text-cyan-400 inline mr-1" />
                <span className="text-cyan-400">{data.competitorPositioning.filter(c => c.threatLevel === 'high').length}</span> competitors at risk
                {data.channels.filter(c => c.parityStatus === 'loss').length > 0 && (
                  <>
                    {' • '}
                    <span className="text-rose-400">{data.channels.filter(c => c.parityStatus === 'loss').length}</span> channels need parity fix
                  </>
                )}
                {data.channels.filter(c => c.parityStatus === 'loss').length === 0 && (
                  <>
                    {' • '}
                    <span className="text-emerald-400">All channels at parity</span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Parity Health:</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => {
                      const score = Math.round(data.channels.reduce((sum, c) => sum + (c.parityScore || 0), 0) / data.channels.length);
                      const filled = i < Math.ceil(score / 20);
                      return (
                        <div key={i} className={`w-2 h-2 rounded-sm ${
                          filled ? (score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-slate-700'
                        }`} />
                      );
                    })}
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  data.kpis.currentRate > data.kpis.avgCompetitorRate 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {data.kpis.currentRate > data.kpis.avgCompetitorRate ? 'Premium' : 'Competitive'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CompetitiveIntelligenceDashboard;
