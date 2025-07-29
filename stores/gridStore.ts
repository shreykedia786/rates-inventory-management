/**
 * Grid Store - Manages grid data, selection, and editing state
 * 
 * This store handles the main grid data for the rates and inventory grid,
 * including cell selection, editing operations, and bulk updates.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GridData, GridCell, RoomType } from '@/types';

// Utility function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface GridState {
  gridData: GridData | null;
  selectedCells: string[];
  editingCell: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadGridData: (params: { propertyId: string; startDate: Date; endDate: Date }) => Promise<void>;
  selectCell: (cellId: string) => void;
  editCell: (cellId: string, value: string) => void;
  bulkUpdateCells: (cellIds: string[], changes: Record<string, any>) => void;
  clearSelection: () => void;
  saveChanges: () => Promise<void>;
}

export const useGridStore = create<GridState>()(
  devtools(
    (set, get) => ({
      gridData: null,
      selectedCells: [],
      editingCell: null,
      hasUnsavedChanges: false,
      isLoading: false,
      error: null,

      loadGridData: async ({ propertyId, startDate, endDate }) => {
        set({ isLoading: true, error: null });
        try {
          // In a real implementation, this would be an API call
          const mockGridData: GridData = {
            dates: Array.from({ length: 15 }, (_, i) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i);
              return date;
            }),
            dateRange: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
            roomTypes: [
              { id: '1', name: 'Standard Room', code: 'STD', capacity: 2, baseRate: 450, inventory: 10, amenities: [], isActive: true },
              { id: '2', name: 'Deluxe Room', code: 'DLX', capacity: 2, baseRate: 550, inventory: 8, amenities: [], isActive: true },
              { id: '3', name: 'Suite', code: 'SUITE', capacity: 4, baseRate: 750, inventory: 5, amenities: [], isActive: true },
            ],
            cells: [],
            metadata: {
              totalCells: 0,
              loadedCells: 0,
              hasUnsavedChanges: false,
              lastSyncTime: new Date(),
              syncStatus: 'synced',
            },
          };

          // Generate cells with proper type safety
          mockGridData.cells = mockGridData.roomTypes.map((roomType, rowIndex) =>
            mockGridData.dates.map((date, colIndex) => ({
              id: generateId(),
              rowId: String(rowIndex),
              columnId: String(colIndex),
              date,
              roomTypeId: roomType.id,
              cellType: 'rate' as const,
              value: roomType.baseRate ?? 0, // Provide default value of 0 if baseRate is undefined
              originalValue: roomType.baseRate ?? 0, // Provide default value of 0 if originalValue is undefined
              isEditable: true,
              isSelected: false,
              isEditing: false,
              hasChanges: false,
            }))
          );

          // Update metadata safely - we know metadata exists because we initialized it
          mockGridData.metadata!.totalCells = mockGridData.cells.flat().length;
          mockGridData.metadata!.loadedCells = mockGridData.cells.flat().length;

          set({ gridData: mockGridData, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load grid data', isLoading: false });
        }
      },

      selectCell: (cellId) => {
        set((state) => ({
          selectedCells: [cellId],
          editingCell: null,
        }));
      },

      editCell: (cellId, value) => {
        set((state) => {
          if (!state.gridData) return state;

          const newCells = state.gridData.cells.map(row =>
            row.map(cell => {
              if (cell.id === cellId) {
                return {
                  ...cell,
                  value: Number(value),
                  hasChanges: true,
                  isEditing: false,
                };
              }
              return cell;
            })
          );

          return {
            gridData: {
              ...state.gridData,
              cells: newCells,
              metadata: {
                totalCells: state.gridData.metadata?.totalCells ?? 0,
                loadedCells: state.gridData.metadata?.loadedCells ?? 0,
                hasUnsavedChanges: true,
                lastSyncTime: state.gridData.metadata?.lastSyncTime ?? new Date(),
                syncStatus: state.gridData.metadata?.syncStatus ?? 'synced',
              },
            },
            selectedCells: state.selectedCells,
            editingCell: null,
            hasUnsavedChanges: true,
            isLoading: state.isLoading,
            error: state.error,
          };
        });
      },

      bulkUpdateCells: (cellIds, changes) => {
        set((state) => {
          if (!state.gridData) return state;

          const newCells = state.gridData.cells.map(row =>
            row.map(cell => {
              if (cellIds.includes(cell.id)) {
                return {
                  ...cell,
                  ...changes,
                  hasChanges: true,
                };
              }
              return cell;
            })
          );

          return {
            gridData: {
              ...state.gridData,
              cells: newCells,
              metadata: {
                totalCells: state.gridData.metadata?.totalCells ?? 0,
                loadedCells: state.gridData.metadata?.loadedCells ?? 0,
                hasUnsavedChanges: true,
                lastSyncTime: state.gridData.metadata?.lastSyncTime ?? new Date(),
                syncStatus: state.gridData.metadata?.syncStatus ?? 'synced',
              },
            },
            selectedCells: [],
            editingCell: state.editingCell,
            hasUnsavedChanges: true,
            isLoading: state.isLoading,
            error: state.error,
          };
        });
      },

      clearSelection: () => {
        set({ selectedCells: [], editingCell: null });
      },

      saveChanges: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real implementation, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          set((state) => {
            if (!state.gridData) return state;

            const newCells = state.gridData.cells.map(row =>
              row.map(cell => ({
                ...cell,
                originalValue: cell.value,
                hasChanges: false,
              }))
            );

            return {
              gridData: {
                ...state.gridData,
                cells: newCells,
                metadata: {
                  totalCells: state.gridData.metadata?.totalCells ?? 0,
                  loadedCells: state.gridData.metadata?.loadedCells ?? 0,
                  hasUnsavedChanges: false,
                  lastSyncTime: new Date(),
                  syncStatus: 'synced' as const,
                },
              },
              selectedCells: state.selectedCells,
              editingCell: state.editingCell,
              hasUnsavedChanges: false,
              isLoading: false,
              error: state.error,
            };
          });
        } catch (error) {
          set({ error: 'Failed to save changes', isLoading: false });
        }
      },
    }),
    {
      name: 'grid-store',
    }
  )
); 