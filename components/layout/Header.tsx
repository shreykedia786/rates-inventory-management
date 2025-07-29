import React from 'react';
import { cn } from '@/lib/utils';
import { useGridStore } from '@/stores/gridStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { Menu, Save, Undo, Redo, Settings } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedCellsCount: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  selectedCellsCount,
  className,
}) => {
  const { hasUnsavedChanges, saveChanges } = useGridStore();
  const { openBulkOperations } = useUIStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        'bg-white border-b border-gray-200',
        'px-4 py-2',
        className
      )}
    >
      <div className="flex items-center justify-between h-12">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Rates & Inventory</h1>
        </div>

        {/* Center Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openBulkOperations()}
            disabled={selectedCellsCount === 0}
          >
            Bulk Edit ({selectedCellsCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveChanges()}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}; 