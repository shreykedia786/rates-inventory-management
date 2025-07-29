import { apiClient } from './client';
import {
  RateInventoryResponse,
  RateInventoryQueryParams,
  CreateRateInventoryRequest,
  UpdateRateInventoryRequest,
  BulkUpdateRequest,
  CopyRatesInventoryRequest,
  RateInventoryStats,
} from '@/types/rates-inventory';

/**
 * Rates & Inventory API Client
 * 
 * Handles all API calls for rates and inventory management:
 * - CRUD operations
 * - Bulk operations
 * - Statistics and reporting
 * - Validation and consistency checks
 */
export const ratesInventoryApi = {
  /**
   * Get rates and inventory with filtering
   */
  async getRatesInventory(
    propertyId: string,
    params: RateInventoryQueryParams,
  ): Promise<RateInventoryResponse> {
    const searchParams = new URLSearchParams();
    
    searchParams.append('startDate', params.startDate.toISOString());
    searchParams.append('endDate', params.endDate.toISOString());
    
    if (params.roomTypeIds?.length) {
      params.roomTypeIds.forEach(id => searchParams.append('roomTypeIds', id));
    }
    
    if (params.ratePlanIds?.length) {
      params.ratePlanIds.forEach(id => searchParams.append('ratePlanIds', id));
    }
    
    if (params.channelIds?.length) {
      params.channelIds.forEach(id => searchParams.append('channelIds', id));
    }
    
    if (params.includeRestrictions !== undefined) {
      searchParams.append('includeRestrictions', params.includeRestrictions.toString());
    }

    const response = await apiClient.get(
      `/properties/${propertyId}/rates-inventory?${searchParams.toString()}`
    );
    
    return response.data;
  },

  /**
   * Create new rate and inventory record
   */
  async createRateInventory(
    propertyId: string,
    data: CreateRateInventoryRequest,
  ) {
    const response = await apiClient.post(
      `/properties/${propertyId}/rates-inventory`,
      {
        ...data,
        date: data.date.toISOString(),
      }
    );
    
    return response.data;
  },

  /**
   * Update existing rate and inventory record
   */
  async updateRateInventory(
    id: string,
    data: UpdateRateInventoryRequest,
  ) {
    const response = await apiClient.put(
      `/properties/*/rates-inventory/${id}`,
      data
    );
    
    return response.data;
  },

  /**
   * Delete rate and inventory record
   */
  async deleteRateInventory(id: string) {
    const response = await apiClient.delete(
      `/properties/*/rates-inventory/${id}`
    );
    
    return response.data;
  },

  /**
   * Bulk update rates and inventory
   */
  async bulkUpdateRatesInventory(
    propertyId: string,
    data: BulkUpdateRequest,
  ) {
    const response = await apiClient.post(
      `/properties/${propertyId}/rates-inventory/bulk-update`,
      {
        ...data,
        updates: data.updates.map(update => ({
          ...update,
          date: update.date.toISOString(),
        })),
      }
    );
    
    return response.data;
  },

  /**
   * Copy rates and inventory between date ranges
   */
  async copyRatesInventory(
    propertyId: string,
    data: CopyRatesInventoryRequest,
  ) {
    const response = await apiClient.post(
      `/properties/${propertyId}/rates-inventory/copy`,
      {
        ...data,
        sourceStartDate: data.sourceStartDate.toISOString(),
        sourceEndDate: data.sourceEndDate.toISOString(),
        targetStartDate: data.targetStartDate.toISOString(),
        targetEndDate: data.targetEndDate.toISOString(),
      }
    );
    
    return response.data;
  },

  /**
   * Get rate and inventory statistics
   */
  async getRateInventoryStats(propertyId: string): Promise<RateInventoryStats> {
    const response = await apiClient.get(
      `/properties/${propertyId}/rates-inventory/statistics`
    );
    
    return response.data;
  },

  /**
   * Validate rate and inventory data
   */
  async validateRateInventory(
    propertyId: string,
    data: CreateRateInventoryRequest,
  ) {
    const response = await apiClient.post(
      `/properties/${propertyId}/rates-inventory/validate`,
      {
        ...data,
        date: data.date.toISOString(),
      }
    );
    
    return response.data;
  },

  /**
   * Check rate consistency across channels
   */
  async checkRateConsistency(
    propertyId: string,
    roomTypeId: string,
    ratePlanId: string,
    date: Date,
  ) {
    const response = await apiClient.get(
      `/properties/${propertyId}/rates-inventory/consistency-check`,
      {
        params: {
          roomTypeId,
          ratePlanId,
          date: date.toISOString(),
        },
      }
    );
    
    return response.data;
  },
}; 