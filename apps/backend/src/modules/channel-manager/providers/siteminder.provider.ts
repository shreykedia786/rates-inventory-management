import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface ChannelSyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{
    recordId: string;
    error: string;
    retryable: boolean;
  }>;
}

/**
 * SiteMinder Channel Manager Provider
 * 
 * Handles real-time synchronization with SiteMinder's channel management platform:
 * - Rate and inventory distribution to 400+ channels
 * - Advanced restriction management
 * - Real-time availability updates
 * - Multi-property and multi-brand support
 * - Comprehensive error handling and retry logic
 */
@Injectable()
export class SiteminderProvider {
  private readonly logger = new Logger(SiteminderProvider.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('SITEMINDER_API_URL', 'https://api.siteminder.com/v1');
    this.apiKey = this.configService.get<string>('SITEMINDER_API_KEY', '');
  }

  /**
   * Sync rates and inventory to SiteMinder
   */
  async syncRatesInventory(
    rateInventoryData: any[],
    channelConfig: any,
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
  ): Promise<ChannelSyncResult> {
    const startTime = Date.now();
    const result: ChannelSyncResult = {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };

    try {
      this.logger.log(`Starting SiteMinder sync: ${operation} for ${rateInventoryData.length} records`);

      // Validate configuration
      if (!this.apiKey || !channelConfig.hotelId) {
        throw new Error('SiteMinder API key or hotel ID not configured');
      }

      // Group records by date for SiteMinder's bulk update format
      const groupedByDate = this.groupRecordsByDate(rateInventoryData);

      for (const [date, records] of Object.entries(groupedByDate)) {
        try {
          const dateResult = await this.syncDateRecords(date, records as any[], channelConfig, operation);
          result.syncedCount += dateResult.syncedCount;
          result.failedCount += dateResult.failedCount;
          result.errors.push(...dateResult.errors);
        } catch (error) {
          this.logger.error(`Date sync failed for ${date}: ${error.message}`);
          
          // Mark all records for this date as failed
          (records as any[]).forEach(record => {
            result.errors.push({
              recordId: record.id,
              error: `Date sync failed: ${error.message}`,
              retryable: this.isRetryableError(error),
            });
            result.failedCount++;
          });
        }
      }

      // Update overall success status
      result.success = result.failedCount === 0;

      this.logger.log(
        `SiteMinder sync completed: ${result.syncedCount} success, ${result.failedCount} failed (${Date.now() - startTime}ms)`
      );

      return result;

    } catch (error) {
      this.logger.error(`SiteMinder sync failed: ${error.message}`, error.stack);
      
      // Mark all records as failed
      rateInventoryData.forEach(record => {
        result.errors.push({
          recordId: record.id,
          error: error.message,
          retryable: this.isRetryableError(error),
        });
      });

      result.failedCount = rateInventoryData.length;
      result.success = false;

      return result;
    }
  }

  /**
   * Sync records for a specific date
   */
  private async syncDateRecords(
    date: string,
    records: any[],
    channelConfig: any,
    operation: string,
  ): Promise<ChannelSyncResult> {
    const result: ChannelSyncResult = {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
    };

    // Transform data to SiteMinder format
    const siteminderData = this.transformToSiteminderFormat(records, channelConfig, date);

    try {
      const endpoint = operation === 'DELETE' ? 'delete-inventory' : 'update-inventory';
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/hotels/${channelConfig.hotelId}/${endpoint}`,
          siteminderData,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'X-SiteMinder-Version': '2024.1',
              'X-Request-ID': this.generateRequestId(),
            },
            timeout: 45000, // 45 seconds for SiteMinder
          }
        )
      );

      // Process SiteMinder response
      if (response.data.status === 'success') {
        result.syncedCount = records.length;
        this.logger.debug(`SiteMinder date sync successful: ${date} - ${records.length} records`);
      } else {
        // Handle SiteMinder-specific error format
        const errors = response.data.errors || [];
        errors.forEach((error: any) => {
          const record = records.find(r => 
            r.roomType.code === error.roomTypeCode && r.ratePlan.code === error.ratePlanCode
          );
          
          if (record) {
            result.errors.push({
              recordId: record.id,
              error: `SiteMinder error: ${error.message} (Code: ${error.errorCode})`,
              retryable: this.isSiteminderErrorRetryable(error.errorCode),
            });
            result.failedCount++;
          }
        });
        
        result.syncedCount = records.length - result.failedCount;
      }

    } catch (error) {
      this.logger.error(`SiteMinder API call failed for date ${date}: ${error.message}`);
      
      // Mark all records for this date as failed
      records.forEach(record => {
        result.errors.push({
          recordId: record.id,
          error: `API call failed: ${error.message}`,
          retryable: this.isRetryableError(error),
        });
        result.failedCount++;
      });
    }

    return result;
  }

  /**
   * Transform internal data format to SiteMinder API format
   */
  private transformToSiteminderFormat(records: any[], channelConfig: any, date: string): any {
    const roomTypes = this.groupRecordsByRoomType(records);
    
    return {
      date: date,
      currency: channelConfig.currency || 'USD',
      roomTypes: Object.entries(roomTypes).map(([roomTypeCode, roomRecords]) => ({
        roomTypeCode: this.mapRoomType(roomTypeCode, channelConfig.roomTypeMapping),
        ratePlans: (roomRecords as any[]).map(record => ({
          ratePlanCode: this.mapRatePlan(record.ratePlan.code, channelConfig.ratePlanMapping),
          rate: record.rate ? {
            amount: parseFloat(record.rate.toString()),
            currency: channelConfig.currency || 'USD',
          } : null,
          inventory: record.inventory,
          restrictions: {
            minimumStay: record.minLos,
            maximumStay: record.maxLos,
            closedToArrival: record.cta,
            closedToDeparture: record.ctd,
            stopSell: record.stopSell,
          },
          metadata: {
            internalId: record.id,
            lastModified: record.updatedAt,
            syncSource: 'rates-inventory-platform',
          },
        })),
      })),
      requestMetadata: {
        timestamp: new Date().toISOString(),
        source: 'rates-inventory-platform',
        version: '1.0.0',
      },
    };
  }

  /**
   * Group records by date
   */
  private groupRecordsByDate(records: any[]): Record<string, any[]> {
    return records.reduce((groups, record) => {
      const date = record.date.toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {});
  }

  /**
   * Group records by room type
   */
  private groupRecordsByRoomType(records: any[]): Record<string, any[]> {
    return records.reduce((groups, record) => {
      const roomTypeCode = record.roomType.code;
      if (!groups[roomTypeCode]) {
        groups[roomTypeCode] = [];
      }
      groups[roomTypeCode].push(record);
      return groups;
    }, {});
  }

  /**
   * Map internal room type to SiteMinder room type
   */
  private mapRoomType(internalCode: string, mapping: any): string {
    return mapping[internalCode] || internalCode;
  }

  /**
   * Map internal rate plan to SiteMinder rate plan
   */
  private mapRatePlan(internalCode: string, mapping: any): string {
    return mapping[internalCode] || internalCode;
  }

  /**
   * Check if SiteMinder-specific error is retryable
   */
  private isSiteminderErrorRetryable(errorCode: string): boolean {
    const retryableErrorCodes = [
      'RATE_LIMIT_EXCEEDED',
      'TEMPORARY_UNAVAILABLE',
      'INTERNAL_SERVER_ERROR',
      'TIMEOUT_ERROR',
      'CONNECTION_ERROR',
    ];
    
    return retryableErrorCodes.includes(errorCode);
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors, timeouts, and 5xx server errors are retryable
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    if (error.response?.status >= 500) {
      return true;
    }

    // SiteMinder rate limiting
    if (error.response?.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * Generate unique request ID for SiteMinder tracking
   */
  private generateRequestId(): string {
    return `sm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Test connection to SiteMinder API
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/health`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        })
      );

      return {
        success: true,
        message: 'SiteMinder connection successful',
      };
    } catch (error) {
      return {
        success: false,
        message: `SiteMinder connection failed: ${error.message}`,
      };
    }
  }
} 