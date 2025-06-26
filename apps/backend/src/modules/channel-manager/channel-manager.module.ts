import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';

import { DatabaseModule } from '../database/database.module';
import { ChannelManagerController } from './channel-manager.controller';
import { ChannelManagerService } from './channel-manager.service';
import { SyncService } from './sync.service';
import { RetryService } from './retry.service';

// Channel Manager Providers
import { RateGainProvider } from './providers/rategain.provider';
import { SiteminderProvider } from './providers/siteminder.provider';
import { DerbysoftProvider } from './providers/derbysoft.provider';
import { BookingComProvider } from './providers/booking-com.provider';
import { ExpediaProvider } from './providers/expedia.provider';

// Queue Processors
import { SyncProcessor } from './processors/sync.processor';
import { RetryProcessor } from './processors/retry.processor';

/**
 * Channel Manager Integration Module
 * 
 * Handles real-time synchronization with external channel managers and OTAs:
 * - Multi-provider support (RateGain, SiteMinder, Derbysoft)
 * - Direct OTA integrations (Booking.com, Expedia, Agoda)
 * - Real-time sync with retry logic and error handling
 * - Queue-based processing for reliability
 * - Comprehensive logging and monitoring
 */
@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 30000, // 30 seconds
      maxRedirects: 3,
    }),
    BullModule.registerQueue(
      {
        name: 'channel-sync',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      },
      {
        name: 'channel-retry',
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 50,
          removeOnFail: 100,
        },
      },
    ),
  ],
  controllers: [ChannelManagerController],
  providers: [
    ChannelManagerService,
    SyncService,
    RetryService,
    
    // Channel Manager Providers
    RateGainProvider,
    SiteminderProvider,
    DerbysoftProvider,
    
    // Direct OTA Providers
    BookingComProvider,
    ExpediaProvider,
    
    // Queue Processors
    SyncProcessor,
    RetryProcessor,
  ],
  exports: [ChannelManagerService, SyncService],
})
export class ChannelManagerModule {} 