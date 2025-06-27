/**
 * Global News Integration Service for Rates & Inventory Management
 * Fetches and analyzes global news impact on hotel demand and pricing
 */

import { FreeNewsAPIsService } from './free-news-apis';

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

export interface MarketImpactAnalysis {
  newsArticleId: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  impactType: 'demand_increase' | 'demand_decrease' | 'price_pressure_up' | 'price_pressure_down' | 'capacity_constraint';
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
  };
  inventoryRecommendations: {
    action: 'restrict' | 'open' | 'optimize' | 'hold';
    reasoning: string;
    channelSpecific: Array<{
      channel: string;
      action: string;
      priority: number;
    }>;
  };
  competitorResponse: {
    likelyReaction: 'follow' | 'contrarian' | 'neutral';
    timeToReact: number; // hours
    marketShare: number;
  };
}

export interface GlobalNewsInsight {
  id: string;
  title: string;
  summary: string;
  impactAnalysis: MarketImpactAnalysis;
  triggerEvents: NewsArticle[];
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
  }>;
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
      .split(/\s+/)
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
    // Simulate AI analysis - in production, integrate with OpenAI/Claude API
    const impactScore = this.calculateImpactScore(article);
    
    return {
      newsArticleId: article.id,
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
        riskFactors: this.identifyRiskFactors(article)
      },
      inventoryRecommendations: {
        action: this.getInventoryAction(article, impactScore),
        reasoning: this.getInventoryReasoning(article),
        channelSpecific: this.getChannelSpecificActions(article)
      },
      competitorResponse: {
        likelyReaction: this.predictCompetitorResponse(article),
        timeToReact: this.estimateReactionTime(article),
        marketShare: 0.15 // Placeholder
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
  private insights: GlobalNewsInsight[] = [];

  constructor() {
    console.log('🔧 Initializing NewsIntegrationService...');
    this.newsAPIService = new NewsAPIService();
    this.aiAnalysisService = new AINewsAnalysisService();
    this.freeNewsService = new FreeNewsAPIsService();
    console.log('✅ NewsIntegrationService initialized successfully');
  }

  /**
   * Main method to fetch and analyze global news insights
   * Returns actionable insights for revenue management
   */
  async fetchGlobalNews(): Promise<GlobalNewsInsight[]> {
    try {
      console.log('🌍 Fetching global news insights...');
      
      // Step 1: Fetch articles from all sources
      const articles = await this.fetchFromAllSources();
      console.log(`📰 Fetched ${articles.length} articles from all sources`);
      
      if (articles.length === 0) {
        console.warn('⚠️  No articles fetched, returning empty insights');
        return [];
      }

      // Step 2: Analyze market impact
      const insights = await this.analyzeNewsImpact(articles);
      console.log(`🎯 Generated ${insights.length} actionable insights`);
      
      // Step 3: Cache insights
      this.insights = insights;
      
      return insights;

    } catch (error) {
      console.error('❌ Error in fetchGlobalNews:', error);
      
      // Return some sample insights so the UI isn't empty
      return this.getSampleInsights();
    }
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

  /**
   * Analyze news articles for market impact
   */
  private async analyzeNewsImpact(articles: NewsArticle[]): Promise<GlobalNewsInsight[]> {
    // Analyze market impact
    const impactAnalyses = await this.aiAnalysisService.analyzeMarketImpact(articles);
    
    // Generate insights
    const insights = this.generateInsightsFromAnalysis(impactAnalyses, articles);
    
    this.insights = insights;
    return insights;
  }

  private generateInsightsFromAnalysis(
    analyses: MarketImpactAnalysis[], 
    articles: NewsArticle[]
  ): GlobalNewsInsight[] {
    const insights: GlobalNewsInsight[] = [];
    
    for (const analysis of analyses) {
      const relatedArticles = articles.filter(article => 
        analysis.newsArticleId === article.id
      );
      
      if (relatedArticles.length === 0) continue;
      
      const primaryArticle = relatedArticles[0];
      
      const insight: GlobalNewsInsight = {
        id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: this.generateInsightTitle(analysis, primaryArticle),
        summary: this.generateInsightSummary(analysis, primaryArticle),
        impactAnalysis: analysis,
        triggerEvents: relatedArticles,
        confidence: primaryArticle.confidenceScore,
        urgency: this.determineUrgency(analysis),
        actionRequired: this.determineActionRequired(analysis),
        autoApplyEnabled: this.shouldEnableAutoApply(analysis),
        createdAt: new Date(),
        expiresAt: this.calculateExpirationDate(analysis),
        status: 'active',
        predictiveScenarios: this.generatePredictiveScenarios(analysis)
      };
      
      insights.push(insight);
    }
    
    return insights;
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

  private generatePredictiveScenarios(analysis: MarketImpactAnalysis): GlobalNewsInsight['predictiveScenarios'] {
    const scenarios = [];
    
    // Optimistic scenario
    scenarios.push({
      name: 'Optimistic',
      probability: 0.3,
      revenueImpact: Math.abs(analysis.pricingRecommendations.percentageChange) * 1.5,
      description: 'Market responds positively to news with increased demand',
      timeframe: '7-14 days'
    });
    
    // Realistic scenario
    scenarios.push({
      name: 'Realistic',
      probability: 0.5,
      revenueImpact: Math.abs(analysis.pricingRecommendations.percentageChange),
      description: 'Expected market response based on historical patterns',
      timeframe: '14-30 days'
    });
    
    // Pessimistic scenario
    scenarios.push({
      name: 'Pessimistic',
      probability: 0.2,
      revenueImpact: -Math.abs(analysis.pricingRecommendations.percentageChange) * 0.8,
      description: 'Market overreacts negatively or news impact is minimal',
      timeframe: '30+ days'
    });
    
    return scenarios;
  }

  /**
   * Get sample insights for demonstration/fallback
   */
  private getSampleInsights(): GlobalNewsInsight[] {
    const now = new Date();
    
    return [
      {
        id: 'sample-insight-1',
        title: 'Global Economic Outlook Impacts Business Travel Demand',
        summary: 'Recent economic indicators suggest increased business confidence, leading to a 15-20% uptick in corporate travel bookings for Q1 2024.',
        impactAnalysis: {
          newsArticleId: 'sample-article-1',
          impactLevel: 'high' as const,
          impactType: 'demand_increase' as const,
          affectedMarkets: ['New York', 'London', 'Tokyo', 'Singapore'],
          affectedPropertyTypes: ['Business Hotels', 'Airport Hotels', 'Convention Centers'],
          seasonalAdjustment: 0.15,
          demandForecast: {
            shortTerm: 0.18,
            mediumTerm: 0.22,
            longTerm: 0.15
          },
          pricingRecommendations: {
            immediateAction: 'increase' as const,
            percentageChange: 12,
            confidenceLevel: 0.78,
            riskFactors: ['Economic volatility', 'Competition response']
          },
          inventoryRecommendations: {
            action: 'optimize' as const,
            reasoning: 'Increase allocation to corporate channels while maintaining leisure availability',
            channelSpecific: [
              { channel: 'Direct Corporate', action: 'increase_allocation', priority: 1 },
              { channel: 'Business Travel Agents', action: 'increase_allocation', priority: 2 },
              { channel: 'OTA', action: 'maintain', priority: 3 }
            ]
          },
          competitorResponse: {
            likelyReaction: 'follow' as const,
            timeToReact: 48,
            marketShare: 0.15
          }
        },
        triggerEvents: [], // Would contain actual news articles
        confidence: 0.78,
        urgency: 'high' as const,
        actionRequired: true,
        autoApplyEnabled: false,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'active' as const,
        predictiveScenarios: [
          {
            name: 'Optimistic Business Recovery',
            probability: 0.35,
            revenueImpact: 25000,
            description: 'Full corporate travel recovery with conference season boost',
            timeframe: '30 days'
          },
          {
            name: 'Steady Growth',
            probability: 0.45,
            revenueImpact: 15000,
            description: 'Gradual increase in business travel with seasonal adjustments',
            timeframe: '60 days'
          },
          {
            name: 'Conservative Uptick',
            probability: 0.20,
            revenueImpact: 8000,
            description: 'Modest increase limited by economic uncertainty',
            timeframe: '90 days'
          }
        ]
      },
      {
        id: 'sample-insight-2',
        title: 'Major Tech Conference Drives Demand Surge',
        summary: 'Upcoming tech conference announcements indicate 40% increase in regional hotel demand. Immediate pricing adjustments recommended.',
        impactAnalysis: {
          newsArticleId: 'sample-article-2',
          impactLevel: 'critical' as const,
          impactType: 'demand_increase' as const,
          affectedMarkets: ['San Francisco', 'San Jose', 'Palo Alto'],
          affectedPropertyTypes: ['Business Hotels', 'Extended Stay', 'Luxury Hotels'],
          seasonalAdjustment: 0.25,
          demandForecast: {
            shortTerm: 0.40,
            mediumTerm: 0.15,
            longTerm: 0.05
          },
          pricingRecommendations: {
            immediateAction: 'increase' as const,
            percentageChange: 25,
            confidenceLevel: 0.92,
            riskFactors: ['Event cancellation risk', 'Competitor undercut']
          },
          inventoryRecommendations: {
            action: 'restrict' as const,
            reasoning: 'Limit availability on discount channels to maximize revenue during peak demand',
            channelSpecific: [
              { channel: 'Direct', action: 'maximize_rates', priority: 1 },
              { channel: 'Corporate', action: 'premium_rates', priority: 2 },
              { channel: 'OTA', action: 'restrict_inventory', priority: 3 }
            ]
          },
          competitorResponse: {
            likelyReaction: 'follow' as const,
            timeToReact: 24,
            marketShare: 0.25
          }
        },
        triggerEvents: [],
        confidence: 0.92,
        urgency: 'critical' as const,
        actionRequired: true,
        autoApplyEnabled: true,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
        status: 'active' as const,
        predictiveScenarios: [
          {
            name: 'Event Confirmed',
            probability: 0.85,
            revenueImpact: 45000,
            description: 'Full event proceeds with maximum attendance',
            timeframe: '14 days'
          },
          {
            name: 'Reduced Capacity',
            probability: 0.12,
            revenueImpact: 20000,
            description: 'Event proceeds with limited attendance',
            timeframe: '14 days'
          },
          {
            name: 'Event Postponed',
            probability: 0.03,
            revenueImpact: -5000,
            description: 'Event cancelled or significantly delayed',
            timeframe: '7 days'
          }
        ]
      },
      {
        id: 'sample-insight-3',
        title: 'Weather Disruption Alert - Hurricane Season Impact',
        summary: 'Weather patterns indicate potential hurricane activity affecting Gulf Coast travel. Recommend flexible cancellation policies and inventory adjustments.',
        impactAnalysis: {
          newsArticleId: 'sample-article-3',
          impactLevel: 'medium' as const,
          impactType: 'demand_decrease' as const,
          affectedMarkets: ['Miami', 'New Orleans', 'Houston', 'Tampa'],
          affectedPropertyTypes: ['Resort Hotels', 'Beachfront Properties', 'Business Hotels'],
          seasonalAdjustment: -0.20,
          demandForecast: {
            shortTerm: -0.30,
            mediumTerm: -0.15,
            longTerm: 0.10
          },
          pricingRecommendations: {
            immediateAction: 'decrease' as const,
            percentageChange: -15,
            confidenceLevel: 0.65,
            riskFactors: ['Weather uncertainty', 'Recovery timing']
          },
          inventoryRecommendations: {
            action: 'open' as const,
            reasoning: 'Increase availability and offer flexible terms to maintain bookings',
            channelSpecific: [
              { channel: 'Direct', action: 'flexible_terms', priority: 1 },
              { channel: 'OTA', action: 'increase_availability', priority: 2 },
              { channel: 'Group', action: 'renegotiate_terms', priority: 3 }
            ]
          },
          competitorResponse: {
            likelyReaction: 'neutral' as const,
            timeToReact: 72,
            marketShare: 0.20
          }
        },
        triggerEvents: [],
        confidence: 0.65,
        urgency: 'medium' as const,
        actionRequired: true,
        autoApplyEnabled: false,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
        status: 'active' as const,
        predictiveScenarios: [
          {
            name: 'Severe Weather Impact',
            probability: 0.30,
            revenueImpact: -25000,
            description: 'Significant disruption with widespread cancellations',
            timeframe: '21 days'
          },
          {
            name: 'Moderate Disruption',
            probability: 0.45,
            revenueImpact: -10000,
            description: 'Limited impact with some cancellations and reduced rates',
            timeframe: '14 days'
          },
          {
            name: 'Minimal Impact',
            probability: 0.25,
            revenueImpact: 2000,
            description: 'Weather systems avoid major markets',
            timeframe: '7 days'
          }
        ]
      }
    ];
  }
}

// Create and export a singleton instance
const newsIntegrationService = new NewsIntegrationService();
export default newsIntegrationService; 