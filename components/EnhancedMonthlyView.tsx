/**
 * World-Class Enhanced Monthly Revenue Management View
 * Professional-grade monthly calendar with comprehensive KPIs, bulk operations, 
 * advanced analytics, and enterprise-level features for revenue managers
 */
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Download, Upload, Filter, 
  Search, Settings, BarChart3, TrendingUp, TrendingDown, AlertCircle,
  Eye, EyeOff, Grid, List, Maximize2, RefreshCw, Clock, Users,
  DollarSign, Package, Brain, Target, Zap, Star, ArrowUpDown,
  CheckSquare, Square, MoreHorizontal, Copy, Edit3, Save, X
} from 'lucide-react';
import { RevenueAnalytics } from './RevenueAnalytics';

// Enhanced interfaces for world-class functionality
interface RevenueCellData {
  date: string;
  adr: number;
  revpar: number;
  occupancy: number;
  inventory: number;
  soldRooms: number;
  rate: number;
  restrictions: string[];
  events: string[];
  aiInsights: any[];
  competitorRates: { [key: string]: number };
  marketSegments: { [key: string]: number };
  channelMix: { [key: string]: number };
  isChanged: boolean;
  variance: { budget: number; lastYear: number };
  groupBlocks: number;
  paceData: { booking: number; revenue: number };
}

interface MonthlyViewProps {
  selectedRoomTypeForMonthly: string;
  setSelectedRoomTypeForMonthly: (value: string) => void;
  selectedRatePlanForMonthly: string;
  setSelectedRatePlanForMonthly: (value: string) => void;
  monthlyViewDate: Date;
  setMonthlyViewDate: (date: Date) => void;
  sampleRoomTypes: any[];
  // ... other props
}

export const EnhancedMonthlyView: React.FC<MonthlyViewProps> = ({
  selectedRoomTypeForMonthly,
  setSelectedRoomTypeForMonthly,
  selectedRatePlanForMonthly,
  setSelectedRatePlanForMonthly,
  monthlyViewDate,
  setMonthlyViewDate,
  sampleRoomTypes,
}) => {
  // Advanced state management
  const [viewMode, setViewMode] = useState<'calendar' | 'grid' | 'analytics'>('calendar');
  const [selectedMetric, setSelectedMetric] = useState<'adr' | 'revpar' | 'occupancy' | 'variance'>('revpar');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [showAllRoomTypes, setShowAllRoomTypes] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    showWeekends: true,
    showRestrictions: true,
    showEvents: true,
    showCompetitors: false,
    minOccupancy: 0,
    maxOccupancy: 100
  });
  const [sortBy, setSortBy] = useState<'date' | 'adr' | 'revpar' | 'occupancy'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Auto-select "all room types" view by default if no selection is made
  React.useEffect(() => {
    if (!selectedRoomTypeForMonthly && sampleRoomTypes.length > 0) {
      setSelectedRoomTypeForMonthly('all');
      setSelectedRatePlanForMonthly('');
    }
  }, [sampleRoomTypes, selectedRoomTypeForMonthly, setSelectedRoomTypeForMonthly, setSelectedRatePlanForMonthly]);

  // Get current room type and rate plan for display
  const currentRoomType = sampleRoomTypes.find((rt: any) => rt.id === selectedRoomTypeForMonthly);
  const currentRatePlan = currentRoomType?.products.find((p: any) => p.id === selectedRatePlanForMonthly);

  // Generate enhanced monthly data with comprehensive KPIs
  const generateEnhancedMonthlyData = useMemo(() => {
    const monthlyData: RevenueCellData[] = [];
    const baseDate = new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth(), 1);
    const daysInMonth = new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
      const dateStr = currentDate.toISOString().split('T')[0];
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      // Generate realistic revenue data (this would come from your API)
      const baseRate = isWeekend ? 15000 : 12000; // Base rate in paise
      const occupancy = Math.max(0.3, Math.min(0.95, 0.7 + (Math.random() - 0.5) * 0.4));
      const inventory = 100;
      const soldRooms = Math.floor(inventory * occupancy);
      const adr = baseRate + (Math.random() - 0.5) * 2000;
      const revpar = (adr * occupancy) / 100;
      
      monthlyData.push({
        date: dateStr,
        adr: adr,
        revpar: revpar,
        occupancy: occupancy * 100,
        inventory: inventory,
        soldRooms: soldRooms,
        rate: adr,
        restrictions: Math.random() > 0.7 ? ['CTA', 'MLOS-2'] : [],
        events: Math.random() > 0.8 ? ['Tech Conference', 'Wedding'] : [],
        aiInsights: Math.random() > 0.6 ? [{type: 'pricing', confidence: 0.85}] : [],
        competitorRates: {
          'Competitor A': adr + (Math.random() - 0.5) * 1000,
          'Competitor B': adr + (Math.random() - 0.5) * 1500,
        },
        marketSegments: {
          'Corporate': Math.random() * 0.4,
          'Leisure': Math.random() * 0.3,
          'Group': Math.random() * 0.3,
        },
        channelMix: {
          'Direct': Math.random() * 0.4,
          'OTA': Math.random() * 0.4,
          'GDS': Math.random() * 0.2,
        },
        isChanged: Math.random() > 0.8,
        variance: { 
          budget: (Math.random() - 0.5) * 0.2, 
          lastYear: (Math.random() - 0.5) * 0.15 
        },
        groupBlocks: Math.floor(Math.random() * 20),
        paceData: { 
          booking: Math.random() * 100, 
          revenue: Math.random() * 50000 
        }
      });
    }
    
    return monthlyData;
  }, [monthlyViewDate]);

  // Enhanced color coding based on performance
  const getCellColorClass = (data: RevenueCellData) => {
    switch (selectedMetric) {
      case 'revpar':
        if (data.revpar > 10000) return 'bg-green-100 dark:bg-green-900/20 border-green-300';
        if (data.revpar > 7000) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300';
        return 'bg-red-100 dark:bg-red-900/20 border-red-300';
      case 'occupancy':
        if (data.occupancy > 80) return 'bg-green-100 dark:bg-green-900/20 border-green-300';
        if (data.occupancy > 60) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300';
        return 'bg-red-100 dark:bg-red-900/20 border-red-300';
      case 'variance':
        if (data.variance.budget > 0.1) return 'bg-green-100 dark:bg-green-900/20 border-green-300';
        if (data.variance.budget > -0.1) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300';
        return 'bg-red-100 dark:bg-red-900/20 border-red-300';
      default:
        return 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* World-Class Header with Advanced Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col space-y-4">
          {/* Title and Key Metrics */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Revenue Management Calendar
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  {monthlyViewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </span>
              </h2>
              
              {/* ENHANCED: Clear data context display */}
              {selectedRoomTypeForMonthly === 'all' ? (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      📊 All Room Types Summary
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Displaying aggregated data across all room types and rate plans
                  </span>
                </div>
              ) : currentRoomType && currentRatePlan ? (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {currentRoomType.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      {currentRatePlan.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Displaying pricing and inventory data for selected room type and rate plan
                  </span>
                </div>
              ) : null}
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enterprise-grade monthly overview with comprehensive KPIs and bulk operations
              </p>
            </div>
            
            {/* Quick KPIs - Only show when data is available */}
            {generateEnhancedMonthlyData.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(generateEnhancedMonthlyData.reduce((sum, d) => sum + d.revpar, 0) / generateEnhancedMonthlyData.length)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg RevPAR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPercentage(generateEnhancedMonthlyData.reduce((sum, d) => sum + d.occupancy, 0) / generateEnhancedMonthlyData.length)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg Occ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(generateEnhancedMonthlyData.reduce((sum, d) => sum + d.adr, 0) / generateEnhancedMonthlyData.length)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg ADR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    +{formatPercentage(5.2)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">vs Budget</div>
                </div>
              </div>
            )}
          </div>

          {/* ENHANCED: Better room type and rate plan selection */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              {/* Room Type & Rate Plan Selection - Enhanced UI */}
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Room:</span>
                  <select
                    value={selectedRoomTypeForMonthly}
                    onChange={(e) => {
                      setSelectedRoomTypeForMonthly(e.target.value);
                      // Auto-select first rate plan when room type changes, unless it's "all"
                      if (e.target.value !== 'all') {
                        const newRoomType = sampleRoomTypes.find((rt: any) => rt.id === e.target.value);
                        if (newRoomType && newRoomType.products.length > 0) {
                          setSelectedRatePlanForMonthly(newRoomType.products[0].id);
                        }
                      } else {
                        setSelectedRatePlanForMonthly('');
                      }
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                  >
                    <option value="all">📊 All Room Types Summary</option>
                    {sampleRoomTypes.map((roomType: any) => (
                      <option key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rate:</span>
                  <select
                    value={selectedRatePlanForMonthly}
                    onChange={(e) => setSelectedRatePlanForMonthly(e.target.value)}
                    disabled={selectedRoomTypeForMonthly === 'all'}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedRoomTypeForMonthly === 'all' ? (
                      <option value="">All Rate Plans</option>
                    ) : (
                      currentRoomType?.products.map((product: any) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                {/* Quick Room Type Switcher */}
                {selectedRoomTypeForMonthly !== 'all' && (
                  <div className="flex items-center gap-1 ml-2">
                    {sampleRoomTypes.slice(0, 3).map((roomType: any, index: number) => (
                      <button
                        key={roomType.id}
                        onClick={() => {
                          setSelectedRoomTypeForMonthly(roomType.id);
                          if (roomType.products.length > 0) {
                            setSelectedRatePlanForMonthly(roomType.products[0].id);
                          }
                        }}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          selectedRoomTypeForMonthly === roomType.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                        title={`Switch to ${roomType.name}`}
                      >
                        {roomType.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'analytics' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              {/* Metric Selection */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="revpar">RevPAR View</option>
                <option value="adr">ADR View</option>
                <option value="occupancy">Occupancy View</option>
                <option value="variance">Variance View</option>
              </select>

              {/* Bulk Operations Toggle */}
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bulkMode
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Bulk Mode
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dates, events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Filter */}
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Filter className="w-4 h-4" />
              </button>

              {/* Export */}
              <button 
                onClick={() => setIsExporting(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Navigation */}
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => setMonthlyViewDate(new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth() - 1, 1))}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setMonthlyViewDate(new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth() + 1, 1))}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Calendar Grid */}
      <div className="p-6">
        {viewMode === 'calendar' && (
          <div>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days - Enhanced with comprehensive data */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth(), 1).getDay() }, (_, i) => (
                <div key={`empty-${i}`} className="h-32 bg-transparent"></div>
              ))}
              
              {generateEnhancedMonthlyData.map((dayData, index) => {
                const date = new Date(dayData.date);
                const dayNumber = date.getDate();
                const isToday = date.toDateString() === new Date().toDateString();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isSelected = selectedDates.has(dayData.date);
                
                return (
                  <div
                    key={dayData.date}
                    onClick={() => {
                      if (bulkMode) {
                        const newSelected = new Set(selectedDates);
                        if (isSelected) {
                          newSelected.delete(dayData.date);
                        } else {
                          newSelected.add(dayData.date);
                        }
                        setSelectedDates(newSelected);
                      }
                    }}
                    className={`relative p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 h-32 ${
                      getCellColorClass(dayData)
                    } ${isToday ? 'ring-2 ring-blue-500' : ''} ${isSelected ? 'ring-2 ring-orange-500' : ''} ${
                      isWeekend ? 'bg-opacity-60' : ''
                    }`}
                  >
                    {/* Date Number */}
                    <div className={`text-lg font-bold mb-2 ${
                      isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {dayNumber}
                      {bulkMode && (
                        <div className="absolute top-1 right-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Key Metrics Display */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">RevPAR:</span>
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          {formatCurrency(dayData.revpar)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Occ:</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          {formatPercentage(dayData.occupancy)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">ADR:</span>
                        <span className="font-semibold text-purple-700 dark:text-purple-400">
                          {formatCurrency(dayData.adr)}
                        </span>
                      </div>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {dayData.restrictions.length > 0 && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" title="Restrictions" />
                      )}
                      {dayData.events.length > 0 && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Events" />
                      )}
                      {dayData.aiInsights.length > 0 && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="AI Insights" />
                      )}
                      {dayData.isChanged && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Recently Changed" />
                      )}
                    </div>

                    {/* Variance Indicator */}
                    <div className="absolute bottom-2 right-2">
                      {dayData.variance.budget > 0.05 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : dayData.variance.budget < -0.05 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <RevenueAnalytics 
            monthlyData={generateEnhancedMonthlyData}
            selectedMetric={selectedMetric}
            monthlyViewDate={monthlyViewDate}
          />
        )}

        {/* Grid View - Tabular format for power users */}
        {viewMode === 'grid' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">RevPAR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ADR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Occupancy</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inventory</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Variance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {generateEnhancedMonthlyData.map((dayData) => {
                    const date = new Date(dayData.date);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <tr key={dayData.date} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isWeekend ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {date.toLocaleDateString('en', { weekday: 'short' })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(dayData.revpar)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {formatCurrency(dayData.adr)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {formatPercentage(dayData.occupancy)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {dayData.inventory}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            dayData.variance.budget > 0.05 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : dayData.variance.budget < -0.05
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {dayData.variance.budget > 0 ? '+' : ''}{formatPercentage(dayData.variance.budget * 100)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex gap-1">
                            {dayData.restrictions.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                R
                              </span>
                            )}
                            {dayData.events.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                E
                              </span>
                            )}
                            {dayData.aiInsights.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                AI
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Room Types Summary View */}
        {viewMode === 'calendar' && selectedRoomTypeForMonthly === 'all' && (
          <div className="space-y-6">
            {/* Summary Cards for All Room Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRoomTypes.map((roomType: any, roomIndex: number) => (
                <div key={roomType.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{roomType.name}</h3>
                    <button
                      onClick={() => {
                        setSelectedRoomTypeForMonthly(roomType.id);
                        if (roomType.products.length > 0) {
                          setSelectedRatePlanForMonthly(roomType.products[0].id);
                        }
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                  
                  {/* Sample metrics for this room type */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg RevPAR:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(8000 + roomIndex * 2000 + Math.random() * 1000)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg Occupancy:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatPercentage(65 + roomIndex * 5 + Math.random() * 10)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg ADR:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {formatCurrency(12000 + roomIndex * 3000 + Math.random() * 2000)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
                      <span className={`font-semibold ${
                        roomIndex % 3 === 0 ? 'text-green-600 dark:text-green-400' :
                        roomIndex % 3 === 1 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {roomIndex % 3 === 0 ? '↗ Above Target' : roomIndex % 3 === 1 ? '→ On Target' : '↘ Below Target'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Quick Edit
                    </button>
                    <button className="flex-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                      AI Insights
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comparative Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Type Performance Comparison</h3>
              <div className="space-y-4">
                {sampleRoomTypes.map((roomType: any, index: number) => {
                  const performance = 60 + index * 10 + Math.random() * 20;
                  return (
                    <div key={roomType.id} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium text-gray-900 dark:text-white">
                        {roomType.name}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            performance > 80 ? 'bg-green-500' : 
                            performance > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(performance, 100)}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {performance.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Performance based on RevPAR vs target for current month
              </p>
            </div>
          </div>
        )}

        {/* Single Room Type Calendar View */}
        {viewMode === 'calendar' && selectedRoomTypeForMonthly !== 'all' && (
          <div>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days - Enhanced with comprehensive data */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: new Date(monthlyViewDate.getFullYear(), monthlyViewDate.getMonth(), 1).getDay() }, (_, i) => (
                <div key={`empty-${i}`} className="h-32 bg-transparent"></div>
              ))}
              
              {generateEnhancedMonthlyData.map((dayData, index) => {
                const date = new Date(dayData.date);
                const dayNumber = date.getDate();
                const isToday = date.toDateString() === new Date().toDateString();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isSelected = selectedDates.has(dayData.date);
                
                return (
                  <div
                    key={dayData.date}
                    onClick={() => {
                      if (bulkMode) {
                        const newSelected = new Set(selectedDates);
                        if (isSelected) {
                          newSelected.delete(dayData.date);
                        } else {
                          newSelected.add(dayData.date);
                        }
                        setSelectedDates(newSelected);
                      }
                    }}
                    className={`relative p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 h-32 ${
                      getCellColorClass(dayData)
                    } ${isToday ? 'ring-2 ring-blue-500' : ''} ${isSelected ? 'ring-2 ring-orange-500' : ''} ${
                      isWeekend ? 'bg-opacity-60' : ''
                    }`}
                  >
                    {/* Date Number */}
                    <div className={`text-lg font-bold mb-2 ${
                      isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {dayNumber}
                      {bulkMode && (
                        <div className="absolute top-1 right-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Key Metrics Display */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">RevPAR:</span>
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          {formatCurrency(dayData.revpar)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Occ:</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          {formatPercentage(dayData.occupancy)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">ADR:</span>
                        <span className="font-semibold text-purple-700 dark:text-purple-400">
                          {formatCurrency(dayData.adr)}
                        </span>
                      </div>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {dayData.restrictions.length > 0 && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" title="Restrictions" />
                      )}
                      {dayData.events.length > 0 && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Events" />
                      )}
                      {dayData.aiInsights.length > 0 && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="AI Insights" />
                      )}
                      {dayData.isChanged && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Recently Changed" />
                      )}
                    </div>

                    {/* Variance Indicator */}
                    <div className="absolute bottom-2 right-2">
                      {dayData.variance.budget > 0.05 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : dayData.variance.budget < -0.05 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Operations Panel */}
      {bulkMode && selectedDates.size > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-orange-50 dark:bg-orange-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDates.size} dates selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Bulk Price Update
                </button>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                  Apply Restrictions
                </button>
                <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                  Copy Rates
                </button>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedDates(new Set());
                setBulkMode(false);
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 