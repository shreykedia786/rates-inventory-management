/**
 * Enhanced Inventory Edit Modal - World-Class Inventory Management UI
 * UX Improvements: Demand forecasting, occupancy intelligence, AI insights, contextual guidance
 * Features: Modern animations, demand analysis, AI recommendations, event impact
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Save, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, Building, BarChart3, Calendar, MapPin, 
  Users, Star, Gauge, ArrowUp, ArrowDown, Target, Info, Clock,
  Home, Zap, Shield, TrendingUp as TrendingUpIcon, Activity,
  PieChart, Signal, Bed
} from 'lucide-react';

interface DemandData {
  historical: Array<{
    date: string;
    occupancy: number;
    demand: number;
    dayOfWeek: string;
  }>;
  currentDemand: number;
  predictedDemand: number;
  demandTrend: 'up' | 'down' | 'stable';
  optimalInventory: number;
  riskLevel: 'low' | 'medium' | 'high';
  
  // Enhanced RM Context
  competitorSnapshot: {
    avgAvailability: number;
    pricePosition: 'premium' | 'parity' | 'discount';
    marketShare: number;
    competitorData: Array<{
      name: string;
      availability: number;
      rate: number;
      distance: number;
      occupancyRate: number;
    }>;
  };
  
  bookingPace: {
    vsLastYear: number;
    vsForecast: number;
    velocityTrend: 'accelerating' | 'steady' | 'declining';
    daysOut: number;
    criticalBookingWindow: boolean;
    pickupVsCompSet: number;
  };
  
  channelPerformance: Array<{
    channel: string;
    conversion: number;
    trend: 'up' | 'down' | 'stable';
    recommendedAction: string;
    marketShare: number;
    efficiency: number;
  }>;
  
  restrictionRecommendations: Array<{
    type: 'length_of_stay' | 'advance_purchase' | 'channel_closeout' | 'rate_fence';
    action: 'add' | 'remove' | 'modify';
    reasoning: string;
    revenueImpact: number;
    urgency: 'immediate' | 'recommended' | 'consider';
    confidence: number;
  }>;
}

interface Event {
  id: string;
  title: string;
  type: string;
  impact: 'high' | 'medium' | 'low';
  attendees?: number;
  startDate: Date;
  endDate: Date;
  venue?: string;
  demandMultiplier: number;
  proximity: number;
  historicalImpact?: {
    occupancyUplift: number;
    adrChange: number;
  };
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'education' | 'opportunity' | 'automation' | 'prediction';
  title: string;
  message: string;
  reasoning: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  potentialRevenue?: number;
}

interface OccupancyForecast {
  date: string;
  predictedOccupancy: number;
  confidence: number;
  factors: string[];
}

interface EnhancedInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  currentInventory: number;
  originalInventory?: number;
  date: string;
  onSave: (newInventory: number) => void;
  demandData?: DemandData;
  events?: Event[];
  aiInsights?: AIInsight[];
  occupancyForecast?: OccupancyForecast;
  isDark?: boolean;
}

export function EnhancedInventoryModal({
  isOpen,
  onClose,
  roomName,
  currentInventory,
  originalInventory,
  date,
  onSave,
  demandData,
  events = [],
  aiInsights = [],
  occupancyForecast,
  isDark = false
}: EnhancedInventoryModalProps) {
  const [editValue, setEditValue] = useState(currentInventory.toString());
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInventoryAnimation, setShowInventoryAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'demand' | 'insights' | 'events' | 'competitive' | 'pace' | 'channels' | 'restrictions'>('overview');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [inventoryConfidence, setInventoryConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEditValue(currentInventory.toString());
      setIsValid(true);
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentInventory]);

  // Enhanced validation with contextual messages
  useEffect(() => {
    const value = Number(editValue);
    const isValidNumber = !isNaN(value) && value >= 0 && value <= 999;
    setIsValid(isValidNumber);
    
    if (!isValidNumber && editValue !== '') {
      if (value < 0) {
        setValidationMessage('Inventory cannot be negative');
      } else if (value > 999) {
        setValidationMessage('Inventory cannot exceed 999 rooms');
      } else {
        setValidationMessage('Please enter a valid number');
      }
    } else {
      setValidationMessage('');
      
      // Set inventory confidence based on demand data
      if (demandData && isValidNumber) {
        const optimalRange = demandData.optimalInventory;
        const deviation = Math.abs(value - optimalRange) / optimalRange;
        
        if (deviation <= 0.1) {
          setInventoryConfidence('high');
        } else if (deviation <= 0.25) {
          setInventoryConfidence('medium');
        } else {
          setInventoryConfidence('low');
        }
      }
    }
  }, [editValue, demandData]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    setShowInventoryAnimation(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API call
      const newInventory = Number(editValue);
      onSave(newInventory);
      onClose();
    } catch (error) {
      console.error('Failed to save inventory:', error);
    } finally {
      setIsSubmitting(false);
      setShowInventoryAnimation(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      e.preventDefault();
      handleSave();
    }
  };

  const getChangeAnalysis = () => {
    const newInventory = Number(editValue);
    const baseInventory = originalInventory || currentInventory;
    const change = newInventory - baseInventory;
    const changePercent = baseInventory > 0 ? ((change / baseInventory) * 100) : 0;
    
    return {
      change,
      changePercent,
      isIncrease: change > 0,
      isSignificant: Math.abs(change) > 5
    };
  };

  const getOccupancyImpact = () => {
    const newInventory = Number(editValue);
    
    if (!demandData || !isValid) return null;
    
    const potentialOccupancy = Math.min((demandData.currentDemand / newInventory) * 100, 100);
    const currentOccupancyRate = Math.min((demandData.currentDemand / currentInventory) * 100, 100);
    const occupancyChange = potentialOccupancy - currentOccupancyRate;
    
    return {
      current: Math.round(currentOccupancyRate),
      potential: Math.round(potentialOccupancy),
      change: Math.round(occupancyChange),
      isOptimal: Math.abs(newInventory - demandData.optimalInventory) <= 2
    };
  };

  const getRevenueImpact = () => {
    const newInventory = Number(editValue);
    const change = newInventory - currentInventory;
    
    // Estimate revenue impact based on inventory changes
    const avgRoomRate = 3500; // Average room rate
    const occupancyRate = demandData?.currentDemand ? 
      Math.min(demandData.currentDemand / newInventory, 1) : 0.75;
    
    const dailyRevenueChange = change * occupancyRate * avgRoomRate;
    
    return {
      daily: Math.round(dailyRevenueChange),
      monthly: Math.round(dailyRevenueChange * 30),
      isPositive: dailyRevenueChange > 0
    };
  };

  const revenueImpact = getRevenueImpact();
  const occupancyImpact = getOccupancyImpact();
  const analysis = getChangeAnalysis();

  if (!portalTarget || !isOpen) return null;

  return createPortal(
    <div className="modal-backdrop animate-fade-in" onClick={handleBackdropClick}>
      <div className="modal-container animate-scale-in max-w-5xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Enhanced Header with Context */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-green-700 to-teal-600 text-white p-6">
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <Bed className="w-6 h-6 text-white" />
                </div>
            <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-sm">Inventory Optimization</h1>
                  <p className="text-emerald-100 text-base font-medium mt-1">Smart room allocation with demand intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Building className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">{roomName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{date}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Activity className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Live Demand</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 
                       flex items-center justify-center transition-all duration-200 hover:scale-105 hover:rotate-90
                       backdrop-blur-sm shadow-lg group"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex">
          {/* Left Panel - Inventory Input & Analysis */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 space-y-6">
              
              {/* Inventory Input Section - Enhanced */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Set Room Inventory
                </label>
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                    <Home className="w-8 h-8" />
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-20 pr-16 py-6 text-3xl font-bold text-center border-3 rounded-2xl 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                              transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl ${
                      !isValid 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shake-animation' 
                        : inventoryConfidence === 'high' ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-200'
                        : inventoryConfidence === 'medium' ? 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-200'
                        : 'border-yellow-500 focus:border-yellow-600 focus:ring-4 focus:ring-yellow-200'
                    }`}
                    placeholder="0"
                    min="0"
                    max="999"
                    step="1"
                  />
                  
                  {/* Inventory Confidence Indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {isValid && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        inventoryConfidence === 'high' ? 'bg-green-100 text-green-700' :
                        inventoryConfidence === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          inventoryConfidence === 'high' ? 'bg-green-500' :
                          inventoryConfidence === 'medium' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`} />
                        {inventoryConfidence.toUpperCase()}
                      </div>
                    )}
                    
                    {isValid ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                
                {/* Enhanced Validation Message */}
                {validationMessage && (
                  <div className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-400 animate-slide-in">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{validationMessage}</span>
                  </div>
                )}
              </div>

              {/* Inventory Comparison Cards - Enhanced */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      Current Inventory
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentInventory}
              </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">rooms available</div>
                    {originalInventory && originalInventory !== currentInventory && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Originally {originalInventory} rooms
                      </div>
                    )}
                  </div>
            </div>

                <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${
              analysis.isIncrease 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : analysis.change < 0 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-2 flex items-center justify-center gap-2 ${
                analysis.isIncrease 
                  ? 'text-green-600 dark:text-green-400' 
                        : analysis.change < 0 
                  ? 'text-red-600 dark:text-red-400' 
                        : 'text-blue-600 dark:text-blue-400'
              }`}>
                      <TrendingUpIcon className="w-4 h-4" />
                New Inventory
              </div>
                    <div className={`text-3xl font-bold transition-all duration-300 ${
                      showInventoryAnimation ? 'animate-pulse' : ''
                    } ${
                analysis.isIncrease 
                  ? 'text-green-600 dark:text-green-400' 
                        : analysis.change < 0 
                  ? 'text-red-600 dark:text-red-400' 
                        : 'text-blue-600 dark:text-blue-400'
              }`}>
                {isValid ? Number(editValue) : '---'}
              </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">rooms available</div>
                    {isValid && analysis.change !== 0 && (
                      <div className={`flex items-center justify-center gap-1 mt-2 text-sm font-medium ${
                        analysis.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {analysis.isIncrease ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {Math.abs(analysis.change)} rooms 
                        ({analysis.changePercent > 0 ? '+' : ''}{analysis.changePercent.toFixed(1)}%)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Occupancy Impact Projection */}
              {isValid && occupancyImpact && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <PieChart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Occupancy Impact</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Projected utilization analysis</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {occupancyImpact.current}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Current Occupancy</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        occupancyImpact.isOptimal ? 'text-green-600' : 
                        occupancyImpact.potential > 85 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {occupancyImpact.potential}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Projected Occupancy</div>
                      {occupancyImpact.change !== 0 && (
                        <div className={`text-xs font-medium ${
                          occupancyImpact.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {occupancyImpact.change > 0 ? '+' : ''}{occupancyImpact.change}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Impact Projection */}
              {isValid && analysis.change !== 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Impact</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Projected financial impact</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${revenueImpact.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {revenueImpact.isPositive ? '+' : ''}₹{Math.abs(revenueImpact.daily).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Daily Impact</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${revenueImpact.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {revenueImpact.isPositive ? '+' : ''}₹{Math.abs(revenueImpact.monthly).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Monthly Impact</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Demand Intelligence */}
          <div className="w-96 bg-gray-50 dark:bg-gray-800/50">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: Gauge },
                  { id: 'demand', label: 'Demand', icon: Signal },
                  { id: 'competitive', label: 'Competitive', icon: Target },
                  { id: 'pace', label: 'Pace', icon: Activity },
                  { id: 'channels', label: 'Channels', icon: BarChart3 },
                  { id: 'restrictions', label: 'Restrictions', icon: Shield },
                  { id: 'insights', label: 'AI', icon: Zap },
                  { id: 'events', label: 'Events', icon: Calendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 h-96 overflow-y-auto">
              {activeTab === 'overview' && demandData && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Demand Overview</h3>
                    
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${Math.min((demandData.currentDemand / Math.max(currentInventory, 1)) * 100, 100)}, 100`}
                          className={`transition-all duration-1000 ${
                            demandData.riskLevel === 'high' ? 'text-red-500' :
                            demandData.riskLevel === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}
                        />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {demandData.currentDemand}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Current Demand
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                      demandData.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      demandData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {demandData.riskLevel.toUpperCase()} RISK
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Optimal Inventory</span>
                      <span className="font-semibold">{demandData.optimalInventory} rooms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Predicted Demand</span>
                      <span className="font-semibold">{demandData.predictedDemand} rooms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Demand Trend</span>
                      <span className={`font-semibold capitalize ${
                        demandData.demandTrend === 'up' ? 'text-green-600' :
                        demandData.demandTrend === 'down' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {demandData.demandTrend}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'demand' && demandData && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Demand Analysis</h3>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Current Demand</span>
                      <span className="text-lg font-bold text-blue-600">{demandData.currentDemand}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Predicted Demand</span>
                      <span className="text-lg font-bold text-purple-600">{demandData.predictedDemand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Optimal Inventory</span>
                      <span className="text-lg font-bold text-green-600">{demandData.optimalInventory}</span>
                    </div>
                  </div>

                  {demandData.historical.slice(0, 4).map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.dayOfWeek}</span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Occupancy: {item.occupancy}%</span>
                        <span className="text-xs text-gray-600">Demand: {item.demand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'insights' && aiInsights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Recommendations</h3>
                  {aiInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.confidence >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          insight.confidence >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {insight.confidence}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{insight.message}</p>
                      {insight.potentialRevenue && (
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">
                          Revenue potential: +₹{insight.potentialRevenue.toLocaleString()}
              </div>
            )}
          </div>
                  ))}
                </div>
              )}

              {activeTab === 'competitive' && demandData?.competitorSnapshot && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Competitive Intelligence</h3>
                  
                  {/* Market Position Overview */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Market Position</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        demandData.competitorSnapshot.pricePosition === 'premium' ? 'bg-green-100 text-green-700' :
                        demandData.competitorSnapshot.pricePosition === 'parity' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {demandData.competitorSnapshot.pricePosition.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Market Share</span>
                        <div className="font-bold text-lg">{demandData.competitorSnapshot.marketShare}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Avg Competitor Availability</span>
                        <div className="font-bold text-lg">{demandData.competitorSnapshot.avgAvailability}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Competitor Breakdown */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Competitor Analysis</div>
                    {demandData.competitorSnapshot.competitorData.slice(0, 4).map((comp, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{comp.name}</span>
                          <span className="text-xs text-gray-500">{comp.distance}km</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Availability</span>
                            <div className="font-medium">{comp.availability} rooms</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Rate</span>
                            <div className="font-medium">₹{comp.rate.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Occupancy</span>
                            <div className={`font-medium ${
                              comp.occupancyRate > 80 ? 'text-red-600' :
                              comp.occupancyRate > 60 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {comp.occupancyRate}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pace' && demandData?.bookingPace && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Pace Analysis</h3>
                  
                  {/* Pace Overview */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-bold ${
                        demandData.bookingPace.velocityTrend === 'accelerating' ? 'text-green-600' :
                        demandData.bookingPace.velocityTrend === 'declining' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {demandData.bookingPace.velocityTrend === 'accelerating' ? '↗' :
                         demandData.bookingPace.velocityTrend === 'declining' ? '↘' : '→'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Booking Velocity: {demandData.bookingPace.velocityTrend.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">vs Last Year</span>
                        <span className={`font-semibold ${
                          demandData.bookingPace.vsLastYear > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {demandData.bookingPace.vsLastYear > 0 ? '+' : ''}
                          {demandData.bookingPace.vsLastYear}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">vs Forecast</span>
                        <span className={`font-semibold ${
                          demandData.bookingPace.vsForecast > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {demandData.bookingPace.vsForecast > 0 ? '+' : ''}
                          {demandData.bookingPace.vsForecast}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">vs CompSet</span>
                        <span className={`font-semibold ${
                          demandData.bookingPace.pickupVsCompSet > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {demandData.bookingPace.pickupVsCompSet > 0 ? '+' : ''}{demandData.bookingPace.pickupVsCompSet}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Days Out</span>
                        <span className="font-semibold">{demandData.bookingPace.daysOut} days</span>
                      </div>
                    </div>
                    
                    {demandData.bookingPace.criticalBookingWindow && (
                      <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                        <div className="text-xs font-medium text-red-700 dark:text-red-400">
                          🚨 Critical Booking Window - Immediate action required
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'channels' && demandData?.channelPerformance && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Channel Performance</h3>
                  
                  {demandData.channelPerformance.map((channel, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{channel.channel}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          channel.trend === 'up' ? 'bg-green-100 text-green-700' :
                          channel.trend === 'down' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {channel.trend === 'up' ? '↗' : channel.trend === 'down' ? '↘' : '→'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Conversion</span>
                          <div className="font-medium">{channel.conversion}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Market Share</span>
                          <div className="font-medium">{channel.marketShare}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Efficiency</span>
                          <div className="font-medium">{channel.efficiency}%</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        💡 {channel.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'restrictions' && demandData?.restrictionRecommendations && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Restriction Strategy</h3>
                  
                  {demandData.restrictionRecommendations.map((rec, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {rec.action.toUpperCase()} {rec.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.urgency === 'immediate' ? 'bg-red-100 text-red-700' :
                            rec.urgency === 'recommended' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.urgency.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{rec.confidence}%</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{rec.reasoning}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Revenue Impact</span>
                        <span className={`text-xs font-medium ${
                          rec.revenueImpact > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {rec.revenueImpact > 0 ? '+' : ''}₹{Math.abs(rec.revenueImpact).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'events' && events.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Event Impact</h3>
                  {events.slice(0, 3).map((event, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          event.impact === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {event.impact.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.startDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.proximity}km
                </span>
              </div>
                      <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        +{Math.round((event.demandMultiplier - 1) * 100)}% demand increase
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {analysis.isSignificant && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Significant inventory change ({Math.abs(analysis.change)} rooms)</span>
                </div>
              )}
              
              {isValid && inventoryConfidence === 'low' && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">Inventory outside optimal range</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg 
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid || isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg 
                         hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg
                         hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Inventory...</span>
                </>
              ) : (
                <>
                    <Save className="w-4 h-4" />
                    <span>Update Inventory</span>
                </>
              )}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
} 