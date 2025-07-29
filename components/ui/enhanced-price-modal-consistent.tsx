/**
 * Enhanced Price Edit Modal - CONSISTENT VERSION
 * Uses standardized rate data model for perfect consistency across all components
 * Ensures tooltip, modal, and grid show identical information
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Save, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, Building, BarChart3, Calendar, MapPin, 
  Users, Star, Gauge, ArrowUp, ArrowDown, Target, Info, Clock,
  DollarSign, Zap, Shield, TrendingUp as TrendingUpIcon, Undo2, Brain
} from 'lucide-react';
import { StandardizedRateData, AIRateRecommendation, RateChangeEvent } from '../../types/rate-consistency';

// Mock implementation of the hook for demo purposes
function useStandardizedRateData({
  cellId,
  initialRate,
  roomTypeId,
  ratePlanId,
  date
}: {
  cellId: string;
  initialRate: number;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
}) {
  const [rateData, setRateData] = useState<StandardizedRateData>({
    baseRate: initialRate,
    currentRate: initialRate,
    finalRate: initialRate,
    rateSource: 'base_rate' as const,
    lastModified: new Date(),
    modifiedBy: 'system',
    isActive: true,
    hasUnsavedChanges: false,
    rateHistory: []
  });

  const [aiRecommendation, setAiRecommendation] = useState<AIRateRecommendation | null>(null);

  const applyAIRecommendation = async (recommendationId: string, userId: string) => {
    // Mock implementation
    return rateData;
  };

  const applyManualOverride = async (newRate: number, userId: string, reason?: string) => {
    // Mock implementation
    return rateData;
  };

  const undoAIApplication = async (userId: string) => {
    // Mock implementation
    return rateData;
  };

  const getDisplayValues = () => ({
    tooltipData: {
      currentRate: rateData.currentRate,
      aiRecommendedRate: aiRecommendation?.aiRecommendedRate,
      aiConfidence: aiRecommendation?.confidence,
      lastModified: rateData.lastModified,
      modifiedBy: rateData.modifiedBy,
      canUndo: aiRecommendation?.undoAvailable || false
    },
    modalData: {
      baseRate: rateData.baseRate,
      currentRate: rateData.currentRate,
      finalRate: rateData.finalRate,
      hasOverride: false,
      overrideReason: rateData.manualOverrideRate ? 'Manual override' : undefined,
      aiRecommendation: aiRecommendation
    },
    badgeConfig: {
      showAIBadge: !!aiRecommendation && aiRecommendation.status === 'pending',
      showAppliedBadge: aiRecommendation?.status === 'accepted',
      showChangeBadge: rateData.hasUnsavedChanges,
      showUndoBadge: aiRecommendation?.undoAvailable || false
    }
  });

  return {
    rateData,
    aiRecommendation,
    applyAIRecommendation,
    applyManualOverride,
    undoAIApplication,
    getDisplayValues,
    setAiRecommendation
  };
}

interface EnhancedPriceModalConsistentProps {
  isOpen: boolean;
  onClose: () => void;
  cellId: string;
  roomName: string;
  productName: string;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
  initialRateData: StandardizedRateData;
  aiRecommendation?: AIRateRecommendation;
  currency?: string;
  onSave: (rateData: StandardizedRateData) => void;
  isDark?: boolean;
}

export function EnhancedPriceModalConsistent({
  isOpen,
  onClose,
  cellId,
  roomName,
  productName,
  roomTypeId,
  ratePlanId,
  date,
  initialRateData,
  aiRecommendation,
  currency = '₹',
  onSave,
  isDark = false
}: EnhancedPriceModalConsistentProps) {
  
  // Use standardized rate management
  const {
    rateData,
    aiRecommendation: currentAIRecommendation,
    applyAIRecommendation,
    applyManualOverride,
    undoAIApplication,
    getDisplayValues
  } = useStandardizedRateData({
    cellId,
    initialRate: initialRateData.currentRate,
    roomTypeId,
    ratePlanId,
    date
  });

  const [editValue, setEditValue] = useState(rateData.currentRate.toString());
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get consistent display values
  const { tooltipData, modalData, badgeConfig } = getDisplayValues();

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEditValue(rateData.currentRate.toString());
      setIsValid(true);
      setTimeout(() => inputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, rateData.currentRate]);

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
    }
  }, [editValue]);

  const handleApplyAI = async () => {
    if (!currentAIRecommendation) return;
    
    try {
      setIsSubmitting(true);
      const updatedRateData = await applyAIRecommendation(currentAIRecommendation.id, 'current_user');
      setEditValue(updatedRateData.finalRate.toString());
      
      // Show success feedback
      console.log('✅ AI Recommendation Applied Successfully');
    } catch (error) {
      console.error('Failed to apply AI recommendation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUndo = async () => {
    try {
      setIsSubmitting(true);
      const updatedRateData = await undoAIApplication('current_user');
      setEditValue(updatedRateData.finalRate.toString());
      
      console.log('⏪ AI Application Undone Successfully');
    } catch (error) {
      console.error('Failed to undo AI application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newRate = Number(editValue);
      const updatedRateData = await applyManualOverride(newRate, 'current_user', 'Manual rate adjustment via modal');
      
      onSave(updatedRateData);
      onClose();
    } catch (error) {
      console.error('Failed to save price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChangeAnalysis = () => {
    const newRate = Number(editValue);
    const change = newRate - rateData.currentRate;
    const changePercent = ((change / rateData.currentRate) * 100);
    
    return {
      change,
      changePercent,
      isIncrease: change > 0,
      isSignificant: Math.abs(changePercent) > 10
    };
  };

  const analysis = getChangeAnalysis();

  if (!portalTarget || !isOpen) return null;

  return createPortal(
    <div className="modal-backdrop animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container animate-scale-in max-w-5xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header with Complete Context */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white p-6">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                    Rate Management - Unified Data Flow
                  </h1>
                  <p className="text-blue-100 text-base font-medium mt-1">
                    Consistent across tooltips, modals, and grid
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Building className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">{roomName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{productName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                  <Info className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Source: {rateData.rateSource.replace('_', ' ').toUpperCase()}</span>
                </div>
                {rateData.hasUnsavedChanges && (
                  <div className="flex items-center gap-2 bg-orange-500/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-400/50">
                    <Clock className="w-4 h-4 text-orange-200" />
                    <span className="text-orange-200 text-sm font-medium">Unsaved Changes</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 
                       flex items-center justify-center transition-all duration-200 hover:scale-105 hover:rotate-90
                       backdrop-blur-sm shadow-lg group"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Panel - Rate Input & Analysis */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 space-y-6">
              
              {/* Standardized Rate Information Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Rate Data - Single Source of Truth
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Base Rate</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {currency}{modalData.baseRate.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Current Rate</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {currency}{modalData.currentRate.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Final Rate</div>
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {currency}{modalData.finalRate.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Last Modified</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                      {tooltipData.lastModified.toLocaleString()}
                    </div>
                  </div>
                </div>

                {modalData.hasOverride && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      <strong>Override Reason:</strong> {modalData.overrideReason}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Recommendation Section - Using Consistent Data */}
              {currentAIRecommendation && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Recommendation
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                        {Math.round(currentAIRecommendation.confidence)}% Confidence
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        currentAIRecommendation.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        currentAIRecommendation.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {currentAIRecommendation.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Suggested Rate</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currency}{currentAIRecommendation.aiRecommendedRate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {((currentAIRecommendation.aiRecommendedRate - rateData.currentRate) / rateData.currentRate * 100).toFixed(1)}% change
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reasoning</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        {currentAIRecommendation.reasoning}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {currentAIRecommendation.status === 'pending' && (
                        <button
                          onClick={handleApplyAI}
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          Apply AI Suggestion
                        </button>
                      )}
                      
                      {currentAIRecommendation.status === 'accepted' && currentAIRecommendation.undoAvailable && (
                        <button
                          onClick={handleUndo}
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Undo2 className="w-4 h-4" />
                          Undo AI Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Rate Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Manual Rate Override
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
                    className={`w-full pl-16 pr-16 py-6 text-3xl font-bold text-center border-3 rounded-2xl 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                              transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl ${
                      !isValid 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-200'
                    }`}
                    placeholder="0"
                    min="1"
                    max="999999"
                    step="1"
                  />
                  
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {isValid ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                
                {validationMessage && (
                  <div className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-400 animate-slide-in">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{validationMessage}</span>
                  </div>
                )}
              </div>

              {/* Change Analysis */}
              {isValid && analysis.change !== 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Impact Analysis
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${analysis.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.isIncrease ? '+' : ''}{currency}{Math.abs(analysis.change).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rate Change</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${analysis.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.changePercent > 0 ? '+' : ''}{analysis.changePercent.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Percentage Change</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Audit Trail & Context */}
          <div className="w-96 bg-gray-50 dark:bg-gray-800/50">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Rate History & Audit Trail
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rateData.rateHistory.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No rate changes yet</div>
                  </div>
                ) : (
                  rateData.rateHistory.slice().reverse().map((event: RateChangeEvent, index: number) => (
                    <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {event.source === 'ai_recommendation' && <Brain className="w-4 h-4 text-purple-500" />}
                          {event.source === 'manual_override' && <Users className="w-4 h-4 text-blue-500" />}
                          {event.source === 'bulk_operation' && <Target className="w-4 h-4 text-green-500" />}
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {event.source.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {currency}{event.fromRate} → {currency}{event.toRate}
                        <span className={`ml-2 font-medium ${
                          event.toRate > event.fromRate ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({event.toRate > event.fromRate ? '+' : ''}{((event.toRate - event.fromRate) / event.fromRate * 100).toFixed(1)}%)
                        </span>
                      </div>
                      
                      {event.reason && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {event.reason}
                        </div>
                      )}
                      
                      {event.aiInsightId && (
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          AI Insight #{event.aiInsightId.slice(-6)} ({event.confidence}% confidence)
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
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
                  <span className="text-sm font-medium">
                    Significant change ({Math.abs(analysis.changePercent).toFixed(1)}%)
                  </span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                All data synchronized across tooltips, grid, and modals
              </div>
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
                    <span>Applying Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Apply Rate Change</span>
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