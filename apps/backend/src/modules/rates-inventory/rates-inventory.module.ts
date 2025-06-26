import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RatesInventoryController } from './rates-inventory.controller';
import { RatesInventoryService } from './rates-inventory.service';
import { ValidationService } from './validation.service';
import { BulkOperationsService } from './bulk-operations.service';

/**
 * Rates & Inventory Management Module
 * 
 * Core business module for managing:
 * - Room rates and inventory
 * - Restrictions (MinLOS, MaxLOS, CTA, CTD, Stop Sell)
 * - Multi-channel distribution
 * - Bulk operations and validation
 * - Real-time sync with channel managers
 */
@Module({
  imports: [DatabaseModule],
  controllers: [RatesInventoryController],
  providers: [
    RatesInventoryService,
    ValidationService,
    BulkOperationsService,
  ],
  exports: [RatesInventoryService],
})
export class RatesInventoryModule {} 