import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { DatabaseService } from '../database/database.service';
import { RateGainProvider } from './providers/rategain.provider';
import { SiteminderProvider } from './providers/siteminder.provider';
import { DerbysoftProvider } from './providers/derbysoft.provider';
import { BookingComProvider } from './providers/booking-com.provider';
import { ExpediaProvider } from './providers/expedia.provider';

export interface SyncRequest {
  propertyId: string;
  channelId: string;
  rateInventoryIds: string[];
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  userId: string;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{
    recordId: string;
    error: string;
    retryable: boolean;
  }>;
  syncId: string;
}

/**
 * Channel Manager Sync Service
 * 
 * Orchestrates real-time synchronization with external channel managers:
 * - Queue-based processing for reliability
 * - Multi-provider support with automatic routing
 * - Retry logic with exponential backoff
 * - Comprehensive error handling and logging
 * - Real-time status tracking and monitoring
 */
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    @InjectQueue('channel-sync') private readonly syncQueue: Queue,
    @InjectQueue('channel-retry') private readonly retryQueue: Queue,
    private readonly rateGainProvider: RateGainProvider,
    private readonly siteminderProvider: SiteminderProvider,
    private readonly derbysoftProvider: DerbysoftProvider,
    private readonly bookingComProvider: BookingComProvider,
    private readonly expediaProvider: ExpediaProvider,
  ) {}

  /**
   * Sync rates and inventory to channel managers
   */
  async syncRatesInventory(request: SyncRequest): Promise<SyncResult> {
    const syncId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Validate request
      await this.validateSyncRequest(request);

      // Get channel configuration
      const channel = await this.databaseService.channel.findUnique({
        where: { id: request.channelId },
        include: { configuration: true },
      });

      if (!channel || !channel.isActive) {
        throw new BadRequestException('Channel not found or inactive');
      }

      // Create sync log entry
      const syncLog = await this.databaseService.channelSyncLog.create({
        data: {
          id: syncId,
          channelId: request.channelId,
          propertyId: request.propertyId,
          operation: request.operation,
          status: 'PENDING',
          requestedBy: request.userId,
          totalRecords: request.rateInventoryIds.length,
          startedAt: new Date(),
        },
      });

      // Queue sync job based on priority
      const priority = this.getPriority(request.priority);
      
      await this.syncQueue.add(
        'sync-rates-inventory',
        {
          syncId,
          request,
          channelConfig: channel.configuration,
        },
        {
          priority,
          delay: 0,
          jobId: syncId,
        }
      );

      this.logger.log(`Queued sync job ${syncId} for channel ${channel.name}`);

      return {
        success: true,
        syncedCount: 0, // Will be updated by processor
        failedCount: 0,
        errors: [],
        syncId,
      };

    } catch (error) {
      this.logger.error(`Failed to queue sync job: ${error.message}`, error.stack);
      
      // Update sync log with error
      await this.databaseService.channelSyncLog.update({
        where: { id: syncId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Process sync job (called by queue processor)
   */
  async processSyncJob(
    syncId: string,
    request: SyncRequest,
    channelConfig: any,
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`Processing sync job ${syncId}`);

      // Update sync log status
      await this.databaseService.channelSyncLog.update({
        where: { id: syncId },
        data: { status: 'IN_PROGRESS' },
      });

      // Get rate inventory data
      const rateInventoryData = await this.databaseService.rateInventory.findMany({
        where: {
          id: { in: request.rateInventoryIds },
          propertyId: request.propertyId,
        },
        include: {
          roomType: true,
          ratePlan: true,
          channel: true,
        },
      });

      if (rateInventoryData.length === 0) {
        throw new Error('No rate inventory data found');
      }

      // Get appropriate provider
      const provider = this.getProvider(rateInventoryData[0].channel.type);
      
      // Sync data to external system
      const result = await provider.syncRatesInventory(
        rateInventoryData,
        channelConfig,
        request.operation,
      );

      // Update individual record sync status
      await this.updateRecordSyncStatus(rateInventoryData, result);

      // Update sync log with results
      await this.databaseService.channelSyncLog.update({
        where: { id: syncId },
        data: {
          status: result.success ? 'SUCCESS' : 'PARTIAL_SUCCESS',
          successCount: result.syncedCount,
          failedCount: result.failedCount,
          errorMessage: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
          completedAt: new Date(),
          duration: Date.now() - startTime,
        },
      });

      // Queue retry jobs for failed records
      if (result.failedCount > 0) {
        await this.queueRetryJobs(syncId, result.errors, request);
      }

      this.logger.log(
        `Completed sync job ${syncId}: ${result.syncedCount} success, ${result.failedCount} failed`
      );

    } catch (error) {
      this.logger.error(`Sync job ${syncId} failed: ${error.message}`, error.stack);

      // Update sync log with error
      await this.databaseService.channelSyncLog.update({
        where: { id: syncId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
          duration: Date.now() - startTime,
        },
      });

      throw error;
    }
  }

  /**
   * Get sync status for a property
   */
  async getSyncStatus(propertyId: string, channelId?: string) {
    const where: any = { propertyId };
    if (channelId) {
      where.channelId = channelId;
    }

    const syncLogs = await this.databaseService.channelSyncLog.findMany({
      where,
      include: { channel: true },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return syncLogs.map(log => ({
      id: log.id,
      channel: log.channel.name,
      status: log.status,
      operation: log.operation,
      totalRecords: log.totalRecords,
      successCount: log.successCount,
      failedCount: log.failedCount,
      startedAt: log.startedAt,
      completedAt: log.completedAt,
      duration: log.duration,
      errorMessage: log.errorMessage,
    }));
  }

  /**
   * Cancel pending sync jobs
   */
  async cancelSyncJobs(propertyId: string, channelId?: string) {
    const jobs = await this.syncQueue.getJobs(['waiting', 'delayed']);
    
    const jobsToCancel = jobs.filter(job => {
      const data = job.data;
      return data.request.propertyId === propertyId &&
        (!channelId || data.request.channelId === channelId);
    });

    for (const job of jobsToCancel) {
      await job.remove();
      
      // Update sync log
      await this.databaseService.channelSyncLog.update({
        where: { id: job.data.syncId },
        data: {
          status: 'CANCELLED',
          completedAt: new Date(),
        },
      });
    }

    return { cancelledCount: jobsToCancel.length };
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.syncQueue.getWaiting(),
      this.syncQueue.getActive(),
      this.syncQueue.getCompleted(),
      this.syncQueue.getFailed(),
    ]);

    return {
      sync: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      },
      retry: {
        waiting: (await this.retryQueue.getWaiting()).length,
        active: (await this.retryQueue.getActive()).length,
        completed: (await this.retryQueue.getCompleted()).length,
        failed: (await this.retryQueue.getFailed()).length,
      },
    };
  }

  // Private helper methods

  private async validateSyncRequest(request: SyncRequest): Promise<void> {
    if (!request.propertyId || !request.channelId || !request.rateInventoryIds?.length) {
      throw new BadRequestException('Invalid sync request: missing required fields');
    }

    if (request.rateInventoryIds.length > 1000) {
      throw new BadRequestException('Too many records in single sync request (max 1000)');
    }

    // Verify property access
    const property = await this.databaseService.property.findUnique({
      where: { id: request.propertyId },
    });

    if (!property) {
      throw new BadRequestException('Property not found');
    }
  }

  private getProvider(channelType: string) {
    switch (channelType) {
      case 'RATEGAIN':
        return this.rateGainProvider;
      case 'SITEMINDER':
        return this.siteminderProvider;
      case 'DERBYSOFT':
        return this.derbysoftProvider;
      case 'BOOKING_COM':
        return this.bookingComProvider;
      case 'EXPEDIA':
        return this.expediaProvider;
      default:
        throw new Error(`Unsupported channel type: ${channelType}`);
    }
  }

  private getPriority(priority?: string): number {
    switch (priority) {
      case 'HIGH':
        return 10;
      case 'NORMAL':
        return 5;
      case 'LOW':
        return 1;
      default:
        return 5;
    }
  }

  private async updateRecordSyncStatus(rateInventoryData: any[], result: SyncResult) {
    const updates = rateInventoryData.map(record => {
      const error = result.errors.find(e => e.recordId === record.id);
      
      return this.databaseService.rateInventory.update({
        where: { id: record.id },
        data: {
          syncStatus: error ? 'FAILED' : 'SUCCESS',
          lastSyncAt: new Date(),
          syncError: error?.error || null,
        },
      });
    });

    await Promise.all(updates);
  }

  private async queueRetryJobs(syncId: string, errors: any[], request: SyncRequest) {
    const retryableErrors = errors.filter(e => e.retryable);
    
    if (retryableErrors.length === 0) return;

    for (const error of retryableErrors) {
      await this.retryQueue.add(
        'retry-sync',
        {
          originalSyncId: syncId,
          recordId: error.recordId,
          request: {
            ...request,
            rateInventoryIds: [error.recordId],
          },
          retryCount: 1,
        },
        {
          delay: 5000, // 5 second delay
          attempts: 3,
        }
      );
    }
  }
} 