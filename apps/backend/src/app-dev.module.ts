import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiInsightsModule } from './modules/ai-insights/ai-insights.module';

/**
 * Minimal development app module for the Rates & Inventory Management Platform
 * 
 * This module runs without external dependencies for quick development setup:
 * - Basic configuration only
 * - AI Insights module with mock data
 * - No external services required
 * - Ready for development and testing
 */
@Module({
  imports: [
    // Basic configuration management
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    
    // AI Insights module with development features
    AiInsightsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppDevModule {
  constructor() {
    console.log('🏗️  Development AppModule initialized');
    console.log('   - Basic Configuration');
    console.log('   - AI Insights Module');
    console.log('   - Ready for development!');
  }
} 