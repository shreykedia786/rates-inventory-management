import { Controller, Get, Post, Param, Query, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AiInsightsService } from './ai-insights.service';
import { RateShopperService } from './rate-shopper.service';

/**
 * AI Insights Controller
 * 
 * REST API endpoints for AI-powered revenue optimization:
 * - Rate recommendations with confidence scoring
 * - Competitor analysis and market insights
 * - Market trend analysis and forecasting
 * - AI suggestion management and application
 */
@ApiTags('AI Insights')
@Controller('ai-insights')
export class AiInsightsController {
  private readonly logger = new Logger(AiInsightsController.name);

  constructor(
    private readonly aiInsightsService: AiInsightsService,
    private readonly rateShopperService: RateShopperService,
  ) {}

  /**
   * Generate rate recommendations for a property
   */
  @Get('recommendations/:propertyId')
  @ApiOperation({ summary: 'Generate AI-powered rate recommendations' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'roomTypeIds', description: 'Room type IDs (comma-separated)', required: false })
  @ApiQuery({ name: 'ratePlanIds', description: 'Rate plan IDs (comma-separated)', required: false })
  @ApiResponse({ status: 200, description: 'Rate recommendations generated successfully' })
  async generateRecommendations(
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('roomTypeIds') roomTypeIds?: string,
    @Query('ratePlanIds') ratePlanIds?: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const roomTypeIdArray = roomTypeIds ? roomTypeIds.split(',') : undefined;
      const ratePlanIdArray = ratePlanIds ? ratePlanIds.split(',') : undefined;

      const recommendations = await this.aiInsightsService.generateRateRecommendations(
        propertyId,
        start,
        end,
        roomTypeIdArray,
        ratePlanIdArray,
      );

      return {
        success: true,
        data: recommendations,
        count: recommendations.length,
      };
    } catch (error) {
      this.logger.error(`Failed to generate recommendations: ${error.message}`);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Get competitor insights for a property
   */
  @Get('competitors/:propertyId')
  @ApiOperation({ summary: 'Get competitor rate insights' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiQuery({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'roomTypeCode', description: 'Room type code', required: false })
  @ApiResponse({ status: 200, description: 'Competitor insights retrieved successfully' })
  async getCompetitorInsights(
    @Param('propertyId') propertyId: string,
    @Query('date') date: string,
    @Query('roomTypeCode') roomTypeCode?: string,
  ) {
    try {
      const targetDate = new Date(date);
      
      const insights = await this.aiInsightsService.getCompetitorInsights(
        propertyId,
        targetDate,
        roomTypeCode,
      );

      return {
        success: true,
        data: insights,
        count: insights.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get competitor insights: ${error.message}`);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Perform market analysis for a property
   */
  @Get('market-analysis/:propertyId')
  @ApiOperation({ summary: 'Perform comprehensive market analysis' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiQuery({ name: 'date', description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'roomTypeCode', description: 'Room type code' })
  @ApiResponse({ status: 200, description: 'Market analysis completed successfully' })
  async performMarketAnalysis(
    @Param('propertyId') propertyId: string,
    @Query('date') date: string,
    @Query('roomTypeCode') roomTypeCode: string,
  ) {
    try {
      const targetDate = new Date(date);
      
      const analysis = await this.aiInsightsService.performMarketAnalysis(
        propertyId,
        targetDate,
        roomTypeCode,
      );

      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      this.logger.error(`Failed to perform market analysis: ${error.message}`);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get AI suggestions for a property
   */
  @Get('suggestions/:propertyId')
  @ApiOperation({ summary: 'Get AI suggestions for a property' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'isApplied', description: 'Filter by applied status', required: false })
  @ApiResponse({ status: 200, description: 'AI suggestions retrieved successfully' })
  async getAiSuggestions(
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('isApplied') isApplied?: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const appliedFilter = isApplied ? isApplied === 'true' : undefined;

      const suggestions = await this.aiInsightsService.getAiSuggestions(
        propertyId,
        start,
        end,
        appliedFilter,
      );

      return {
        success: true,
        data: suggestions,
        count: suggestions.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get AI suggestions: ${error.message}`);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Apply an AI suggestion
   */
  @Post('suggestions/:suggestionId/apply')
  @ApiOperation({ summary: 'Apply an AI suggestion' })
  @ApiParam({ name: 'suggestionId', description: 'AI suggestion ID' })
  @ApiResponse({ status: 200, description: 'AI suggestion applied successfully' })
  async applySuggestion(
    @Param('suggestionId') suggestionId: string,
    @Body() body: { userId: string },
  ) {
    try {
      await this.aiInsightsService.applySuggestion(suggestionId, body.userId);

      return {
        success: true,
        message: 'AI suggestion applied successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to apply AI suggestion: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Refresh competitor data for a property
   */
  @Post('competitors/:propertyId/refresh')
  @ApiOperation({ summary: 'Refresh competitor data for a property' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiResponse({ status: 200, description: 'Competitor data refresh initiated' })
  async refreshCompetitorData(@Param('propertyId') propertyId: string) {
    try {
      // Run refresh in background
      this.aiInsightsService.refreshCompetitorData(propertyId).catch(error => {
        this.logger.error(`Background competitor refresh failed: ${error.message}`);
      });

      return {
        success: true,
        message: 'Competitor data refresh initiated',
      };
    } catch (error) {
      this.logger.error(`Failed to initiate competitor refresh: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Test rate shopper connection
   */
  @Get('rate-shopper/test-connection')
  @ApiOperation({ summary: 'Test rate shopper API connection' })
  @ApiResponse({ status: 200, description: 'Connection test completed' })
  async testRateShopperConnection() {
    try {
      const result = await this.rateShopperService.testConnection();
      
      return {
        success: result.success,
        message: result.message,
      };
    } catch (error) {
      this.logger.error(`Rate shopper connection test failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get AI insights dashboard data
   */
  @Get('dashboard/:propertyId')
  @ApiOperation({ summary: 'Get comprehensive AI insights dashboard data' })
  @ApiParam({ name: 'propertyId', description: 'Property ID' })
  @ApiQuery({ name: 'date', description: 'Date (YYYY-MM-DD)', required: false })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getDashboardData(
    @Param('propertyId') propertyId: string,
    @Query('date') date?: string,
  ) {
    try {
      const targetDate = date ? new Date(date) : new Date();
      const endDate = new Date(targetDate);
      endDate.setDate(targetDate.getDate() + 7); // Next 7 days

      // Get recommendations, competitor insights, and suggestions in parallel
      const [recommendations, competitorInsights, suggestions] = await Promise.all([
        this.aiInsightsService.generateRateRecommendations(propertyId, targetDate, endDate),
        this.aiInsightsService.getCompetitorInsights(propertyId, targetDate),
        this.aiInsightsService.getAiSuggestions(propertyId, targetDate, endDate, false),
      ]);

      return {
        success: true,
        data: {
          recommendations,
          competitorInsights,
          suggestions,
          summary: {
            recommendationCount: recommendations.length,
            competitorCount: competitorInsights.length,
            pendingSuggestions: suggestions.length,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get dashboard data: ${error.message}`);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
} 