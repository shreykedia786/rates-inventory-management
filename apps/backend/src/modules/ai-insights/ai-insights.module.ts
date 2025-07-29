import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AiInsightsService } from './ai-insights.service';
import { RateShopperService } from './rate-shopper.service';
import { RecommendationEngine } from './recommendation.engine';
import { CompetitorAnalysisService } from './competitor-analysis.service';
import { AiInsightsController } from './ai-insights.controller';

/**
 * AI Insights Module
 * 
 * Provides AI-powered revenue optimization and competitive intelligence:
 * - Rate recommendations with confidence scoring
 * - Competitor analysis and market positioning
 * - Market trend detection and forecasting
 * - Historical performance analysis
 * - Real-time insights and suggestions
 */
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AiInsightsController],
  providers: [
    AiInsightsService,
    RateShopperService,
    RecommendationEngine,
    CompetitorAnalysisService,
  ],
  exports: [
    AiInsightsService,
    RateShopperService,
    RecommendationEngine,
    CompetitorAnalysisService,
  ],
})
export class AiInsightsModule {} 