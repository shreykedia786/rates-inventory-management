import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { GridCell as GridCellType } from '@/types';

interface GridCellProps {
  cell: GridCellType;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: (value: string) => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  cell,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
}) => {
  const [editValue, setEditValue] = useState(String(cell.value));
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  // Handle input blur
  const handleBlur = useCallback(() => {
    onEdit(editValue);
  }, [editValue, onEdit]);

  // Handle key down events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onEdit(editValue);
        break;
      case 'Escape':
        e.preventDefault();
        setEditValue(String(cell.value));
        onEdit(String(cell.value));
        break;
    }
  }, [editValue, cell.value, onEdit]);

  // Handle cell click
  const handleClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  // Format cell value based on cell type
  const formatCellValue = useCallback((value: number | string, type: string) => {
    if (type === 'rate') {
      return formatCurrency(Number(value));
    }
    return String(value);
  }, []);

  return (
    <div
      className={cn(
        'relative min-h-[36px] p-2 border border-gray-200',
        'hover:border-primary-300 hover:shadow-sm',
        'focus-within:border-primary-500 focus-within:shadow-md',
        'transition-all duration-150',
        {
          'bg-primary-50 border-primary-500': isSelected,
          'bg-white': !isSelected,
        }
      )}
      onClick={handleClick}
      role="gridcell"
      aria-label={`${cell.cellType} ${cell.value}`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full h-full px-1 py-0.5',
            'border border-primary-500 rounded',
            'focus:outline-none focus:ring-2 focus:ring-primary-200',
            'text-sm'
          )}
        />
      ) : (
        <div className="flex flex-col">
          <span className="font-medium">
            {formatCellValue(cell.value, cell.cellType)}
          </span>
          {cell.hasChanges && (
            <span className="text-xs text-primary-600">
              Modified
            </span>
          )}
          {cell.aiRecommendation && (
            <div className="mt-1 text-xs text-success-600">
              AI: {formatCellValue(cell.aiRecommendation.suggestedValue, cell.cellType)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 