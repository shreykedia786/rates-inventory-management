import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ratesInventoryApi } from '@/lib/api/rates-inventory';
import {
  RateInventoryData,
  RateInventoryQueryParams,
  CreateRateInventoryRequest,
  UpdateRateInventoryRequest,
  BulkUpdateRequest,
  CopyRatesInventoryRequest,
  RateInventoryStats,
} from '@/types/rates-inventory';

/**
 * Rates & Inventory Hook
 * 
 * Provides comprehensive data management for rates and inventory:
 * - Fetching with filtering and pagination
 * - CRUD operations with optimistic updates
 * - Bulk operations (update, delete, copy)
 * - Real-time validation and error handling
 * - Cache management and synchronization
 */
export const useRatesInventory = (
  propertyId: string,
  queryParams: RateInventoryQueryParams,
) => {
  const queryClient = useQueryClient();

  // Query key factory
  const queryKey = ['rates-inventory', propertyId, queryParams];

  // Fetch rates and inventory data
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: () => ratesInventoryApi.getRatesInventory(propertyId, queryParams),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Create rate inventory mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateRateInventoryRequest) =>
      ratesInventoryApi.createRateInventory(propertyId, data),
    onSuccess: (newRecord) => {
      // Update cache with new record
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return { data: [newRecord], total: 1 };
        return {
          ...oldData,
          data: [...oldData.data, newRecord],
          total: oldData.total + 1,
        };
      });
      
      toast.success('Rate and inventory created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create rate and inventory';
      toast.error(message);
    },
  });

  // Update rate inventory mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRateInventoryRequest }) =>
      ratesInventoryApi.updateRateInventory(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update cache
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((item: RateInventoryData) =>
            item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
          ),
        };
      });

      return { previousData };
    },
    onSuccess: (updatedRecord) => {
      // Update cache with server response
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((item: RateInventoryData) =>
            item.id === updatedRecord.id ? updatedRecord : item
          ),
        };
      });
      
      toast.success('Rate and inventory updated successfully');
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      const message = error.response?.data?.message || 'Failed to update rate and inventory';
      toast.error(message);
    },
  });

  // Delete rate inventory mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ratesInventoryApi.deleteRateInventory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove from cache
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.filter((item: RateInventoryData) => item.id !== id),
          total: oldData.total - 1,
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Rate and inventory deleted successfully');
    },
    onError: (error: any, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      const message = error.response?.data?.message || 'Failed to delete rate and inventory';
      toast.error(message);
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: (data: BulkUpdateRequest) =>
      ratesInventoryApi.bulkUpdateRatesInventory(propertyId, data),
    onSuccess: (result) => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey });
      
      toast.success(`Bulk operation completed: ${result.successCount} updated, ${result.failedCount} failed`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Bulk operation failed';
      toast.error(message);
    },
  });

  // Copy rates inventory mutation
  const copyMutation = useMutation({
    mutationFn: (data: CopyRatesInventoryRequest) =>
      ratesInventoryApi.copyRatesInventory(propertyId, data),
    onSuccess: (result) => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey });
      
      toast.success(`Copied ${result.copiedCount} records successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to copy rates and inventory';
      toast.error(message);
    },
  });

  return {
    // Data
    data: data?.data || [],
    total: data?.total || 0,
    
    // Loading states
    isLoading,
    isRefetching,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,
    isCopying: copyMutation.isPending,
    
    // Error state
    error,
    
    // Actions
    refetch,
    
    createRateInventory: (data: CreateRateInventoryRequest) =>
      createMutation.mutateAsync(data),
    
    updateRateInventory: (id: string, data: UpdateRateInventoryRequest) =>
      updateMutation.mutateAsync({ id, data }),
    
    deleteRateInventory: (id: string) =>
      deleteMutation.mutateAsync(id),
    
    bulkUpdateRatesInventory: (data: BulkUpdateRequest) =>
      bulkUpdateMutation.mutateAsync(data),
    
    copyRatesInventory: (data: CopyRatesInventoryRequest) =>
      copyMutation.mutateAsync(data),
    
    // Utility functions
    invalidateCache: () => queryClient.invalidateQueries({ queryKey }),
    
    getCachedData: () => queryClient.getQueryData(queryKey),
    
    prefetchNextPage: (nextParams: RateInventoryQueryParams) => {
      const nextQueryKey = ['rates-inventory', propertyId, nextParams];
      queryClient.prefetchQuery({
        queryKey: nextQueryKey,
        queryFn: () => ratesInventoryApi.getRatesInventory(propertyId, nextParams),
        staleTime: 30 * 1000,
      });
    },
  };
};

/**
 * Hook for fetching rate inventory statistics
 */
export const useRateInventoryStats = (propertyId: string) => {
  return useQuery({
    queryKey: ['rates-inventory-stats', propertyId],
    queryFn: () => ratesInventoryApi.getRateInventoryStats(propertyId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for validating rate inventory data
 */
export const useRateInventoryValidation = () => {
  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string; data: CreateRateInventoryRequest }) =>
      ratesInventoryApi.validateRateInventory(propertyId, data),
    onError: (error: any) => {
      // Don't show toast for validation errors - they're handled in the UI
      console.warn('Validation error:', error);
    },
  });
};

/**
 * Hook for checking rate consistency
 */
export const useRateConsistencyCheck = () => {
  return useMutation({
    mutationFn: ({
      propertyId,
      roomTypeId,
      ratePlanId,
      date,
    }: {
      propertyId: string;
      roomTypeId: string;
      ratePlanId: string;
      date: Date;
    }) =>
      ratesInventoryApi.checkRateConsistency(propertyId, roomTypeId, ratePlanId, date),
  });
}; 