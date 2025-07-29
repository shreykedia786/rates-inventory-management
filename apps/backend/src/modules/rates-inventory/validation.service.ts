import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateRateInventoryDto,
  UpdateRateInventoryDto,
  BulkUpdateItemDto,
} from './dto/rates-inventory.dto';

/**
 * Validation Service
 * 
 * Handles business rule validation for rates and inventory:
 * - Rate and inventory constraints
 * - Restriction logic validation
 * - Channel-specific rules
 * - Date range validation
 * - Business rule enforcement
 */
@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Validate rate and inventory data for creation
   */
  async validateRateInventoryData(
    data: CreateRateInventoryDto,
    propertyId: string,
  ): Promise<void> {
    const errors: string[] = [];

    // Validate basic constraints
    if (data.rate < 0) {
      errors.push('Rate cannot be negative');
    }

    if (data.inventory < 0) {
      errors.push('Inventory cannot be negative');
    }

    // Validate date is not in the past (allow today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date < today) {
      errors.push('Cannot set rates for past dates');
    }

    // Validate date is not too far in the future (2 years max)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);
    if (data.date > maxFutureDate) {
      errors.push('Cannot set rates more than 2 years in advance');
    }

    // Validate MinLOS and MaxLOS
    if (data.minStay && data.maxStay && data.minStay > data.maxStay) {
      errors.push('Minimum stay cannot be greater than maximum stay');
    }

    if (data.minStay && (data.minStay < 1 || data.minStay > 30)) {
      errors.push('Minimum stay must be between 1 and 30 days');
    }

    if (data.maxStay && (data.maxStay < 1 || data.maxStay > 365)) {
      errors.push('Maximum stay must be between 1 and 365 days');
    }

    // Validate room type exists and belongs to property
    const roomType = await this.databaseService.roomType.findFirst({
      where: {
        id: data.roomTypeId,
        propertyId,
      },
    });

    if (!roomType) {
      errors.push('Invalid room type for this property');
    }

    // Validate rate plan exists and belongs to property
    const ratePlan = await this.databaseService.ratePlan.findFirst({
      where: {
        id: data.ratePlanId,
        propertyId,
      },
    });

    if (!ratePlan) {
      errors.push('Invalid rate plan for this property');
    }

    // Validate channel exists and is active
    const channel = await this.databaseService.channel.findUnique({
      where: { id: data.channelId },
    });

    if (!channel || !channel.isActive) {
      errors.push('Invalid or inactive channel');
    }

    // Channel-specific validation
    if (channel) {
      await this.validateChannelSpecificRules(data, channel, errors);
    }

    // Property-specific validation
    if (roomType && ratePlan) {
      await this.validatePropertySpecificRules(data, propertyId, roomType, ratePlan, errors);
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate rate and inventory update
   */
  async validateRateInventoryUpdate(
    updateData: UpdateRateInventoryDto,
    existingRecord: any,
  ): Promise<void> {
    const errors: string[] = [];

    // Validate rate constraints
    if (updateData.rate !== undefined) {
      if (updateData.rate < 0) {
        errors.push('Rate cannot be negative');
      }

      // Check for rate floor/ceiling if configured
      const ratePlan = await this.databaseService.ratePlan.findUnique({
        where: { id: existingRecord.ratePlanId },
      });

      if (ratePlan?.minRate && updateData.rate < ratePlan.minRate) {
        errors.push(`Rate cannot be below minimum rate of $${ratePlan.minRate}`);
      }

      if (ratePlan?.maxRate && updateData.rate > ratePlan.maxRate) {
        errors.push(`Rate cannot exceed maximum rate of $${ratePlan.maxRate}`);
      }
    }

    // Validate inventory constraints
    if (updateData.inventory !== undefined) {
      if (updateData.inventory < 0) {
        errors.push('Inventory cannot be negative');
      }

      // Check against room type capacity
      const roomType = await this.databaseService.roomType.findUnique({
        where: { id: existingRecord.roomTypeId },
      });

      if (roomType?.maxOccupancy && updateData.inventory > roomType.maxOccupancy) {
        errors.push(`Inventory cannot exceed room capacity of ${roomType.maxOccupancy}`);
      }
    }

    // Validate stay restrictions
    if (updateData.minStay !== undefined && updateData.maxStay !== undefined) {
      if (updateData.minStay > updateData.maxStay) {
        errors.push('Minimum stay cannot be greater than maximum stay');
      }
    } else if (updateData.minStay !== undefined && existingRecord.maxStay) {
      if (updateData.minStay > existingRecord.maxStay) {
        errors.push('Minimum stay cannot be greater than existing maximum stay');
      }
    } else if (updateData.maxStay !== undefined && existingRecord.minStay) {
      if (updateData.maxStay < existingRecord.minStay) {
        errors.push('Maximum stay cannot be less than existing minimum stay');
      }
    }

    // Validate restriction logic
    if (updateData.stopSell && (updateData.inventory > 0 || updateData.rate > 0)) {
      // Allow but warn - stop sell overrides inventory/rate
      this.logger.warn('Stop sell is enabled but inventory/rate is set - stop sell takes precedence');
    }

    if (updateData.closedToArrival && updateData.closedToDeparture) {
      errors.push('Cannot close both arrival and departure on the same date');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate bulk update operation
   */
  async validateBulkUpdate(
    updateItem: BulkUpdateItemDto,
    propertyId: string,
  ): Promise<void> {
    const errors: string[] = [];

    // Basic validation
    if (updateItem.rate !== undefined && updateItem.rate < 0) {
      errors.push(`Invalid rate for ${updateItem.date}: cannot be negative`);
    }

    if (updateItem.inventory !== undefined && updateItem.inventory < 0) {
      errors.push(`Invalid inventory for ${updateItem.date}: cannot be negative`);
    }

    // Validate entities exist
    const [roomType, ratePlan, channel] = await Promise.all([
      this.databaseService.roomType.findFirst({
        where: { id: updateItem.roomTypeId, propertyId },
      }),
      this.databaseService.ratePlan.findFirst({
        where: { id: updateItem.ratePlanId, propertyId },
      }),
      this.databaseService.channel.findUnique({
        where: { id: updateItem.channelId },
      }),
    ]);

    if (!roomType) {
      errors.push(`Invalid room type: ${updateItem.roomTypeId}`);
    }

    if (!ratePlan) {
      errors.push(`Invalid rate plan: ${updateItem.ratePlanId}`);
    }

    if (!channel || !channel.isActive) {
      errors.push(`Invalid or inactive channel: ${updateItem.channelId}`);
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Bulk validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate channel-specific business rules
   */
  private async validateChannelSpecificRules(
    data: CreateRateInventoryDto,
    channel: any,
    errors: string[],
  ): Promise<void> {
    switch (channel.type) {
      case 'BOOKING_COM':
        // Booking.com specific rules
        if (data.rate && data.rate < 10) {
          errors.push('Booking.com requires minimum rate of $10');
        }
        if (data.maxStay && data.maxStay > 28) {
          errors.push('Booking.com maximum stay cannot exceed 28 days');
        }
        break;

      case 'EXPEDIA':
        // Expedia specific rules
        if (data.rate && data.rate < 15) {
          errors.push('Expedia requires minimum rate of $15');
        }
        break;

      case 'AGODA':
        // Agoda specific rules
        if (data.minStay && data.minStay > 14) {
          errors.push('Agoda minimum stay cannot exceed 14 days');
        }
        break;

      case 'DIRECT':
        // Direct booking rules (more flexible)
        break;

      default:
        // Generic OTA rules
        if (data.rate && data.rate < 5) {
          errors.push('Minimum rate of $5 required for OTA channels');
        }
        break;
    }

    // Check channel-specific rate parity rules
    if (channel.type !== 'DIRECT' && data.rate) {
      const directRate = await this.databaseService.rateInventory.findFirst({
        where: {
          roomTypeId: data.roomTypeId,
          ratePlanId: data.ratePlanId,
          date: data.date,
          channel: { type: 'DIRECT' },
        },
      });

      if (directRate && data.rate < directRate.rate * 0.95) {
        errors.push('OTA rate cannot be more than 5% below direct rate (rate parity)');
      }
    }
  }

  /**
   * Validate property-specific business rules
   */
  private async validatePropertySpecificRules(
    data: CreateRateInventoryDto,
    propertyId: string,
    roomType: any,
    ratePlan: any,
    errors: string[],
  ): Promise<void> {
    // Check for blackout dates
    const blackoutDate = await this.databaseService.blackoutDate.findFirst({
      where: {
        propertyId,
        date: data.date,
        isActive: true,
      },
    });

    if (blackoutDate) {
      errors.push(`${data.date.toISOString().split('T')[0]} is a blackout date`);
    }

    // Check for special events that might affect pricing
    const specialEvent = await this.databaseService.specialEvent.findFirst({
      where: {
        propertyId,
        startDate: { lte: data.date },
        endDate: { gte: data.date },
        isActive: true,
      },
    });

    if (specialEvent && specialEvent.minRate && data.rate < specialEvent.minRate) {
      errors.push(`Minimum rate of $${specialEvent.minRate} required during ${specialEvent.name}`);
    }

    // Validate against seasonal pricing rules
    const seasonalRule = await this.databaseService.seasonalPricing.findFirst({
      where: {
        propertyId,
        roomTypeId: data.roomTypeId,
        ratePlanId: data.ratePlanId,
        startDate: { lte: data.date },
        endDate: { gte: data.date },
        isActive: true,
      },
    });

    if (seasonalRule) {
      if (seasonalRule.minRate && data.rate < seasonalRule.minRate) {
        errors.push(`Seasonal minimum rate of $${seasonalRule.minRate} required`);
      }
      if (seasonalRule.maxRate && data.rate > seasonalRule.maxRate) {
        errors.push(`Seasonal maximum rate of $${seasonalRule.maxRate} exceeded`);
      }
    }

    // Check inventory against overbooking limits
    if (data.inventory > roomType.totalRooms * 1.1) {
      errors.push('Inventory exceeds 110% of total rooms (overbooking limit)');
    }
  }

  /**
   * Validate date range for bulk operations
   */
  validateDateRange(startDate: Date, endDate: Date): void {
    const errors: string[] = [];

    if (startDate >= endDate) {
      errors.push('Start date must be before end date');
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      errors.push('Date range cannot exceed 365 days');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (endDate < today) {
      errors.push('End date cannot be in the past');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Date range validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate rate consistency across channels
   */
  async validateRateConsistency(
    propertyId: string,
    roomTypeId: string,
    ratePlanId: string,
    date: Date,
    newRate: number,
    channelId: string,
  ): Promise<string[]> {
    const warnings: string[] = [];

    // Get rates for the same room type, rate plan, and date across all channels
    const existingRates = await this.databaseService.rateInventory.findMany({
      where: {
        propertyId,
        roomTypeId,
        ratePlanId,
        date,
        channelId: { not: channelId },
      },
      include: { channel: true },
    });

    for (const rate of existingRates) {
      const priceDiff = Math.abs(newRate - rate.rate) / rate.rate;
      
      if (priceDiff > 0.2) { // More than 20% difference
        warnings.push(
          `Rate differs by ${(priceDiff * 100).toFixed(1)}% from ${rate.channel.name} ($${rate.rate})`
        );
      }
    }

    return warnings;
  }
} 