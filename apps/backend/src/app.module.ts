import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';

// Database
import { PrismaModule } from './common/database/prisma.module';

// Core modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { RatesInventoryModule } from './modules/rates-inventory/rates-inventory.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { AiInsightsModule } from './modules/ai-insights/ai-insights.module';
import { AuditModule } from './modules/audit/audit.module';

// Common modules
import { HealthModule } from './common/health/health.module';

// Configuration
import { validationSchema } from './common/config/validation';
import configuration from './common/config/configuration';

/**
 * Main application module for the Rates & Inventory Management Platform
 * 
 * Configures all core modules following Phase 1 specifications:
 * - Multi-tenant architecture
 * - Enterprise security (RBAC, MFA, JWT)
 * - Real-time sync capabilities
 * - AI-powered insights
 * - Comprehensive audit logging
 * - Performance optimization (caching, rate limiting)
 */
@Module({
  imports: [
    // Configuration management with validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      expandVariables: true,
    }),

    // Rate limiting for API security
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000, // Convert to milliseconds
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
        {
          name: 'medium',
          ttl: 60 * 60 * 1000, // 1 hour
          limit: 1000,
        },
        {
          name: 'long',
          ttl: 24 * 60 * 60 * 1000, // 24 hours
          limit: 10000,
        },
      ],
      inject: [ConfigService],
    }),

    // Redis caching for performance
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: 'redis',
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 300, // 5 minutes default TTL
        max: 1000, // Maximum number of items in cache
      }),
      inject: [ConfigService],
    }),

    // Background job processing with Redis
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 50, // Keep last 50 failed jobs
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Database module
    PrismaModule,

    // Core business modules
    AuthModule,
    UsersModule,
    PropertiesModule,
    RatesInventoryModule,
    ChannelsModule,
    AiInsightsModule,
    AuditModule,

    // Common modules
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Log module initialization in development
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      console.log('🏗️  AppModule initialized with the following modules:');
      console.log('   - Configuration & Validation');
      console.log('   - Rate Limiting & Throttling'); 
      console.log('   - Redis Caching');
      console.log('   - Background Job Processing');
      console.log('   - Database (PostgreSQL + Prisma)');
      console.log('   - Authentication & Authorization');
      console.log('   - User Management & RBAC');
      console.log('   - Property Management');
      console.log('   - Rates & Inventory Management');
      console.log('   - Channel Integrations');
      console.log('   - AI Insights & Recommendations');
      console.log('   - Audit Logging & Compliance');
      console.log('   - Health Monitoring');
    }
  }
} 