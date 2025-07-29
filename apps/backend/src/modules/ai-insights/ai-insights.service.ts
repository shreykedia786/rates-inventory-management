import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RateShopperService } from './rate-shopper.service';
import { RecommendationEngine } from './recommendation.engine';
import { CompetitorAnalysisService } from './competitor-analysis.service';

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

export interface CompetitorInsight {
  competitorId: string;
  competitorName: string;
  roomTypeCode: string;
  rate: number;
  currency: string;
  availability: boolean;
  lastUpdated: Date;
}

export interface MarketAnalysis {
  propertyId: string;
  roomTypeCode: string;
  date: Date;
  marketAverage: number;
  marketMin: number;
  marketMax: number;
  positionIndex: number; // 0-100, where 50 is market average
  competitorCount: number;
  recommendations: string[];
}

/**
 * AI Insights Service
 * 
 * Main orchestrator for AI-powered revenue optimization insights:
 * - Generates rate recommendations based on market data
 * - Provides competitor analysis and positioning
 * - Delivers market trend insights
 * - Manages AI suggestion lifecycle
 * - Tracks recommendation performance
 */
@Injectable()
export class AiInsightsService {
  private readonly logger = new Logger(AiInsightsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly rateShopperService: RateShopperService,
    private readonly recommendationEngine: RecommendationEngine,
    private readonly competitorAnalysisService: CompetitorAnalysisService,
  ) {}

  /**
   * Generate rate recommendations for a property and date range
   */
  async generateRateRecommendations(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    roomTypeIds?: string[],
    ratePlanIds?: string[],
  ): Promise<RateRecommendation[]> {
    try {
      this.logger.log(`Generating rate recommendations for property ${propertyId}`);

      // Get current rates and inventory
      const currentRates = await this.getCurrentRates(
        propertyId,
        startDate,
        endDate,
        roomTypeIds,
        ratePlanIds,
      );

      // Get competitor data
      const competitorData = await this.rateShopperService.getCompetitorRates(
        propertyId,
        startDate,
        endDate,
        roomTypeIds,
      );

      // Generate recommendations using AI engine
      const recommendations: RateRecommendation[] = [];

      for (const rateRecord of currentRates) {
        try {
          const recommendation = await this.recommendationEngine.generateRecommendation(
            rateRecord,
            competitorData,
            await this.getHistoricalPerformance(rateRecord),
          );

          if (recommendation) {
            recommendations.push(recommendation);

            // Save recommendation to database
            await this.saveRecommendation(recommendation);
          }
        } catch (error) {
          this.logger.error(
            `Failed to generate recommendation for rate ${rateRecord.id}: ${error.message}`
          );
        }
      }

      this.logger.log(`Generated ${recommendations.length} rate recommendations`);
      return recommendations;

    } catch (error) {
      this.logger.error(`Failed to generate rate recommendations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get competitor insights for a property
   */
  async getCompetitorInsights(
    propertyId: string,
    date: Date,
    roomTypeCode?: string,
  ): Promise<CompetitorInsight[]> {
    try {
      const competitorRates = await this.databaseService.competitorRate.findMany({
        where: {
          propertyId,
          date,
          ...(roomTypeCode && { roomTypeCode }),
        },
        orderBy: { rate: 'asc' },
      });

      return competitorRates.map(rate => ({
        competitorId: rate.competitorId,
        competitorName: rate.competitorName,
        roomTypeCode: rate.roomTypeCode,
        rate: parseFloat(rate.rate.toString()),
        currency: rate.currency,
        availability: true, // Assume available if rate exists
        lastUpdated: rate.collectedAt,
      }));

    } catch (error) {
      this.logger.error(`Failed to get competitor insights: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform market analysis for a property
   */
  async performMarketAnalysis(
    propertyId: string,
    date: Date,
    roomTypeCode: string,
  ): Promise<MarketAnalysis> {
    try {
      const competitorInsights = await this.getCompetitorInsights(propertyId, date, roomTypeCode);
      
      if (competitorInsights.length === 0) {
        throw new Error('No competitor data available for market analysis');
      }

      const rates = competitorInsights.map(c => c.rate);
      const marketAverage = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
      const marketMin = Math.min(...rates);
      const marketMax = Math.max(...rates);

      // Get current property rate
      const currentRate = await this.getCurrentPropertyRate(propertyId, date, roomTypeCode);
      
      // Calculate position index (0-100 scale)
      let positionIndex = 50; // Default to market average
      if (currentRate && marketMax > marketMin) {
        positionIndex = ((currentRate - marketMin) / (marketMax - marketMin)) * 100;
      }

      // Generate recommendations
      const recommendations = await this.competitorAnalysisService.generateMarketRecommendations(
        currentRate,
        marketAverage,
        competitorInsights,
      );

      return {
        propertyId,
        roomTypeCode,
        date,
        marketAverage,
        marketMin,
        marketMax,
        positionIndex,
        competitorCount: competitorInsights.length,
        recommendations,
      };

    } catch (error) {
      this.logger.error(`Failed to perform market analysis: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get AI suggestions for a property
   */
  async getAiSuggestions(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    isApplied?: boolean,
  ) {
    return this.databaseService.aiSuggestion.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(isApplied !== undefined && { isApplied }),
      },
      include: {
        // Add relations if needed
      },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Apply an AI suggestion
   */
  async applySuggestion(suggestionId: string, userId: string) {
    try {
      const suggestion = await this.databaseService.aiSuggestion.findUnique({
        where: { id: suggestionId },
      });

      if (!suggestion) {
        throw new Error('AI suggestion not found');
      }

      if (suggestion.isApplied) {
        throw new Error('AI suggestion already applied');
      }

      // Update the actual rate inventory record
      await this.databaseService.rateInventory.updateMany({
        where: {
          propertyId: suggestion.propertyId,
          roomTypeId: suggestion.roomTypeId,
          ratePlanId: suggestion.ratePlanId,
          date: suggestion.date,
        },
        data: {
          rate: suggestion.suggestedRate,
          syncSource: 'ai_suggestion',
          updatedAt: new Date(),
        },
      });

      // Mark suggestion as applied
      await this.databaseService.aiSuggestion.update({
        where: { id: suggestionId },
        data: {
          isApplied: true,
          appliedAt: new Date(),
          appliedBy: userId,
        },
      });

      this.logger.log(`Applied AI suggestion ${suggestionId} by user ${userId}`);

    } catch (error) {
      this.logger.error(`Failed to apply AI suggestion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh competitor data for a property
   */
  async refreshCompetitorData(propertyId: string) {
    try {
      this.logger.log(`Refreshing competitor data for property ${propertyId}`);
      
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30); // Next 30 days

      await this.rateShopperService.collectCompetitorRates(propertyId, today, endDate);
      
      this.logger.log(`Competitor data refresh completed for property ${propertyId}`);

    } catch (error) {
      this.logger.error(`Failed to refresh competitor data: ${error.message}`);
      throw error;
    }
  }

  // Private helper methods

  private async getCurrentRates(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    roomTypeIds?: string[],
    ratePlanIds?: string[],
  ) {
    return this.databaseService.rateInventory.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(roomTypeIds && { roomTypeId: { in: roomTypeIds } }),
        ...(ratePlanIds && { ratePlanId: { in: ratePlanIds } }),
      },
      include: {
        roomType: true,
        ratePlan: true,
      },
    });
  }

  private async getCurrentPropertyRate(
    propertyId: string,
    date: Date,
    roomTypeCode: string,
  ): Promise<number | null> {
    const rateRecord = await this.databaseService.rateInventory.findFirst({
      where: {
        propertyId,
        date,
        roomType: { code: roomTypeCode },
      },
    });

    return rateRecord?.rate ? parseFloat(rateRecord.rate.toString()) : null;
  }

  private async getHistoricalPerformance(rateRecord: any) {
    // Get historical performance data for the recommendation engine
    // This would include occupancy, ADR, RevPAR trends, etc.
    return {
      averageOccupancy: 75, // Placeholder
      averageAdr: 150, // Placeholder
      seasonalTrend: 'stable' as const,
    };
  }

  private async saveRecommendation(recommendation: RateRecommendation) {
    await this.databaseService.aiSuggestion.create({
      data: {
        propertyId: recommendation.propertyId,
        roomTypeId: recommendation.roomTypeId,
        ratePlanId: recommendation.ratePlanId,
        date: recommendation.date,
        suggestedRate: recommendation.suggestedRate,
        currentRate: recommendation.currentRate,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        factors: recommendation.factors,
        isApplied: false,
      },
    });
  }
} 