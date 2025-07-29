import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * Create Rate Inventory DTO
 */
export class CreateRateInventoryDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 'room-type-uuid' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ example: 'rate-plan-uuid' })
  @IsUUID()
  ratePlanId: string;

  @ApiProperty({ example: 'channel-uuid' })
  @IsUUID()
  channelId: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rate: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  inventory: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  minStay?: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  maxStay?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToArrival?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToDeparture?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  stopSell?: boolean;
}

/**
 * Update Rate Inventory DTO
 */
export class UpdateRateInventoryDto {
  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rate?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  minStay?: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  maxStay?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToArrival?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToDeparture?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  stopSell?: boolean;
}

/**
 * Rate Inventory Query DTO
 */
export class RateInventoryQueryDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2024-01-31' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: ['room-type-1', 'room-type-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roomTypeIds?: string[];

  @ApiProperty({ example: ['rate-plan-1', 'rate-plan-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ratePlanIds?: string[];

  @ApiProperty({ example: ['channel-1', 'channel-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  channelIds?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeRestrictions?: boolean;
}

/**
 * Bulk Update Item DTO
 */
export class BulkUpdateItemDto {
  @ApiProperty({ example: 'rate-inventory-uuid', required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 'room-type-uuid' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ example: 'rate-plan-uuid' })
  @IsUUID()
  ratePlanId: string;

  @ApiProperty({ example: 'channel-uuid' })
  @IsUUID()
  channelId: string;

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  rate?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  minStay?: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  maxStay?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToArrival?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  closedToDeparture?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  stopSell?: boolean;
}

/**
 * Bulk Update Operation Type
 */
export enum BulkOperationType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  COPY = 'COPY',
}

/**
 * Bulk Update DTO
 */
export class BulkUpdateDto {
  @ApiProperty({ enum: BulkOperationType, example: BulkOperationType.UPDATE })
  @IsEnum(BulkOperationType)
  operation: BulkOperationType;

  @ApiProperty({ type: [BulkUpdateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  updates: BulkUpdateItemDto[];
}

/**
 * Copy Rates Inventory DTO
 */
export class CopyRatesInventoryDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  sourceStartDate: Date;

  @ApiProperty({ example: '2024-01-07' })
  @IsDate()
  @Type(() => Date)
  sourceEndDate: Date;

  @ApiProperty({ example: '2024-02-01' })
  @IsDate()
  @Type(() => Date)
  targetStartDate: Date;

  @ApiProperty({ example: '2024-02-07' })
  @IsDate()
  @Type(() => Date)
  targetEndDate: Date;

  @ApiProperty({ example: ['room-type-1'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roomTypeIds?: string[];

  @ApiProperty({ example: ['rate-plan-1'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ratePlanIds?: string[];

  @ApiProperty({ example: ['channel-1'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  channelIds?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  copyRates?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  copyInventory?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  copyRestrictions?: boolean;
}

/**
 * Rate Inventory Statistics DTO
 */
export class RateInventoryStatsDto {
  @ApiProperty({ example: 1000 })
  total: number;

  @ApiProperty({ example: 125.50 })
  averageRate: number;

  @ApiProperty({ example: 8.5 })
  averageInventory: number;

  @ApiProperty({ 
    example: { min: 50.00, max: 300.00 },
    description: 'Rate range'
  })
  rateRange: {
    min: number;
    max: number;
  };

  @ApiProperty({ 
    example: { min: 0, max: 20 },
    description: 'Inventory range'
  })
  inventoryRange: {
    min: number;
    max: number;
  };

  @ApiProperty({ 
    example: [
      { stopSell: false, closedToArrival: false, closedToDeparture: false, _count: { id: 800 } },
      { stopSell: true, closedToArrival: false, closedToDeparture: false, _count: { id: 200 } }
    ],
    description: 'Restriction statistics'
  })
  restrictions: Array<{
    stopSell: boolean;
    closedToArrival: boolean;
    closedToDeparture: boolean;
    _count: { id: number };
  }>;
} 