/**
 * Calendar Grid Component - Core Interface
 * Implementation of the main spreadsheet-like calendar grid
 * Based on: 01-Phase2-Core-Interface.md specifications
 */

import React, { useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GridCell } from './GridCell';
import { cn } from '@/lib/utils';
import { formatDate, generateDateRange } from '@/lib/utils';
import type { GridData, GridCell as GridCellType } from '@/types';

interface CalendarGridProps {
  gridData: GridData;
  selectedCells: string[];
  editingCell?: string;
  onCellSelect: (cellId: string) => void;
  onCellEdit: (cellId: string, value: string) => void;
  className?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  gridData,
  selectedCells,
  editingCell,
  onCellSelect,
  onCellEdit,
  className,
}) => {
  // Create date headers
  const dateHeaders = useMemo(() => {
    return gridData.dates.map(date => (
      <div
        key={date.toISOString()}
        className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 text-center font-medium"
      >
        {formatDate(date, 'short')}
      </div>
    ));
  }, [gridData.dates]);

  // Create room type headers
  const roomTypeHeaders = useMemo(() => {
    return gridData.roomTypes.map(roomType => (
      <div
        key={roomType.id}
        className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 font-medium"
      >
        {roomType.name}
      </div>
    ));
  }, [gridData.roomTypes]);

  // Setup virtual scrolling for rows
  const rowVirtualizer = useVirtualizer({
    count: gridData.roomTypes.length,
    getScrollElement: () => document.getElementById('calendar-grid'),
    estimateSize: () => 36, // Estimated row height
    overscan: 5,
  });

  // Setup virtual scrolling for columns
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: gridData.dates.length,
    getScrollElement: () => document.getElementById('calendar-grid'),
    estimateSize: () => 80, // Estimated column width
    overscan: 3,
  });

  // Handle cell selection
  const handleCellSelect = useCallback((cellId: string) => {
    onCellSelect(cellId);
  }, [onCellSelect]);

  // Handle cell edit
  const handleCellEdit = useCallback((cellId: string, value: string) => {
    onCellEdit(cellId, value);
  }, [onCellEdit]);

  return (
    <div
      id="calendar-grid"
      className={cn(
        'relative w-full h-full overflow-auto',
        className
      )}
    >
      {/* Date Headers */}
      <div className="sticky top-0 z-20 flex bg-white border-b border-gray-200">
        <div className="w-[120px] flex-shrink-0" /> {/* Room type header spacer */}
        <div className="flex">
          {dateHeaders}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex">
        {/* Room Type Headers */}
        <div className="sticky left-0 z-20 flex flex-col bg-white border-r border-gray-200">
          {roomTypeHeaders}
        </div>

        {/* Grid Cells */}
        <div
          className="relative"
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const roomType = gridData.roomTypes[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex">
                  {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                    const date = gridData.dates[virtualColumn.index];
                    const cell = gridData.cells[virtualRow.index][virtualColumn.index];
                    const isSelected = selectedCells.includes(cell.id);
                    const isEditing = editingCell === cell.id;

                    return (
                      <div
                        key={virtualColumn.index}
                        className="absolute"
                        style={{
                          transform: `translateX(${virtualColumn.start}px)`,
                        }}
                      >
                        <GridCell
                          cell={cell}
                          isSelected={isSelected}
                          isEditing={isEditing}
                          onSelect={() => handleCellSelect(cell.id)}
                          onEdit={(value) => handleCellEdit(cell.id, value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 