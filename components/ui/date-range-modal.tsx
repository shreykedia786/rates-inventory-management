/**
 * Date Range Modal Component for Rates & Inventory Grid
 * Features: Single calendar view for start date selection, enterprise styling
 * UX: Clean modal with calendar, clear call-to-action, and keyboard navigation
 */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Calendar, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { 
  addDays, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns';

/**
 * Props interface for DateRangeModal component
 */
interface DateRangeModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Current start date */
  currentStartDate: Date;
  /** Function called when start date is selected */
  onDateSelect: (startDate: Date) => void;
  /** Dark mode flag */
  isDark?: boolean;
  /** Click position for positioning the modal */
  clickPosition?: { x: number; y: number };
}

/**
 * DateRangeModal Component
 * Provides a clean calendar interface for selecting start date for the rates & inventory grid
 */
export function DateRangeModal({ 
  isOpen, 
  onClose, 
  currentStartDate,
  onDateSelect,
  isDark = false,
  clickPosition 
}: DateRangeModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(currentStartDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(currentStartDate);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ top?: number; left?: number; right?: number; bottom?: number }>({});
  
  // Refs for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Calculate optimal modal position based on click position and viewport constraints
   */
  const calculateModalPosition = useCallback(() => {
    if (!clickPosition) {
      // Default to center if no click position provided
      return {};
    }

    const modalWidth = 400; // Approximate modal width
    const modalHeight = 600; // Approximate modal height
    const padding = 20; // Minimum padding from viewport edges
    const verticalOffset = 12; // Distance below the clicked area

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let position: { top?: number; left?: number; right?: number; bottom?: number } = {};

    // Position directly below the clicked area
    const targetTop = clickPosition.y + verticalOffset;
    
    // Check if modal fits below the click point
    if (targetTop + modalHeight <= viewportHeight - padding) {
      position.top = targetTop;
    } else {
      // If no space below, position above the clicked area
      const targetTopAbove = clickPosition.y - verticalOffset - modalHeight;
      if (targetTopAbove >= padding) {
        position.top = targetTopAbove;
      } else {
        // If neither above nor below works, center vertically
        position.top = Math.max(padding, (viewportHeight - modalHeight) / 2);
      }
    }

    // Center horizontally relative to click point
    const targetLeft = clickPosition.x - (modalWidth / 2);
    
    // Ensure modal stays within viewport horizontally
    if (targetLeft >= padding && targetLeft + modalWidth <= viewportWidth - padding) {
      position.left = targetLeft;
    } else if (targetLeft < padding) {
      // Too far left, align to left edge with padding
      position.left = padding;
    } else {
      // Too far right, align to right edge with padding
      position.left = viewportWidth - modalWidth - padding;
    }

    return position;
  }, [clickPosition]);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setSelectedDate(currentStartDate);
      setCurrentMonth(currentStartDate);
      setModalPosition(calculateModalPosition());
      
      // Focus management for accessibility
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 150);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, currentStartDate, calculateModalPosition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  /**
   * Generate calendar days for the current month
   */
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  /**
   * Handle date selection
   */
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  /**
   * Handle month navigation
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  /**
   * Handle applying the selected date
   */
  const handleApply = () => {
    onDateSelect(selectedDate);
    onClose();
  };

  /**
   * Quick date selection shortcuts
   */
  const quickSelections = [
    { label: 'Today', date: new Date() },
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'Next Week', date: addDays(new Date(), 7) },
    { label: 'Next Month', date: addMonths(new Date(), 1) }
  ];

  if (!isOpen) return null;

  const calendarDays = generateCalendarDays();

  return (
    <>
      {/* Spotlight Overlay with cutout around clicked area */}
      <div 
        className="fixed inset-0 z-[60] pointer-events-none transition-all duration-300"
        style={{
          background: clickPosition 
            ? `radial-gradient(circle 80px at ${clickPosition.x}px ${clickPosition.y}px, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.5) 70%)`
            : 'rgba(0, 0, 0, 0.5)'
        }}
      />
      
      {/* Main blur overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-all duration-300 ${
          isAnimating ? 'animate-in fade-in' : ''
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        style={{
          position: 'fixed',
          top: modalPosition.top,
          left: modalPosition.left,
          right: modalPosition.right,
          bottom: modalPosition.bottom,
          maxWidth: '400px',
          maxHeight: '90vh',
          zIndex: 70, // Higher than spotlight overlay
          ...(Object.keys(modalPosition).length === 0 && {
            // Fallback to center if no position calculated
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          })
        }}
        className={`w-full rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
          isDark ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
        } ${isAnimating ? 'animate-in slide-in-from-bottom-4 zoom-in-95' : ''}`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Scrollable container for smaller screens */}
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  id="modal-title"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Select Start Date
                </h3>
                <p 
                  id="modal-description"
                  className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Choose the starting date for your rates & inventory grid
                </p>
              </div>
              <button
                ref={firstButtonRef}
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors hover:bg-opacity-80 ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Quick Selections */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Quick Select
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickSelections.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => handleDateClick(quick.date)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      isSameDay(selectedDate, quick.date)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <h4 className="font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h4>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div
                    key={day}
                    className={`p-2 text-xs font-medium text-center ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isSelected = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      disabled={!isCurrentMonth}
                      className={`p-2 text-sm rounded-lg transition-all relative ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isTodayDate
                            ? isDark
                              ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isCurrentMonth
                              ? isDark
                                ? 'hover:bg-gray-800 text-gray-200'
                                : 'hover:bg-gray-100 text-gray-900'
                              : isDark
                                ? 'text-gray-600'
                                : 'text-gray-400'
                      }`}
                    >
                      {format(date, 'd')}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Selected: {format(selectedDate, 'MMM d, yyyy')}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 