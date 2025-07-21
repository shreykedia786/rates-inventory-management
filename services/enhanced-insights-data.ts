/**
 * Enhanced Insights Data Service - Deep Granular Analytics
 * Provides room-specific, rate-plan-specific actionable insights for revenue managers
 */

export interface GranularAction {
  id: string;
  type: 'price_increase' | 'price_decrease' | 'inventory_open' | 'inventory_close' | 'channel_adjust';
  roomType: string;
  ratePlan: string;
  currentPrice?: number;
  recommendedPrice?: number;
  priceChange?: number;
  currentInventory?: number;
  recommendedInventory?: number;
  inventoryChange?: number;
  channel?: string;
  dates: string[];
  timeframe: string;
  reasoning: string;
  expectedRevenue: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  priority: number;
}

export interface RoomTypeAnalysis {
  roomType: string;
  currentADR: number;
  optimalADR: number;
  currentOccupancy: number;
  optimalOccupancy: number;
  revPAR: number;
  optimalRevPAR: number;
  performanceScore: number;
  trend: 'improving' | 'declining' | 'stable';
  actions: GranularAction[];
}

export interface RatePlanAnalysis {
  ratePlan: string;
  code: string;
  currentRate: number;
  marketPosition: 'premium' | 'competitive' | 'budget';
  bookingVelocity: number;
  conversionRate: number;
  channelPerformance: {
    channel: string;
    bookings: number;
    revenue: number;
    adr: number;
  }[];
  recommendations: GranularAction[];
}

export interface ChannelAnalysis {
  channel: string;
  currentShare: number;
  optimalShare: number;
  commission: number;
  profitability: number;
  bookingTrend: number;
  recommendations: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  type: 'pricing' | 'inventory' | 'channel';
  status: 'active' | 'paused' | 'testing';
  trigger: string;
  action: string;
  roomTypes: string[];
  ratePlans: string[];
  conditions: string[];
  performance: {
    timesTriggered: number;
    successRate: number;
    revenueImpact: number;
    lastTriggered: Date;
  };
}

export interface AnalyticsData {
  revenueAnalysis: {
    actualRevenue: number;
    forecastRevenue: number;
    variance: number;
    growthRate: number;
    segmentBreakdown: {
      segment: string;
      revenue: number;
      percentage: number;
      growth: number;
    }[];
  };
  roomPerformance: RoomTypeAnalysis[];
  ratePlanEffectiveness: RatePlanAnalysis[];
  channelAnalysis: ChannelAnalysis[];
  competitiveIntelligence: {
    property: string;
    adr: number;
    occupancy: number;
    revpar: number;
    marketShare: number;
    ratePosition: number;
  }[];
  forecastData: {
    period: string;
    predictedADR: number;
    predictedOccupancy: number;
    predictedRevPAR: number;
    confidence: number;
    factors: string[];
  }[];
}

export interface EnhancedInsight {
  id: string;
  title: string;
  summary: string;
  category: 'pricing' | 'inventory' | 'distribution' | 'competitive' | 'demand' | 'operational';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  
  // Deep granular actions
  granularActions: GranularAction[];
  
  // Room and rate specific analysis
  affectedRoomTypes: RoomTypeAnalysis[];
  affectedRatePlans: RatePlanAnalysis[];
  
  // Revenue Impact with specificity
  revenueImpact: {
    shortTerm: { amount: number; timeframe: string; probability: number };
    mediumTerm: { amount: number; timeframe: string; probability: number };
    longTerm: { amount: number; timeframe: string; probability: number };
    total: number;
  };
  
  // Market Context
  marketContext: {
    competitorActions: { property: string; action: string; impact: string }[];
    demandDrivers: { factor: string; impact: number; trend: string }[];
    seasonalFactors: { factor: string; multiplier: number; dates: string[] }[];
  };
  
  // Implementation roadmap
  implementation: {
    phase: number;
    action: string;
    timeline: string;
    dependencies: string[];
    risk: string;
  }[];
  
  // Performance tracking
  kpiTargets: {
    metric: string;
    current: number;
    target: number;
    timeframe: string;
  }[];
}

// Generate comprehensive, granular insights
export const generateGranularInsights = (): EnhancedInsight[] => [
  {
    id: 'granular-weekend-pricing-1',
    title: '🏖️ Weekend Premium Strategy: Room-Specific Pricing Optimization',
    summary: 'AI analysis reveals specific room types and rate plans underperforming weekend demand. Implement targeted 18-25% increases across 4 room categories.',
    category: 'pricing',
    urgency: 'high',
    confidence: 96,
    
    granularActions: [
      {
        id: 'action-1',
        type: 'price_increase',
        roomType: 'Deluxe Ocean View',
        ratePlan: 'Best Available Rate (BAR)',
        currentPrice: 3200,
        recommendedPrice: 3840,
        priceChange: 20,
        dates: ['2024-02-17', '2024-02-18', '2024-02-24', '2024-02-25'],
        timeframe: 'Implement by 4 PM today',
        reasoning: 'Competitor rates 22% higher, 89% booking pace',
        expectedRevenue: 45000,
        confidence: 94,
        risk: 'low',
        priority: 1
      },
      {
        id: 'action-2',
        type: 'price_increase',
        roomType: 'Premium Ocean View',
        ratePlan: 'Advance Purchase 7 (ADV7)',
        currentPrice: 4200,
        recommendedPrice: 4956,
        priceChange: 18,
        dates: ['2024-02-17', '2024-02-18', '2024-02-24', '2024-02-25'],
        timeframe: 'Implement by 4 PM today',
        reasoning: 'Limited inventory, premium positioning opportunity',
        expectedRevenue: 28000,
        confidence: 91,
        risk: 'low',
        priority: 2
      },
      {
        id: 'action-3',
        type: 'inventory_close',
        roomType: 'Standard City View',
        ratePlan: 'Corporate Rate (CORP)',
        currentInventory: 45,
        recommendedInventory: 25,
        inventoryChange: -20,
        dates: ['2024-02-17', '2024-02-18'],
        timeframe: 'Immediate',
        reasoning: 'Leisure rates 35% higher, protect high-value inventory',
        expectedRevenue: 22000,
        confidence: 88,
        risk: 'medium',
        priority: 3
      },
      {
        id: 'action-4',
        type: 'channel_adjust',
        roomType: 'All Room Types',
        ratePlan: 'All Rate Plans',
        channel: 'Booking.com',
        dates: ['2024-02-17', '2024-02-18', '2024-02-24', '2024-02-25'],
        timeframe: 'Within 2 hours',
        reasoning: 'Reduce allocation by 30%, increase direct booking rates',
        expectedRevenue: 15000,
        confidence: 85,
        risk: 'low',
        priority: 4
      }
    ],
    
    affectedRoomTypes: [
      {
        roomType: 'Deluxe Ocean View',
        currentADR: 3200,
        optimalADR: 3840,
        currentOccupancy: 78,
        optimalOccupancy: 78,
        revPAR: 2496,
        optimalRevPAR: 2995,
        performanceScore: 82,
        trend: 'improving',
        actions: [
          {
            id: 'deluxe-action-1',
            type: 'price_increase',
            roomType: 'Deluxe Ocean View',
            ratePlan: 'BAR',
            currentPrice: 3200,
            recommendedPrice: 3840,
            priceChange: 20,
            dates: ['2024-02-17', '2024-02-18'],
            timeframe: 'Today 4 PM',
            reasoning: 'Market positioning allows premium pricing',
            expectedRevenue: 45000,
            confidence: 94,
            risk: 'low',
            priority: 1
          }
        ]
      },
      {
        roomType: 'Premium Ocean View',
        currentADR: 4200,
        optimalADR: 4956,
        currentOccupancy: 85,
        optimalOccupancy: 85,
        revPAR: 3570,
        optimalRevPAR: 4212,
        performanceScore: 88,
        trend: 'stable',
        actions: []
      }
    ],
    
    affectedRatePlans: [
      {
        ratePlan: 'Best Available Rate',
        code: 'BAR',
        currentRate: 3200,
        marketPosition: 'competitive',
        bookingVelocity: 145,
        conversionRate: 12.5,
        channelPerformance: [
          { channel: 'Direct', bookings: 45, revenue: 144000, adr: 3200 },
          { channel: 'Booking.com', bookings: 38, revenue: 121600, adr: 3200 },
          { channel: 'Expedia', bookings: 22, revenue: 70400, adr: 3200 }
        ],
        recommendations: []
      }
    ],
    
    revenueImpact: {
      shortTerm: { amount: 110000, timeframe: 'Next 2 weekends', probability: 92 },
      mediumTerm: { amount: 285000, timeframe: 'Next 30 days', probability: 85 },
      longTerm: { amount: 520000, timeframe: 'Q1 2024', probability: 78 },
      total: 915000
    },
    
    marketContext: {
      competitorActions: [
        { property: 'Seaside Resort', action: 'Increased weekend rates by 15%', impact: 'Positive pricing pressure' },
        { property: 'Ocean Palace', action: 'Launched weekend packages', impact: 'Value differentiation opportunity' }
      ],
      demandDrivers: [
        { factor: 'Corporate events downtown', impact: 25, trend: 'increasing' },
        { factor: 'Weather forecast improvement', impact: 15, trend: 'stable' },
        { factor: 'Concert at venue nearby', impact: 35, trend: 'event-driven' }
      ],
      seasonalFactors: [
        { factor: 'Weekend leisure demand', multiplier: 1.4, dates: ['2024-02-17', '2024-02-18'] },
        { factor: 'Valentine weekend premium', multiplier: 1.2, dates: ['2024-02-24', '2024-02-25'] }
      ]
    },
    
    implementation: [
      {
        phase: 1,
        action: 'Update rates in PMS for Deluxe Ocean View BAR',
        timeline: 'Today 4:00 PM',
        dependencies: ['Revenue manager approval', 'PMS system access'],
        risk: 'Low - established pricing strategy'
      },
      {
        phase: 2,
        action: 'Adjust Premium Ocean View ADV7 rates',
        timeline: 'Today 5:00 PM',
        dependencies: ['Phase 1 completion', 'Channel manager sync'],
        risk: 'Low - advance purchase buffer'
      },
      {
        phase: 3,
        action: 'Restrict corporate inventory allocation',
        timeline: 'Today 6:00 PM',
        dependencies: ['Sales team notification', 'Corporate contract review'],
        risk: 'Medium - potential corporate client impact'
      }
    ],
    
    kpiTargets: [
      { metric: 'Weekend RevPAR', current: 2496, target: 2995, timeframe: 'This weekend' },
      { metric: 'Deluxe Ocean View ADR', current: 3200, target: 3840, timeframe: 'Next 48 hours' },
      { metric: 'Direct booking share', current: 28, target: 35, timeframe: 'Next 7 days' }
    ]
  },

  {
    id: 'event-driven-tech-conference-1',
    title: '🏢 Tech Conference Surge: AI Conference 2024 Opportunity',
    summary: 'Major tech conference (Feb 22-24) driving 340% booking surge. Implement dynamic pricing across all room types with 25-45% premiums.',
    category: 'demand',
    urgency: 'critical',
    confidence: 98,
    
    granularActions: [
      {
        id: 'conference-action-1',
        type: 'price_increase',
        roomType: 'Suite Ocean Front',
        ratePlan: 'Best Available Rate (BAR)',
        currentPrice: 6500,
        recommendedPrice: 9425,
        priceChange: 45,
        dates: ['2024-02-22', '2024-02-23', '2024-02-24'],
        timeframe: 'Immediate - Conference booking peak',
        reasoning: 'C-level executives attending, premium positioning justified',
        expectedRevenue: 87500,
        confidence: 97,
        risk: 'low',
        priority: 1
      },
      {
        id: 'conference-action-2',
        type: 'price_increase',
        roomType: 'Premium Ocean View',
        ratePlan: 'Corporate Rate (CORP)',
        currentPrice: 3800,
        recommendedPrice: 5130,
        priceChange: 35,
        dates: ['2024-02-22', '2024-02-23', '2024-02-24'],
        timeframe: 'Within 3 hours',
        reasoning: 'Tech companies willing to pay premium for proximity',
        expectedRevenue: 65800,
        confidence: 95,
        risk: 'low',
        priority: 2
      },
      {
        id: 'conference-action-3',
        type: 'inventory_close',
        roomType: 'Standard City View',
        ratePlan: 'Advance Purchase 14 (ADV14)',
        currentInventory: 40,
        recommendedInventory: 15,
        inventoryChange: -25,
        dates: ['2024-02-22', '2024-02-23', '2024-02-24'],
        timeframe: 'Immediate',
        reasoning: 'Protect inventory for higher-value corporate bookings',
        expectedRevenue: 45200,
        confidence: 92,
        risk: 'medium',
        priority: 3
      },
      {
        id: 'conference-action-4',
        type: 'price_increase',
        roomType: 'Deluxe Ocean View',
        ratePlan: 'Government Rate (GOV)',
        currentPrice: 2880,
        recommendedPrice: 3600,
        priceChange: 25,
        dates: ['2024-02-22', '2024-02-23', '2024-02-24'],
        timeframe: 'Today end of day',
        reasoning: 'Government attendees, moderate increase acceptable',
        expectedRevenue: 28600,
        confidence: 89,
        risk: 'low',
        priority: 4
      }
    ],
    
    affectedRoomTypes: [
      {
        roomType: 'Suite Ocean Front',
        currentADR: 6500,
        optimalADR: 9425,
        currentOccupancy: 65,
        optimalOccupancy: 95,
        revPAR: 4225,
        optimalRevPAR: 8954,
        performanceScore: 95,
        trend: 'improving',
        actions: []
      },
      {
        roomType: 'Premium Ocean View',
        currentADR: 4200,
        optimalADR: 5670,
        currentOccupancy: 82,
        optimalOccupancy: 98,
        revPAR: 3444,
        optimalRevPAR: 5557,
        performanceScore: 92,
        trend: 'improving',
        actions: []
      }
    ],
    
    affectedRatePlans: [
      {
        ratePlan: 'Corporate Rate',
        code: 'CORP',
        currentRate: 3800,
        marketPosition: 'premium',
        bookingVelocity: 485,
        conversionRate: 38.5,
        channelPerformance: [
          { channel: 'Direct Corporate', bookings: 285, revenue: 1083000, adr: 3800 },
          { channel: 'GDS', bookings: 145, revenue: 551000, adr: 3800 }
        ],
        recommendations: []
      }
    ],
    
    revenueImpact: {
      shortTerm: { amount: 227100, timeframe: 'Conference dates (3 days)', probability: 96 },
      mediumTerm: { amount: 385000, timeframe: 'Conference + spillover (7 days)', probability: 91 },
      longTerm: { amount: 620000, timeframe: 'Q1 corporate positioning', probability: 84 },
      total: 1232100
    },
    
    marketContext: {
      competitorActions: [
        { property: 'Business District Hotel', action: 'Increased rates 40% for conference', impact: 'Market supports premium pricing' },
        { property: 'Downtown Convention Center', action: 'Sold out, denying bookings', impact: 'Capture overflow demand' }
      ],
      demandDrivers: [
        { factor: 'AI Conference 2024 - 5,000 attendees', impact: 85, trend: 'event-driven' },
        { factor: 'Tech company travel budgets Q1', impact: 45, trend: 'increasing' },
        { factor: 'Proximity to convention center', impact: 65, trend: 'location-advantage' }
      ],
      seasonalFactors: [
        { factor: 'Business travel Q1 recovery', multiplier: 1.3, dates: ['2024-02-20', '2024-02-26'] },
        { factor: 'Conference premium period', multiplier: 1.8, dates: ['2024-02-22', '2024-02-24'] }
      ]
    },
    
    implementation: [
      {
        phase: 1,
        action: 'Immediate rate increase for Suite Ocean Front',
        timeline: 'Within 1 hour',
        dependencies: ['GM approval for >40% increase', 'PMS access'],
        risk: 'Low - justified by demand surge'
      },
      {
        phase: 2,
        action: 'Corporate rate adjustments across room types',
        timeline: 'Within 3 hours',
        dependencies: ['Corporate sales notification', 'Channel updates'],
        risk: 'Low - corporate clients expect event premiums'
      },
      {
        phase: 3,
        action: 'Inventory restrictions and minimum stays',
        timeline: 'Today EOD',
        dependencies: ['Reservations team briefing', 'OTA updates'],
        risk: 'Medium - potential guest friction'
      }
    ],
    
    kpiTargets: [
      { metric: 'Conference Period RevPAR', current: 3444, target: 6200, timeframe: 'Feb 22-24' },
      { metric: 'Corporate Segment ADR', current: 3800, target: 5130, timeframe: 'Conference week' },
      { metric: 'Suite Occupancy', current: 65, target: 95, timeframe: 'Conference dates' }
    ]
  },

  {
    id: 'event-driven-concert-series-2',
    title: '🎵 Stadium Concert Series: Multi-Night Music Events',
    summary: 'Popular artist 3-night concert series (Feb 18-20) creating music tourism surge. Target younger demographics with strategic packaging.',
    category: 'demand',
    urgency: 'high',
    confidence: 93,
    
    granularActions: [
      {
        id: 'concert-action-1',
        type: 'price_increase',
        roomType: 'Standard Garden View',
        ratePlan: 'Best Available Rate (BAR)',
        currentPrice: 2750,
        recommendedPrice: 3575,
        priceChange: 30,
        dates: ['2024-02-18', '2024-02-19', '2024-02-20'],
        timeframe: 'Immediate',
        reasoning: 'Music fans willing to pay premium, budget-conscious segment',
        expectedRevenue: 42500,
        confidence: 91,
        risk: 'medium',
        priority: 1
      },
      {
        id: 'concert-action-2',
        type: 'price_increase',
        roomType: 'Deluxe Ocean View',
        ratePlan: 'Package Rate (PKG)',
        currentPrice: 3400,
        recommendedPrice: 4420,
        priceChange: 30,
        dates: ['2024-02-18', '2024-02-19', '2024-02-20'],
        timeframe: 'Within 4 hours',
        reasoning: 'Concert + hotel packages popular with out-of-town guests',
        expectedRevenue: 35600,
        confidence: 88,
        risk: 'low',
        priority: 2
      },
      {
        id: 'concert-action-3',
        type: 'inventory_open',
        roomType: 'Standard City View',
        ratePlan: 'Flash Sale (FLASH)',
        currentInventory: 0,
        recommendedInventory: 25,
        inventoryChange: 25,
        dates: ['2024-02-18', '2024-02-19', '2024-02-20'],
        timeframe: 'Today 2 PM',
        reasoning: 'Capture last-minute concert-goers with competitive rates',
        expectedRevenue: 28800,
        confidence: 85,
        risk: 'low',
        priority: 3
      }
    ],
    
    affectedRoomTypes: [
      {
        roomType: 'Standard Garden View',
        currentADR: 2750,
        optimalADR: 3575,
        currentOccupancy: 69,
        optimalOccupancy: 85,
        revPAR: 1898,
        optimalRevPAR: 3039,
        performanceScore: 84,
        trend: 'improving',
        actions: []
      }
    ],
    
    affectedRatePlans: [
      {
        ratePlan: 'Package Rate',
        code: 'PKG',
        currentRate: 3400,
        marketPosition: 'competitive',
        bookingVelocity: 185,
        conversionRate: 22.5,
        channelPerformance: [
          { channel: 'Direct', bookings: 95, revenue: 323000, adr: 3400 },
          { channel: 'Booking.com', bookings: 75, revenue: 255000, adr: 3400 }
        ],
        recommendations: []
      }
    ],
    
    revenueImpact: {
      shortTerm: { amount: 106900, timeframe: 'Concert weekend (3 days)', probability: 89 },
      mediumTerm: { amount: 165000, timeframe: 'Concert month', probability: 82 },
      longTerm: { amount: 285000, timeframe: 'Music tourism season', probability: 76 },
      total: 556900
    },
    
    marketContext: {
      competitorActions: [
        { property: 'Music District Hotel', action: 'Launched concert packages', impact: 'Need competitive response' },
        { property: 'Stadium View Inn', action: 'Increased rates 25%', impact: 'Market supports increases' }
      ],
      demandDrivers: [
        { factor: 'Popular artist - 45K stadium capacity', impact: 75, trend: 'event-driven' },
        { factor: 'Out-of-town music tourists', impact: 55, trend: 'increasing' },
        { factor: 'Social media buzz and FOMO', impact: 35, trend: 'viral' }
      ],
      seasonalFactors: [
        { factor: 'Concert weekend premium', multiplier: 1.6, dates: ['2024-02-18', '2024-02-20'] },
        { factor: 'Music tourism season start', multiplier: 1.2, dates: ['2024-02-15', '2024-02-29'] }
      ]
    },
    
    implementation: [
      {
        phase: 1,
        action: 'Launch concert package rates and promotions',
        timeline: 'Today 2:00 PM',
        dependencies: ['Marketing approval', 'Package creation in PMS'],
        risk: 'Low - established event pricing strategy'
      },
      {
        phase: 2,
        action: 'Social media marketing push for packages',
        timeline: 'Today 4:00 PM',
        dependencies: ['Package rates live', 'Social media assets'],
        risk: 'Low - digital marketing execution'
      },
      {
        phase: 3,
        action: 'Flash sale inventory release',
        timeline: 'Today 6:00 PM',
        dependencies: ['Rate approvals', 'Channel distribution'],
        risk: 'Medium - revenue dilution risk'
      }
    ],
    
    kpiTargets: [
      { metric: 'Concert Weekend Occupancy', current: 69, target: 85, timeframe: 'Feb 18-20' },
      { metric: 'Package Rate Bookings', current: 12, target: 45, timeframe: 'Concert weekend' },
      { metric: 'Music Tourism RevPAR', current: 1898, target: 3039, timeframe: 'Feb 15-29' }
    ]
  },

  {
    id: 'granular-inventory-optimization-2',
    title: '🏢 Corporate vs Leisure Inventory Reallocation Strategy',
    summary: 'Detailed analysis shows Corporate segment underperforming by 23% vs leisure rates. Implement precise room-type reallocation across 6 rate plans.',
    category: 'inventory',
    urgency: 'medium',
    confidence: 89,
    
    granularActions: [
      {
        id: 'inv-action-1',
        type: 'inventory_close',
        roomType: 'Standard City View',
        ratePlan: 'Corporate Rate (CORP)',
        currentInventory: 60,
        recommendedInventory: 35,
        inventoryChange: -25,
        dates: ['2024-02-20', '2024-02-21', '2024-02-22'],
        timeframe: 'Within 24 hours',
        reasoning: 'Corporate ADR ₹2400 vs Leisure ADR ₹3100 - 29% gap',
        expectedRevenue: 38000,
        confidence: 91,
        risk: 'medium',
        priority: 1
      },
      {
        id: 'inv-action-2',
        type: 'price_increase',
        roomType: 'Standard City View',
        ratePlan: 'Best Available Rate (BAR)',
        currentPrice: 2800,
        recommendedPrice: 3080,
        priceChange: 10,
        dates: ['2024-02-20', '2024-02-21', '2024-02-22'],
        timeframe: 'Same day as inventory change',
        reasoning: 'Capitalize on reallocated inventory with premium pricing',
        expectedRevenue: 27000,
        confidence: 87,
        risk: 'low',
        priority: 2
      }
    ],
    
    affectedRoomTypes: [
      {
        roomType: 'Standard City View',
        currentADR: 2600,
        optimalADR: 2990,
        currentOccupancy: 72,
        optimalOccupancy: 78,
        revPAR: 1872,
        optimalRevPAR: 2332,
        performanceScore: 74,
        trend: 'improving',
        actions: []
      },
      {
        roomType: 'Standard Garden View',
        currentADR: 2750,
        optimalADR: 3135,
        currentOccupancy: 69,
        optimalOccupancy: 75,
        revPAR: 1898,
        optimalRevPAR: 2351,
        performanceScore: 76,
        trend: 'stable',
        actions: []
      }
    ],
    
    affectedRatePlans: [
      {
        ratePlan: 'Corporate Rate',
        code: 'CORP',
        currentRate: 2400,
        marketPosition: 'budget',
        bookingVelocity: 85,
        conversionRate: 22.5,
        channelPerformance: [
          { channel: 'Direct Corporate', bookings: 325, revenue: 780000, adr: 2400 },
          { channel: 'GDS', bookings: 145, revenue: 348000, adr: 2400 }
        ],
        recommendations: []
      }
    ],
    
    revenueImpact: {
      shortTerm: { amount: 65000, timeframe: 'Next 7 days', probability: 89 },
      mediumTerm: { amount: 185000, timeframe: 'Next 30 days', probability: 84 },
      longTerm: { amount: 420000, timeframe: 'Q1 2024', probability: 76 },
      total: 670000
    },
    
    marketContext: {
      competitorActions: [
        { property: 'Business Hotel A', action: 'Reduced corporate rates by 5%', impact: 'Competitive pressure on corp segment' },
        { property: 'Business Hotel B', action: 'Enhanced corporate packages', impact: 'Value competition increase' }
      ],
      demandDrivers: [
        { factor: 'Leisure travel recovery', impact: 35, trend: 'increasing' },
        { factor: 'Corporate travel budget constraints', impact: -15, trend: 'stable' },
        { factor: 'Weekend demand surge', impact: 28, trend: 'seasonal' }
      ],
      seasonalFactors: [
        { factor: 'Corporate Q1 budget availability', multiplier: 0.85, dates: ['2024-02-01', '2024-02-29'] },
        { factor: 'Leisure Valentine demand', multiplier: 1.25, dates: ['2024-02-14', '2024-02-18'] }
      ]
    },
    
    implementation: [
      {
        phase: 1,
        action: 'Notify corporate sales team of inventory changes',
        timeline: 'Today 2:00 PM',
        dependencies: ['Sales director approval', 'Client communication plan'],
        risk: 'Medium - corporate relationship management'
      },
      {
        phase: 2,
        action: 'Adjust inventory allocation in PMS',
        timeline: 'Today 6:00 PM',
        dependencies: ['Sales notification', 'PMS configuration'],
        risk: 'Low - system implementation'
      },
      {
        phase: 3,
        action: 'Increase BAR rates for affected room types',
        timeline: 'Tomorrow 8:00 AM',
        dependencies: ['Inventory changes live', 'Channel distribution'],
        risk: 'Low - market positioning allows increase'
      }
    ],
    
    kpiTargets: [
      { metric: 'Revenue Mix (Leisure %)', current: 45, target: 58, timeframe: 'Next 14 days' },
      { metric: 'Standard Room ADR', current: 2675, target: 3035, timeframe: 'Next 21 days' },
      { metric: 'Corporate Denial Rate', current: 4, target: 8, timeframe: 'Next 7 days' }
    ]
  }
];

// Generate comprehensive analytics data
export const generateAnalyticsData = (): AnalyticsData => ({
  revenueAnalysis: {
    actualRevenue: 2847500,
    forecastRevenue: 2650000,
    variance: 7.4,
    growthRate: 12.8,
    segmentBreakdown: [
      { segment: 'Leisure', revenue: 1281375, percentage: 45, growth: 18.5 },
      { segment: 'Corporate', revenue: 967925, percentage: 34, growth: 5.2 },
      { segment: 'Group', revenue: 569475, percentage: 20, growth: 15.8 },
      { segment: 'Other', revenue: 28725, percentage: 1, growth: -2.1 }
    ]
  },
  
  roomPerformance: [
    {
      roomType: 'Deluxe Ocean View',
      currentADR: 3200,
      optimalADR: 3840,
      currentOccupancy: 78.5,
      optimalOccupancy: 82.0,
      revPAR: 2512,
      optimalRevPAR: 3149,
      performanceScore: 85,
      trend: 'improving',
      actions: []
    },
    {
      roomType: 'Premium Ocean View',
      currentADR: 4200,
      optimalADR: 4956,
      currentOccupancy: 82.1,
      optimalOccupancy: 85.5,
      revPAR: 3448,
      optimalRevPAR: 4237,
      performanceScore: 88,
      trend: 'stable',
      actions: []
    },
    {
      roomType: 'Standard City View',
      currentADR: 2600,
      optimalADR: 2990,
      currentOccupancy: 72.3,
      optimalOccupancy: 78.0,
      revPAR: 1880,
      optimalRevPAR: 2332,
      performanceScore: 74,
      trend: 'improving',
      actions: []
    },
    {
      roomType: 'Standard Garden View',
      currentADR: 2750,
      optimalADR: 3135,
      currentOccupancy: 69.8,
      optimalOccupancy: 75.5,
      revPAR: 1919,
      optimalRevPAR: 2367,
      performanceScore: 76,
      trend: 'declining',
      actions: []
    },
    {
      roomType: 'Suite Ocean Front',
      currentADR: 6500,
      optimalADR: 7475,
      currentOccupancy: 65.2,
      optimalOccupancy: 70.0,
      revPAR: 4238,
      optimalRevPAR: 5233,
      performanceScore: 82,
      trend: 'stable',
      actions: []
    }
  ],
  
  ratePlanEffectiveness: [
    {
      ratePlan: 'Best Available Rate',
      code: 'BAR',
      currentRate: 3200,
      marketPosition: 'competitive',
      bookingVelocity: 145,
      conversionRate: 12.5,
      channelPerformance: [
        { channel: 'Direct', bookings: 245, revenue: 784000, adr: 3200 },
        { channel: 'Booking.com', bookings: 189, revenue: 604800, adr: 3200 },
        { channel: 'Expedia', bookings: 156, revenue: 499200, adr: 3200 },
        { channel: 'Agoda', bookings: 98, revenue: 313600, adr: 3200 }
      ],
      recommendations: []
    },
    {
      ratePlan: 'Advance Purchase 7',
      code: 'ADV7',
      currentRate: 2880,
      marketPosition: 'budget',
      bookingVelocity: 210,
      conversionRate: 18.5,
      channelPerformance: [
        { channel: 'Direct', bookings: 189, revenue: 544320, adr: 2880 },
        { channel: 'Booking.com', bookings: 234, revenue: 673920, adr: 2880 },
        { channel: 'Expedia', bookings: 167, revenue: 481056, adr: 2880 }
      ],
      recommendations: []
    },
    {
      ratePlan: 'Corporate Rate',
      code: 'CORP',
      currentRate: 2400,
      marketPosition: 'budget',
      bookingVelocity: 85,
      conversionRate: 22.5,
      channelPerformance: [
        { channel: 'Direct Corporate', bookings: 325, revenue: 780000, adr: 2400 },
        { channel: 'GDS', bookings: 145, revenue: 348000, adr: 2400 }
      ],
      recommendations: []
    }
  ],
  
  channelAnalysis: [
    {
      channel: 'Direct',
      currentShare: 32,
      optimalShare: 38,
      commission: 0,
      profitability: 100,
      bookingTrend: 15.8,
      recommendations: ['Increase marketing spend', 'Enhance booking incentives', 'Improve website UX']
    },
    {
      channel: 'Booking.com',
      currentShare: 28,
      optimalShare: 22,
      commission: 15,
      profitability: 85,
      bookingTrend: 8.2,
      recommendations: ['Reduce allocation by 25%', 'Implement rate parity differential', 'Focus on direct conversion']
    },
    {
      channel: 'Expedia',
      currentShare: 18,
      optimalShare: 15,
      commission: 18,
      profitability: 82,
      bookingTrend: 5.5,
      recommendations: ['Negotiate commission rates', 'Optimize listing presence', 'Strategic inventory management']
    },
    {
      channel: 'Corporate Direct',
      currentShare: 15,
      optimalShare: 18,
      commission: 0,
      profitability: 92,
      bookingTrend: 3.2,
      recommendations: ['Enhance corporate portal', 'Expand sales outreach', 'Develop loyalty programs']
    },
    {
      channel: 'GDS',
      currentShare: 7,
      optimalShare: 7,
      commission: 12,
      profitability: 88,
      bookingTrend: -2.1,
      recommendations: ['Maintain current strategy', 'Monitor competitor rates', 'Optimize rate loading']
    }
  ],
  
  competitiveIntelligence: [
    {
      property: 'Your Property',
      adr: 3145,
      occupancy: 75.8,
      revpar: 2384,
      marketShare: 18.5,
      ratePosition: 2
    },
    {
      property: 'Seaside Resort',
      adr: 2890,
      occupancy: 82.1,
      revpar: 2372,
      marketShare: 22.1,
      ratePosition: 4
    },
    {
      property: 'Ocean Palace',
      adr: 3520,
      occupancy: 71.5,
      revpar: 2517,
      marketShare: 19.8,
      ratePosition: 1
    },
    {
      property: 'Coastal Grand',
      adr: 3150,
      occupancy: 78.2,
      revpar: 2463,
      marketShare: 16.5,
      ratePosition: 3
    },
    {
      property: 'Bay View Inn',
      adr: 2650,
      occupancy: 85.8,
      revpar: 2274,
      marketShare: 14.2,
      ratePosition: 5
    },
    {
      property: 'Harbor Hotel',
      adr: 2480,
      occupancy: 89.2,
      revpar: 2212,
      marketShare: 8.9,
      ratePosition: 6
    }
  ],
  
  forecastData: [
    {
      period: 'Next 7 Days',
      predictedADR: 3285,
      predictedOccupancy: 78.5,
      predictedRevPAR: 2579,
      confidence: 94,
      factors: ['Valentine weekend premium', 'Weather improvement', 'Competitor rate increases']
    },
    {
      period: 'Next 14 Days',
      predictedADR: 3156,
      predictedOccupancy: 76.2,
      predictedRevPAR: 2405,
      confidence: 89,
      factors: ['Post-holiday normalization', 'Corporate travel recovery', 'Event-driven demand']
    },
    {
      period: 'Next 30 Days',
      predictedADR: 3089,
      predictedOccupancy: 74.8,
      predictedRevPAR: 2311,
      confidence: 82,
      factors: ['Seasonal patterns', 'Market competition', 'Economic indicators']
    },
    {
      period: 'Q1 2024',
      predictedADR: 3145,
      predictedOccupancy: 76.5,
      predictedRevPAR: 2406,
      confidence: 76,
      factors: ['Spring booking patterns', 'Corporate budget cycles', 'Tourism recovery trends']
    }
  ]
});

// Generate automation rules data
export const generateAutomationData = (): AutomationRule[] => [
  {
    id: 'auto-1',
    name: 'Weekend Premium Pricing',
    type: 'pricing',
    status: 'active',
    trigger: 'Friday-Sunday arrivals AND occupancy forecast > 75%',
    action: 'Increase BAR rates by 15-25% based on demand intensity',
    roomTypes: ['Deluxe Ocean View', 'Premium Ocean View', 'Suite Ocean Front'],
    ratePlans: ['BAR', 'ADV7', 'ADV14'],
    conditions: ['Competitor rates support premium', 'No major events causing oversupply', 'Weather forecast favorable'],
    performance: {
      timesTriggered: 28,
      successRate: 89.3,
      revenueImpact: 485000,
      lastTriggered: new Date('2024-02-15T16:30:00')
    }
  },
  {
    id: 'auto-2',
    name: 'Last Minute Inventory Push',
    type: 'inventory',
    status: 'active',
    trigger: 'T-2 days AND occupancy forecast < 60%',
    action: 'Open all rate restrictions, increase OTA allocations by 40%',
    roomTypes: ['Standard City View', 'Standard Garden View'],
    ratePlans: ['BAR', 'SALE', 'FLASH'],
    conditions: ['No group blocks pending', 'Minimum ADR threshold maintained', 'Weather not severely adverse'],
    performance: {
      timesTriggered: 12,
      successRate: 75.0,
      revenueImpact: 125000,
      lastTriggered: new Date('2024-02-12T10:15:00')
    }
  },
  {
    id: 'auto-3',
    name: 'Corporate Rate Protection',
    type: 'inventory',
    status: 'active',
    trigger: 'Leisure demand > 140% pace AND weekend period',
    action: 'Reduce corporate inventory by 50%, increase minimum stay to 2 nights',
    roomTypes: ['Standard City View', 'Standard Garden View', 'Deluxe Ocean View'],
    ratePlans: ['CORP', 'GOV', 'NEGOT'],
    conditions: ['Corporate denial rate < 15%', 'Key account bookings protected', 'Advance booking window > 14 days'],
    performance: {
      timesTriggered: 15,
      successRate: 93.3,
      revenueImpact: 285000,
      lastTriggered: new Date('2024-02-14T14:20:00')
    }
  },
  {
    id: 'auto-4',
    name: 'Competitive Rate Response',
    type: 'pricing',
    status: 'active',
    trigger: 'Key competitor rate decrease > 10% AND booking pace decline > 20%',
    action: 'Match competitor rates within 5% for affected periods',
    roomTypes: ['All room types'],
    ratePlans: ['BAR', 'ADV7', 'ADV14'],
    conditions: ['Rate matching maintains minimum margins', 'Not during peak demand periods', 'Competitor action sustained > 24 hours'],
    performance: {
      timesTriggered: 8,
      successRate: 87.5,
      revenueImpact: 95000,
      lastTriggered: new Date('2024-02-10T09:45:00')
    }
  },
  {
    id: 'auto-5',
    name: 'Channel Optimization',
    type: 'channel',
    status: 'testing',
    trigger: 'Direct booking conversion > 15% AND OTA commission > 18%',
    action: 'Reduce OTA allocations by 20%, increase direct booking incentives',
    roomTypes: ['All room types'],
    ratePlans: ['BAR', 'PKG', 'PROMO'],
    conditions: ['Direct booking infrastructure stable', 'Marketing budget available', 'Customer satisfaction scores > 8.5'],
    performance: {
      timesTriggered: 5,
      successRate: 60.0,
      revenueImpact: 35000,
      lastTriggered: new Date('2024-02-08T11:30:00')
    }
  },
  {
    id: 'auto-6',
    name: 'Demand Surge Response',
    type: 'pricing',
    status: 'active',
    trigger: 'Booking pace > 150% historical average AND forecast accuracy > 85%',
    action: 'Progressive rate increases: +10% at 150% pace, +20% at 200% pace',
    roomTypes: ['Deluxe Ocean View', 'Premium Ocean View'],
    ratePlans: ['BAR', 'ADV7'],
    conditions: ['Rate increases do not exceed premium positioning', 'Guest satisfaction maintained', 'Competitor rates support increase'],
    performance: {
      timesTriggered: 22,
      successRate: 91.0,
      revenueImpact: 420000,
      lastTriggered: new Date('2024-02-16T13:15:00')
    }
  }
]; 