/**
 * Rate Inventory Data Types
 * 
 * TypeScript interfaces for rates and inventory management
 */

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  totalRooms: number;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatePlan {
  id: string;
  name: string;
  description?: string;
  minRate?: number;
  maxRate?: number;
  propertyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'BOOKING_COM' | 'EXPEDIA' | 'AGODA' | 'HOTELS_COM' | 'DIRECT' | 'OTHER';
  isActive: boolean;
  syncStatus?: 'SUCCESS' | 'PENDING' | 'FAILED';
  lastSyncAt?: string;
  configuration?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RateInventoryData {
  id: string;
  date: string;
  roomTypeId: string;
  ratePlanId: string;
  channelId: string;
  propertyId: string;
  rate: number;
  inventory: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  stopSell: boolean;
  
  // Related entities
  roomType: RoomType;
  ratePlan: RatePlan;
  channel: Channel;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface RateInventoryQueryParams {
  startDate: Date;
  endDate: Date;
  roomTypeIds?: string[];
  ratePlanIds?: string[];
  channelIds?: string[];
  includeRestrictions?: boolean;
}

export interface CreateRateInventoryRequest {
  date: Date;
  roomTypeId: string;
  ratePlanId: string;
  channelId: string;
  rate: number;
  inventory: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  stopSell?: boolean;
}

export interface UpdateRateInventoryRequest {
  rate?: number;
  inventory?: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  stopSell?: boolean;
}

export interface BulkUpdateItem {
  id?: string;
  date: Date;
  roomTypeId: string;
  ratePlanId: string;
  channelId: string;
  rate?: number;
  inventory?: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  stopSell?: boolean;
}

export type BulkOperationType = 'UPDATE' | 'DELETE' | 'COPY';

export interface BulkUpdateOperation {
  type: BulkOperationType;
  data: Partial<UpdateRateInventoryRequest>;
}

export interface BulkUpdateRequest {
  operation: BulkOperationType;
  updates: BulkUpdateItem[];
}

export interface CopyRatesInventoryRequest {
  sourceStartDate: Date;
  sourceEndDate: Date;
  targetStartDate: Date;
  targetEndDate: Date;
  roomTypeIds?: string[];
  ratePlanIds?: string[];
  channelIds?: string[];
  copyRates?: boolean;
  copyInventory?: boolean;
  copyRestrictions?: boolean;
}

export interface RateInventoryStats {
  total: number;
  averageRate: number;
  averageInventory: number;
  rateRange: {
    min: number;
    max: number;
  };
  inventoryRange: {
    min: number;
    max: number;
  };
  restrictions: Array<{
    stopSell: boolean;
    closedToArrival: boolean;
    closedToDeparture: boolean;
    _count: { id: number };
  }>;
}

export interface RateInventoryResponse {
  data: RateInventoryData[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

// Grid-specific types
export interface GridColumnDef {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  type?: 'text' | 'number' | 'boolean' | 'date';
  cellRenderer?: string;
  cellEditor?: string;
  pinned?: 'left' | 'right';
}

export interface GridOptions {
  enableRangeSelection?: boolean;
  enableFillHandle?: boolean;
  rowSelection?: 'single' | 'multiple';
  suppressRowClickSelection?: boolean;
  animateRows?: boolean;
  rowHeight?: number;
  headerHeight?: number;
}

// Filter and sort types
export interface FilterModel {
  [key: string]: {
    filterType: string;
    type: string;
    filter?: any;
    filterTo?: any;
  };
}

export interface SortModel {
  colId: string;
  sort: 'asc' | 'desc';
}

// Export types
export interface ExportOptions {
  fileName?: string;
  columnSeparator?: string;
  includeHeaders?: boolean;
  selectedOnly?: boolean;
}

// Sync status types
export interface SyncStatus {
  channelId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  lastSyncAt?: string;
  errorMessage?: string;
  retryCount?: number;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{
    recordId: string;
    error: string;
  }>;
} 