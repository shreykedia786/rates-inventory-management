import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { X, Filter, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40',
        'w-80 bg-white border-r border-gray-200',
        'transform transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters & Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Date Range Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Date Range</h3>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Room Types Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Room Types</h3>
            <div className="space-y-2">
              {['Standard', 'Deluxe', 'Suite', 'Executive'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rate Types Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Rate Types</h3>
            <div className="space-y-2">
              {['BAR', 'Corporate', 'Package', 'Promotional'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Display Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Show AI Recommendations</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Show Historical Data</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {/* Reset filters */}}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}; 