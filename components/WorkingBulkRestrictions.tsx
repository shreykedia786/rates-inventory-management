import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Shield, Building, DollarSign, Globe, FileText, CalendarIcon, ArrowRight, ArrowLeft, Archive, CheckCircle, Lightbulb } from 'lucide-react';

interface RestrictionType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'availability' | 'length_of_stay' | 'booking';
  icon: string;
  color: 'red' | 'orange' | 'blue' | 'purple';
  priority: number;
}

interface RoomType {
  id: string;
  name: string;
  category: string;
  products: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
  }>;
}

interface WorkingBulkRestrictionsProps {
  isOpen: boolean;
  onClose: () => void;
  restrictionTypes: RestrictionType[];
  roomTypes: RoomType[];
  onApply: (data: any) => void;
}

export const WorkingBulkRestrictions: React.FC<WorkingBulkRestrictionsProps> = ({
  isOpen,
  onClose,
  restrictionTypes,
  roomTypes,
  onApply
}) => {
  const [selectedRestrictionType, setSelectedRestrictionType] = useState<RestrictionType | null>(null);
  const [restrictionForm, setRestrictionForm] = useState({
    value: '',
    dateRange: { start: '', end: '' },
    roomTypes: [] as string[],
    ratePlans: [] as string[],
    channels: [] as string[],
    notes: ''
  });
  
  // Scroll preservation hooks
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Preserve scroll position during state updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  });

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop);
    }
  };

  if (!isOpen) return null;

  const handleApplyRestriction = () => {
    onApply({
      restrictionType: selectedRestrictionType,
      ...restrictionForm
    });
    
    // Reset form
    setSelectedRestrictionType(null);
    setRestrictionForm({
      value: '',
      dateRange: { start: '', end: '' },
      roomTypes: [],
      ratePlans: [],
      channels: [],
      notes: ''
    });
    onClose();
  };

  const isReadyToApply = selectedRestrictionType && 
    restrictionForm.dateRange.start && 
    restrictionForm.dateRange.end && 
    (restrictionForm.roomTypes.length > 0 || restrictionForm.ratePlans.length > 0 || restrictionForm.channels.length > 0);

  const targetCount = restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Bulk Restrictions</h2>
                <p className="text-orange-100 mt-1">Apply restrictions to multiple room types, rate plans, and channels</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-smooth"
          >
            <div className="p-6 space-y-8">
              {/* 1. Restriction Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  1. Choose Restriction Type
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    Select the type of restriction you want to apply
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restrictionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedRestrictionType(type)}
                      className={`w-full min-h-[120px] p-5 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                        selectedRestrictionType?.id === type.id
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 shadow-xl ring-2 ring-orange-200 dark:ring-orange-700'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                            selectedRestrictionType?.id === type.id 
                              ? `${type.color === 'red' ? 'bg-red-500 text-white' :
                                  type.color === 'orange' ? 'bg-orange-500 text-white' :
                                  type.color === 'blue' ? 'bg-blue-500 text-white' :
                                  'bg-purple-500 text-white'}`
                              : `${type.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                                  type.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                  type.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                  'bg-purple-100 dark:bg-purple-900/30'}`
                          }`}>
                            {type.icon === 'X' && <X className="w-6 h-6" />}
                            {type.icon === 'ArrowRight' && <ArrowRight className="w-6 h-6" />}
                            {type.icon === 'ArrowLeft' && <ArrowLeft className="w-6 h-6" />}
                            {type.icon === 'Calendar' && <CalendarIcon className="w-6 h-6" />}
                            {type.icon === 'Link' && <Archive className="w-6 h-6" />}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                            {type.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-auto">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              type.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              type.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                              type.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}>
                              {type.code}
                            </span>
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {type.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Date Range Selection */}
              {selectedRestrictionType && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    2. Select Date Range
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={restrictionForm.dateRange.start}
                          onChange={(e) => setRestrictionForm(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                        <input
                          type="date"
                          value={restrictionForm.dateRange.end}
                          onChange={(e) => setRestrictionForm(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Target Selection */}
              {selectedRestrictionType && restrictionForm.dateRange.start && restrictionForm.dateRange.end && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    3. Select Targets
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700 space-y-6">
                    
                    {/* Room Types */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Building className="w-5 h-5 text-purple-600" />
                          Room Types
                          {restrictionForm.roomTypes.length > 0 && (
                            <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              {restrictionForm.roomTypes.length} selected
                            </span>
                          )}
                        </h4>
                        <button
                          onClick={() => {
                            const allRoomTypes = roomTypes.map(rt => rt.name);
                            const isAllSelected = allRoomTypes.every(rt => restrictionForm.roomTypes.includes(rt));
                            setRestrictionForm(prev => ({
                              ...prev,
                              roomTypes: isAllSelected ? [] : allRoomTypes
                            }));
                          }}
                          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
                        >
                          {roomTypes.every(rt => restrictionForm.roomTypes.includes(rt.name)) ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {roomTypes.map((roomType) => (
                          <label 
                            key={roomType.id} 
                            className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
                              restrictionForm.roomTypes.includes(roomType.name)
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg ring-2 ring-purple-200 dark:ring-purple-700'
                                : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={restrictionForm.roomTypes.includes(roomType.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    roomTypes: [...prev.roomTypes, roomType.name]
                                  }));
                                } else {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    roomTypes: prev.roomTypes.filter(rt => rt !== roomType.name)
                                  }));
                                }
                              }}
                              className="w-5 h-5 text-purple-600 rounded-lg focus:ring-purple-500 focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                                {roomType.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {roomType.category} • {roomType.products.length} rate plans
                              </div>
                            </div>
                            {restrictionForm.roomTypes.includes(roomType.name) && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rate Plans */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          Rate Plans
                          {restrictionForm.ratePlans.length > 0 && (
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                              {restrictionForm.ratePlans.length} selected
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {roomTypes.flatMap(rt => rt.products.map(p => ({ ...p, roomTypeName: rt.name }))).map((ratePlan) => (
                          <label 
                            key={`${ratePlan.roomTypeName}-${ratePlan.id}`} 
                            className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
                              restrictionForm.ratePlans.includes(`${ratePlan.roomTypeName} - ${ratePlan.name}`)
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg ring-2 ring-green-200 dark:ring-green-700'
                                : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={restrictionForm.ratePlans.includes(`${ratePlan.roomTypeName} - ${ratePlan.name}`)}
                              onChange={(e) => {
                                const ratePlanId = `${ratePlan.roomTypeName} - ${ratePlan.name}`;
                                if (e.target.checked) {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    ratePlans: [...prev.ratePlans, ratePlanId]
                                  }));
                                } else {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    ratePlans: prev.ratePlans.filter(rp => rp !== ratePlanId)
                                  }));
                                }
                              }}
                              className="w-5 h-5 text-green-600 rounded-lg focus:ring-green-500 focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                                {ratePlan.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {ratePlan.roomTypeName} • {ratePlan.type}
                              </div>
                            </div>
                            {restrictionForm.ratePlans.includes(`${ratePlan.roomTypeName} - ${ratePlan.name}`) && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          Distribution Channels
                          {restrictionForm.channels.length > 0 && (
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium">
                              {restrictionForm.channels.length} selected
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {['Booking.com', 'Expedia', 'Direct', 'Agoda', 'GDS'].map((channel) => (
                          <label 
                            key={channel} 
                            className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
                              restrictionForm.channels.includes(channel)
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg ring-2 ring-blue-200 dark:ring-blue-700'
                                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={restrictionForm.channels.includes(channel)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    channels: [...prev.channels, channel]
                                  }));
                                } else {
                                  setRestrictionForm(prev => ({
                                    ...prev,
                                    channels: prev.channels.filter(ch => ch !== channel)
                                  }));
                                }
                              }}
                              className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                {channel}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Distribution Partner
                              </div>
                            </div>
                            {restrictionForm.channels.includes(channel) && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Sticky Footer with Progress */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-6 border-t border-gray-200 dark:border-gray-600 flex-shrink-0 shadow-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                selectedRestrictionType ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>1</div>
              <div className={`w-8 h-0.5 transition-all duration-300 ${
                selectedRestrictionType ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                restrictionForm.dateRange.start && restrictionForm.dateRange.end ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>2</div>
              <div className={`w-8 h-0.5 transition-all duration-300 ${
                restrictionForm.dateRange.start && restrictionForm.dateRange.end ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                targetCount > 0 ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>3</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium transform hover:scale-105"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            
            <div className="flex items-center gap-4">
              {/* Target Summary */}
              {targetCount > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg font-medium">
                  <span className="font-bold">{targetCount}</span> targets selected
                </div>
              )}
              
              <button
                onClick={handleApplyRestriction}
                disabled={!isReadyToApply}
                className="px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 disabled:hover:scale-100 shadow-xl hover:shadow-2xl"
              >
                <Plus className="w-6 h-6" />
                Apply Restriction
                {targetCount > 0 && (
                  <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold">
                    {targetCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-300">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">
                💡 Complete all steps to apply bulk restrictions
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button - Always Visible */}
      {isReadyToApply && (
        <div className="fixed bottom-6 right-6 z-[1001] animate-bounce">
          <button
            onClick={handleApplyRestriction}
            className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full shadow-2xl transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-110 group"
          >
            <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold mt-1">APPLY</span>
          </button>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
            {targetCount}
          </div>
        </div>
      )}
    </div>
  );
}; 