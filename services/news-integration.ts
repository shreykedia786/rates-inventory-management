/**
 * Comprehensive Agentic AI Insights Service for Rates & Inventory Management
 * Analyzes news, events, occupancy patterns, pricing trends, and market intelligence
 */

import { FreeNewsAPIsService } from './free-news-apis';

// Enhanced Insight Types
export type InsightCategory = 'news' | 'events' | 'occupancy' | 'pricing' | 'market' | 'competitor' | 'seasonal';

export type InsightSource = 'global_news' | 'local_events' | 'booking_data' | 'competitor_intelligence' | 
                           'market_analytics' | 'seasonal_patterns' | 'demand_forecasting' | 'pricing_engine';

// News Data Interfaces
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: Date;
  source: {
    id: string;
    name: string;
    category: 'business' | 'politics' | 'technology' | 'sports' | 'entertainment' | 'health' | 'science' | 'travel';
  };
  country: string;
  language: string;
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidenceScore: number;
  relevanceScore: number;
  impactType: 'travel_demand' | 'economic' | 'event_driven' | 'regulatory' | 'weather' | 'security' | 'health';
  geographicScope: 'local' | 'regional' | 'national' | 'international';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

// Event Data Interfaces
export interface EventData {
  id: string;
  name: string;
  description: string;
  type: 'conference' | 'festival' | 'sports' | 'concert' | 'trade_show' | 'holiday' | 'local_event' | 'corporate';
  startDate: Date;
  endDate: Date;
  location: {
    city: string;
    country: string;
    venue?: string;
    coordinates?: { lat: number; lng: number };
  };
  expectedAttendance: number;
  impactRadius: number; // km
  category: string;
  source: string;
  confidence: number;
  historicalImpact?: {
    demandIncrease: number;
    priceIncrease: number;
    occupancyRate: number;
  };
}

// Occupancy Analytics Interfaces
export interface OccupancyPattern {
  id: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  pattern: {
    date: Date;
    occupancyRate: number;
    averageRate: number;
    revpar: number;
    bookingPace: number;
    cancellationRate: number;
  }[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  seasonalAdjustment: number;
  competitorComparison: {
    market: number;
    advantage: number;
  };
}

// Pricing Intelligence Interfaces
export interface PricingIntelligence {
  id: string;
  roomType: string;
  currentPrice: number;
  optimalPrice: number;
  competitorPrices: {
    competitor: string;
    price: number;
    availability: boolean;
  }[];
  priceElasticity: number;
  demandForecast: number;
  revenueOptimization: {
    action: 'increase' | 'decrease' | 'maintain';
    percentage: number;
    expectedRevenue: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface MarketImpactAnalysis {
  newsArticleId?: string;
  eventId?: string;
  dataSource: InsightSource;
  category: InsightCategory;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  impactType: 'demand_increase' | 'demand_decrease' | 'price_pressure_up' | 'price_pressure_down' | 'capacity_constraint' | 'competitive_threat' | 'market_opportunity';
  affectedMarkets: string[];
  affectedPropertyTypes: string[];
  seasonalAdjustment: number;
  demandForecast: {
    shortTerm: number; // 7 days
    mediumTerm: number; // 30 days
    longTerm: number; // 90 days
  };
  pricingRecommendations: {
    immediateAction: 'increase' | 'decrease' | 'maintain' | 'dynamic';
    percentageChange: number;
    confidenceLevel: number;
    riskFactors: string[];
    targetSegments?: string[];
    channelStrategy?: { [channel: string]: number };
  };
  inventoryRecommendations: {
    action: 'restrict' | 'open' | 'optimize' | 'hold';
    reasoning: string;
    channelSpecific: Array<{
      channel: string;
      action: string;
      priority: number;
    }>;
    allotmentStrategy?: {
      corporate: number;
      leisure: number;
      group: number;
    };
  };
  competitorResponse: {
    likelyReaction: 'follow' | 'contrarian' | 'neutral';
    timeToReact: number; // hours
    marketShare: number;
  };
  // New fields for comprehensive analysis
  revenueImpact: {
    shortTermRevenue: number;
    mediumTermRevenue: number;
    longTermRevenue: number;
    riskAdjustedRevenue: number;
  };
  marketIntelligence: {
    bookingPaceChange: number;
    lengthOfStayTrend: number;
    advanceBookingWindow: number;
    cancellationRiskLevel: 'low' | 'medium' | 'high';
  };
}

export interface GlobalNewsInsight {
  id: string;
  title: string;
  summary: string;
  category: InsightCategory;
  source: InsightSource;
  impactAnalysis: MarketImpactAnalysis;
  triggerEvents: (NewsArticle | EventData)[];
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  autoApplyEnabled: boolean;
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'applied' | 'expired' | 'dismissed';
  predictiveScenarios: Array<{
    name: string;
    probability: number;
    revenueImpact: number;
    description: string;
    timeframe: string;
    actionItems: string[];
  }>;
  // Enhanced fields
  priority: number; // 1-10 scale
  tags: string[];
  relatedInsights: string[]; // IDs of related insights
  performanceMetrics?: {
    accuracyScore?: number;
    revenueGenerated?: number;
    implementationSuccess?: boolean;
  };
}

// News API Services
class NewsAPIService {
  private apiKey: string;
  private baseURL: string;
  
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
    this.baseURL = 'https://newsapi.org/v2';
  }

  /**
   * Fetch global news from multiple sources
   */
  async fetchGlobalNews(params: {
    keywords?: string[];
    countries?: string[];
    categories?: string[];
    language?: string;
    sortBy?: 'publishedAt' | 'relevancy' | 'popularity';
    pageSize?: number;
  }): Promise<NewsArticle[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.keywords?.length) {
        queryParams.append('q', params.keywords.join(' OR '));
      }
      
      if (params.countries?.length) {
        queryParams.append('country', params.countries.join(','));
      }
      
      if (params.categories?.length) {
        queryParams.append('category', params.categories.join(','));
      }
      
      queryParams.append('language', params.language || 'en');
      queryParams.append('sortBy', params.sortBy || 'publishedAt');
      queryParams.append('pageSize', (params.pageSize || 100).toString());
      queryParams.append('apiKey', this.apiKey);

      const response = await fetch(`${this.baseURL}/top-headlines?${queryParams}`);
      const data = await response.json();
      
      return data.articles.map((article: any) => ({
        id: this.generateId(article.url),
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        source: {
          id: article.source.id,
          name: article.source.name,
          category: this.categorizeSource(article.source.name)
        },
        country: this.extractCountry(article),
        language: params.language || 'en',
        keywords: this.extractKeywords(article.title + ' ' + article.description),
        sentiment: 'neutral', // Will be analyzed separately
        confidenceScore: 0.5,
        relevanceScore: 0.5,
        impactType: this.determineImpactType(article),
        geographicScope: this.determineGeographicScope(article),
        timeframe: this.determineTimeframe(article)
      }));
    } catch (error) {
      console.error('Error fetching global news:', error);
      throw error;
    }
  }

  /**
   * Fetch news specific to travel and hospitality
   */
  async fetchTravelNews(): Promise<NewsArticle[]> {
    const travelKeywords = [
      'hotel', 'travel', 'tourism', 'hospitality', 'airlines', 'booking',
      'vacation', 'business travel', 'conference', 'event', 'festival',
      'olympics', 'world cup', 'pandemic', 'border', 'visa', 'lockdown'
    ];

    return this.fetchGlobalNews({
      keywords: travelKeywords,
      categories: ['business', 'sports', 'entertainment'],
      countries: ['us', 'gb', 'de', 'fr', 'jp', 'au', 'ca', 'in', 'br', 'mx'],
      pageSize: 50
    });
  }

  private generateId(url: string): string {
    return btoa(url).slice(0, 16);
  }

  private categorizeSource(sourceName: string): NewsArticle['source']['category'] {
    const businessSources = ['bloomberg', 'reuters', 'financial times', 'wall street journal'];
    const travelSources = ['travel weekly', 'skift', 'travel + leisure'];
    
    const lowerName = sourceName.toLowerCase();
    
    if (businessSources.some(source => lowerName.includes(source))) return 'business';
    if (travelSources.some(source => lowerName.includes(source))) return 'travel';
    
    return 'business'; // Default
  }

  private extractCountry(article: any): string {
    // Simple country extraction - in production, use NLP
    return 'US'; // Default
  }

  private extractKeywords(text: string): string[] {
    const keywords = text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
    return keywords;
  }

  private determineImpactType(article: any): NewsArticle['impactType'] {
    const content = (article.title + ' ' + article.description).toLowerCase();
    
    if (content.includes('event') || content.includes('festival') || content.includes('conference')) {
      return 'event_driven';
    }
    if (content.includes('economy') || content.includes('recession') || content.includes('inflation')) {
      return 'economic';
    }
    if (content.includes('weather') || content.includes('storm') || content.includes('hurricane')) {
      return 'weather';
    }
    if (content.includes('security') || content.includes('terror') || content.includes('safety')) {
      return 'security';
    }
    if (content.includes('health') || content.includes('pandemic') || content.includes('virus')) {
      return 'health';
    }
    
    return 'travel_demand';
  }

  private determineGeographicScope(article: any): NewsArticle['geographicScope'] {
    const content = (article.title + ' ' + article.description).toLowerCase();
    
    if (content.includes('global') || content.includes('international') || content.includes('worldwide')) {
      return 'international';
    }
    if (content.includes('national') || content.includes('country')) {
      return 'national';
    }
    if (content.includes('region') || content.includes('state')) {
      return 'regional';
    }
    
    return 'local';
  }

  private determineTimeframe(article: any): NewsArticle['timeframe'] {
    const content = (article.title + ' ' + article.description).toLowerCase();
    
    if (content.includes('immediate') || content.includes('now') || content.includes('today')) {
      return 'immediate';
    }
    if (content.includes('next week') || content.includes('next month')) {
      return 'short_term';
    }
    if (content.includes('next year') || content.includes('2024') || content.includes('2025')) {
      return 'long_term';
    }
    
    return 'medium_term';
  }
}

// AI Analysis Service
class AINewsAnalysisService {
  /**
   * Analyze news articles for market impact using AI
   */
  async analyzeMarketImpact(articles: NewsArticle[]): Promise<MarketImpactAnalysis[]> {
    const analyses: MarketImpactAnalysis[] = [];
    
    for (const article of articles) {
      const analysis = await this.analyzeArticleImpact(article);
      if (analysis.impactLevel !== 'low') {
        analyses.push(analysis);
      }
    }
    
    return analyses.sort((a, b) => this.getImpactScore(b) - this.getImpactScore(a));
  }

  private async analyzeArticleImpact(article: NewsArticle): Promise<MarketImpactAnalysis> {
    const impactScore = this.calculateImpactScore(article);
    
    return {
      newsArticleId: article.id,
      dataSource: 'global_news',
      category: 'news',
      impactLevel: this.getImpactLevel(impactScore),
      impactType: this.determineImpactType(article),
      affectedMarkets: this.identifyAffectedMarkets(article),
      affectedPropertyTypes: this.identifyAffectedPropertyTypes(article),
      seasonalAdjustment: this.calculateSeasonalAdjustment(article),
      demandForecast: {
        shortTerm: this.calculateDemandForecast(article, 7),
        mediumTerm: this.calculateDemandForecast(article, 30),
        longTerm: this.calculateDemandForecast(article, 90)
      },
      pricingRecommendations: {
        immediateAction: this.getPricingAction(article, impactScore),
        percentageChange: this.calculatePriceChange(article, impactScore),
        confidenceLevel: article.confidenceScore,
        riskFactors: this.identifyRiskFactors(article),
        targetSegments: ['leisure', 'business', 'group'],
        channelStrategy: {
          direct: 1.0,
          ota: 0.8,
          corporate: 1.2,
          group: 0.9
        }
      },
      inventoryRecommendations: {
        action: this.getInventoryAction(article, impactScore),
        reasoning: this.getInventoryReasoning(article),
        channelSpecific: this.getChannelSpecificActions(article),
        allotmentStrategy: {
          corporate: 0.3,
          leisure: 0.5,
          group: 0.2
        }
      },
      competitorResponse: {
        likelyReaction: this.predictCompetitorResponse(article),
        timeToReact: this.estimateReactionTime(article),
        marketShare: 0.15 // Default market share
      },
      revenueImpact: {
        shortTermRevenue: impactScore * 1000,
        mediumTermRevenue: impactScore * 2500,
        longTermRevenue: impactScore * 5000,
        riskAdjustedRevenue: impactScore * 2000 * article.confidenceScore
      },
      marketIntelligence: {
        bookingPaceChange: impactScore * 0.1,
        lengthOfStayTrend: impactScore * 0.05,
        advanceBookingWindow: 14 + (impactScore * 7),
        cancellationRiskLevel: impactScore > 0.7 ? 'high' : impactScore > 0.4 ? 'medium' : 'low'
      }
    };
  }

  private calculateImpactScore(article: NewsArticle): number {
    let score = 0;
    
    // Base relevance score
    score += article.relevanceScore * 0.3;
    
    // Impact type weights
    const impactWeights = {
      'event_driven': 0.8,
      'economic': 0.7,
      'weather': 0.6,
      'security': 0.9,
      'health': 0.8,
      'regulatory': 0.5,
      'travel_demand': 0.6
    };
    score += (impactWeights[article.impactType] || 0.5) * 0.3;
    
    // Geographic scope weight
    const scopeWeights = {
      'international': 0.9,
      'national': 0.7,
      'regional': 0.5,
      'local': 0.3
    };
    score += (scopeWeights[article.geographicScope] || 0.5) * 0.2;
    
    // Timeframe urgency
    const timeframeWeights = {
      'immediate': 0.9,
      'short_term': 0.7,
      'medium_term': 0.5,
      'long_term': 0.3
    };
    score += (timeframeWeights[article.timeframe] || 0.5) * 0.2;
    
    return Math.min(score, 1.0);
  }

  private getImpactLevel(score: number): MarketImpactAnalysis['impactLevel'] {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  private getImpactScore(analysis: MarketImpactAnalysis): number {
    const levelScores = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return levelScores[analysis.impactLevel];
  }

  private determineImpactType(article: NewsArticle): MarketImpactAnalysis['impactType'] {
    const content = (article.title + ' ' + article.description).toLowerCase();
    
    if (content.includes('increase') || content.includes('boom') || content.includes('surge')) {
      return 'demand_increase';
    }
    if (content.includes('decrease') || content.includes('decline') || content.includes('drop')) {
      return 'demand_decrease';
    }
    if (content.includes('price') && content.includes('up')) {
      return 'price_pressure_up';
    }
    if (content.includes('price') && content.includes('down')) {
      return 'price_pressure_down';
    }
    
    return 'demand_increase'; // Default optimistic
  }

  private identifyAffectedMarkets(article: NewsArticle): string[] {
    // Placeholder - in production, use NLP to extract locations
    return ['New York', 'London', 'Tokyo', 'Paris'];
  }

  private identifyAffectedPropertyTypes(article: NewsArticle): string[] {
    const content = (article.title + ' ' + article.description).toLowerCase();
    const types: string[] = [];
    
    if (content.includes('business') || content.includes('corporate')) {
      types.push('business');
    }
    if (content.includes('luxury') || content.includes('premium')) {
      types.push('luxury');
    }
    if (content.includes('budget') || content.includes('economy')) {
      types.push('economy');
    }
    if (content.includes('resort') || content.includes('vacation')) {
      types.push('resort');
    }
    
    return types.length > 0 ? types : ['all'];
  }

  private calculateSeasonalAdjustment(article: NewsArticle): number {
    // Placeholder - in production, use historical seasonal data
    return 1.0;
  }

  private calculateDemandForecast(article: NewsArticle, days: number): number {
    const baseImpact = article.relevanceScore;
    const timeDecay = Math.exp(-days / 30); // Exponential decay
    return baseImpact * timeDecay;
  }

  private getPricingAction(article: NewsArticle, impactScore: number): MarketImpactAnalysis['pricingRecommendations']['immediateAction'] {
    if (article.impactType === 'event_driven' && impactScore > 0.7) {
      return 'increase';
    }
    if (article.impactType === 'economic' && impactScore > 0.6) {
      return 'decrease';
    }
    if (impactScore > 0.8) {
      return 'dynamic';
    }
    return 'maintain';
  }

  private calculatePriceChange(article: NewsArticle, impactScore: number): number {
    const baseChange = impactScore * 20; // Up to 20% change
    
    if (article.impactType === 'event_driven') {
      return baseChange * 1.5;
    }
    if (article.impactType === 'security' || article.impactType === 'health') {
      return -baseChange * 1.2;
    }
    
    return Math.max(-25, Math.min(25, baseChange));
  }

  private identifyRiskFactors(article: NewsArticle): string[] {
    const factors: string[] = [];
    
    if (article.impactType === 'security') {
      factors.push('Safety concerns may deter bookings');
    }
    if (article.impactType === 'health') {
      factors.push('Health restrictions may limit travel');
    }
    if (article.impactType === 'economic') {
      factors.push('Economic uncertainty affects travel spending');
    }
    if (article.geographicScope === 'international') {
      factors.push('Global impact may be unpredictable');
    }
    
    return factors;
  }

  private getInventoryAction(article: NewsArticle, impactScore: number): MarketImpactAnalysis['inventoryRecommendations']['action'] {
    if (article.impactType === 'event_driven' && impactScore > 0.7) {
      return 'restrict';
    }
    if (article.impactType === 'economic' && impactScore > 0.6) {
      return 'open';
    }
    if (impactScore > 0.8) {
      return 'optimize';
    }
    return 'hold';
  }

  private getInventoryReasoning(article: NewsArticle): string {
    return `Based on ${article.impactType} impact analysis from news: "${article.title.slice(0, 50)}..."`;
  }

  private getChannelSpecificActions(article: NewsArticle): MarketImpactAnalysis['inventoryRecommendations']['channelSpecific'] {
    return [
      { channel: 'Direct', action: 'Prioritize for best rates', priority: 1 },
      { channel: 'Booking.com', action: 'Optimize visibility', priority: 2 },
      { channel: 'Expedia', action: 'Maintain competitive position', priority: 3 }
    ];
  }

  private predictCompetitorResponse(article: NewsArticle): MarketImpactAnalysis['competitorResponse']['likelyReaction'] {
    if (article.impactType === 'event_driven') return 'follow';
    if (article.impactType === 'economic') return 'contrarian';
    return 'neutral';
  }

  private estimateReactionTime(article: NewsArticle): number {
    if (article.timeframe === 'immediate') return 2;
    if (article.timeframe === 'short_term') return 12;
    if (article.timeframe === 'medium_term') return 48;
    return 168; // 1 week
  }
}

// News Integration Service
export class NewsIntegrationService {
  private newsAPIService: NewsAPIService;
  private aiAnalysisService: AINewsAnalysisService;
  private freeNewsService: FreeNewsAPIsService;
  private eventAnalyticsService: EventAnalyticsService;
  private occupancyIntelligenceService: OccupancyIntelligenceService;
  private pricingIntelligenceService: PricingIntelligenceService;
  private insights: GlobalNewsInsight[] = [];

  constructor() {
    console.log('🔧 Initializing NewsIntegrationService...');
    this.newsAPIService = new NewsAPIService();
    this.aiAnalysisService = new AINewsAnalysisService();
    this.freeNewsService = new FreeNewsAPIsService();
    this.eventAnalyticsService = new EventAnalyticsService();
    this.occupancyIntelligenceService = new OccupancyIntelligenceService();
    this.pricingIntelligenceService = new PricingIntelligenceService();
    console.log('✅ NewsIntegrationService initialized successfully');
  }

  /**
   * Comprehensive insights fetching from all sources
   * This is the main entry point for the Agentic AI system
   */
  async fetchGlobalNews(): Promise<GlobalNewsInsight[]> {
    try {
      console.log('🔄 Fetching comprehensive insights from all sources...');
      
      // Fetch insights from all sources in parallel
      const [
        newsInsights,
        eventInsights,
        occupancyInsights,
        pricingInsights
      ] = await Promise.all([
        this.fetchNewsBasedInsights(),
        this.fetchEventBasedInsights(),
        this.fetchOccupancyBasedInsights(),
        this.fetchPricingBasedInsights()
      ]);

      // Combine all insights
      const allInsights = [
        ...newsInsights,
        ...eventInsights,
        ...occupancyInsights,
        ...pricingInsights
      ];

      // Sort by priority and urgency
      const sortedInsights = this.prioritizeInsights(allInsights);

      // Update internal cache
      this.insights = sortedInsights;

      console.log(`✅ Fetched ${sortedInsights.length} comprehensive insights:`, {
        news: newsInsights.length,
        events: eventInsights.length,
        occupancy: occupancyInsights.length,
        pricing: pricingInsights.length,
        total: sortedInsights.length
      });

      return sortedInsights;
    } catch (error) {
      console.error('❌ Error fetching comprehensive insights:', error);
      
      // Return comprehensive mock insights for development/demo
      console.log('🎭 Using comprehensive mock insights for demo/development');
      const mockInsights = this.generateMockInsights();
      
      // Update internal cache
      this.insights = mockInsights;
      
      console.log(`✅ Generated ${mockInsights.length} mock insights for demo:`, {
        critical: mockInsights.filter(i => i.urgency === 'critical').length,
        high: mockInsights.filter(i => i.urgency === 'high').length,
        medium: mockInsights.filter(i => i.urgency === 'medium').length,
        low: mockInsights.filter(i => i.urgency === 'low').length,
        total: mockInsights.length
      });

      return mockInsights;
    }
  }

  /**
   * Fetch news-based insights
   */
  private async fetchNewsBasedInsights(): Promise<GlobalNewsInsight[]> {
    try {
      const articles = await this.fetchFromAllSources();
      const analyses = await this.aiAnalysisService.analyzeMarketImpact(articles);
      return this.generateInsightsFromAnalysis(analyses, articles);
    } catch (error) {
      console.error('❌ Error fetching news insights:', error);
        return [];
    }
  }

  /**
   * Fetch event-based insights
   */
  private async fetchEventBasedInsights(): Promise<GlobalNewsInsight[]> {
    try {
      const events = await this.eventAnalyticsService.fetchRelevantEvents({
        city: 'New York', // In production, use actual hotel location
        radius: 50
      });
      
      const analyses = await this.eventAnalyticsService.analyzeEventImpact(events);
      return this.generateEventInsights(analyses, events);
    } catch (error) {
      console.error('❌ Error fetching event insights:', error);
      return [];
    }
  }

  /**
   * Fetch occupancy-based insights
   */
  private async fetchOccupancyBasedInsights(): Promise<GlobalNewsInsight[]> {
    try {
      // In production, fetch actual occupancy data from PMS
      const historicalData: any[] = [];
      const analyses = await this.occupancyIntelligenceService.analyzeOccupancyPatterns(historicalData);
      return this.generateOccupancyInsights(analyses);
    } catch (error) {
      console.error('❌ Error fetching occupancy insights:', error);
      return [];
    }
  }

  /**
   * Fetch pricing-based insights
   */
  private async fetchPricingBasedInsights(): Promise<GlobalNewsInsight[]> {
    try {
      // In production, fetch actual competitor and market data
      const competitorData: any[] = [];
      const marketData: any[] = [];
      const analyses = await this.pricingIntelligenceService.analyzePricingOpportunities(competitorData, marketData);
      return this.generatePricingInsights(analyses);
    } catch (error) {
      console.error('❌ Error fetching pricing insights:', error);
      return [];
    }
  }

  /**
   * Generate insights from event analysis
   */
  private generateEventInsights(analyses: MarketImpactAnalysis[], events: EventData[]): GlobalNewsInsight[] {
    return analyses.map(analysis => {
      const event = events.find(e => e.id === analysis.eventId);
      if (!event) return null;

      return {
        id: `event-insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${event.name} - ${this.getEventInsightTitle(analysis)}`,
        summary: `${event.description} Expected to ${this.getImpactDescription(analysis)}.`,
        category: 'events',
        source: 'local_events',
        impactAnalysis: analysis,
        triggerEvents: [event],
        confidence: analysis.pricingRecommendations.confidenceLevel,
        urgency: this.determineUrgency(analysis),
        actionRequired: this.determineActionRequired(analysis),
        autoApplyEnabled: this.shouldEnableAutoApply(analysis),
        createdAt: new Date(),
        expiresAt: new Date(event.endDate.getTime() + 24 * 60 * 60 * 1000), // 1 day after event
        status: 'active',
        predictiveScenarios: this.generatePredictiveScenarios(analysis),
        priority: this.calculatePriority(analysis),
        tags: this.generateEventTags(analysis, event),
        relatedInsights: []
      };
    }).filter(Boolean) as GlobalNewsInsight[];
  }

  /**
   * Generate insights from occupancy analysis
   */
  private generateOccupancyInsights(analyses: MarketImpactAnalysis[]): GlobalNewsInsight[] {
    return analyses.map(analysis => ({
      id: `occupancy-insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.getOccupancyInsightTitle(analysis),
      summary: this.getOccupancyInsightSummary(analysis),
      category: 'occupancy',
      source: 'booking_data',
      impactAnalysis: analysis,
      triggerEvents: [],
      confidence: analysis.pricingRecommendations.confidenceLevel,
      urgency: this.determineUrgency(analysis),
      actionRequired: this.determineActionRequired(analysis),
      autoApplyEnabled: this.shouldEnableAutoApply(analysis),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'active',
      predictiveScenarios: this.generatePredictiveScenarios(analysis),
      priority: this.calculatePriority(analysis),
      tags: this.generateOccupancyTags(analysis),
      relatedInsights: []
    }));
  }

  /**
   * Generate insights from pricing analysis
   */
  private generatePricingInsights(analyses: MarketImpactAnalysis[]): GlobalNewsInsight[] {
    return analyses.map(analysis => ({
      id: `pricing-insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.getPricingInsightTitle(analysis),
      summary: this.getPricingInsightSummary(analysis),
      category: 'pricing',
      source: analysis.dataSource,
      impactAnalysis: analysis,
      triggerEvents: [],
      confidence: analysis.pricingRecommendations.confidenceLevel,
      urgency: this.determineUrgency(analysis),
      actionRequired: this.determineActionRequired(analysis),
      autoApplyEnabled: this.shouldEnableAutoApply(analysis),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      status: 'active',
      predictiveScenarios: this.generatePredictiveScenarios(analysis),
      priority: this.calculatePriority(analysis),
      tags: this.generatePricingTags(analysis),
      relatedInsights: []
    }));
  }

  /**
   * Prioritize insights based on urgency, impact, and revenue potential
   */
  private prioritizeInsights(insights: GlobalNewsInsight[]): GlobalNewsInsight[] {
    return insights.sort((a, b) => {
      // Primary sort: urgency
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Secondary sort: priority
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff !== 0) return priorityDiff;

      // Tertiary sort: revenue impact
      const revenueA = a.impactAnalysis.revenueImpact.riskAdjustedRevenue;
      const revenueB = b.impactAnalysis.revenueImpact.riskAdjustedRevenue;
      return revenueB - revenueA;
    });
  }

  // Helper methods for generating insight titles and summaries
  private getEventInsightTitle(analysis: MarketImpactAnalysis): string {
    const action = analysis.pricingRecommendations.immediateAction;
    const percentage = Math.abs(analysis.pricingRecommendations.percentageChange);
    return `${action === 'increase' ? 'Increase' : 'Adjust'} Rates by ${percentage}%`;
  }

  private getImpactDescription(analysis: MarketImpactAnalysis): string {
    const impact = analysis.impactType;
    switch (impact) {
      case 'demand_increase': return 'drive significant demand increase';
      case 'demand_decrease': return 'reduce demand temporarily';
      case 'price_pressure_up': return 'create pricing opportunities';
      case 'price_pressure_down': return 'require competitive pricing';
      default: return 'impact market conditions';
    }
  }

  private getOccupancyInsightTitle(analysis: MarketImpactAnalysis): string {
    if (analysis.impactType === 'market_opportunity') {
      return analysis.demandForecast.shortTerm < 0 
        ? 'Low Occupancy Alert - Revenue Recovery Opportunity'
        : 'High Demand Pattern Detected - Optimize Rates';
    }
    return 'Occupancy Pattern Analysis';
  }

  private getOccupancyInsightSummary(analysis: MarketImpactAnalysis): string {
    const action = analysis.pricingRecommendations.immediateAction;
    const percentage = Math.abs(analysis.pricingRecommendations.percentageChange);
    return `${analysis.inventoryRecommendations.reasoning} Recommend ${action} rates by ${percentage}%.`;
  }

  private getPricingInsightTitle(analysis: MarketImpactAnalysis): string {
    const action = analysis.pricingRecommendations.immediateAction;
    const percentage = Math.abs(analysis.pricingRecommendations.percentageChange);
    
    if (action === 'dynamic') {
      return 'Dynamic Pricing Optimization Opportunity';
    }
    return `Competitive Pricing Advantage - ${action === 'increase' ? 'Increase' : 'Adjust'} by ${percentage}%`;
  }

  private getPricingInsightSummary(analysis: MarketImpactAnalysis): string {
    return analysis.inventoryRecommendations.reasoning;
  }

  private generateEventTags(analysis: MarketImpactAnalysis, event: EventData): string[] {
    return Array.from(new Set([
      'events',
      analysis.impactLevel,
      event.type,
      event.category.toLowerCase(),
      ...analysis.affectedMarkets.slice(0, 2)
    ]));
  }

  private generateOccupancyTags(analysis: MarketImpactAnalysis): string[] {
    return Array.from(new Set([
      'occupancy',
      analysis.impactLevel,
      analysis.impactType,
      ...analysis.affectedMarkets.slice(0, 2)
    ]));
  }

  private generatePricingTags(analysis: MarketImpactAnalysis): string[] {
    return Array.from(new Set([
      'pricing',
      analysis.impactLevel,
      analysis.pricingRecommendations.immediateAction,
      ...analysis.affectedMarkets.slice(0, 2)
    ]));
  }

  /**
   * Get comprehensive sample insights for demonstration
   */
  private getComprehensiveSampleInsights(): GlobalNewsInsight[] {
    const insights: GlobalNewsInsight[] = [];

    // News-based insight
    insights.push({
      id: 'sample-news-1',
      title: 'Tech Conference Driving Demand Surge in Downtown Area',
      summary: 'Major technology conference expected to increase hotel demand by 40% in the downtown district over the next week.',
      category: 'news',
      source: 'global_news',
      impactAnalysis: {
        newsArticleId: 'sample-article-1',
        dataSource: 'global_news',
        category: 'news',
        impactLevel: 'high',
        impactType: 'demand_increase',
        affectedMarkets: ['Downtown', 'Business District'],
        affectedPropertyTypes: ['Business Hotels', 'Luxury Hotels'],
        seasonalAdjustment: 1.2,
        demandForecast: { shortTerm: 1.4, mediumTerm: 1.1, longTerm: 1.0 },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: 15,
          confidenceLevel: 0.85,
          riskFactors: ['Competitor response', 'Weather conditions'],
          targetSegments: ['business', 'corporate'],
          channelStrategy: { direct: 1.2, corporate: 1.3, ota: 1.1 }
        },
        inventoryRecommendations: {
          action: 'restrict',
          reasoning: 'High demand expected, optimize for revenue',
          channelSpecific: [
            { channel: 'Direct', action: 'increase_allocation', priority: 1 },
            { channel: 'Corporate', action: 'maintain', priority: 2 }
          ],
          allotmentStrategy: { corporate: 0.4, leisure: 0.3, group: 0.3 }
        },
        competitorResponse: { likelyReaction: 'follow', timeToReact: 24, marketShare: 0.15 },
        revenueImpact: {
          shortTermRevenue: 25000,
          mediumTermRevenue: 15000,
          longTermRevenue: 5000,
          riskAdjustedRevenue: 20000
        },
        marketIntelligence: {
          bookingPaceChange: 0.3,
          lengthOfStayTrend: 0.1,
          advanceBookingWindow: 21,
          cancellationRiskLevel: 'low'
        }
      },
      triggerEvents: [],
      confidence: 0.85,
      urgency: 'high',
      actionRequired: true,
      autoApplyEnabled: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictiveScenarios: [
        {
          name: 'High Demand',
          probability: 0.7,
          revenueImpact: 18.5,
          description: 'Conference attendance exceeds expectations',
          timeframe: '3-7 days',
          actionItems: ['Increase rates by 20%', 'Restrict OTA inventory', 'Focus on corporate bookings']
        }
      ],
      priority: 8,
      tags: ['news', 'high', 'demand_increase', 'Downtown', 'business'],
      relatedInsights: []
    });

    // Event-based insight
    insights.push({
      id: 'sample-event-1',
      title: 'Music Festival - Increase Rates by 25%',
      summary: 'Three-day music festival with 25,000 attendees. Expected to drive significant demand increase.',
      category: 'events',
      source: 'local_events',
      impactAnalysis: {
        eventId: 'event-music-festival',
        dataSource: 'local_events',
        category: 'events',
        impactLevel: 'critical',
        impactType: 'demand_increase',
        affectedMarkets: ['City Center', 'Entertainment District'],
        affectedPropertyTypes: ['Budget Hotels', 'Mid-scale Hotels', 'Boutique Hotels'],
        seasonalAdjustment: 1.2,
        demandForecast: { shortTerm: 0.35, mediumTerm: 0.21, longTerm: 0.07 },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: 25,
          confidenceLevel: 0.9,
          riskFactors: ['Weather conditions', 'Event cancellation risk'],
          targetSegments: ['leisure', 'group'],
          channelStrategy: { direct: 1.2, ota: 1.3, group: 1.4, corporate: 1.0 }
        },
        inventoryRecommendations: {
          action: 'restrict',
          reasoning: 'High demand expected due to Summer Music Festival. Optimize for revenue.',
          channelSpecific: [
            { channel: 'Direct', action: 'increase_allocation', priority: 1 },
            { channel: 'Group', action: 'special_rates', priority: 2 },
            { channel: 'OTA', action: 'premium_placement', priority: 3 }
          ],
          allotmentStrategy: { corporate: 0.2, leisure: 0.4, group: 0.4 }
        },
        competitorResponse: { likelyReaction: 'follow', timeToReact: 12, marketShare: 0.18 },
        revenueImpact: {
          shortTermRevenue: 50000,
          mediumTermRevenue: 30000,
          longTermRevenue: 10000,
          riskAdjustedRevenue: 40000
        },
        marketIntelligence: {
          bookingPaceChange: 0.4,
          lengthOfStayTrend: 0.1,
          advanceBookingWindow: 21,
          cancellationRiskLevel: 'low'
        }
      },
      triggerEvents: [],
      confidence: 0.9,
      urgency: 'critical',
      actionRequired: true,
      autoApplyEnabled: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictiveScenarios: [
        {
          name: 'Festival Success',
          probability: 0.8,
          revenueImpact: 35000,
          description: 'Festival proceeds with full attendance',
          timeframe: '3-5 days',
          actionItems: ['Implement surge pricing', 'Maximize group bookings', 'Restrict discounts']
        }
      ],
      priority: 9,
      tags: ['events', 'critical', 'festival', 'entertainment'],
      relatedInsights: []
    });

    // Occupancy-based insight
    insights.push({
      id: 'sample-occupancy-1',
      title: 'Low Occupancy Alert - Revenue Recovery Opportunity',
      summary: 'Low occupancy detected. Increase availability and implement promotional strategies.',
      category: 'occupancy',
      source: 'booking_data',
      impactAnalysis: {
        dataSource: 'booking_data',
        category: 'occupancy',
        impactLevel: 'high',
        impactType: 'market_opportunity',
        affectedMarkets: ['Downtown', 'Airport'],
        affectedPropertyTypes: ['Business Hotels'],
        seasonalAdjustment: 1.0,
        demandForecast: { shortTerm: -0.15, mediumTerm: 0.05, longTerm: 0.10 },
        pricingRecommendations: {
          immediateAction: 'decrease',
          percentageChange: -12,
          confidenceLevel: 0.82,
          riskFactors: ['Market saturation', 'Economic factors'],
          targetSegments: ['leisure', 'price-sensitive'],
          channelStrategy: { direct: 0.9, ota: 1.2, group: 1.1, corporate: 1.0 }
        },
        inventoryRecommendations: {
          action: 'open',
          reasoning: 'Low occupancy detected. Increase availability and implement promotional strategies.',
          channelSpecific: [
            { channel: 'OTA', action: 'increase_availability', priority: 1 },
            { channel: 'Direct', action: 'promotional_rates', priority: 2 },
            { channel: 'Group', action: 'flexible_terms', priority: 3 }
          ],
          allotmentStrategy: { corporate: 0.25, leisure: 0.55, group: 0.20 }
        },
        competitorResponse: { likelyReaction: 'follow', timeToReact: 48, marketShare: 0.20 },
        revenueImpact: {
          shortTermRevenue: -5000,
          mediumTermRevenue: 8000,
          longTermRevenue: 15000,
          riskAdjustedRevenue: 6000
        },
        marketIntelligence: {
          bookingPaceChange: -0.25,
          lengthOfStayTrend: 0.1,
          advanceBookingWindow: 12,
          cancellationRiskLevel: 'medium'
        }
      },
      triggerEvents: [],
      confidence: 0.82,
      urgency: 'high',
      actionRequired: true,
      autoApplyEnabled: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictiveScenarios: [
        {
          name: 'Recovery Strategy',
          probability: 0.6,
          revenueImpact: 8000,
          description: 'Promotional strategies drive occupancy recovery',
          timeframe: '7-14 days',
          actionItems: ['Launch promotional campaigns', 'Increase OTA presence', 'Flexible booking terms']
        }
      ],
      priority: 7,
      tags: ['occupancy', 'high', 'market_opportunity', 'Downtown'],
      relatedInsights: []
    });

    // Pricing-based insight
    insights.push({
      id: 'sample-pricing-1',
      title: 'Competitive Pricing Advantage - Increase by 8%',
      summary: 'Competitors pricing 8-12% higher. Opportunity to increase rates while maintaining competitiveness.',
      category: 'pricing',
      source: 'competitor_intelligence',
      impactAnalysis: {
        dataSource: 'competitor_intelligence',
        category: 'pricing',
        impactLevel: 'high',
        impactType: 'price_pressure_up',
        affectedMarkets: ['Business District', 'Airport'],
        affectedPropertyTypes: ['Business Hotels', 'Extended Stay'],
        seasonalAdjustment: 1.0,
        demandForecast: { shortTerm: 0.12, mediumTerm: 0.08, longTerm: 0.05 },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: 8,
          confidenceLevel: 0.88,
          riskFactors: ['Competitor reaction', 'Demand elasticity'],
          targetSegments: ['business', 'last-minute'],
          channelStrategy: { direct: 1.2, corporate: 1.1, ota: 1.3, group: 1.0 }
        },
        inventoryRecommendations: {
          action: 'optimize',
          reasoning: 'Competitors pricing 8-12% higher. Opportunity to increase rates while maintaining competitiveness.',
          channelSpecific: [
            { channel: 'Direct', action: 'rate_increase', priority: 1 },
            { channel: 'OTA', action: 'rate_increase', priority: 2 },
            { channel: 'Corporate', action: 'negotiate_rates', priority: 3 }
          ],
          allotmentStrategy: { corporate: 0.40, leisure: 0.35, group: 0.25 }
        },
        competitorResponse: { likelyReaction: 'neutral', timeToReact: 72, marketShare: 0.22 },
        revenueImpact: {
          shortTermRevenue: 12000,
          mediumTermRevenue: 20000,
          longTermRevenue: 25000,
          riskAdjustedRevenue: 19000
        },
        marketIntelligence: {
          bookingPaceChange: 0.08,
          lengthOfStayTrend: 0.05,
          advanceBookingWindow: 18,
          cancellationRiskLevel: 'low'
        }
      },
      triggerEvents: [],
      confidence: 0.88,
      urgency: 'medium',
      actionRequired: true,
      autoApplyEnabled: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'active',
      predictiveScenarios: [
        {
          name: 'Competitive Advantage',
          probability: 0.7,
          revenueImpact: 19000,
          description: 'Rate increase maintains competitiveness while boosting revenue',
          timeframe: '7-21 days',
          actionItems: ['Implement rate increase', 'Monitor competitor response', 'Track booking pace']
        }
      ],
      priority: 6,
      tags: ['pricing', 'high', 'increase', 'Business District'],
      relatedInsights: []
    });

    return insights;
  }

  /**
   * Generate comprehensive mock insights for development/demo
   * This provides realistic sample data when APIs are not available
   */
  private generateMockInsights(): GlobalNewsInsight[] {
    const mockInsights: GlobalNewsInsight[] = [
      {
        id: 'insight-1',
        title: '🏖️ Summer Travel Surge: Revenue Opportunity +40%',
        summary: 'Major airlines report significant uptick in domestic leisure travel, with weekend bookings leading the surge. Expected revenue increase of $125,000 over next 4 weeks.',
        category: 'news',
        source: 'global_news',
        impactAnalysis: this.getComprehensiveSampleInsights()[0].impactAnalysis,
        triggerEvents: [],
        confidence: 0.92,
        urgency: 'high',
        actionRequired: true,
        autoApplyEnabled: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        predictiveScenarios: [
          {
            name: 'Peak Summer Demand',
            probability: 0.85,
            revenueImpact: 125000,
            description: 'Strong weekend leisure travel continues with 40% booking increase',
            timeframe: '4 weeks',
            actionItems: [
              'Increase weekend rates by 10-15%',
              'Implement minimum stay restrictions',
              'Launch targeted promotional campaigns for mid-week'
            ]
          },
          {
            name: 'Extended Season',
            probability: 0.65,
            revenueImpact: 200000,
            description: 'Travel surge extends into fall shoulder season',
            timeframe: '8 weeks',
            actionItems: [
              'Extend premium pricing strategy',
              'Optimize inventory allocation',
              'Partner with local attractions'
            ]
          }
        ],
        priority: 8,
        tags: ['summer', 'leisure', 'weekend', 'opportunity'],
        relatedInsights: ['insight-4', 'insight-5']
      },
      {
        id: 'insight-2',
        title: '🎪 Tech Conference: Premium Pricing Opportunity',
        summary: 'Global Tech Summit (15,000 attendees) scheduled for next week. Historical data shows 95% occupancy with 40% RevPAR increase potential.',
        category: 'events',
        source: 'local_events',
        impactAnalysis: this.getComprehensiveSampleInsights()[1].impactAnalysis,
        triggerEvents: [],
        confidence: 0.87,
        urgency: 'critical',
        actionRequired: true,
        autoApplyEnabled: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active',
        predictiveScenarios: [
          {
            name: 'Conference Success',
            probability: 0.90,
            revenueImpact: 89000,
            description: 'Full attendance with extended stays and corporate packages',
            timeframe: '1 week',
            actionItems: [
              'Implement premium conference rates',
              'Close low-rate OTA channels',
              'Offer corporate packages with meeting space'
            ]
          },
          {
            name: 'Spillover Effects',
            probability: 0.70,
            revenueImpact: 35000,
            description: 'Extended bookings before and after conference dates',
            timeframe: '2 weeks',
            actionItems: [
              'Market extended stay packages',
              'Partner with conference organizers',
              'Optimize check-in/out processes'
            ]
          }
        ],
        priority: 9,
        tags: ['conference', 'corporate', 'technology', 'premium'],
        relatedInsights: ['insight-4']
      },
      {
        id: 'insight-3',
        title: '⚡ Competitor Alert: Major Rate Drop Detected',
        summary: 'Primary competitor reduced rates by 15% across all segments. Risk of market share loss estimated at $45,000 if no response within 48 hours.',
        category: 'competitor',
        source: 'competitor_intelligence',
        impactAnalysis: this.getComprehensiveSampleInsights()[2].impactAnalysis,
        triggerEvents: [],
        confidence: 0.94,
        urgency: 'critical',
        actionRequired: true,
        autoApplyEnabled: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'active',
        predictiveScenarios: [
          {
            name: 'Immediate Response',
            probability: 0.80,
            revenueImpact: -15000,
            description: 'Selective rate matching preserves market share',
            timeframe: '48 hours',
            actionItems: [
              'Review pricing strategy immediately',
              'Selective rate adjustments for low-demand periods',
              'Enhance value proposition with packages'
            ]
          },
          {
            name: 'No Response',
            probability: 0.60,
            revenueImpact: -45000,
            description: 'Market share erosion if no competitive response',
            timeframe: '1 week',
            actionItems: [
              'Monitor booking pace closely',
              'Prepare aggressive counter-pricing',
              'Strengthen direct booking incentives'
            ]
          }
        ],
        priority: 10,
        tags: ['competitor', 'pricing', 'urgent', 'market-share'],
        relatedInsights: ['insight-1', 'insight-4']
      },
      {
        id: 'insight-4',
        title: '📈 Corporate Travel Recovery: Long-term Growth',
        summary: 'Corporate travel spending shows strong 25% YoY recovery. Advanced booking patterns improving with $67,000 revenue opportunity identified.',
        category: 'market',
        source: 'market_analytics',
        impactAnalysis: this.getComprehensiveSampleInsights()[3].impactAnalysis,
        triggerEvents: [],
        confidence: 0.89,
        urgency: 'medium',
        actionRequired: false,
        autoApplyEnabled: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        predictiveScenarios: [
          {
            name: 'Sustained Recovery',
            probability: 0.75,
            revenueImpact: 67000,
            description: 'Corporate travel budgets return to pre-pandemic levels',
            timeframe: '3 months',
            actionItems: [
              'Strengthen corporate partnerships',
              'Develop mid-week business packages',
              'Enhance business amenities'
            ]
          },
          {
            name: 'Acceleration',
            probability: 0.45,
            revenueImpact: 120000,
            description: 'Corporate travel exceeds pre-pandemic levels',
            timeframe: '6 months',
            actionItems: [
              'Expand corporate account management',
              'Invest in business center upgrades',
              'Create executive floor packages'
            ]
          }
        ],
        priority: 6,
        tags: ['corporate', 'recovery', 'long-term', 'growth'],
        relatedInsights: ['insight-2', 'insight-5']
      },
      {
        id: 'insight-5',
        title: '🍂 Fall Conference Season: Seasonal Opportunity',
        summary: 'Historical patterns indicate 30% increase in corporate bookings during fall conference season. Preparation window for $78,000 revenue opportunity.',
        category: 'seasonal',
        source: 'seasonal_patterns',
        impactAnalysis: this.getComprehensiveSampleInsights()[4].impactAnalysis,
        triggerEvents: [],
        confidence: 0.91,
        urgency: 'low',
        actionRequired: false,
        autoApplyEnabled: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        predictiveScenarios: [
          {
            name: 'Typical Season',
            probability: 0.85,
            revenueImpact: 78000,
            description: 'Standard fall corporate booking patterns emerge',
            timeframe: '2 months',
            actionItems: [
              'Prepare inventory allocation for corporate blocks',
              'Review group booking policies',
              'Enhance meeting facilities'
            ]
          },
          {
            name: 'Strong Season',
            probability: 0.55,
            revenueImpact: 125000,
            description: 'Above-average corporate event activity',
            timeframe: '3 months',
            actionItems: [
              'Increase corporate rate premiums',
              'Expand meeting room capacity',
              'Partner with event planners'
            ]
          }
        ],
        priority: 5,
        tags: ['seasonal', 'corporate', 'fall', 'conferences'],
        relatedInsights: ['insight-1', 'insight-4']
      }
    ];

    return mockInsights;
  }

  /**
   * Fetch articles from all available sources
   */
  private async fetchFromAllSources(): Promise<NewsArticle[]> {
    console.log('🔄 Fetching from all sources...');
    
    try {
      // For now, focus on free APIs since they're more reliable
      const freeArticles = await this.freeNewsService.fetchAllFreeNews();
      console.log(`✅ Fetched ${freeArticles.length} articles from free sources`);
      
      // Try premium APIs if available (but don't fail if they don't work)
      let premiumArticles: NewsArticle[] = [];
      try {
        premiumArticles = await this.fetchFromPremiumAPIs();
        console.log(`✅ Fetched ${premiumArticles.length} articles from premium sources`);
      } catch (error) {
        console.warn('⚠️  Premium APIs not available:', error);
      }

      // Combine and deduplicate
      const allArticles = [...freeArticles, ...premiumArticles];
      return this.removeDuplicates(allArticles);

    } catch (error) {
      console.error('❌ Error fetching from all sources:', error);
      throw error;
    }
  }

  /**
   * Fetch from premium APIs (NewsAPI, etc.) - requires API keys
   */
  private async fetchFromPremiumAPIs(): Promise<NewsArticle[]> {
    const premiumArticles: NewsArticle[] = [];
    
    // Try NewsAPI
    try {
      const newsApiArticles = await this.newsAPIService.fetchGlobalNews({
        keywords: ['travel', 'tourism', 'hotel', 'economy', 'event'],
        countries: ['us', 'gb', 'de', 'fr', 'jp', 'au'],
        pageSize: 50
      });
      premiumArticles.push(...newsApiArticles);
    } catch (error) {
      console.warn('⚠️ NewsAPI not available');
    }
    
    return premiumArticles;
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    const uniqueArticles: NewsArticle[] = [];
    const seenTitles: string[] = [];
    
    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      // Check for similar titles (basic approach)
      let isDuplicate = false;
      for (const seenTitle of seenTitles) {
        if (this.calculateSimilarity(normalizedTitle, seenTitle) > 0.8) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueArticles.push(article);
        seenTitles.push(normalizedTitle);
      }
    }
    
    return uniqueArticles;
  }

  /**
   * Calculate similarity between two strings (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return commonWords.length / totalWords;
  }

  private generateInsightsFromAnalysis(
    analyses: MarketImpactAnalysis[], 
    articles: NewsArticle[]
  ): GlobalNewsInsight[] {
    return analyses.map(analysis => {
      const article = articles.find(a => a.id === analysis.newsArticleId);
      if (!article) return null;

      return {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: this.generateInsightTitle(analysis, article),
        summary: this.generateInsightSummary(analysis, article),
        category: analysis.category,
        source: analysis.dataSource,
        impactAnalysis: analysis,
        triggerEvents: [article],
        confidence: analysis.pricingRecommendations.confidenceLevel,
        urgency: this.determineUrgency(analysis),
        actionRequired: this.determineActionRequired(analysis),
        autoApplyEnabled: this.shouldEnableAutoApply(analysis),
        createdAt: new Date(),
        expiresAt: this.calculateExpirationDate(analysis),
        status: 'active',
        predictiveScenarios: this.generatePredictiveScenarios(analysis),
        priority: this.calculatePriority(analysis),
        tags: this.generateTags(analysis, article),
        relatedInsights: []
      };
    }).filter(Boolean) as GlobalNewsInsight[];
  }

  private generateInsightTitle(analysis: MarketImpactAnalysis, article: NewsArticle): string {
    const impactType = analysis.impactType.replace('_', ' ').toUpperCase();
    const level = analysis.impactLevel.toUpperCase();
    
    return `${level} ${impactType}: ${article.title.slice(0, 50)}...`;
  }

  private generateInsightSummary(analysis: MarketImpactAnalysis, article: NewsArticle): string {
    const action = analysis.pricingRecommendations.immediateAction;
    const change = Math.abs(analysis.pricingRecommendations.percentageChange);
    
    return `News analysis suggests ${action} pricing by ${change.toFixed(1)}% due to ${analysis.impactType.replace('_', ' ')}. Affected markets: ${analysis.affectedMarkets.join(', ')}.`;
  }

  private determineUrgency(analysis: MarketImpactAnalysis): GlobalNewsInsight['urgency'] {
    if (analysis.impactLevel === 'critical') return 'critical';
    if (analysis.impactLevel === 'high') return 'high';
    if (analysis.pricingRecommendations.immediateAction !== 'maintain') return 'medium';
    return 'low';
  }

  private determineActionRequired(analysis: MarketImpactAnalysis): boolean {
    return analysis.impactLevel === 'critical' || 
           analysis.impactLevel === 'high' ||
           analysis.pricingRecommendations.immediateAction !== 'maintain';
  }

  private shouldEnableAutoApply(analysis: MarketImpactAnalysis): boolean {
    return analysis.impactLevel === 'critical' && 
           analysis.pricingRecommendations.confidenceLevel > 0.8;
  }

  private calculateExpirationDate(analysis: MarketImpactAnalysis): Date {
    const now = new Date();
    const hours = analysis.competitorResponse.timeToReact * 2; // Expire after expected competitor reaction
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  }

  private calculatePriority(analysis: MarketImpactAnalysis): number {
    let priority = 5; // Base priority
    
    // Adjust based on impact level
    switch (analysis.impactLevel) {
      case 'critical': priority += 4; break;
      case 'high': priority += 3; break;
      case 'medium': priority += 1; break;
      case 'low': priority -= 1; break;
    }
    
    // Adjust based on revenue impact
    if (analysis.revenueImpact.shortTermRevenue > 10000) priority += 2;
    if (analysis.revenueImpact.riskAdjustedRevenue > 5000) priority += 1;
    
    return Math.max(1, Math.min(10, priority));
  }

  private generateTags(analysis: MarketImpactAnalysis, article: NewsArticle): string[] {
    const tags = [
      analysis.category,
      analysis.impactLevel,
      analysis.impactType,
      ...analysis.affectedMarkets.slice(0, 2),
      article.source.category
    ];
    
    return Array.from(new Set(tags)); // Remove duplicates
  }

  private generatePredictiveScenarios(analysis: MarketImpactAnalysis): GlobalNewsInsight['predictiveScenarios'] {
    const baseRevenue = analysis.revenueImpact.shortTermRevenue;
    
    return [
      {
        name: 'Optimistic Scenario',
      probability: 0.3,
        revenueImpact: baseRevenue * 1.5,
        description: 'Market responds favorably with higher than expected demand',
        timeframe: '7-14 days',
        actionItems: [
          'Monitor booking pace closely',
          'Prepare for dynamic pricing adjustments',
          'Increase marketing spend in key segments'
        ]
      },
      {
        name: 'Expected Scenario',
      probability: 0.5,
        revenueImpact: baseRevenue,
        description: 'Market performs as predicted by AI analysis',
        timeframe: '7-30 days',
        actionItems: [
          'Implement recommended pricing changes',
          'Adjust inventory allocation',
          'Monitor competitor responses'
        ]
      },
      {
        name: 'Conservative Scenario',
      probability: 0.2,
        revenueImpact: baseRevenue * 0.7,
        description: 'Market shows lower response or external factors interfere',
        timeframe: '14-45 days',
        actionItems: [
          'Prepare contingency pricing strategy',
          'Consider additional marketing channels',
          'Review and adjust forecasting models'
        ]
      }
    ];
  }
}

// Event Analytics Service - moved before NewsIntegrationService
class EventAnalyticsService {
  private eventSources: string[] = [
    'eventbrite', 'meetup', 'conference-index', 'sports-calendar', 
    'holiday-calendar', 'trade-show-calendar'
  ];

  /**
   * Fetch local and regional events that could impact hotel demand
   */
  async fetchRelevantEvents(location: { city: string; radius: number }): Promise<EventData[]> {
    // Simulate event data fetching - in production, integrate with event APIs
    const mockEvents: EventData[] = [
      {
        id: 'event-tech-conf-2024',
        name: 'Global Tech Summit 2024',
        description: 'Major technology conference with 15,000+ attendees',
        type: 'conference',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: {
          city: location.city,
          country: 'US',
          venue: 'Convention Center',
          coordinates: { lat: 40.7589, lng: -73.9851 }
        },
        expectedAttendance: 15000,
        impactRadius: 25,
        category: 'Technology',
        source: 'conference-index',
        confidence: 0.9,
        historicalImpact: {
          demandIncrease: 0.45,
          priceIncrease: 0.25,
          occupancyRate: 0.95
        }
      },
      {
        id: 'event-music-festival',
        name: 'Summer Music Festival',
        description: 'Three-day music festival attracting young demographics',
        type: 'festival',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        location: {
          city: location.city,
          country: 'US',
          venue: 'City Park',
          coordinates: { lat: 40.7831, lng: -73.9712 }
        },
        expectedAttendance: 25000,
        impactRadius: 15,
        category: 'Entertainment',
        source: 'eventbrite',
        confidence: 0.85,
        historicalImpact: {
          demandIncrease: 0.35,
          priceIncrease: 0.20,
          occupancyRate: 0.88
        }
      }
    ];

    return mockEvents;
  }

  /**
   * Analyze event impact on hotel demand and pricing
   */
  async analyzeEventImpact(events: EventData[]): Promise<MarketImpactAnalysis[]> {
    return events.map(event => {
      const impactScore = this.calculateEventImpactScore(event);
      
      return {
        eventId: event.id,
        dataSource: 'local_events',
        category: 'events',
        impactLevel: this.getEventImpactLevel(impactScore),
        impactType: 'demand_increase',
        affectedMarkets: [event.location.city],
        affectedPropertyTypes: this.determineAffectedPropertyTypes(event),
        seasonalAdjustment: this.calculateSeasonalAdjustment(event),
        demandForecast: {
          shortTerm: event.historicalImpact?.demandIncrease || impactScore,
          mediumTerm: (event.historicalImpact?.demandIncrease || impactScore) * 0.6,
          longTerm: (event.historicalImpact?.demandIncrease || impactScore) * 0.2
        },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: (event.historicalImpact?.priceIncrease || impactScore) * 100,
          confidenceLevel: event.confidence,
          riskFactors: this.identifyEventRiskFactors(event),
          targetSegments: this.getEventTargetSegments(event),
          channelStrategy: this.getEventChannelStrategy(event)
        },
        inventoryRecommendations: {
          action: 'restrict',
          reasoning: `High demand expected due to ${event.name}. Optimize for revenue.`,
          channelSpecific: this.getEventChannelActions(event),
          allotmentStrategy: this.getEventAllotmentStrategy(event)
        },
        competitorResponse: {
          likelyReaction: 'follow',
          timeToReact: 12,
          marketShare: 0.18
        },
        revenueImpact: {
          shortTermRevenue: event.expectedAttendance * 50,
          mediumTermRevenue: event.expectedAttendance * 30,
          longTermRevenue: event.expectedAttendance * 10,
          riskAdjustedRevenue: event.expectedAttendance * 40 * event.confidence
        },
        marketIntelligence: {
          bookingPaceChange: impactScore * 0.4,
          lengthOfStayTrend: event.type === 'conference' ? 0.3 : 0.1,
          advanceBookingWindow: event.type === 'conference' ? 45 : 21,
          cancellationRiskLevel: event.confidence > 0.8 ? 'low' : 'medium'
        }
      };
    });
  }

  private calculateEventImpactScore(event: EventData): number {
    let score = 0.5; // Base score
    
    // Attendance impact
    if (event.expectedAttendance > 10000) score += 0.3;
    else if (event.expectedAttendance > 5000) score += 0.2;
    else if (event.expectedAttendance > 1000) score += 0.1;
    
    // Event type impact
    switch (event.type) {
      case 'conference': score += 0.2; break;
      case 'trade_show': score += 0.2; break;
      case 'sports': score += 0.15; break;
      case 'festival': score += 0.1; break;
      case 'concert': score += 0.1; break;
    }
    
    // Historical impact
    if (event.historicalImpact) {
      score += event.historicalImpact.demandIncrease * 0.3;
    }
    
    return Math.min(1.0, score);
  }

  private getEventImpactLevel(score: number): MarketImpactAnalysis['impactLevel'] {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  private determineAffectedPropertyTypes(event: EventData): string[] {
    switch (event.type) {
      case 'conference':
      case 'trade_show':
        return ['Business Hotels', 'Convention Hotels', 'Airport Hotels'];
      case 'festival':
      case 'concert':
        return ['Budget Hotels', 'Mid-scale Hotels', 'Boutique Hotels'];
      case 'sports':
        return ['All Property Types'];
      default:
        return ['Mid-scale Hotels', 'Business Hotels'];
    }
  }

  private calculateSeasonalAdjustment(event: EventData): number {
    const month = event.startDate.getMonth();
    // Higher adjustment for peak travel months
    const peakMonths = [5, 6, 7, 8, 11]; // June-Sept, Dec
    return peakMonths.includes(month) ? 1.2 : 1.0;
  }

  private identifyEventRiskFactors(event: EventData): string[] {
    const risks = ['Weather conditions', 'Competitor response'];
    
    if (event.confidence < 0.8) risks.push('Event cancellation risk');
    if (event.type === 'festival' || event.type === 'concert') risks.push('Crowd control issues');
    if (event.expectedAttendance > 20000) risks.push('Infrastructure strain');
    
    return risks;
  }

  private getEventTargetSegments(event: EventData): string[] {
    switch (event.type) {
      case 'conference':
      case 'trade_show':
        return ['business', 'corporate'];
      case 'festival':
      case 'concert':
        return ['leisure', 'group'];
      case 'sports':
        return ['leisure', 'group', 'business'];
      default:
        return ['leisure'];
    }
  }

  private getEventChannelStrategy(event: EventData): { [channel: string]: number } {
    return {
      'direct': 0.4,
      'expedia': 0.25,
      'booking': 0.25,
      'corporate': event.type === 'conference' ? 0.3 : 0.1
    };
  }

  private getEventChannelActions(event: EventData): Array<{channel: string; action: string; priority: number}> {
    return [
      { channel: 'direct', action: 'increase_rates', priority: 1 },
      { channel: 'ota', action: 'restrict_availability', priority: 2 },
      { channel: 'corporate', action: event.type === 'conference' ? 'negotiate_rates' : 'maintain', priority: 3 }
    ];
  }

  private getEventAllotmentStrategy(event: EventData): {corporate: number; leisure: number; group: number} {
    switch (event.type) {
      case 'conference':
        return { corporate: 0.6, leisure: 0.2, group: 0.2 };
      case 'festival':
      case 'concert':
        return { corporate: 0.1, leisure: 0.5, group: 0.4 };
      default:
        return { corporate: 0.3, leisure: 0.4, group: 0.3 };
    }
  }
}

// Occupancy Intelligence Service - moved before NewsIntegrationService
class OccupancyIntelligenceService {
  /**
   * Analyze historical occupancy patterns and predict future trends
   */
  async analyzeOccupancyPatterns(historicalData: any[]): Promise<MarketImpactAnalysis[]> {
    // Simulate comprehensive occupancy analysis
    // In production, this would analyze actual PMS data, booking patterns, etc.
    
    const mockAnalyses: MarketImpactAnalysis[] = [
      {
        dataSource: 'booking_data',
        category: 'occupancy',
        impactLevel: 'high',
        impactType: 'demand_increase',
        affectedMarkets: ['New York', 'Manhattan'],
        affectedPropertyTypes: ['Business Hotels', 'Luxury Hotels'],
        seasonalAdjustment: 1.1,
        demandForecast: {
          shortTerm: 0.85,
          mediumTerm: 0.78,
          longTerm: 0.72
        },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: 15,
          confidenceLevel: 0.87,
          riskFactors: ['Economic uncertainty', 'Competitor response'],
          targetSegments: ['business', 'corporate'],
          channelStrategy: {
            'direct': 0.35,
            'expedia': 0.25,
            'booking': 0.25,
            'corporate': 0.15
          }
        },
        inventoryRecommendations: {
          action: 'optimize',
          reasoning: 'High occupancy trend detected. Optimize inventory allocation across channels.',
          channelSpecific: [
            { channel: 'direct', action: 'increase_allocation', priority: 1 },
            { channel: 'ota', action: 'restrict_lowest_rates', priority: 2 }
          ],
          allotmentStrategy: {
            corporate: 0.4,
            leisure: 0.35,
            group: 0.25
          }
        },
        competitorResponse: {
          likelyReaction: 'follow',
          timeToReact: 24,
          marketShare: 0.22
        },
        revenueImpact: {
          shortTermRevenue: 125000,
          mediumTermRevenue: 375000,
          longTermRevenue: 850000,
          riskAdjustedRevenue: 680000
        },
        marketIntelligence: {
          bookingPaceChange: 0.18,
          lengthOfStayTrend: 0.12,
          advanceBookingWindow: 28,
          cancellationRiskLevel: 'low'
        }
      }
    ];

    return mockAnalyses;
  }
}

// Pricing Intelligence Service - moved before NewsIntegrationService  
class PricingIntelligenceService {
  /**
   * Analyze competitive pricing and market opportunities
   */
  async analyzePricingOpportunities(competitorData: any[], marketData: any[]): Promise<MarketImpactAnalysis[]> {
    // Simulate comprehensive pricing analysis
    // In production, this would analyze competitor rates, market positioning, etc.
    
    const mockAnalyses: MarketImpactAnalysis[] = [
      {
        dataSource: 'competitor_intelligence',
        category: 'pricing',
        impactLevel: 'medium',
        impactType: 'market_opportunity',
        affectedMarkets: ['New York', 'Manhattan'],
        affectedPropertyTypes: ['Mid-scale Hotels', 'Business Hotels'],
        seasonalAdjustment: 1.0,
        demandForecast: {
          shortTerm: 0.72,
          mediumTerm: 0.76,
          longTerm: 0.74
        },
        pricingRecommendations: {
          immediateAction: 'increase',
          percentageChange: 8,
          confidenceLevel: 0.74,
          riskFactors: ['Market saturation', 'Economic conditions'],
          targetSegments: ['business', 'leisure'],
          channelStrategy: {
            'direct': 0.40,
            'expedia': 0.30,
            'booking': 0.25,
            'corporate': 0.05
          }
        },
        inventoryRecommendations: {
          action: 'open',
          reasoning: 'Competitive pricing gap identified. Open inventory with optimized rates.',
          channelSpecific: [
            { channel: 'direct', action: 'premium_rates', priority: 1 },
            { channel: 'ota', action: 'competitive_rates', priority: 2 }
          ],
          allotmentStrategy: {
            corporate: 0.15,
            leisure: 0.65,
            group: 0.20
          }
        },
        competitorResponse: {
          likelyReaction: 'contrarian',
          timeToReact: 48,
          marketShare: 0.18
        },
        revenueImpact: {
          shortTermRevenue: 85000,
          mediumTermRevenue: 245000,
          longTermRevenue: 520000,
          riskAdjustedRevenue: 385000
        },
        marketIntelligence: {
          bookingPaceChange: 0.12,
          lengthOfStayTrend: 0.08,
          advanceBookingWindow: 21,
          cancellationRiskLevel: 'medium'
        }
      }
    ];

    return mockAnalyses;
  }
}
// Create and export a singleton instance
const newsIntegrationService = new NewsIntegrationService();
export default newsIntegrationService; 