import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { RatesInventoryService } from './rates-inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole, User } from '@prisma/client';

import {
  CreateRateInventoryDto,
  UpdateRateInventoryDto,
  BulkUpdateDto,
  RateInventoryQueryDto,
  CopyRatesInventoryDto,
} from './dto/rates-inventory.dto';

/**
 * Rates & Inventory Controller
 * 
 * REST API endpoints for managing rates, inventory, and restrictions:
 * - CRUD operations for rate/inventory records
 * - Bulk operations (update, delete, copy)
 * - Query and filtering capabilities
 * - Statistics and reporting
 * - Multi-tenant and role-based access control
 */
@ApiTags('rates-inventory')
@Controller('properties/:propertyId/rates-inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatesInventoryController {
  constructor(private readonly ratesInventoryService: RatesInventoryService) {}

  /**
   * Get rates and inventory with filtering
   */
  @Get()
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN, UserRole.AI_VIEWER)
  @ApiOperation({ summary: 'Get rates and inventory' })
  @ApiResponse({ status: 200, description: 'Rates and inventory retrieved successfully' })
  async getRatesInventory(
    @Param('propertyId') propertyId: string,
    @Query() query: RateInventoryQueryDto,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.getRatesInventory(propertyId, user.id, query);
  }

  /**
   * Create new rate and inventory record
   */
  @Post()
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Create rate and inventory record' })
  @ApiResponse({ status: 201, description: 'Rate and inventory created successfully' })
  async createRateInventory(
    @Param('propertyId') propertyId: string,
    @Body() createDto: CreateRateInventoryDto,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.createRateInventory(propertyId, user.id, createDto);
  }

  /**
   * Update existing rate and inventory record
   */
  @Put(':id')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Update rate and inventory record' })
  @ApiResponse({ status: 200, description: 'Rate and inventory updated successfully' })
  async updateRateInventory(
    @Param('id') id: string,
    @Body() updateDto: UpdateRateInventoryDto,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.updateRateInventory(id, user.id, updateDto);
  }

  /**
   * Delete rate and inventory record
   */
  @Delete(':id')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete rate and inventory record' })
  @ApiResponse({ status: 204, description: 'Rate and inventory deleted successfully' })
  async deleteRateInventory(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.deleteRateInventory(id, user.id);
  }

  /**
   * Bulk update rates and inventory
   */
  @Post('bulk-update')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Bulk update rates and inventory' })
  @ApiResponse({ status: 200, description: 'Bulk update completed successfully' })
  async bulkUpdateRatesInventory(
    @Param('propertyId') propertyId: string,
    @Body() bulkUpdateDto: BulkUpdateDto,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.bulkUpdateRatesInventory(propertyId, user.id, bulkUpdateDto);
  }

  /**
   * Copy rates and inventory between date ranges
   */
  @Post('copy')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Copy rates and inventory between date ranges' })
  @ApiResponse({ status: 200, description: 'Rates and inventory copied successfully' })
  async copyRatesInventory(
    @Param('propertyId') propertyId: string,
    @Body() copyDto: CopyRatesInventoryDto,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.copyRatesInventory(
      propertyId,
      user.id,
      copyDto.sourceStartDate,
      copyDto.sourceEndDate,
      copyDto.targetStartDate,
      copyDto.targetEndDate,
      {
        roomTypeIds: copyDto.roomTypeIds,
        ratePlanIds: copyDto.ratePlanIds,
        channelIds: copyDto.channelIds,
        copyRates: copyDto.copyRates,
        copyInventory: copyDto.copyInventory,
        copyRestrictions: copyDto.copyRestrictions,
      },
    );
  }

  /**
   * Get rate and inventory statistics
   */
  @Get('statistics')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN, UserRole.AI_VIEWER)
  @ApiOperation({ summary: 'Get rate and inventory statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getRateInventoryStats(
    @Param('propertyId') propertyId: string,
    @GetUser() user: User,
  ) {
    return this.ratesInventoryService.getRateInventoryStats(propertyId, user.id);
  }

  /**
   * Get single rate and inventory record
   */
  @Get(':id')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN, UserRole.AI_VIEWER)
  @ApiOperation({ summary: 'Get single rate and inventory record' })
  @ApiResponse({ status: 200, description: 'Rate and inventory record retrieved successfully' })
  async getRateInventoryById(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    // This would be implemented in the service
    // return this.ratesInventoryService.getRateInventoryById(propertyId, id, user.id);
    throw new Error('Not implemented yet');
  }

  /**
   * Validate rate and inventory data
   */
  @Post('validate')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Validate rate and inventory data' })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  async validateRateInventory(
    @Param('propertyId') propertyId: string,
    @Body() createDto: CreateRateInventoryDto,
    @GetUser() user: User,
  ) {
    // This would validate without saving
    // return this.ratesInventoryService.validateRateInventory(propertyId, createDto, user.id);
    throw new Error('Not implemented yet');
  }

  /**
   * Get rate consistency warnings
   */
  @Get('consistency-check')
  @Roles(UserRole.REVENUE_MANAGER, UserRole.DISTRIBUTION_MANAGER, UserRole.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Check rate consistency across channels' })
  @ApiResponse({ status: 200, description: 'Consistency check completed' })
  async checkRateConsistency(
    @Param('propertyId') propertyId: string,
    @Query('roomTypeId') roomTypeId: string,
    @Query('ratePlanId') ratePlanId: string,
    @Query('date') date: string,
    @GetUser() user: User,
  ) {
    // This would check rate consistency
    // return this.ratesInventoryService.checkRateConsistency(propertyId, roomTypeId, ratePlanId, new Date(date), user.id);
    throw new Error('Not implemented yet');
  }
} 