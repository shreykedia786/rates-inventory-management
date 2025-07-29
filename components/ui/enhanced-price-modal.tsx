/**
 * Enhanced Price Edit Modal - World-Class Revenue Management UI
 * UX Improvements: Better visual hierarchy, enhanced input experience, contextual guidance
 * Features: Modern animations, competitor intelligence, AI insights, market analysis
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Save, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, Building, BarChart3, Calendar, MapPin, 
  Users, Star, Gauge, ArrowUp, ArrowDown, Target, Info, Clock,
  DollarSign, Zap, Shield, TrendingUp as TrendingUpIcon
} from 'lucide-react';

interface CompetitorData {
  competitors: Array<{
    name: string;
    rate: number;
    availability: number;
    distance: number;
    rating: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  marketPosition: 'premium' | 'competitive' | 'value';
  priceAdvantage: number;
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

interface EnhancedPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  productName: string;
  currentPrice: number;
  originalPrice?: number;
  currency?: string;
  onSave: (newPrice: number) => void;
  competitorData?: CompetitorData;
  events?: Event[];
  aiInsights?: AIInsight[];
  isDark?: boolean;
}

export function EnhancedPriceModal({
  isOpen,
  onClose,
  roomName,
  productName,
  currentPrice,
  originalPrice,
  currency = '₹',
  onSave,
  competitorData,
  events = [],
  aiInsights = [],
  isDark = false
}: EnhancedPriceModalProps) {
  const [editValue, setEditValue] = useState(currentPrice.toString());
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceAnimation, setShowPriceAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'insights' | 'events'>('overview');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [priceConfidence, setPriceConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEditValue(currentPrice.toString());
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
  }, [isOpen, currentPrice]);

  useEffect(() => {
    const value = Number(editValue);
    const isValidNumber = !isNaN(value) && value > 0 && value <= 999999;
    setIsValid(isValidNumber);
    
    if (!isValidNumber && editValue !== '') {
      if (value <= 0) {
        setValidationMessage('Price must be greater than zero');
      } else if (value > 999999) {
        setValidationMessage('Price cannot exceed ₹999,999');
      } else {
        setValidationMessage('Please enter a valid number');
      }
    } else {
      setValidationMessage('');
      
      // Set price confidence based on market data
      if (competitorData && isValidNumber) {
        const avgCompetitorRate = competitorData.competitors.reduce((sum, comp) => sum + comp.rate, 0) / competitorData.competitors.length;
        const priceRatio = value / avgCompetitorRate;
        
        if (priceRatio > 1.2 || priceRatio < 0.8) {
          setPriceConfidence('low');
        } else if (priceRatio > 1.1 || priceRatio < 0.9) {
          setPriceConfidence('medium');
        } else {
          setPriceConfidence('high');
        }
      }
    }
  }, [editValue, competitorData]);

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
    setShowPriceAnimation(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API call
      const newPrice = Number(editValue);
      onSave(newPrice);
      onClose();
    } catch (error) {
      console.error('Failed to save price:', error);
    } finally {
      setIsSubmitting(false);
      setShowPriceAnimation(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      e.preventDefault();
      handleSave();
    }
  };

  const getChangeAnalysis = () => {
    const newPrice = Number(editValue);
    const basePrice = originalPrice || currentPrice;
    const change = newPrice - basePrice;
    const changePercent = ((change / basePrice) * 100);
    
    return {
      change,
      changePercent,
      isIncrease: change > 0,
      isSignificant: Math.abs(changePercent) > 10
    };
  };

  const getMarketPosition = () => {
    if (!competitorData) return null;
    
    const avgCompetitorRate = competitorData.competitors.reduce((sum, comp) => sum + comp.rate, 0) / competitorData.competitors.length;
    const newPrice = Number(editValue);
    const percentile = ((competitorData.competitors.filter(c => c.rate < newPrice).length / competitorData.competitors.length) * 100);
    
    return {
      avgRate: avgCompetitorRate,
      percentile: Math.round(percentile),
      position: percentile > 75 ? 'premium' : percentile > 25 ? 'competitive' : 'value'
    };
  };

  const getRevenueImpact = () => {
    const newPrice = Number(editValue);
    const change = newPrice - currentPrice;
    const baseOccupancy = 75; // Assume 75% base occupancy
    
    // Simple revenue impact calculation
    const dailyRevenue = newPrice * baseOccupancy * 0.01;
    const currentDailyRevenue = currentPrice * baseOccupancy * 0.01;
    const revenueImpact = dailyRevenue - currentDailyRevenue;
    
    return {
      daily: Math.round(revenueImpact),
      monthly: Math.round(revenueImpact * 30),
      isPositive: revenueImpact > 0
    };
  };

  const revenueImpact = getRevenueImpact();
  const analysis = getChangeAnalysis();
  const marketPosition = getMarketPosition();

  if (!portalTarget || !isOpen) return null;

  return createPortal(
    <div className="modal-backdrop animate-fade-in" onClick={handleBackdropClick}>
      <div className="modal-container animate-scale-in max-w-5xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Enhanced Header with Context */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white p-6">
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-sm">Price Optimization</h1>
                  <p className="text-blue-100 text-base font-medium mt-1">Strategic pricing with market intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Building className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">{roomName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{productName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Live Data</span>
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
          {/* Left Panel - Price Input & Analysis */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 space-y-6">
              
              {/* Price Input Section - Enhanced */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Set New Price
                </label>
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                    {currency}
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-16 pr-16 py-6 text-3xl font-bold text-center border-3 rounded-2xl 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                              transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl ${
                      !isValid 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shake-animation' 
                        : priceConfidence === 'high' ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-200'
                        : priceConfidence === 'medium' ? 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-200'
                        : 'border-yellow-500 focus:border-yellow-600 focus:ring-4 focus:ring-yellow-200'
                    }`}
                    placeholder="0"
                    min="1"
                    max="999999"
                    step="1"
                  />
                  
                  {/* Price Confidence Indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {isValid && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        priceConfidence === 'high' ? 'bg-green-100 text-green-700' :
                        priceConfidence === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          priceConfidence === 'high' ? 'bg-green-500' :
                          priceConfidence === 'medium' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`} />
                        {priceConfidence.toUpperCase()}
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

              {/* Price Comparison Cards - Enhanced */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      Current Price
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currency}{currentPrice.toLocaleString()}
                    </div>
                    {originalPrice && originalPrice !== currentPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Originally {currency}{originalPrice.toLocaleString()}
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
                      New Price
                    </div>
                    <div className={`text-3xl font-bold transition-all duration-300 ${
                      showPriceAnimation ? 'animate-pulse' : ''
                    } ${
                      analysis.isIncrease 
                        ? 'text-green-600 dark:text-green-400' 
                        : analysis.change < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {currency}{isValid ? Number(editValue).toLocaleString() : '---'}
                    </div>
                    {isValid && analysis.change !== 0 && (
                      <div className={`flex items-center justify-center gap-1 mt-2 text-sm font-medium ${
                        analysis.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {analysis.isIncrease ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {currency}{Math.abs(analysis.change).toLocaleString()} 
                        ({analysis.changePercent > 0 ? '+' : ''}{analysis.changePercent.toFixed(1)}%)
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                        {revenueImpact.isPositive ? '+' : ''}{currency}{Math.abs(revenueImpact.daily).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Daily Impact</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${revenueImpact.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {revenueImpact.isPositive ? '+' : ''}{currency}{Math.abs(revenueImpact.monthly).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Monthly Impact</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Market Intelligence */}
          <div className="w-96 bg-gray-50 dark:bg-gray-800/50">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Gauge },
                  { id: 'competitors', label: 'Market', icon: Building },
                  { id: 'insights', label: 'AI', icon: Zap },
                  { id: 'events', label: 'Events', icon: Calendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
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
              {activeTab === 'overview' && marketPosition && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Market Position</h3>
                    
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
                          strokeDasharray={`${marketPosition.percentile}, 100`}
                          className={`transition-all duration-1000 ${
                            marketPosition.position === 'premium' ? 'text-purple-500' :
                            marketPosition.position === 'competitive' ? 'text-blue-500' :
                            'text-green-500'
                          }`}
                        />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {marketPosition.percentile}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Percentile
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                      marketPosition.position === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      marketPosition.position === 'competitive' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {marketPosition.position.toUpperCase()} POSITIONING
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Market Average</span>
                      <span className="font-semibold">{currency}{Math.round(marketPosition.avgRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Your Position</span>
                      <span className="font-semibold">{marketPosition.percentile}th percentile</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'competitors' && competitorData && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Competitor Analysis</h3>
                  {competitorData.competitors.slice(0, 5).map((competitor, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {competitor.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{competitor.rating}</span>
                          </div>
                        </div>
                        
                        {competitor.trend && (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            competitor.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
                            competitor.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {competitor.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />}
                            {competitor.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {currency}{competitor.rate.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {competitor.availability} rooms • {competitor.distance}km
                        </div>
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
                          Revenue potential: +{currency}{insight.potentialRevenue.toLocaleString()}
                        </div>
                      )}
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
                  <span className="text-sm font-medium">Significant price change ({Math.abs(analysis.changePercent).toFixed(1)}%)</span>
                </div>
              )}
              
              {isValid && priceConfidence === 'low' && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">Price outside optimal range</span>
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                         hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg
                         hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Price...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Price</span>
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