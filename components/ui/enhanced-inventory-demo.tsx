/**
 * Enhanced Inventory Modal Demo - Sample Implementation
 * Shows how to use the EnhancedInventoryModal with realistic data
 */
'use client';

import React, { useState } from 'react';
import { EnhancedInventoryModal } from './inventory-modal';

export function EnhancedInventoryDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enhanced mock data with comprehensive revenue management context
  const mockDemandData = {
    historical: [
      { date: '2024-01-15', occupancy: 78, demand: 42, dayOfWeek: 'Monday' },
      { date: '2024-01-16', occupancy: 82, demand: 45, dayOfWeek: 'Tuesday' },
      { date: '2024-01-17', occupancy: 85, demand: 48, dayOfWeek: 'Wednesday' },
      { date: '2024-01-18', occupancy: 91, demand: 52, dayOfWeek: 'Thursday' },
    ],
    currentDemand: 48,
    predictedDemand: 52,
    demandTrend: 'up' as const,
    optimalInventory: 55,
    riskLevel: 'medium' as const,
    
    // Enhanced RM Context
    competitorSnapshot: {
      avgAvailability: 42,
      pricePosition: 'premium' as const,
      marketShare: 18.5,
      competitorData: [
        { name: 'Grand Palace Hotel', availability: 38, rate: 8500, distance: 0.8, occupancyRate: 76 },
        { name: 'Royal Suites', availability: 22, rate: 9200, distance: 1.2, occupancyRate: 85 },
        { name: 'Business Center Inn', availability: 55, rate: 6800, distance: 2.1, occupancyRate: 62 },
        { name: 'Luxury Resort', availability: 15, rate: 12000, distance: 3.5, occupancyRate: 92 }
      ]
    },
    
    bookingPace: {
      vsLastYear: 15.2,
      vsForecast: 8.7,
      velocityTrend: 'accelerating' as const,
      daysOut: 14,
      criticalBookingWindow: false,
      pickupVsCompSet: 12.3
    },
    
    channelPerformance: [
      { channel: 'Direct Booking', conversion: 8.5, trend: 'up' as const, recommendedAction: 'Increase direct incentives - strong performance', marketShare: 35, efficiency: 92 },
      { channel: 'Booking.com', conversion: 3.2, trend: 'stable' as const, recommendedAction: 'Monitor competitor rates closely', marketShare: 28, efficiency: 78 },
      { channel: 'Expedia', conversion: 2.8, trend: 'down' as const, recommendedAction: 'Consider rate parity adjustment', marketShare: 22, efficiency: 71 },
      { channel: 'Agoda', conversion: 4.1, trend: 'up' as const, recommendedAction: 'Expand inventory allocation', marketShare: 15, efficiency: 85 }
    ],
    
    restrictionRecommendations: [
      {
        type: 'length_of_stay' as const,
        action: 'add' as const,
        reasoning: 'High demand period approaching - implement 2-night minimum to maximize revenue',
        revenueImpact: 125000,
        urgency: 'recommended' as const,
        confidence: 87
      },
      {
        type: 'advance_purchase' as const,
        action: 'modify' as const,
        reasoning: 'Reduce advance purchase discount from 15% to 10% - demand strength supports it',
        revenueImpact: 85000,
        urgency: 'immediate' as const,
        confidence: 92
      },
      {
        type: 'channel_closeout' as const,
        action: 'add' as const,
        reasoning: 'Close low-efficiency OTA channels, redirect to direct booking',
        revenueImpact: 156000,
        urgency: 'consider' as const,
        confidence: 78
      }
    ]
  };

  // Mock events data
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Tech Conference 2024',
      type: 'Conference',
      impact: 'high' as const,
      attendees: 2500,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-22'),
      venue: 'Convention Center',
      demandMultiplier: 1.4,
      proximity: 2.5,
      historicalImpact: {
        occupancyUplift: 35,
        adrChange: 25
      }
    },
    {
      id: 'event-2',
      title: 'Music Festival',
      type: 'Entertainment',
      impact: 'medium' as const,
      attendees: 8000,
      startDate: new Date('2024-01-25'),
      endDate: new Date('2024-01-27'),
      venue: 'City Park',
      demandMultiplier: 1.25,
      proximity: 5.2,
      historicalImpact: {
        occupancyUplift: 20,
        adrChange: 15
      }
    },
    {
      id: 'event-3',
      title: 'Corporate Summit',
      type: 'Business',
      impact: 'low' as const,
      attendees: 500,
      startDate: new Date('2024-01-30'),
      endDate: new Date('2024-01-30'),
      venue: 'Business District',
      demandMultiplier: 1.15,
      proximity: 8.1
    }
  ];

  // Mock AI insights
  const mockAIInsights = [
    {
      id: 'insight-1',
      type: 'recommendation' as const,
      title: 'Optimize Inventory for Tech Conference',
      message: 'Increase inventory to 60 rooms to capture demand surge from upcoming tech conference. Historical data shows 40% occupancy uplift.',
      reasoning: 'Analysis of similar events in the past 12 months shows significant demand increase within 5km radius.',
      confidence: 87,
      impact: 'high' as const,
      suggestedAction: 'Increase inventory by 8-10 rooms',
      potentialRevenue: 125000
    },
    {
      id: 'insight-2',
      type: 'warning' as const,
      title: 'Risk of Overbooking',
      message: 'Current demand trend suggests potential overbooking risk if inventory remains at current levels during peak periods.',
      reasoning: 'Demand forecasting model indicates 15% increase in bookings over next 7 days.',
      confidence: 75,
      impact: 'medium' as const,
      suggestedAction: 'Monitor booking pace closely',
      potentialRevenue: -50000
    },
    {
      id: 'insight-3',
      type: 'opportunity' as const,
      title: 'Weekend Inventory Optimization',
      message: 'Weekend inventory can be safely reduced by 5-8 rooms based on historical demand patterns.',
      reasoning: 'Weekend occupancy consistently 15-20% lower than weekdays in this market segment.',
      confidence: 92,
      impact: 'medium' as const,
      suggestedAction: 'Implement dynamic weekend inventory allocation',
      potentialRevenue: 35000
    }
  ];

  // Mock occupancy forecast
  const mockOccupancyForecast = {
    date: '2024-01-20',
    predictedOccupancy: 85,
    confidence: 78,
    factors: ['Tech Conference', 'Weekend Premium', 'Market Trends', 'Seasonal Patterns']
  };

  const handleSaveInventory = (newInventory: number) => {
    console.log('Inventory updated to:', newInventory);
    // Here you would typically make an API call to save the inventory
    // Example:
    // await updateInventory({ roomType: 'Deluxe Suite', date: '2024-01-20', inventory: newInventory });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Enhanced Inventory Management</h1>
        
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Revenue Management: Enhanced Inventory Intelligence
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience world-class inventory management with competitive intelligence, booking pace analysis, and strategic recommendations.
            </p>
          </div>
          
          {/* Revenue Management Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Smart Status</h3>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">Context-aware inventory status considering demand, competitive position, and booking velocity</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                <h3 className="font-medium text-green-900 dark:text-green-100">Competitive Intel</h3>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">Real-time competitor availability, rates, and market positioning analysis</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <h3 className="font-medium text-purple-900 dark:text-purple-100">Booking Pace</h3>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">Velocity tracking vs. last year, forecast, and competitive set performance</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🛡️</span>
                </div>
                <h3 className="font-medium text-orange-900 dark:text-orange-100">Strategy AI</h3>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">Intelligent restriction recommendations with revenue impact analysis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Current Status</h3>
              <div className="text-2xl font-bold text-blue-600">50</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Deluxe Suite - OPTIMAL</div>
              <div className="text-xs text-blue-500 mt-1">Competitive advantage position</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Booking Pace</h3>
              <div className="text-2xl font-bold text-green-600">{mockDemandData.currentDemand}</div>
              <div className="text-sm text-green-600 dark:text-green-400">+15.2% vs last year</div>
              <div className="text-xs text-green-500 mt-1">Accelerating velocity</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Revenue Opportunity</h3>
              <div className="text-2xl font-bold text-purple-600">{mockDemandData.optimalInventory}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">+₹366K potential</div>
              <div className="text-xs text-purple-500 mt-1">From strategy optimizations</div>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg 
                     hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium
                     shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Experience Smart Revenue Management
          </button>
        </div>

        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Demand Intelligence</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time demand analysis with historical patterns</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">AI Recommendations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smart inventory suggestions with confidence scores</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Event Impact Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track local events affecting demand patterns</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Revenue Impact</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time revenue projections for inventory changes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnhancedInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomName="Deluxe Suite"
        currentInventory={50}
        originalInventory={45}
        date="January 20, 2024"
        onSave={handleSaveInventory}
        demandData={mockDemandData}
        events={mockEvents}
        aiInsights={mockAIInsights}
        occupancyForecast={mockOccupancyForecast}
      />
    </div>
  );
} 