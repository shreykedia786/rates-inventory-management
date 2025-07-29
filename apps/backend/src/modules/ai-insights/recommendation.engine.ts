import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RecommendationInput {
  id: string;
  propertyId: string;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
  rate: number;
  inventory: number;
  roomType: { code: string; name: string };
  ratePlan: { code: string; name: string };
}

export interface CompetitorData {
  competitorId: string;
  competitorName: string;
  roomTypeCode: string;
  rate: number;
  currency: string;
  date: Date;
  availability: boolean;
}

export interface HistoricalPerformance {
  averageOccupancy: number;
  averageAdr: number;
  seasonalTrend: 'up' | 'down' | 'stable';
}

export interface RateRecommendation {
  id: string;
  propertyId: string;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
  currentRate: number;
  suggestedRate: number;
  confidence: number;
  reasoning: string;
  factors: {
    competitorAverage: number;
    marketTrend: 'up' | 'down' | 'stable';
    demandLevel: 'low' | 'medium' | 'high';
    occupancyForecast: number;
  };
  createdAt: Date;
}

/**
 * AI Recommendation Engine
 * 
 * Advanced AI-powered rate optimization engine that generates intelligent pricing recommendations:
 * - Market-based pricing analysis using competitor data
 * - Historical performance pattern recognition
 * - Demand forecasting and seasonal adjustments
 * - Confidence scoring based on data quality and market conditions
 * - Multi-factor recommendation reasoning
 * - Revenue optimization algorithms
 */
@Injectable()
export class RecommendationEngine {
  private readonly logger = new Logger(RecommendationEngine.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate rate recommendation for a specific rate record
   */
  async generateRecommendation(
    rateRecord: RecommendationInput,
    competitorData: CompetitorData[],
    historicalPerformance: HistoricalPerformance,
  ): Promise<RateRecommendation | null> {
    try {
      this.logger.debug(`Generating recommendation for rate ${rateRecord.id}`);

      // Filter competitor data for the same room type and date
      const relevantCompetitors = this.filterRelevantCompetitors(
        competitorData,
        rateRecord.roomType.code,
        rateRecord.date,
      );

      if (relevantCompetitors.length === 0) {
        this.logger.warn(`No competitor data available for ${rateRecord.roomType.code} on ${rateRecord.date}`);
        return null;
      }

      // Calculate market metrics
      const marketMetrics = this.calculateMarketMetrics(relevantCompetitors);
      
      // Analyze demand level
      const demandLevel = this.analyzeDemandLevel(
        rateRecord,
        marketMetrics,
        historicalPerformance,
      );

      // Determine market trend
      const marketTrend = this.determineMarketTrend(
        marketMetrics,
        historicalPerformance,
        rateRecord.date,
      );

      // Generate rate suggestion
      const suggestedRate = this.calculateOptimalRate(
        rateRecord.rate,
        marketMetrics,
        demandLevel,
        marketTrend,
        historicalPerformance,
      );

      // Calculate confidence score
      const confidence = this.calculateConfidenceScore(
        relevantCompetitors.length,
        marketMetrics.standardDeviation,
        historicalPerformance,
        rateRecord.date,
      );

      // Generate reasoning
      const reasoning = this.generateReasoning(
        rateRecord.rate,
        suggestedRate,
        marketMetrics,
        demandLevel,
        marketTrend,
      );

      // Forecast occupancy
      const occupancyForecast = this.forecastOccupancy(
        historicalPerformance,
        demandLevel,
        rateRecord.date,
      );

      return {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        propertyId: rateRecord.propertyId,
        roomTypeId: rateRecord.roomTypeId,
        ratePlanId: rateRecord.ratePlanId,
        date: rateRecord.date,
        currentRate: rateRecord.rate,
        suggestedRate: Math.round(suggestedRate),
        confidence: Math.round(confidence),
        reasoning,
        factors: {
          competitorAverage: Math.round(marketMetrics.average),
          marketTrend,
          demandLevel,
          occupancyForecast: Math.round(occupancyForecast),
        },
        createdAt: new Date(),
      };

    } catch (error) {
      this.logger.error(`Failed to generate recommendation: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * Filter competitor data for relevant comparisons
   */
  private filterRelevantCompetitors(
    competitorData: CompetitorData[],
    roomTypeCode: string,
    date: Date,
  ): CompetitorData[] {
    const targetDate = date.toISOString().split('T')[0];
    
    return competitorData.filter(comp => {
      const compDate = comp.date.toISOString().split('T')[0];
      return comp.roomTypeCode === roomTypeCode && 
             compDate === targetDate && 
             comp.availability && 
             comp.rate > 0;
    });
  }

  /**
   * Calculate market metrics from competitor data
   */
  private calculateMarketMetrics(competitors: CompetitorData[]) {
    const rates = competitors.map(c => c.rate);
    const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    
    // Calculate standard deviation
    const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - average, 2), 0) / rates.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      average,
      min,
      max,
      standardDeviation,
      count: competitors.length,
    };
  }

  /**
   * Analyze demand level based on market conditions
   */
  private analyzeDemandLevel(
    rateRecord: RecommendationInput,
    marketMetrics: any,
    historicalPerformance: HistoricalPerformance,
  ): 'low' | 'medium' | 'high' {
    // Factor 1: Current rate vs market average
    const ratePosition = rateRecord.rate / marketMetrics.average;
    
    // Factor 2: Historical occupancy
    const occupancyFactor = historicalPerformance.averageOccupancy / 100;
    
    // Factor 3: Day of week (weekend = higher demand)
    const dayOfWeek = rateRecord.date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;
    
    // Factor 4: Seasonal trends
    const seasonalFactor = this.getSeasonalDemandFactor(rateRecord.date);
    
    // Composite demand score
    const demandScore = (ratePosition * 0.3) + (occupancyFactor * 0.4) + (weekendFactor * 0.15) + (seasonalFactor * 0.15);
    
    if (demandScore >= 1.1) return 'high';
    if (demandScore >= 0.9) return 'medium';
    return 'low';
  }

  /**
   * Determine market trend direction
   */
  private determineMarketTrend(
    marketMetrics: any,
    historicalPerformance: HistoricalPerformance,
    date: Date,
  ): 'up' | 'down' | 'stable' {
    // Use historical trend as baseline
    if (historicalPerformance.seasonalTrend !== 'stable') {
      return historicalPerformance.seasonalTrend;
    }
    
    // Analyze market volatility
    const volatility = marketMetrics.standardDeviation / marketMetrics.average;
    
    // High volatility suggests unstable market
    if (volatility > 0.15) {
      // Use seasonal patterns to determine direction
      const month = date.getMonth();
      
      // Summer and winter holiday seasons trend up
      if ((month >= 5 && month <= 8) || month === 11 || month === 0) {
        return 'up';
      }
      
      // Spring trends up moderately
      if (month >= 2 && month <= 4) {
        return 'up';
      }
      
      // Fall tends to be stable to down
      return 'down';
    }
    
    return 'stable';
  }

  /**
   * Calculate optimal rate based on multiple factors
   */
  private calculateOptimalRate(
    currentRate: number,
    marketMetrics: any,
    demandLevel: 'low' | 'medium' | 'high',
    marketTrend: 'up' | 'down' | 'stable',
    historicalPerformance: HistoricalPerformance,
  ): number {
    let suggestedRate = currentRate;
    
    // Base adjustment towards market average (weighted)
    const marketWeight = 0.6;
    const currentWeight = 0.4;
    suggestedRate = (marketMetrics.average * marketWeight) + (currentRate * currentWeight);
    
    // Demand level adjustments
    switch (demandLevel) {
      case 'high':
        suggestedRate *= 1.08; // 8% increase for high demand
        break;
      case 'medium':
        suggestedRate *= 1.02; // 2% increase for medium demand
        break;
      case 'low':
        suggestedRate *= 0.95; // 5% decrease for low demand
        break;
    }
    
    // Market trend adjustments
    switch (marketTrend) {
      case 'up':
        suggestedRate *= 1.05; // 5% increase for upward trend
        break;
      case 'down':
        suggestedRate *= 0.97; // 3% decrease for downward trend
        break;
      // 'stable' requires no adjustment
    }
    
    // Historical performance adjustments
    if (historicalPerformance.averageOccupancy > 85) {
      suggestedRate *= 1.03; // 3% premium for high-performing properties
    } else if (historicalPerformance.averageOccupancy < 65) {
      suggestedRate *= 0.98; // 2% discount for underperforming properties
    }
    
    // Ensure reasonable bounds (±25% of current rate)
    const minRate = currentRate * 0.75;
    const maxRate = currentRate * 1.25;
    
    return Math.max(minRate, Math.min(maxRate, suggestedRate));
  }

  /**
   * Calculate confidence score for the recommendation
   */
  private calculateConfidenceScore(
    competitorCount: number,
    marketVolatility: number,
    historicalPerformance: HistoricalPerformance,
    date: Date,
  ): number {
    let confidence = 100;
    
    // Reduce confidence based on limited competitor data
    if (competitorCount < 3) {
      confidence -= 30;
    } else if (competitorCount < 5) {
      confidence -= 15;
    }
    
    // Reduce confidence for high market volatility
    const volatilityPenalty = Math.min(25, marketVolatility * 100);
    confidence -= volatilityPenalty;
    
    // Reduce confidence for poor historical data
    if (historicalPerformance.averageOccupancy === 75) { // Default/placeholder value
      confidence -= 10;
    }
    
    // Reduce confidence for far future dates
    const daysAhead = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysAhead > 30) {
      confidence -= Math.min(20, (daysAhead - 30) * 0.5);
    }
    
    return Math.max(30, Math.min(100, confidence));
  }

  /**
   * Generate human-readable reasoning for the recommendation
   */
  private generateReasoning(
    currentRate: number,
    suggestedRate: number,
    marketMetrics: any,
    demandLevel: 'low' | 'medium' | 'high',
    marketTrend: 'up' | 'down' | 'stable',
  ): string {
    const rateChange = ((suggestedRate - currentRate) / currentRate) * 100;
    const marketPosition = ((currentRate - marketMetrics.average) / marketMetrics.average) * 100;
    
    let reasoning = '';
    
    if (Math.abs(rateChange) < 2) {
      reasoning = 'Current rate is well-positioned. ';
    } else if (rateChange > 0) {
      reasoning = `Consider increasing rate by ${Math.round(rateChange)}%. `;
    } else {
      reasoning = `Consider decreasing rate by ${Math.round(Math.abs(rateChange))}%. `;
    }
    
    // Add market context
    if (marketPosition > 10) {
      reasoning += 'Your rate is significantly above market average. ';
    } else if (marketPosition < -10) {
      reasoning += 'Your rate is below market average. ';
    } else {
      reasoning += 'Your rate is close to market average. ';
    }
    
    // Add demand context
    switch (demandLevel) {
      case 'high':
        reasoning += 'High demand conditions support premium pricing. ';
        break;
      case 'low':
        reasoning += 'Lower demand suggests competitive pricing needed. ';
        break;
      default:
        reasoning += 'Moderate demand allows for balanced pricing. ';
    }
    
    // Add trend context
    switch (marketTrend) {
      case 'up':
        reasoning += 'Market trends are favorable for rate increases.';
        break;
      case 'down':
        reasoning += 'Market softening suggests caution with rate increases.';
        break;
      default:
        reasoning += 'Stable market conditions support current strategy.';
    }
    
    return reasoning;
  }

  /**
   * Forecast occupancy based on various factors
   */
  private forecastOccupancy(
    historicalPerformance: HistoricalPerformance,
    demandLevel: 'low' | 'medium' | 'high',
    date: Date,
  ): number {
    let forecast = historicalPerformance.averageOccupancy;
    
    // Adjust for demand level
    switch (demandLevel) {
      case 'high':
        forecast += 10;
        break;
      case 'low':
        forecast -= 8;
        break;
      // 'medium' requires no adjustment
    }
    
    // Seasonal adjustments
    const seasonalFactor = this.getSeasonalDemandFactor(date);
    forecast *= seasonalFactor;
    
    // Weekend boost
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      forecast += 5;
    }
    
    return Math.max(20, Math.min(100, forecast));
  }

  /**
   * Get seasonal demand factor for a given date
   */
  private getSeasonalDemandFactor(date: Date): number {
    const month = date.getMonth();
    
    // Summer peak season
    if (month >= 5 && month <= 8) return 1.15;
    
    // Winter holidays
    if (month === 11 || month === 0) return 1.20;
    
    // Spring
    if (month >= 2 && month <= 4) return 1.05;
    
    // Fall
    return 0.95;
  }
} 