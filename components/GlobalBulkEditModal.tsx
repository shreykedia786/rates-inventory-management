/**
 * Global Bulk Edit Modal Component - Enhanced with Smart Date Selection
 * Features: Intuitive date selection (double-click for single, click for ranges), 2-month calendar view
 * Smart UX: No CTAs needed - users interact directly with calendar
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, Calendar, ChevronLeft, ChevronRight, Settings, 
  DollarSign, Package, Building, Tag, Clock,
  Target, Save, AlertCircle, CheckCircle, Info, Sparkles,
  Zap, TrendingUp, BarChart3
} from 'lucide-react';
import { addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

// Enhanced Types for Smart Date Selection
interface RoomType {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  icon: string;
}

interface RatePlan {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  color: string;
}

interface DateRange {
  id: string;
  start: Date;
  end: Date;
  type: 'single' | 'range';
}

interface EnhancedDateSelection {
  ranges: DateRange[];
  selectedDates: Date[];
}

interface DaySelection {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface BulkEditData {
  roomTypes: string[];
  ratePlans: string[];
  dateSelection: EnhancedDateSelection;
  daySelection: DaySelection;
  editType: 'rates' | 'inventory';
  rateValue?: number;
  rateType?: 'absolute' | 'percentage' | 'increment';
  inventoryValue?: number;
  inventoryType?: 'absolute' | 'increment';
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: BulkEditData) => void;
  isDark?: boolean;
}

// Enhanced Mock data with better variety
const roomTypes: RoomType[] = [
  { id: 'std-ocean', name: 'Standard Ocean View', code: 'STD-OV', category: 'Standard', description: '25 sqm with ocean view', icon: '🌊' },
  { id: 'prem-ocean', name: 'Premium Ocean View', code: 'PREM-OV', category: 'Premium', description: '35 sqm with premium ocean view', icon: '🏖️' },
  { id: 'suite-ocean', name: 'Suite Ocean Front', code: 'SUITE-OF', category: 'Suite', description: '55 sqm oceanfront suite', icon: '🏝️' },
  { id: 'villa-beach', name: 'Beach Villa', code: 'VILLA-BH', category: 'Villa', description: '85 sqm private beach villa', icon: '🏡' },
  { id: 'pent-sky', name: 'Penthouse Sky', code: 'PENT-SKY', category: 'Penthouse', description: '120 sqm penthouse with sky view', icon: '🏢' }
];

const ratePlans: RatePlan[] = [
  { id: 'bbb', name: 'Best Flexible Rate', code: 'BBB', category: 'Public', description: 'Best available rate with flexible cancellation', color: 'blue' },
  { id: 'corp', name: 'Corporate Rate', code: 'CORP', category: 'Corporate', description: 'Special rates for corporate bookings', color: 'purple' },
  { id: 'early-bird', name: 'Early Bird Special', code: 'EARLY', category: 'Promotion', description: '15% discount for advance bookings', color: 'green' },
  { id: 'last-min', name: 'Last Minute Deal', code: 'LASTMIN', category: 'Promotion', description: 'Special rates for last-minute bookings', color: 'orange' },
  { id: 'group', name: 'Group Rate', code: 'GROUP', category: 'Group', description: 'Special rates for group bookings (10+ rooms)', color: 'teal' }
];

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayShorts = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function GlobalBulkEditModal({ isOpen, onClose, onApply, isDark = false }: Props) {
  const [bulkEditData, setBulkEditData] = useState<BulkEditData>({
    roomTypes: [],
    ratePlans: [],
    dateSelection: { ranges: [], selectedDates: [] },
    daySelection: {
      monday: false, tuesday: false, wednesday: false, thursday: false,
      friday: false, saturday: false, sunday: false
    },
    editType: 'rates'
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [roomTypeDropdown, setRoomTypeDropdown] = useState(false);
  const [ratePlanDropdown, setRatePlanDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  // Enhanced date selection state
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [pendingRangeStart, setPendingRangeStart] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Refs for enhanced accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLButtonElement>(null);

  // Enhanced modal entrance animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setBulkEditData({
        roomTypes: [],
        ratePlans: [],
        dateSelection: { ranges: [], selectedDates: [] },
        daySelection: {
          monday: false, tuesday: false, wednesday: false, thursday: false,
          friday: false, saturday: false, sunday: false
        },
        editType: 'rates'
      });
      
      // Reset date selection state
      setPendingRangeStart(null);
      setHoveredDate(null);
      
      // Focus management for accessibility
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
    } else {
      setIsAnimating(false);
      setShowSuccessAnimation(false);
    }
  }, [isOpen]);

  // Enhanced keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Tab trapping for accessibility
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Enhanced calendar generation for 2-month view
  const generateTwoMonthCalendar = () => {
    const currentMonth = {
      date: currentDate,
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    };
    
    const nextMonth = {
      date: addMonths(currentDate, 1),
      start: startOfMonth(addMonths(currentDate, 1)),
      end: endOfMonth(addMonths(currentDate, 1))
    };

    const generateCalendarDays = (monthInfo: typeof currentMonth) => {
      const days = eachDayOfInterval({ start: monthInfo.start, end: monthInfo.end });
      const startDay = monthInfo.start.getDay();
      const emptyDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null);
      return [...emptyDays, ...days];
    };

    return {
      currentMonth: {
        ...currentMonth,
        days: generateCalendarDays(currentMonth)
      },
      nextMonth: {
        ...nextMonth,
        days: generateCalendarDays(nextMonth)
      }
    };
  };

  // Smart date selection logic
  const handleDateClick = (date: Date) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    
    // Double-click detection (within 300ms)
    if (timeDiff < 300 && lastClickTime > 0) {
      // Double-click: Single date selection/deselection OR range removal
      handleDateDeselection(date);
    } else {
      // Single click: Range selection logic
      handleRangeSelection(date);
    }
    
    setLastClickTime(now);
  };

  const handleDateDeselection = (date: Date) => {
    // Check if this date is part of any range (single or multi-day)
    const affectedRanges = bulkEditData.dateSelection.ranges.filter(range => {
      if (range.type === 'single') {
        return isSameDay(range.start, date);
      } else {
        // Check if date is within the range
        return date >= range.start && date <= range.end;
      }
    });

    if (affectedRanges.length > 0) {
      // Remove all affected ranges and their dates
      const rangesToRemove = affectedRanges.map(range => range.id);
      
      setBulkEditData(prev => {
        const newRanges = prev.dateSelection.ranges.filter(range => !rangesToRemove.includes(range.id));
        
        // Recalculate selectedDates from remaining ranges
        const newSelectedDates: Date[] = [];
        newRanges.forEach(range => {
          if (range.type === 'single') {
            newSelectedDates.push(range.start);
          } else {
            const rangeDates = eachDayOfInterval({ start: range.start, end: range.end });
            newSelectedDates.push(...rangeDates);
          }
        });

        return {
          ...prev,
          dateSelection: {
            ranges: newRanges,
            selectedDates: newSelectedDates
          }
        };
      });
    } else {
      // If no existing selection, add as single date
      handleSingleDateSelection(date);
    }

    // Clear any pending range
    setPendingRangeStart(null);
  };

  const handleSingleDateSelection = (date: Date) => {
    const newRange: DateRange = {
      id: `single-${Date.now()}`,
      start: date,
      end: date,
      type: 'single'
    };

    // Add new single date
    setBulkEditData(prev => ({
      ...prev,
      dateSelection: {
        ranges: [...prev.dateSelection.ranges, newRange],
        selectedDates: [...prev.dateSelection.selectedDates, date]
      }
    }));

    // Clear any pending range
    setPendingRangeStart(null);
  };

  const handleRangeSelection = (date: Date) => {
    // Check if clicked date is already selected (part of any range)
    const isDateSelected = bulkEditData.dateSelection.selectedDates.some(d => isSameDay(d, date));
    
    if (isDateSelected && !pendingRangeStart) {
      // If date is already selected and no pending range, do nothing on single click
      return;
    }

    if (!pendingRangeStart) {
      // Start new range
      setPendingRangeStart(date);
    } else {
      // Complete range
      const start = pendingRangeStart;
      const end = date;
      const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start];
      
      const newRange: DateRange = {
        id: `range-${Date.now()}`,
        start: rangeStart,
        end: rangeEnd,
        type: 'range'
      };

      const rangeDates = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

      setBulkEditData(prev => ({
        ...prev,
        dateSelection: {
          ranges: [...prev.dateSelection.ranges, newRange],
          selectedDates: [...prev.dateSelection.selectedDates, ...rangeDates]
        }
      }));

      setPendingRangeStart(null);
    }
  };

  // Remove individual range
  const removeRange = (rangeId: string) => {
    setBulkEditData(prev => {
      const newRanges = prev.dateSelection.ranges.filter(range => range.id !== rangeId);
      
      // Recalculate selectedDates from remaining ranges
      const newSelectedDates: Date[] = [];
      newRanges.forEach(range => {
        if (range.type === 'single') {
          newSelectedDates.push(range.start);
        } else {
          const rangeDates = eachDayOfInterval({ start: range.start, end: range.end });
          newSelectedDates.push(...rangeDates);
        }
      });

      return {
        ...prev,
        dateSelection: {
          ranges: newRanges,
          selectedDates: newSelectedDates
        }
      };
    });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return bulkEditData.dateSelection.selectedDates.some(d => isSameDay(d, date));
  };

  // Check if a date is in a pending range
  const isDateInPendingRange = (date: Date) => {
    if (!pendingRangeStart || !hoveredDate) return false;
    const start = pendingRangeStart <= hoveredDate ? pendingRangeStart : hoveredDate;
    const end = pendingRangeStart <= hoveredDate ? hoveredDate : pendingRangeStart;
    return date >= start && date <= end;
  };

  // Clear all date selections
  const clearAllDates = () => {
    setBulkEditData(prev => ({
      ...prev,
      dateSelection: { ranges: [], selectedDates: [] }
    }));
    setPendingRangeStart(null);
  };

  // Enhanced room type selection with animation
  const handleRoomTypeToggle = (roomTypeId: string) => {
    setBulkEditData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomTypeId)
        ? prev.roomTypes.filter(id => id !== roomTypeId)
        : [...prev.roomTypes, roomTypeId]
    }));
  };

  // Enhanced rate plan selection
  const handleRatePlanToggle = (ratePlanId: string) => {
    setBulkEditData(prev => ({
      ...prev,
      ratePlans: prev.ratePlans.includes(ratePlanId)
        ? prev.ratePlans.filter(id => id !== ratePlanId)
        : [...prev.ratePlans, ratePlanId]
    }));
  };

  // Enhanced day selection
  const handleDayToggle = (day: keyof DaySelection) => {
    setBulkEditData(prev => ({
      ...prev,
      daySelection: {
        ...prev.daySelection,
        [day]: !prev.daySelection[day]
      }
    }));
  };

  // Enhanced validation with detailed feedback
  const getValidationStatus = () => {
    const issues = [];
    
    if (bulkEditData.roomTypes.length === 0) {
      issues.push('Select at least one room type');
    }
    
    if (bulkEditData.ratePlans.length === 0) {
      issues.push('Select at least one rate plan');
    }
    
    if (bulkEditData.dateSelection.selectedDates.length === 0 && !Object.values(bulkEditData.daySelection).some(Boolean)) {
      issues.push('Select dates or days of week');
    }
    
    if (bulkEditData.editType === 'rates' && bulkEditData.rateValue === undefined) {
      issues.push('Enter rate value');
    }
    
    if (bulkEditData.editType === 'inventory' && bulkEditData.inventoryValue === undefined) {
      issues.push('Enter inventory value');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  // Enhanced apply handler with success animation
  const handleApply = () => {
    const { isValid } = getValidationStatus();
    
    if (isValid) {
      setShowSuccessAnimation(true);
      
      setTimeout(() => {
        onApply(bulkEditData);
        onClose();
      }, 800);
    }
  };

  // Enhanced impact calculation for better UX
  const calculateImpact = () => {
    const combinations = bulkEditData.roomTypes.length * bulkEditData.ratePlans.length * 
                        (bulkEditData.dateSelection.selectedDates.length || Object.values(bulkEditData.daySelection).filter(Boolean).length);
    return combinations;
  };

  if (!isOpen) return null;

  const { isValid, issues } = getValidationStatus();
  const impactCount = calculateImpact();
  const calendar = generateTwoMonthCalendar();

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
      isAnimating ? 'animate-in fade-in zoom-in-95' : ''
    }`}>
      <div 
        ref={modalRef}
        className={`w-full max-w-[90vw] max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-500 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        } ${isAnimating ? 'animate-in slide-in-from-bottom-4' : ''}`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Enhanced Header with gradient background */}
        <div className={`sticky top-0 p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ${
                showSuccessAnimation ? 'animate-pulse' : ''
              }`}>
                {showSuccessAnimation ? (
                  <CheckCircle className="w-6 h-6 text-white animate-bounce" />
                ) : (
                  <Settings className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 id="modal-title" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Bulk Edit
                </h2>
                <p id="modal-description" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Double-click for single dates • Click and select for ranges • Multiple ranges supported
                </p>
                {impactCount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {impactCount} combinations will be affected
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Enhanced Edit Type Selection with icons */}
          <div>
            <label className="text-base font-semibold mb-4 block flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Edit Type
            </label>
            <div className="flex gap-3">
              <button
                ref={firstInputRef}
                onClick={() => setBulkEditData(prev => ({ ...prev, editType: 'rates' }))}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 transform hover:scale-105 ${
                  bulkEditData.editType === 'rates'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Rates</span>
                {bulkEditData.editType === 'rates' && <TrendingUp className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setBulkEditData(prev => ({ ...prev, editType: 'inventory' }))}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 transform hover:scale-105 ${
                  bulkEditData.editType === 'inventory'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Inventory</span>
                {bulkEditData.editType === 'inventory' && <BarChart3 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Enhanced Grid Layout - 3 columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Selection Controls */}
            <div className="space-y-6">
              {/* Room Type Selection - Enhanced */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                <label className="text-base font-semibold mb-4 block flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Room Types 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    bulkEditData.roomTypes.length > 0 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {bulkEditData.roomTypes.length} selected
                  </span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setRoomTypeDropdown(!roomTypeDropdown)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${
                      roomTypeDropdown
                        ? 'border-blue-500 ring-4 ring-blue-500/20'
                        : isDark 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {bulkEditData.roomTypes.length === 0 
                        ? 'Select room types...' 
                        : `${bulkEditData.roomTypes.length} room type(s) selected`}
                    </span>
                    <Settings className={`w-5 h-5 transition-transform duration-200 ${roomTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {roomTypeDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-blue-200 shadow-xl z-20 max-h-80 overflow-y-auto ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                    } animate-in slide-in-from-top-2`}>
                      {roomTypes.map((roomType) => (
                        <button
                          key={roomType.id}
                          onClick={() => handleRoomTypeToggle(roomType.id)}
                          className={`w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 flex items-center gap-4 ${
                            bulkEditData.roomTypes.includes(roomType.id) ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <span className="text-2xl">{roomType.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{roomType.name}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {roomType.code} • {roomType.category}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                              {roomType.description}
                            </div>
                          </div>
                          {bulkEditData.roomTypes.includes(roomType.id) && (
                            <CheckCircle className="w-5 h-5 text-blue-500 animate-in zoom-in-75" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rate Plan Selection - Enhanced */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                <label className="text-base font-semibold mb-4 block flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" />
                  Rate Plans
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    bulkEditData.ratePlans.length > 0 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {bulkEditData.ratePlans.length} selected
                  </span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setRatePlanDropdown(!ratePlanDropdown)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${
                      ratePlanDropdown
                        ? 'border-purple-500 ring-4 ring-purple-500/20'
                        : isDark 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {bulkEditData.ratePlans.length === 0 
                        ? 'Select rate plans...' 
                        : `${bulkEditData.ratePlans.length} rate plan(s) selected`}
                    </span>
                    <Settings className={`w-5 h-5 transition-transform duration-200 ${ratePlanDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {ratePlanDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-purple-200 shadow-xl z-20 max-h-80 overflow-y-auto ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
                    } animate-in slide-in-from-top-2`}>
                      {ratePlans.map((ratePlan) => (
                        <button
                          key={ratePlan.id}
                          onClick={() => handleRatePlanToggle(ratePlan.id)}
                          className={`w-full p-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 flex items-center gap-4 ${
                            bulkEditData.ratePlans.includes(ratePlan.id) ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500' : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-${ratePlan.color}-500 shadow-lg`}></div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{ratePlan.name}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {ratePlan.code} • {ratePlan.category}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                              {ratePlan.description}
                            </div>
                          </div>
                          {bulkEditData.ratePlans.includes(ratePlan.id) && (
                            <CheckCircle className="w-5 h-5 text-purple-500 animate-in zoom-in-75" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Day Selection */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border border-green-100 dark:border-green-800">
                <label className="text-base font-semibold mb-4 block flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  Days of Week <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {dayShorts.map((day, index) => {
                    const dayKey = dayNames[index].toLowerCase() as keyof DaySelection;
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(dayKey)}
                        className={`p-3 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          bulkEditData.daySelection[dayKey]
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle Column - Enhanced 2-Month Calendar */}
            <div className="xl:col-span-2">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-indigo-500" />
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Smart Date Selection
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Double-click: single dates • Click and select: ranges • Multiple ranges supported
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bulkEditData.dateSelection.selectedDates.length > 0 && (
                      <button
                        onClick={clearAllDates}
                        className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      bulkEditData.dateSelection.selectedDates.length > 0 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {bulkEditData.dateSelection.selectedDates.length} dates
                    </span>
                  </div>
                </div>
                
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className={`p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 transform hover:scale-110`}
                  >
                    <ChevronLeft className="w-5 h-5 text-indigo-500" />
                  </button>
                  <div className="flex gap-8">
                    <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                      {format(calendar.currentMonth.date, 'MMMM yyyy')}
                    </div>
                    <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                      {format(calendar.nextMonth.date, 'MMMM yyyy')}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className={`p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 transform hover:scale-110`}
                  >
                    <ChevronRight className="w-5 h-5 text-indigo-500" />
                  </button>
                </div>

                {/* 2-Month Calendar Grid */}
                <div className="grid grid-cols-2 gap-8">
                  {[calendar.currentMonth, calendar.nextMonth].map((month, monthIndex) => (
                    <div key={monthIndex}>
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className={`p-2 text-center text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {month.days.map((day, index) => {
                          if (!day) {
                            return <div key={index} className="p-3"></div>;
                          }
                          
                          const isSelected = isDateSelected(day);
                          const isInPendingRange = isDateInPendingRange(day);
                          const isPendingStart = pendingRangeStart && isSameDay(pendingRangeStart, day);
                          
                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => handleDateClick(day)}
                              onMouseEnter={() => setHoveredDate(day)}
                              onMouseLeave={() => setHoveredDate(null)}
                              className={`p-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-110 font-medium relative ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
                                  : isPendingStart
                                  ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 ring-2 ring-yellow-400'
                                  : isInPendingRange
                                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                  : isDark 
                                  ? 'hover:bg-gray-700 text-gray-300' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                              title={isSelected ? 'Double-click to remove' : isPendingStart ? 'Range start (click another date)' : 'Click to select • Double-click for single date'}
                            >
                              {format(day, 'd')}
                              {isPendingStart && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selection Summary */}
                {bulkEditData.dateSelection.ranges.length > 0 && (
                  <div className={`mt-6 p-4 rounded-xl border-2 ${isDark ? 'border-indigo-700 bg-indigo-900/30' : 'border-indigo-300 bg-indigo-50'}`}>
                    <div className="text-sm font-semibold mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        Selected Ranges ({bulkEditData.dateSelection.ranges.length}):
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Double-click dates to remove • Click × to remove ranges
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs max-h-32 overflow-y-auto">
                      {bulkEditData.dateSelection.ranges.map((range, index) => (
                        <div key={range.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${range.type === 'single' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full`}></div>
                            <span className="font-medium">
                              {range.type === 'single' 
                                ? format(range.start, 'MMM dd') 
                                : `${format(range.start, 'MMM dd')} - ${format(range.end, 'MMM dd')}`
                              }
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              ({range.type === 'single' ? '1 day' : `${eachDayOfInterval({ start: range.start, end: range.end }).length} days`})
                            </span>
                          </div>
                          <button
                            onClick={() => removeRange(range.id)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 transform hover:scale-110"
                            title={`Remove ${range.type === 'single' ? 'date' : 'range'}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        💡 <strong>Tip:</strong> Double-click any selected date to remove it or its entire range
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Value Input - Now in its own section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 rounded-xl border border-amber-100 dark:border-amber-800">
            {bulkEditData.editType === 'rates' ? (
              <div>
                <label className="text-base font-semibold mb-4 block flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  Rate Value
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBulkEditData(prev => ({ ...prev, rateType: 'absolute' }))}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        bulkEditData.rateType === 'absolute'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Set Price
                    </button>
                    <button
                      onClick={() => setBulkEditData(prev => ({ ...prev, rateType: 'percentage' }))}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        bulkEditData.rateType === 'percentage'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      % Change
                    </button>
                    <button
                      onClick={() => setBulkEditData(prev => ({ ...prev, rateType: 'increment' }))}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        bulkEditData.rateType === 'increment'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      +/- Amount
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={
                        bulkEditData.rateType === 'absolute' ? 'Enter rate (e.g., 150)'
                        : bulkEditData.rateType === 'percentage' ? 'Enter percentage (e.g., 10)'
                        : 'Enter amount (e.g., 25)'
                      }
                      value={bulkEditData.rateValue || ''}
                      onChange={(e) => setBulkEditData(prev => ({ ...prev, rateValue: parseFloat(e.target.value) }))}
                      className={`w-full p-4 text-lg font-semibold rounded-xl border-2 transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-amber-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                      } focus:ring-4 focus:ring-amber-500/20`}
                    />
                    <DollarSign className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-base font-semibold mb-4 block flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  Inventory Value
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBulkEditData(prev => ({ ...prev, inventoryType: 'absolute' }))}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        bulkEditData.inventoryType === 'absolute'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Set Count
                    </button>
                    <button
                      onClick={() => setBulkEditData(prev => ({ ...prev, inventoryType: 'increment' }))}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        bulkEditData.inventoryType === 'increment'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      +/- Count
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={
                        bulkEditData.inventoryType === 'absolute' 
                          ? 'Enter inventory count (e.g., 10)'
                          : 'Enter change amount (e.g., +5 or -3)'
                      }
                      value={bulkEditData.inventoryValue || ''}
                      onChange={(e) => setBulkEditData(prev => ({ ...prev, inventoryValue: parseFloat(e.target.value) }))}
                      className={`w-full p-4 text-lg font-semibold rounded-xl border-2 transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-amber-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                      } focus:ring-4 focus:ring-amber-500/20`}
                    />
                    <Package className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Notes Section */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <label className="text-base font-semibold mb-3 block flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-500" />
              Notes <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </label>
            <textarea
              placeholder="Add any notes about this bulk edit operation..."
              value={bulkEditData.notes || ''}
              onChange={(e) => setBulkEditData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className={`w-full p-4 rounded-xl border-2 resize-none transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
              } focus:ring-4 focus:ring-gray-500/20`}
            />
          </div>

          {/* Enhanced Summary and Actions */}
          <div className={`border-t-2 pt-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Enhanced Validation Messages */}
            {!isValid && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-700 animate-in slide-in-from-left-1">
                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Please complete all required fields:</span>
                </div>
                <ul className="text-sm text-amber-600 dark:text-amber-500 space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enhanced Success Summary */}
            {isValid && (
              <div className={`mb-6 p-6 rounded-xl border-2 ${isDark ? 'border-green-700 bg-gradient-to-r from-green-900/30 to-emerald-900/30' : 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'} animate-in slide-in-from-right-1`}>
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400 mb-3">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Ready to Apply</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-600 dark:text-green-500">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {bulkEditData.roomTypes.length} room type(s)
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {bulkEditData.ratePlans.length} rate plan(s)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {bulkEditData.dateSelection.selectedDates.length} specific date(s)
                    </div>
                    {Object.values(bulkEditData.daySelection).some(Boolean) && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Selected days of week
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    Impact: {impactCount} rate/inventory combinations will be updated
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleApply}
                disabled={!isValid}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                  isValid
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {showSuccessAnimation ? (
                  <>
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Apply Smart Bulk Edit
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 