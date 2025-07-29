import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Filter, CheckSquare, Square, ChevronDown, ChevronRight, Sparkles, Calendar, DollarSign, AlertTriangle, TrendingUp, Users, Target, Home, CreditCard } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';

export interface FilterState {
  roomTypes: string[];
  productTypes: string[];
  priceRange: { min: number; max: number };
  dateRange: { start: string; end: string };
  hasRestrictions: boolean;
  hasAIInsights: boolean;
  hasEvents: boolean;
  riskLevel: string[];
  competitorPosition: string[];
  confidenceRange: { min: number; max: number };
}

interface FilterOption {
  id: string;
  name: string;
  type: string;
  count?: number;
  isActive?: boolean;
  roomTypeId?: string; // For rate plans to know which room type they belong to
}

interface RoomTypeWithRatePlans {
  id: string;
  name: string;
  type: string;
  count: number;
  isActive: boolean;
  ratePlans: FilterOption[];
}

interface EnhancedFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  onClearAll: () => void;
  roomTypes: FilterOption[];
  ratePlans: FilterOption[];
  isDark?: boolean;
}

/**
 * Enhanced Filter Popup Component with Hierarchical Room Type → Rate Plan Relationship
 * 
 * Features:
 * - Shows hierarchical relationship between room types and rate plans
 * - Smart filtering: rate plans filter based on selected room types
 * - Expandable/collapsible room type sections
 * - Search functionality across the hierarchy
 * - Modern, accessible design following enterprise UX patterns
 */
export function EnhancedFilterPopup({
  isOpen,
  onClose,
  filters,
  setFilters,
  onClearAll,
  roomTypes,
  ratePlans,
  isDark = false
}: EnhancedFilterPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'hierarchical' | 'advanced' | 'analytics'>('hierarchical');
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'hierarchy' | 'separate'>('hierarchy');
  
  const searchRef = useRef<HTMLInputElement>(null);

  // Build hierarchical data structure
  const roomTypesWithRatePlans = useMemo((): RoomTypeWithRatePlans[] => {
    return roomTypes.map(roomType => {
      // Find rate plans that belong to this room type
      const associatedRatePlans = ratePlans.filter(ratePlan => 
        ratePlan.roomTypeId === roomType.id || 
        // If roomTypeId is not set, we need to derive the relationship from the data structure
        // This is a fallback - ideally roomTypeId should be set when creating ratePlans
        ratePlan.id.startsWith(roomType.id) || ratePlan.name.includes(roomType.name)
      );
      
      return {
        ...roomType,
        count: roomType.count || 0, // Ensure count is always a number
        isActive: roomType.isActive || false, // Ensure isActive is always a boolean
        ratePlans: associatedRatePlans
      };
    });
  }, [roomTypes, ratePlans]);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return roomTypesWithRatePlans;
    
    return roomTypesWithRatePlans.filter(roomType => {
      // Check if room type name matches
      const roomTypeMatches = roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             roomType.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if any rate plan matches
      const ratePlanMatches = roomType.ratePlans.some(ratePlan =>
        ratePlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ratePlan.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return roomTypeMatches || ratePlanMatches;
    });
  }, [roomTypesWithRatePlans, searchTerm]);

  // Available rate plans based on selected room types
  const availableRatePlans = useMemo(() => {
    if (filters.roomTypes.length === 0) return ratePlans;
    
    const selectedRoomTypes = roomTypesWithRatePlans.filter(rt => filters.roomTypes.includes(rt.id));
    const availablePlans = selectedRoomTypes.flatMap(rt => rt.ratePlans);
    
    // Remove duplicates
    const uniquePlans = availablePlans.filter((plan, index, self) => 
      index === self.findIndex(p => p.id === plan.id)
    );
    
    return uniquePlans;
  }, [filters.roomTypes, roomTypesWithRatePlans, ratePlans]);

  const toggleRoomType = (roomTypeId: string) => {
    setExpandedRoomTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomTypeId)) {
        newSet.delete(roomTypeId);
      } else {
        newSet.add(roomTypeId);
      }
      return newSet;
    });
  };

  const handleRoomTypeChange = (roomTypeId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({ ...prev, roomTypes: [...prev.roomTypes, roomTypeId] }));
    } else {
      setFilters(prev => ({ 
        ...prev, 
        roomTypes: prev.roomTypes.filter(id => id !== roomTypeId),
        // Also remove rate plans that belong to this room type
        productTypes: prev.productTypes.filter(planId => {
          const roomType = roomTypesWithRatePlans.find(rt => rt.id === roomTypeId);
          return !roomType?.ratePlans.some(rp => rp.id === planId);
        })
      }));
    }
  };

  const handleRatePlanChange = (ratePlanId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({ ...prev, productTypes: [...prev.productTypes, ratePlanId] }));
    } else {
      setFilters(prev => ({ ...prev, productTypes: prev.productTypes.filter(id => id !== ratePlanId) }));
    }
  };

  const selectAllRoomTypes = () => {
    setFilters(prev => ({ ...prev, roomTypes: roomTypes.map(rt => rt.id) }));
  };

  const clearAllRoomTypes = () => {
    setFilters(prev => ({ ...prev, roomTypes: [], productTypes: [] }));
  };

  const selectAllAvailableRatePlans = () => {
    setFilters(prev => ({ ...prev, productTypes: availableRatePlans.map(rp => rp.id) }));
  };

  const clearAllRatePlans = () => {
    setFilters(prev => ({ ...prev, productTypes: [] }));
  };

  // Auto-expand room types when they're selected
  useEffect(() => {
    const selectedRoomTypes = new Set(filters.roomTypes);
    setExpandedRoomTypes(prev => new Set([...Array.from(prev), ...Array.from(selectedRoomTypes)]));
  }, [filters.roomTypes]);

  // Reset search when popup opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      // Auto-expand room types that have selected rate plans
      const roomTypesWithSelectedPlans = new Set<string>();
      filters.productTypes.forEach(planId => {
        roomTypesWithRatePlans.forEach(roomType => {
          if (roomType.ratePlans.some(rp => rp.id === planId)) {
            roomTypesWithSelectedPlans.add(roomType.id);
          }
        });
      });
      setExpandedRoomTypes(roomTypesWithSelectedPlans);
    }
  }, [isOpen, filters.productTypes, roomTypesWithRatePlans]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] border flex flex-col`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Advanced Filters</h2>
                <p className="text-blue-100 mt-1">Filter by room types and their associated rate plans</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 bg-white/10 rounded-lg p-1">
            {[
              { id: 'hierarchical', label: 'Room Types & Rate Plans', icon: Home },
              { id: 'advanced', label: 'Advanced Filters', icon: Sparkles },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Make this flex-1 with overflow */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'hierarchical' && (
            <div className="h-full flex flex-col">
              {/* Controls */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Room Types & Rate Plans ({filteredData.length} room types)
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode(viewMode === 'hierarchy' ? 'separate' : 'hierarchy')}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                      >
                        {viewMode === 'hierarchy' ? 'Switch to Separate View' : 'Switch to Hierarchy View'}
                      </button>
                      <button
                        onClick={selectAllRoomTypes}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        Select All Room Types
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={clearAllRoomTypes}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search room types and rate plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Available Rate Plans Summary */}
                {filters.roomTypes.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">{availableRatePlans.length} rate plans</span> available for selected room types
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllAvailableRatePlans}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={clearAllRatePlans}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Clear Plans
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hierarchical Room Types & Rate Plans - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {filteredData.map((roomType) => {
                    const isRoomTypeSelected = filters.roomTypes.includes(roomType.id);
                    const isExpanded = expandedRoomTypes.has(roomType.id);
                    const selectedRatePlansCount = roomType.ratePlans.filter(rp => 
                      filters.productTypes.includes(rp.id)
                    ).length;

                    return (
                      <div key={roomType.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Room Type Header */}
                        <div 
                          className={`p-4 cursor-pointer transition-all ${
                            isRoomTypeSelected 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700' 
                              : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                          }`}
                          onClick={() => toggleRoomType(roomType.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <div className="relative">
                                {isRoomTypeSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {roomType.name}
                                </div>
                                <div className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                  {roomType.type}
                                </div>
                                <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                  {roomType.ratePlans.length} rate plans
                                </div>
                                {selectedRatePlansCount > 0 && (
                                  <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                    {selectedRatePlansCount} selected
                                  </div>
                                )}
                              </div>
                            </div>

                            <input
                              type="checkbox"
                              checked={isRoomTypeSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRoomTypeChange(roomType.id, e.target.checked);
                              }}
                              className="sr-only"
                            />
                          </div>
                        </div>

                        {/* Rate Plans */}
                        {isExpanded && (
                          <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                            {roomType.ratePlans.length > 0 ? (
                              <div className="p-4 space-y-2">
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                                  <CreditCard className="w-3 h-3" />
                                  Rate Plans for {roomType.name}
                                </div>
                                {roomType.ratePlans.map((ratePlan) => {
                                  const isSelected = filters.productTypes.includes(ratePlan.id);
                                  const isAvailable = availableRatePlans.some(rp => rp.id === ratePlan.id);
                                  
                                  return (
                                    <label 
                                      key={ratePlan.id} 
                                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ml-6 ${
                                        isSelected 
                                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm' 
                                          : isAvailable
                                          ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
                                      }`}
                                    >
                                      <div className="relative">
                                        {isSelected ? (
                                          <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        ) : (
                                          <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                      </div>
                                      <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {ratePlan.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {ratePlan.type}
                                        </div>
                                      </div>
                                      {!isAvailable && (
                                        <div className="text-xs text-gray-400">
                                          Select room type first
                                        </div>
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={!isAvailable}
                                        onChange={(e) => {
                                          handleRatePlanChange(ratePlan.id, e.target.checked);
                                        }}
                                        className="sr-only"
                                      />
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                No rate plans available for this room type
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredData.length === 0 && (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No room types or rate plans found</p>
                      <p className="text-xs mt-1">Try adjusting your search terms</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Price Range
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Date Range
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, start: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, end: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Risk Level
                    </label>
                  </div>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map((risk) => (
                      <label key={risk} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.riskLevel.includes(risk)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, riskLevel: [...prev.riskLevel, risk] }));
                            } else {
                              setFilters(prev => ({ ...prev, riskLevel: prev.riskLevel.filter(r => r !== risk) }));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm capitalize ${
                          risk === 'high' ? 'text-red-600 dark:text-red-400' :
                          risk === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {risk} Risk
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Toggle Filters */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Content Filters
                    </label>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'hasRestrictions', label: 'Has Restrictions', icon: '🚫' },
                      { key: 'hasAIInsights', label: 'Has AI Insights', icon: '🤖' },
                      { key: 'hasEvents', label: 'Has Events', icon: '📅' }
                    ].map((filter) => (
                      <label key={filter.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[filter.key as keyof FilterState] as boolean}
                          onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-lg">{filter.icon}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Competitor Position */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Competitor Position
                    </label>
                  </div>
                  <div className="space-y-2">
                    {['higher', 'competitive', 'lower'].map((position) => (
                      <label key={position} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.competitorPosition.includes(position)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, competitorPosition: [...prev.competitorPosition, position] }));
                            } else {
                              setFilters(prev => ({ ...prev, competitorPosition: prev.competitorPosition.filter(p => p !== position) }));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                          {position} than competitors
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Confidence Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Confidence Score Range
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.confidenceRange.min}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          confidenceRange: { ...prev.confidenceRange, min: Number(e.target.value) } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.confidenceRange.max}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          confidenceRange: { ...prev.confidenceRange, max: Number(e.target.value) } 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className={`border-t p-4 flex items-center justify-between flex-shrink-0 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={onClearAll}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
            >
              Clear All Filters
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {filters.roomTypes.length} room types, {filters.productTypes.length} rate plans selected
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

      </div>
    </div>
  );
} 