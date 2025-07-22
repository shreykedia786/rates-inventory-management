/**
 * World-Class Revenue Management Platform
 * Premium AI-Powered Interface for Revenue Managers
 * Features: Modern Card Layout, Live Events, AI Insights Drawer, Enhanced Pricing, Animations
 */
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  User, Plus, Calendar, Search, Filter, Download, Upload, Settings, ChevronDown, ChevronUp, 
  Sun, Moon, Bot, Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, Star, 
  Lightbulb, Shield, Zap, Clock, Eye, EyeOff, RefreshCw, Undo2, Save, FileText, 
  CheckCircle, XCircle, Info, ChevronLeft, ChevronRight, X, MessageCircle, 
  Send, Mic, MicOff, Maximize2, Minimize2, BarChart3, PieChart, LineChart,
  Package, Lock, UserCheck, Calendar as CalendarIcon, MapPin, Cloud, Umbrella, Sun as SunIcon,
  Brain, Cpu, Activity, Zap as ZapIcon, AlertCircle, CheckCircle2, Clock as ClockIcon,
  Users, TrendingUp as TrendingUpIcon, Settings as SettingsIcon, MessageSquare, BarChart,
  Layers, Archive, Bell, BellOff, Volume2, VolumeX, Pause, Play, 
  Building, Minus, Edit3, BookOpen, ArrowUp, ArrowDown, Gauge, DollarSign, Tag, ArrowRight,
  Trash2, Globe
} from 'lucide-react';
import { EnhancedPriceModal } from '@/components/ui/enhanced-price-modal';
import { EnhancedInventoryModal } from '@/components/ui/inventory-modal';
import GlobalNewsInsights from '../components/GlobalNewsInsights';
import { MonthlyCalendarView } from '../components/MonthlyCalendarView';
import { useGlobalNewsInsights } from '../hooks/useGlobalNewsInsights';
import PromotionAssistant from '../components/PromotionAssistant';
import { InventoryStatusIconInline, getFixedCompetitorData } from '../components/MainPageFixes';
import CompactInventoryStatus from '../components/CompactInventoryStatus';import PublishConfirmation from '../components/PublishConfirmation';

// Enhanced Types for Modern Interface
interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'education' | 'opportunity' | 'automation' | 'prediction';
  title: string;
  message: string;
  reasoning: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  eventBased?: boolean;
  competitorBased?: boolean;
  status?: 'pending' | 'applied' | 'dismissed' | 'auto-applied' | 'scheduled' | 'learning';
  appliedAt?: Date;
  appliedBy?: string;
  autoApplied?: boolean;
  undoAvailable?: boolean;
  undoExpiresAt?: Date;
  potentialRevenue?: number;
  
  // Agentic AI Features
  agentCapabilities?: {
    canAutoExecute: boolean;
    requiresApproval: boolean;
    executionDelay?: number; // minutes
    learningPattern?: 'user_behavior' | 'market_trends' | 'seasonal_patterns' | 'competitor_response';
    adaptiveConfidence?: number; // confidence that improves over time
    riskAssessment?: 'low' | 'medium' | 'high';
    executionHistory?: Array<{
      timestamp: Date;
      success: boolean;
      outcome: string;
      revenueImpact?: number;
    }>;
  };
  
  // Smart Context
  context?: {
    triggeredBy: 'user_action' | 'market_change' | 'competitor_move' | 'event_detection' | 'pattern_recognition';
    dataPoints: string[];
    correlations: Array<{
      factor: string;
      strength: number;
      description: string;
    }>;
    marketConditions: {
      demandLevel: 'low' | 'normal' | 'high' | 'surge';
      competitionIntensity: 'low' | 'medium' | 'high';
      seasonality: 'off-peak' | 'shoulder' | 'peak';
    };
  };
  
  // Predictive Elements
  predictions?: {
    timeHorizon: '1h' | '6h' | '24h' | '7d' | '30d';
    scenarios: Array<{
      name: string;
      probability: number;
      revenueImpact: number;
      description: string;
    }>;
    nextBestAction?: string;
    alternativeActions?: Array<{
      action: string;
      probability: number;
      expectedOutcome: string;
    }>;
  };
}

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'festival' | 'sports' | 'holiday' | 'exhibition' | 'concert' | 'business';
  impact: 'high' | 'medium' | 'low';
  attendees?: number;
  description: string;
  startDate: Date;
  endDate: Date;
  venue?: string;
  demandMultiplier: number;
  proximity: number;
  relevanceScore: number;
  historicalImpact?: {
    occupancyUplift: number;
    adrChange: number;
  };
}

interface CompetitorData {
  competitors: Array<{
    name: string;
    rate: number;
    availability: number;
    distance: number;
    rating: number;
    trend?: 'up' | 'down' | 'stable';
    lastUpdated?: Date;
    roomType?: string;
  }>;
  marketPosition: 'premium' | 'competitive' | 'value';
  priceAdvantage: number;
  averageRate?: number;
  lowestRate?: number;
  highestRate?: number;
  marketShare?: number;
}

interface ProductData {
  rate: number;
  restrictions: any[];
  isWeekend: boolean;
  competitorIndicator?: 'higher' | 'lower' | 'competitive';
  aiInsights: AIInsight[];
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  originalRate?: number;
  isChanged?: boolean;
  lastModified?: Date;
  isActive: boolean;
  competitorData?: CompetitorData;
  eventImpact?: any;
  aiApplied?: boolean;
  autoApplied?: boolean;
  aiSuggested?: boolean;
  undoAvailable?: boolean;
  undoExpiresAt?: Date;
}

interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  data: ProductData[];
}

interface RoomInventoryData {
  inventory: number;
  originalInventory?: number;
  isChanged?: boolean;
  lastModified?: Date;
  isActive: boolean;
  eventImpact?: any;
  restrictions?: string[];
}

interface RoomType {
  id: string;
  name: string;
  category: string;
  inventoryData: RoomInventoryData[];
  products: Product[];
  isExpanded: boolean;
}

interface RestrictionType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'availability' | 'length_of_stay' | 'booking' | 'rate' | 'guest';
  icon: string;
  color: string;
  priority: number; // Higher priority restrictions override lower ones
}

interface BulkRestriction {
  id: string;
  restrictionType: RestrictionType;
  value?: number | string;
  dateRange: {
    start: string;
    end: string;
  };
  targets: {
    roomTypes: string[];
    ratePlans: string[];
    channels: string[];
  };
  status: 'active' | 'scheduled' | 'expired';
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'ota' | 'direct' | 'gds' | 'corporate' | 'group';
  commission: number;
  isActive: boolean;
}

// Enhanced Types for Modern Interface
interface EventLog {
  id: string;
  timestamp: Date;
  eventType: 'price_update' | 'inventory_update' | 'restriction_added' | 'restriction_removed' | 'bulk_restriction_applied' | 'ai_insight_applied' | 'export_generated' | 'filter_applied';
  userId: string;
  userName: string;
  roomType?: string;
  ratePlan?: string;
  channel?: string;
  dateAffected?: string;
  oldValue?: number | string;
  newValue?: number | string;
  changeAmount?: number;
  changePercentage?: number;
  reason?: string;
  source: 'manual' | 'ai' | 'bulk_operation' | 'import' | 'api';
  metadata?: {
    batchId?: string;
    restrictionType?: string;
    affectedCells?: number;
    filterCriteria?: any;
    exportFormat?: string;
    aiInsightId?: string;
    confidence?: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'pricing' | 'inventory' | 'restrictions' | 'system' | 'export' | 'ai';
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

interface SmartInventoryStatus {
  level: 'critical' | 'low' | 'optimal' | 'oversupply';
  reasoning: string[];
  urgency: 'immediate' | 'monitor' | 'routine';
  confidence: number;
  factors: {
    demandPace: number;
    competitorPosition: 'advantage' | 'parity' | 'disadvantage';
    eventImpact: 'none' | 'positive' | 'negative';
    seasonalTrend: 'peak' | 'shoulder' | 'valley';
  };
  displayText: string;
  colorClass: string;
  actionRequired?: string;
}

interface CompetitorSnapshot {
  avgAvailability: number;
  pricePosition: 'premium' | 'parity' | 'discount';
  marketShare: number;
  competitorData: Array<{
    name: string;
    availability: number;
    rate: number;
    distance: number;
  }>;
}

interface BookingPaceAnalysis {
  vsLastYear: number;
  vsForecast: number;
  velocityTrend: 'accelerating' | 'steady' | 'declining';
  daysOut: number;
  criticalBookingWindow: boolean;
}

interface InventoryDecisionContext {
  competitorSnapshot: CompetitorSnapshot;
  bookingPace: BookingPaceAnalysis;
  channelPerformance: Array<{
    channel: string;
    conversion: number;
    trend: 'up' | 'down' | 'stable';
    recommendedAction: string;
  }>;
  restrictionRecommendations: Array<{
    type: 'length_of_stay' | 'advance_purchase' | 'channel_closeout';
    action: 'add' | 'remove' | 'modify';
    reasoning: string;
    revenueImpact: number;
  }>;
}

// Modern AI Insights Drawer Component
function AIInsightsDrawer({ 
  isOpen, 
  onClose, 
  insights, 
  isDark,
  onApplyInsight,
  onDismissInsight
}: {
  isOpen: boolean;
  onClose: () => void;
  insights: AIInsight[];
  isDark: boolean;
  onApplyInsight: (insight: AIInsight) => void;
  onDismissInsight: (insight: AIInsight) => void;
}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const pendingInsights = insights.filter(i => i.status === 'pending');
  const totalPotentialRevenue = pendingInsights.reduce((sum, insight) => 
    sum + (insight.potentialRevenue || 0), 0
  );

  if (!portalTarget) return null;

  return createPortal(
    <>
      <div className={`ai-drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`ai-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
                <p className="text-sm text-gray-500">Revenue optimization recommendations</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pendingInsights.length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Pending Insights</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{totalPotentialRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Potential Revenue</div>
            </div>
          </div>
          
          {pendingInsights.length > 0 && (
            <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]">
              Apply All Recommendations
            </button>
          )}
        </div>

        {/* Insights List */}
        <div className="ai-insights-content p-6 space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No insights yet</h3>
              <p className="text-gray-500">AI will analyze your data and provide recommendations soon.</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <div 
                key={insight.id} 
                className={`ai-insight-card ${insight.type}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      insight.type === 'recommendation' ? 'bg-green-100 dark:bg-green-900/30' :
                      insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      insight.type === 'opportunity' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      insight.type === 'automation' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      insight.type === 'prediction' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {insight.type === 'recommendation' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                      {insight.type === 'opportunity' && <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      {insight.type === 'automation' && <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      {insight.type === 'prediction' && <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                      {insight.type === 'education' && <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                      
                      {/* Enhanced Status and Agent Capabilities */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.confidence >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          insight.confidence >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {insight.confidence}% confidence
                        </span>
                        
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          insight.impact === 'critical' ? 'border-red-500 text-red-700 dark:border-red-400 dark:text-red-300 bg-red-50 dark:bg-red-900/20' :
                          insight.impact === 'high' ? 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400' :
                          insight.impact === 'medium' ? 'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400' :
                          'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400'
                        }`}>
                          {insight.impact} impact
                        </span>
                        
                        {/* Agent Status Indicators */}
                        {insight.status === 'scheduled' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Auto-executing in {insight.agentCapabilities?.executionDelay}m
                          </span>
                        )}
                        
                        {insight.status === 'learning' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Learning pattern
                          </span>
                        )}
                        
                        {insight.agentCapabilities?.canAutoExecute && insight.status === 'pending' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-executable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {insight.potentialRevenue && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        +₹{insight.potentialRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">potential</div>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{insight.message}</p>
                
                {/* Specific Action Details */}
                {insight.predictions?.nextBestAction && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg mb-3">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Recommended Action
                    </h5>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">{insight.predictions.nextBestAction}</p>
                  </div>
                )}
                
                {/* Specific Room/Product Targets */}
                {insight.id === '1' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg mb-3">
                    <h5 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Target Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Room Type:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">Deluxe Room</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Rate Plan:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">Best Available Rate (BAR)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Target Dates:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">Feb 17-18 (Weekend)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Current Rate:</span>
                        <span className="font-medium text-green-900 dark:text-green-100">₹9,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 dark:text-green-300">Suggested Rate:</span>
                        <span className="font-bold text-green-900 dark:text-green-100">₹11,200 (+18%)</span>
                      </div>
                      <div className="pt-2 border-t border-green-200 dark:border-green-700">
                        <span className="text-green-700 dark:text-green-300 text-xs">Expected Revenue Impact: +₹45,000 over 2 days</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {insight.id === '3' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg mb-3">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Inventory Strategy
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300">Room Type:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">Deluxe Room</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300">Current Allocation:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">20 rooms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300">Suggested Allocation:</span>
                        <span className="font-bold text-blue-900 dark:text-blue-100">17 rooms (-15%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300">Rate Increase:</span>
                        <span className="font-bold text-blue-900 dark:text-blue-100">₹8,500 → ₹9,520 (+12%)</span>
                      </div>
                      <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                        <span className="text-blue-700 dark:text-blue-300 text-xs">Scarcity psychology drives urgency and premium pricing</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {insight.id === '4' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-3">
                    <h5 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Mitigation
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 dark:text-red-300">Affected Dates:</span>
                        <span className="font-medium text-red-900 dark:text-red-100">Feb 24-25 (Next Weekend)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 dark:text-red-300">Market Supply:</span>
                        <span className="font-medium text-red-900 dark:text-red-100">+25% vs last month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 dark:text-red-300">Recommended Action:</span>
                        <span className="font-bold text-red-900 dark:text-red-100">Value differentiation strategy</span>
                      </div>
                      <div className="pt-2 border-t border-red-200 dark:border-red-700">
                        <span className="text-red-700 dark:text-red-300 text-xs">Focus on amenities, service quality, and package deals</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {insight.reasoning && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Reasoning:</strong> {insight.reasoning}
                    </p>
                  </div>
                )}
                
                {/* Scenario Analysis */}
                {insight.predictions?.scenarios && insight.predictions.scenarios.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Scenario Analysis
                    </h5>
                    <div className="space-y-2">
                      {insight.predictions.scenarios.map((scenario, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{scenario.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{scenario.description}</div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {Math.round(scenario.probability * 100)}%
                            </div>
                            <div className={`text-xs font-medium ${
                              scenario.revenueImpact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {scenario.revenueImpact > 0 ? '+' : ''}₹{scenario.revenueImpact.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {insight.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onApplyInsight(insight)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Recommendation
                    </button>
                    <button 
                      onClick={() => onDismissInsight(insight)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                
                {insight.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onApplyInsight(insight)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Execute Now
                    </button>
                    <button 
                      onClick={() => onDismissInsight(insight)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel Schedule
                    </button>
                  </div>
                )}
                
                {insight.status === 'applied' && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Applied {insight.appliedAt && formatDistanceToNow(insight.appliedAt)} ago
                    {insight.undoAvailable && (
                      <button className="ml-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Undo2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>,
    portalTarget
  );
}

// Main Revenue Management Page Component
export default function RevenuePage() {
  // State Management
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<'daily' | 'monthly'>('daily');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{room: string, product: string, price: number} | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<{room: string, inventory: number, dateIndex: number} | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dateOffset, setDateOffset] = useState(0);
  
  // Monthly View State
  const [selectedRoomTypeForMonthly, setSelectedRoomTypeForMonthly] = useState("");
  const [selectedRatePlanForMonthly, setSelectedRatePlanForMonthly] = useState("");
  const [monthlyViewDate, setMonthlyViewDate] = useState(new Date());  
  const [changes, setChanges] = useState<Array<{
    id: string;
    type: 'price' | 'inventory';
    room: string;
    product?: string;
    date: string;
    oldValue: number;
    newValue: number;
    timestamp: Date;
  }>>([]);
  const [showChangesSummary, setShowChangesSummary] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    content: string;
    position: { x: number; y: number };
  } | null>(null);
  
  // Inline Editing State
  const [inlineEdit, setInlineEdit] = useState<{
    type: 'price' | 'inventory';
    roomId: string;
    productId?: string;
    dateIndex: number;
    value: string;
    originalValue: number;
  } | null>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  // Enhanced Rich Tooltip State
  const [richTooltip, setRichTooltip] = useState<{
    type: 'event' | 'ai' | 'competitor' | 'general' | 'inventory_analysis';
    data: any;
    position: { x: number; y: number };
  } | null>(null);

  // Enhanced cell click handlers with double-click support
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Tooltip timeout for preventing flickering
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  // Filters and Export State
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [filters, setFilters] = useState({
    roomTypes: [] as string[],
    productTypes: [] as string[],
    priceRange: { min: 0, max: 50000 },
    dateRange: { start: '', end: '' },
    hasRestrictions: false,
    hasAIInsights: false,
    hasEvents: false,
    riskLevel: [] as string[],
    competitorPosition: [] as string[],
    confidenceRange: { min: 0, max: 100 }
  });
  const [exportOptions, setExportOptions] = useState({
    format: 'excel' as 'excel' | 'csv' | 'pdf',
    includeRestrictions: true,
    includeAIInsights: true,
    includeEvents: true,
    dateRange: 'visible' as 'visible' | 'all' | 'custom',
    customDateRange: { start: '', end: '' }
  });

  // Bulk Restrictions State
  const [isBulkRestrictionsOpen, setIsBulkRestrictionsOpen] = useState(false);
  const [selectedRestrictionType, setSelectedRestrictionType] = useState<RestrictionType | null>(null);
  const [restrictionForm, setRestrictionForm] = useState({
    value: '',
    dateRange: { start: '', end: '' },
    roomTypes: [] as string[],
    ratePlans: [] as string[],
    channels: [] as string[],
    notes: ''
  });
  const [bulkRestrictions, setBulkRestrictions] = useState<BulkRestriction[]>([]);

  // Event Logs State
  const [isEventLogsOpen, setIsEventLogsOpen] = useState(false);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [eventLogsFilter, setEventLogsFilter] = useState({
    category: 'all' as 'all' | EventLog['category'],
    severity: 'all' as 'all' | EventLog['severity'],
    source: 'all' as 'all' | EventLog['source'],
    dateRange: { start: '', end: '' },
    searchTerm: '',
    userId: 'all'
  });

  // Global News Insights State
  const [isGlobalNewsOpen, setIsGlobalNewsOpen] = useState(false);

  // Room Types State (for expand/collapse functionality) - Properly initialized after sampleRoomTypes
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // Global News Insights Hook
  const {
    insights: globalNewsInsights,
    isLoading: isNewsLoading,
    error: newsError,
    stats: newsStats,
    refreshInsights: refreshNewsInsights,
    applyInsight: applyNewsInsight,
    dismissInsight: dismissNewsInsight,
    toggleAutoRefresh,
    isAutoRefreshEnabled
  } = useGlobalNewsInsights({
    autoRefresh: true,
    refreshInterval: 15 * 60 * 1000, // 15 minutes
    enableNotifications: true
  });

  // Sample Restriction Types
  const restrictionTypes: RestrictionType[] = [
    {
      id: 'closeout',
      name: 'Close Out',
      code: 'CTA',
      description: 'Close room type/rate plan to arrival',
      category: 'availability',
      icon: 'X',
      color: 'red',
      priority: 10
    },
    {
      id: 'ctd',
      name: 'Close to Departure',
      code: 'CTD',
      description: 'Close room type/rate plan to departure',
      category: 'availability',
      icon: 'XCircle',
      color: 'red',
      priority: 9
    },
    {
      id: 'minlos',
      name: 'Minimum Length of Stay',
      code: 'MINLOS',
      description: 'Minimum number of nights required',
      category: 'length_of_stay',
      icon: 'ArrowRight',
      color: 'orange',
      priority: 7
    },
    {
      id: 'maxlos',
      name: 'Maximum Length of Stay',
      code: 'MAXLOS',
      description: 'Maximum number of nights allowed',
      category: 'length_of_stay',
      icon: 'ArrowLeft',
      color: 'orange',
      priority: 6
    },
    {
      id: 'booking_window',
      name: 'Booking Window',
      code: 'BW',
      description: 'Advance booking requirements',
      category: 'booking',
      icon: 'Calendar',
      color: 'blue',
      priority: 5
    },
    {
      id: 'no_arrival',
      name: 'No Arrival',
      code: 'NA',
      description: 'No arrivals allowed on this date',
      category: 'availability',
      icon: 'Ban',
      color: 'red',
      priority: 8
    },
    {
      id: 'full_pattern',
      name: 'Full Pattern',
      code: 'FP',
      description: 'Must stay through entire pattern',
      category: 'length_of_stay',
      icon: 'Link',
      color: 'purple',
      priority: 4
    }
  ];

  // Sample Channels
  const channels: Channel[] = [
    { id: 'direct', name: 'Direct Booking', type: 'direct', commission: 0, isActive: true },
    { id: 'booking_com', name: 'Booking.com', type: 'ota', commission: 15, isActive: true },
    { id: 'expedia', name: 'Expedia', type: 'ota', commission: 18, isActive: true },
    { id: 'agoda', name: 'Agoda', type: 'ota', commission: 17, isActive: true },
    { id: 'amadeus', name: 'Amadeus GDS', type: 'gds', commission: 10, isActive: true },
    { id: 'sabre', name: 'Sabre GDS', type: 'gds', commission: 10, isActive: true },
    { id: 'corporate', name: 'Corporate Direct', type: 'corporate', commission: 5, isActive: true },
    { id: 'groups', name: 'Group Bookings', type: 'group', commission: 8, isActive: true }
  ];

  // Sample Data
  const sampleInsights: AIInsight[] = [
    {
      id: '1',
      type: 'automation',
      title: 'Auto-Pricing Agent Activated',
      message: 'AI agent has detected optimal pricing opportunity and is ready to auto-execute rate adjustments.',
      reasoning: 'Tech conference demand surge detected with 87% confidence. Competitor rates increased by average 18%. Historical data shows 25% occupancy increase during similar events.',
      confidence: 87,
      impact: 'high',
      status: 'scheduled',
      potentialRevenue: 45000,
      eventBased: true,
      competitorBased: true,
      agentCapabilities: {
        canAutoExecute: true,
        requiresApproval: false,
        executionDelay: 15,
        learningPattern: 'market_trends',
        adaptiveConfidence: 92,
        riskAssessment: 'low',
        executionHistory: [
          {
            timestamp: new Date(Date.now() - 86400000),
            success: true,
            outcome: 'Rate increased by 15%, occupancy maintained at 95%',
            revenueImpact: 12500
          }
        ]
      },
      context: {
        triggeredBy: 'event_detection',
        dataPoints: ['Tech Innovation Summit (1200 attendees)', 'Competitor rate increases', 'Historical event data'],
        correlations: [
          { factor: 'Event proximity', strength: 0.95, description: '2.1km from venue with high relevance score' },
          { factor: 'Competitor pricing', strength: 0.87, description: 'All nearby competitors increased rates 15-20%' },
          { factor: 'Historical performance', strength: 0.92, description: 'Similar events showed 25% occupancy boost' }
        ],
        marketConditions: {
          demandLevel: 'surge',
          competitionIntensity: 'medium',
          seasonality: 'peak'
        }
      },
      predictions: {
        timeHorizon: '24h',
        scenarios: [
          { name: 'Optimal Execution', probability: 0.85, revenueImpact: 45000, description: 'Execute rate increase now for maximum revenue' },
          { name: 'Delayed Execution', probability: 0.12, revenueImpact: 28000, description: 'Wait 6 hours, risk competitor saturation' },
          { name: 'No Action', probability: 0.03, revenueImpact: -15000, description: 'Miss opportunity, revenue loss likely' }
        ],
        nextBestAction: 'Execute rate increase of 18% for weekend dates',
        alternativeActions: [
          { action: 'Gradual increase over 3 hours', probability: 0.75, expectedOutcome: 'Reduced risk, 80% of potential revenue' },
          { action: 'Premium positioning strategy', probability: 0.65, expectedOutcome: 'Higher rates, selective demand' }
        ]
      }
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Competitor Response Predicted',
      message: 'AI predicts Hotel Paradise will drop rates by 8-12% within next 6 hours based on pattern analysis.',
      reasoning: 'Machine learning model detected Hotel Paradise\'s typical response pattern to our rate increases. Historical data shows 89% accuracy in predicting their moves.',
      confidence: 92,
      impact: 'medium',
      status: 'learning',
      potentialRevenue: 0,
      competitorBased: true,
      agentCapabilities: {
        canAutoExecute: false,
        requiresApproval: true,
        learningPattern: 'competitor_response',
        adaptiveConfidence: 94,
        riskAssessment: 'medium'
      },
      context: {
        triggeredBy: 'pattern_recognition',
        dataPoints: ['Hotel Paradise rate history', 'Response time patterns', 'Market positioning data'],
        correlations: [
          { factor: 'Response timing', strength: 0.89, description: 'Typically responds within 4-8 hours' },
          { factor: 'Rate adjustment size', strength: 0.76, description: 'Usually 60-80% of our increase magnitude' },
          { factor: 'Market conditions', strength: 0.82, description: 'More aggressive in high-demand periods' }
        ],
        marketConditions: {
          demandLevel: 'high',
          competitionIntensity: 'high',
          seasonality: 'peak'
        }
      },
      predictions: {
        timeHorizon: '6h',
        scenarios: [
          { name: 'Aggressive Response', probability: 0.65, revenueImpact: -8500, description: 'Paradise drops rates 12%, we lose some bookings' },
          { name: 'Moderate Response', probability: 0.28, revenueImpact: -3200, description: 'Paradise drops rates 8%, minimal impact' },
          { name: 'No Response', probability: 0.07, revenueImpact: 0, description: 'Paradise maintains rates, unlikely scenario' }
        ],
        nextBestAction: 'Prepare counter-strategy for predicted rate drop',
        alternativeActions: [
          { action: 'Preemptive value-add strategy', probability: 0.78, expectedOutcome: 'Maintain rates with enhanced offerings' },
          { action: 'Dynamic response automation', probability: 0.85, expectedOutcome: 'Auto-adjust based on their move' }
        ]
      }
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Smart Inventory Optimization',
      message: 'AI detected unusual booking velocity pattern. Recommend reducing inventory allocation to drive urgency and rate premiums.',
      reasoning: 'Booking velocity increased 340% in last 4 hours. Search-to-book ratio improved by 180%. Scarcity psychology can drive 15-25% rate premium.',
      confidence: 76,
      impact: 'high',
      status: 'pending',
      potentialRevenue: 28000,
      agentCapabilities: {
        canAutoExecute: true,
        requiresApproval: true,
        executionDelay: 5,
        learningPattern: 'user_behavior',
        adaptiveConfidence: 81,
        riskAssessment: 'low'
      },
      context: {
        triggeredBy: 'pattern_recognition',
        dataPoints: ['Booking velocity trends', 'Search behavior analytics', 'Conversion rate data'],
        correlations: [
          { factor: 'Booking velocity', strength: 0.94, description: 'Sharp increase indicates high demand' },
          { factor: 'Search volume', strength: 0.87, description: 'Search volume up 340% for target dates' },
          { factor: 'Conversion rate', strength: 0.79, description: 'Higher conversion suggests price acceptance' }
        ],
        marketConditions: {
          demandLevel: 'surge',
          competitionIntensity: 'medium',
          seasonality: 'peak'
        }
      },
      predictions: {
        timeHorizon: '1h',
        scenarios: [
          { name: 'Scarcity Strategy', probability: 0.82, revenueImpact: 28000, description: 'Reduce inventory by 20%, increase rates 15%' },
          { name: 'Volume Strategy', probability: 0.15, revenueImpact: 18000, description: 'Maintain inventory, modest rate increase' },
          { name: 'Status Quo', probability: 0.03, revenueImpact: 5000, description: 'No changes, miss opportunity' }
        ],
        nextBestAction: 'Reduce available inventory by 15% and increase rates by 12%',
        alternativeActions: [
          { action: 'Gradual inventory reduction', probability: 0.88, expectedOutcome: 'Lower risk, 75% of potential revenue' },
          { action: 'Premium room upsell focus', probability: 0.72, expectedOutcome: 'Higher margins, selective demand' }
        ]
      }
    },
    {
      id: '4',
      type: 'warning',
      title: 'Market Saturation Alert',
      message: 'AI detects potential market oversupply risk for next weekend. Proactive strategy needed.',
      reasoning: 'Multiple competitors showing increased availability. New hotel opening detected. Historical patterns suggest rate pressure incoming.',
      confidence: 84,
      impact: 'critical',
      status: 'pending',
      potentialRevenue: -12000,
      competitorBased: true,
      agentCapabilities: {
        canAutoExecute: false,
        requiresApproval: true,
        learningPattern: 'market_trends',
        adaptiveConfidence: 86,
        riskAssessment: 'high'
      },
      context: {
        triggeredBy: 'market_change',
        dataPoints: ['Competitor inventory levels', 'New property openings', 'Historical saturation patterns'],
        correlations: [
          { factor: 'Supply increase', strength: 0.91, description: '25% more rooms available than last month' },
          { factor: 'Competitor pricing', strength: 0.78, description: 'Aggressive pricing signals detected' },
          { factor: 'Demand indicators', strength: 0.65, description: 'Search volume stable but conversion declining' }
        ],
        marketConditions: {
          demandLevel: 'normal',
          competitionIntensity: 'high',
          seasonality: 'shoulder'
        }
      },
      predictions: {
        timeHorizon: '7d',
        scenarios: [
          { name: 'Rate War Scenario', probability: 0.45, revenueImpact: -25000, description: 'Competitors start aggressive price competition' },
          { name: 'Value Strategy Success', probability: 0.35, revenueImpact: -5000, description: 'Focus on value proposition maintains position' },
          { name: 'Market Stabilization', probability: 0.20, revenueImpact: 2000, description: 'Market finds new equilibrium quickly' }
        ],
        nextBestAction: 'Implement value-differentiation strategy immediately',
        alternativeActions: [
          { action: 'Defensive pricing strategy', probability: 0.65, expectedOutcome: 'Protect market share, lower margins' },
          { action: 'Premium positioning', probability: 0.55, expectedOutcome: 'Higher rates, reduced volume' }
        ]
      }
    }
  ];

  // Expanded sample events data
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Tech Innovation Summit',
      type: 'conference',
      impact: 'high',
      attendees: 1200,
      description: 'Major technology conference',
      startDate: new Date(2024, 1, 15),
      endDate: new Date(2024, 1, 17),
      venue: 'Convention Center',
      demandMultiplier: 1.8,
      proximity: 2.1,
      relevanceScore: 0.95,
      historicalImpact: {
        occupancyUplift: 45,
        adrChange: 25
      }
    },
    {
      id: '2',
      title: 'Music Festival',
      type: 'festival',
      impact: 'medium',
      attendees: 800,
      description: 'Annual music festival',
      startDate: new Date(2024, 1, 20),
      endDate: new Date(2024, 1, 22),
      venue: 'City Park',
      demandMultiplier: 1.4,
      proximity: 1.5,
      relevanceScore: 0.78,
      historicalImpact: {
        occupancyUplift: 30,
        adrChange: 15
      }
    },
    {
      id: '3',
      title: 'Corporate Annual Meet',
      type: 'business',
      impact: 'high',
      attendees: 2500,
      description: 'Large corporate annual meeting',
      startDate: new Date(2024, 1, 12),
      endDate: new Date(2024, 1, 14),
      venue: 'Grand Hotel',
      demandMultiplier: 2.1,
      proximity: 0.5,
      relevanceScore: 0.92,
      historicalImpact: {
        occupancyUplift: 65,
        adrChange: 35
      }
    },
    {
      id: '4',
      title: 'Food & Wine Expo',
      type: 'exhibition',
      impact: 'medium',
      attendees: 600,
      description: 'Culinary exhibition and wine tasting',
      startDate: new Date(2024, 1, 18),
      endDate: new Date(2024, 1, 19),
      venue: 'Exhibition Hall',
      demandMultiplier: 1.3,
      proximity: 1.8,
      relevanceScore: 0.72,
      historicalImpact: {
        occupancyUplift: 25,
        adrChange: 18
      }
    },
    {
      id: '5',
      title: 'Marathon Championship',
      type: 'sports',
      impact: 'high',
      attendees: 5000,
      description: 'International marathon event',
      startDate: new Date(2024, 1, 25),
      endDate: new Date(2024, 1, 26),
      venue: 'City Center',
      demandMultiplier: 1.9,
      proximity: 1.2,
      relevanceScore: 0.88,
      historicalImpact: {
        occupancyUplift: 55,
        adrChange: 28
      }
    },
    {
      id: '6',
      title: 'Art Gallery Opening',
      type: 'exhibition',
      impact: 'low',
      attendees: 300,
      description: 'Contemporary art exhibition opening',
      startDate: new Date(2024, 1, 16),
      endDate: new Date(2024, 1, 17),
      venue: 'Art District',
      demandMultiplier: 1.1,
      proximity: 2.5,
      relevanceScore: 0.45,
      historicalImpact: {
        occupancyUplift: 15,
        adrChange: 8
      }
    },
    {
      id: '7',
      title: 'Holiday Weekend',
      type: 'holiday',
      impact: 'high',
      attendees: 0,
      description: 'National holiday weekend',
      startDate: new Date(2024, 1, 23),
      endDate: new Date(2024, 1, 25),
      venue: 'Citywide',
      demandMultiplier: 1.7,
      proximity: 0,
      relevanceScore: 0.95,
      historicalImpact: {
        occupancyUplift: 40,
        adrChange: 22
      }
    },
    {
      id: '8',
      title: 'Rock Concert',
      type: 'concert',
      impact: 'medium',
      attendees: 1500,
      description: 'Popular rock band concert',
      startDate: new Date(2024, 1, 21),
      endDate: new Date(2024, 1, 21),
      venue: 'Stadium',
      demandMultiplier: 1.5,
      proximity: 3.2,
      relevanceScore: 0.65,
      historicalImpact: {
        occupancyUplift: 35,
        adrChange: 20
      }
    }
  ];

  // Generate sample dates for calendar with proper event assignment
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i + dateOffset);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Assign events to dates based on event date ranges
      const events = sampleEvents.filter(event => {
        const eventStart = event.startDate;
        const eventEnd = event.endDate;
        return date >= eventStart && date <= eventEnd;
      });
      
      // Add some additional events for demonstration across more dates
      if (i === 3) events.push(sampleEvents[2]); // Corporate meeting
      if (i === 7) events.push(sampleEvents[0]); // Tech summit
      if (i === 10) events.push(sampleEvents[3]); // Food expo
      if (i === 12) events.push(sampleEvents[1]); // Music festival
      if (i === 6) events.push(sampleEvents[5]); // Art gallery
      if (i === 18) events.push(sampleEvents[4]); // Marathon
      if (i === 9) events.push(sampleEvents[7]); // Concert
      if (i === 15) events.push(sampleEvents[2]); // Another corporate event
      if (i === 20) events.push(sampleEvents[6]); // Holiday weekend
      
      dates.push({ date, dayName, dateStr, isWeekend, events });
    }
    return dates;
  };

  const dates = generateDates();

  // Enhanced Event Tooltip Component
  const EventTooltip = ({ event, position }: { event: Event; position: { x: number; y: number } }) => {
    // Enhanced positioning logic
    const calculateOptimalPosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 320; // tooltip max width
      const tooltipHeight = 280; // estimated height
      const spacing = 8; // consistent 8px spacing
      
      let x = position.x;
      let y = position.y;
      let placement = 'right';
      
      // Default to right placement with center alignment
      if (x + spacing + tooltipWidth <= viewportWidth - 20) {
        // Sufficient space on right
        x = x + spacing;
        placement = 'right';
      } else {
        // Flip to left
        x = x - spacing - tooltipWidth;
        placement = 'left';
        // Ensure it doesn't go off left edge
        if (x < 20) {
          x = 20;
          placement = 'top'; // fallback to top if needed
        }
      }
      
      // Center vertically relative to trigger
      y = y - (tooltipHeight / 2);
      
      // Ensure tooltip stays within viewport bounds
      if (y < 20) {
        y = 20;
      } else if (y + tooltipHeight > viewportHeight - 20) {
        y = viewportHeight - tooltipHeight - 20;
      }
      
      return { x, y, placement };
    };

    const { x, y, placement } = calculateOptimalPosition();
    
    return (
      <div 
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`
        }}
      >
        {/* Tooltip Arrow */}
        {placement === 'right' && (
          <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white dark:border-r-gray-800"></div>
          </div>
        )}
        {placement === 'left' && (
          <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-white dark:border-l-gray-800"></div>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            event.impact === 'high' ? 'bg-red-500' :
            event.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          }`} />
          <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{event.venue}</span>
          </div>
          {event.attendees && (
            <div className="flex items-center justify-center gap-2">
              <Users className="w-3 h-3" />
              <span>{event.attendees.toLocaleString()} attendees</span>
            </div>
          )}
          {event.historicalImpact && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="text-green-600 dark:text-green-400">
                📈 Occupancy: +{event.historicalImpact.occupancyUplift}%
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                💰 ADR: +{event.historicalImpact.adrChange}%
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced Rich Tooltip Component - Microsoft Word Style
  const RichTooltip = ({ tooltip }: { tooltip: typeof richTooltip }) => {
    if (!tooltip) return null;

    // Calculate position to keep tooltip within viewport
    const calculatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Dynamic tooltip width based on content type
      const getTooltipWidth = () => {
        switch (tooltip.type) {
          case 'inventory_analysis':
            return Math.min(420, viewportWidth * 0.9); // Max 420px or 90% viewport
          case 'competitor':
            return Math.min(350, viewportWidth * 0.85); // Max 350px or 85% viewport
          case 'ai':
            return Math.min(380, viewportWidth * 0.85); // Max 380px or 85% viewport
          case 'event':
            return Math.min(360, viewportWidth * 0.85); // Max 360px or 85% viewport
          default:
            return Math.min(320, viewportWidth * 0.8); // Default width
        }
      };
      
      const tooltipWidth = getTooltipWidth();
      const tooltipHeight = 450; // estimated height
      const spacing = 8; // consistent 8px spacing
      
      let x = tooltip.position.x;
      let y = tooltip.position.y;
      let placement = 'right';
      
      // Default to right placement with center alignment
      if (x + spacing + tooltipWidth <= viewportWidth - 20) {
        // Sufficient space on right
        x = x + spacing;
        placement = 'right';
      } else {
        // Flip to left
        x = x - spacing - tooltipWidth;
        placement = 'left';
        // Ensure it doesn't go off left edge
        if (x < 20) {
          x = 20;
          placement = 'top'; // fallback to top if needed
        }
      }
      
      // Center vertically relative to trigger
      y = y - (tooltipHeight / 2);
      
      // Ensure tooltip stays within viewport bounds
      if (y < 20) {
        y = 20;
      } else if (y + tooltipHeight > viewportHeight - 20) {
        y = viewportHeight - tooltipHeight - 20;
      }
      
      return { x, y, placement, width: tooltipWidth };
    };

    const position = calculatePosition();

    const renderTooltipContent = () => {
      if (!tooltip) return null;

      switch (tooltip.type) {
        case 'event':
          // Handle both data formats: direct array or object with events property
          const eventData = tooltip.data;
          const events = Array.isArray(eventData) ? eventData : (eventData?.events || []);
          
          return (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">Event Impact Analysis</h3>
                  <p className="text-xs text-gray-300">{Array.isArray(events) ? events.length : 0} event{(Array.isArray(events) && events.length !== 1) ? 's' : ''} detected</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                {Array.isArray(events) && events.length > 0 ? events.map((event, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-sm font-medium text-white mb-1 break-words">{event.title}</h4>
                        <p className="text-xs text-gray-300 break-words">{event.venue}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        event.impact === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' :
                        event.impact === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
                        'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      }`}>
                        {event.impact.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/5 rounded-md p-2">
                        <div className="text-gray-400 mb-1">Expected Attendees</div>
                        <div className="text-white font-semibold">{event.attendees?.toLocaleString() || 'N/A'}</div>
                      </div>
                      <div className="bg-white/5 rounded-md p-2">
                        <div className="text-gray-400 mb-1">Demand Multiplier</div>
                        <div className="text-emerald-400 font-semibold">{event.demandMultiplier}x</div>
                      </div>
                      <div className="bg-white/5 rounded-md p-2">
                        <div className="text-gray-400 mb-1">Proximity Impact</div>
                        <div className="text-blue-400 font-semibold">{(event.proximity * 100).toFixed(0)}%</div>
                      </div>
                      <div className="bg-white/5 rounded-md p-2">
                        <div className="text-gray-400 mb-1">Relevance Score</div>
                        <div className="text-purple-400 font-semibold">{(event.relevanceScore * 100).toFixed(0)}%</div>
                      </div>
                    </div>

                    {event.historicalImpact && (
                      <div className="mt-3 p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md border border-emerald-500/30">
                        <div className="text-xs font-medium text-emerald-300 mb-1">Historical Performance</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Occupancy Uplift:</span>
                          <span className="text-emerald-400 font-semibold">+{event.historicalImpact.occupancyUplift}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">ADR Change:</span>
                          <span className={`font-semibold ${event.historicalImpact.adrChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {event.historicalImpact.adrChange > 0 ? '+' : ''}{event.historicalImpact.adrChange}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
                    <div className="text-gray-400 text-sm">No events detected for this date</div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'ai':
          // Handle both data formats: direct array or object with insights property
          const aiData = tooltip.data;
          const aiInsights = Array.isArray(aiData) ? aiData : (aiData.insights || []);
          
          return (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">AI Revenue Insights</h3>
                  <p className="text-xs text-gray-300">Intelligent recommendations for optimization</p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-3">
                {Array.isArray(aiInsights) && aiInsights.length > 0 ? aiInsights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-sm font-medium text-white mb-1 break-words">{insight.title}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed break-words">{insight.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          insight.confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' :
                          insight.confidence >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :
                          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        }`}>
                          {insight.confidence}%
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          insight.impact === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          insight.impact === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                          insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {insight.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {insight.potentialRevenue && (
                      <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md p-2 mb-3 border border-emerald-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Revenue Potential:</span>
                          <span className="text-emerald-400 font-bold">+₹{insight.potentialRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    
                    {insight.suggestedAction && (
                      <div className="bg-blue-500/10 rounded-md p-2 border border-blue-500/20">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-blue-300 mb-1">Suggested Action</div>
                            <p className="text-xs text-gray-300 leading-relaxed break-words">{insight.suggestedAction}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
                    <div className="text-gray-400 text-sm">No AI insights available for this date</div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'competitor':
          const competitorData = tooltip.data;
          const currentPrice = competitorData.currentPrice || 0;
          return (
            <div className="space-y-3">
              {/* Compact Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/20">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-white">Competitor Analysis</h3>
                  <p className="text-xs text-gray-400">vs ₹{currentPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Compact Market Position */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Position:</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    competitorData.marketPosition === 'premium' ? 'bg-emerald-500/20 text-emerald-300' :
                    competitorData.marketPosition === 'competitive' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {competitorData.marketPosition === 'premium' ? '🏆 PREMIUM' :
                     competitorData.marketPosition === 'competitive' ? '⚡ COMPETITIVE' : '💰 VALUE'}
                  </span>
                </div>
                
                {/* Compact Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded p-1.5 text-center">
                    <div className="text-xs text-gray-400">Avg Rate</div>
                    <div className="text-cyan-400 font-semibold text-sm">₹{(competitorData.averageRate || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 rounded p-1.5 text-center">
                    <div className="text-xs text-gray-400">Advantage</div>
                    <div className={`font-semibold text-sm ${
                      (competitorData.priceAdvantage || 0) > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(competitorData.priceAdvantage || 0) > 0 ? '+' : ''}{competitorData.priceAdvantage || 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 3 Competitors Only */}
              {competitorData.competitors && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs font-medium text-cyan-300">Top Competitors</span>
                  </div>
                  
                  {competitorData.competitors.slice(0, 3).map((competitor: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            competitor.trend === 'up' ? 'bg-emerald-500' :
                            competitor.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-white text-xs font-medium truncate">{competitor.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-cyan-400 font-bold text-sm">₹{competitor.rate.toLocaleString()}</span>
                          <span className={`text-xs ${
                            competitor.rate > currentPrice ? 'text-red-400' : 
                            competitor.rate < currentPrice ? 'text-emerald-400' : 'text-yellow-400'
                          }`}>
                            {competitor.rate > currentPrice ? '+' : competitor.rate < currentPrice ? '-' : '='}
                            {Math.abs(competitor.rate - currentPrice)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 mt-1 text-xs">
                        <div className="text-center">
                          <div className={`font-medium ${competitor.availability > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {competitor.availability}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-medium">{competitor.distance}km</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-medium">{competitor.rating}★</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Compact Footer */}
              <div className="pt-2 border-t border-gray-200/20 text-center">
                <span className="text-xs text-gray-400">Updated 2m ago</span>
              </div>
            </div>
          );

        case 'inventory_analysis':
          const inventoryData = tooltip.data;
          const status = inventoryData.status as SmartInventoryStatus;
          return (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/20">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    status.level === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    status.level === 'low' ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                    status.level === 'optimal' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                    'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">Smart Inventory Analysis</h3>
                    <p className="text-xs text-gray-300">AI-powered inventory intelligence</p>
                  </div>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-medium flex-shrink-0 ${
                  status.level === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' :
                  status.level === 'low' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg hidden' :
                  status.level === 'optimal' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' :
                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                }`}>
                  {status.displayText}
                </span>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-1">Current Inventory</div>
                  <div className="text-white font-bold text-xl">{inventoryData.inventory}</div>
                  <div className="text-gray-500 text-xs truncate">{inventoryData.roomType}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-1">Confidence</div>
                  <div className="text-white font-bold text-xl">{status.confidence}%</div>
                  <div className={`text-xs font-medium ${
                    status.confidence >= 80 ? 'text-emerald-400' : 'text-yellow-400'
                  }`}>
                    {status.confidence >= 80 ? 'HIGH' : 'MEDIUM'}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-gray-400 text-xs mb-1">Urgency</div>
                  <div className={`font-bold text-xl ${
                    status.urgency === 'immediate' ? 'text-red-400' :
                    status.urgency === 'monitor' ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {status.urgency === 'immediate' ? '⚠️' : status.urgency === 'monitor' ? '👀' : '✅'}
                  </div>
                  <div className={`text-xs font-medium ${
                    status.urgency === 'immediate' ? 'text-red-400' :
                    status.urgency === 'monitor' ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {status.urgency.toUpperCase()}
                  </div>
                </div>
              </div>
              
              {/* Analysis Factors */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xs font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  Smart Analysis Factors
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Demand Pace:</span>
                    <span className={`font-medium ${
                      status.factors.demandPace > 0.7 ? 'text-emerald-400' :
                      status.factors.demandPace > 0.4 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {(status.factors.demandPace * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Competition:</span>
                    <span className={`font-medium ${
                      status.factors.competitorPosition === 'advantage' ? 'text-emerald-400' :
                      status.factors.competitorPosition === 'parity' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {status.factors.competitorPosition.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event Impact:</span>
                    <span className={`font-medium ${
                      status.factors.eventImpact === 'positive' ? 'text-emerald-400' :
                      status.factors.eventImpact === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {status.factors.eventImpact.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Season:</span>
                    <span className={`font-medium ${
                      status.factors.seasonalTrend === 'peak' ? 'text-emerald-400' :
                      status.factors.seasonalTrend === 'shoulder' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {status.factors.seasonalTrend.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {status.reasoning && status.reasoning.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    AI Recommendations
                  </div>
                  <div className="space-y-1">
                    {status.reasoning.slice(0, 2).map((reason, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-300 leading-relaxed">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Required */}
              {status.actionRequired && (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-orange-300 mb-1">Action Required</div>
                      <p className="text-xs text-gray-300 leading-relaxed">{status.actionRequired}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case 'general':
          const generalData = tooltip.data;
          if (generalData.type === 'restrictions') {
            return (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Active Restrictions</h3>
                    <p className="text-xs text-gray-300">{generalData.count} restriction{generalData.count !== 1 ? 's' : ''} applied</p>
                  </div>
                </div>

                {/* Restrictions List */}
                <div className="space-y-2">
                  {generalData.restrictions.slice(0, 3).map((restriction: any, index: number) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <span className="text-sm text-white font-medium">{restriction}</span>
                          <div className="text-xs text-gray-400 mt-1">Active restriction policy</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          if (generalData.type === 'monthly_calendar') {
            return (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {new Date(generalData.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {generalData.roomType} • {generalData.ratePlan}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-gray-300">Inventory</span>
                    </div>
                    <div className={`text-lg font-bold ${
                      generalData.inventory < 20 ? 'text-red-400' :
                      generalData.inventory < 40 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {generalData.inventory}
                    </div>
                    <div className="text-xs text-gray-400">rooms available</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-gray-300">Rate</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-400">
                      ₹{generalData.rate.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">per night</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-gray-300">Occupancy</span>
                    </div>
                    <div className={`text-lg font-bold ${
                      generalData.occupancyLevel > 80 ? 'text-red-400' :
                      generalData.occupancyLevel > 60 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {generalData.occupancyLevel}%
                    </div>
                    <div className="text-xs text-gray-400">projected</div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium text-gray-300">Revenue</span>
                    </div>
                    <div className="text-lg font-bold text-orange-400">
                      ₹{generalData.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">estimated</div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                  {generalData.isWeekend && (
                    <div className="flex items-center gap-2 bg-blue-500/20 rounded-lg p-2 border border-blue-500/30">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs text-blue-300 font-medium">Weekend Premium</span>
                    </div>
                  )}
                  
                  {generalData.restrictions.length > 0 && (
                    <div className="flex items-center gap-2 bg-orange-500/20 rounded-lg p-2 border border-orange-500/30">
                      <Lock className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-orange-300 font-medium">
                        {generalData.restrictions.length} restriction{generalData.restrictions.length !== 1 ? 's' : ''}
                      </span>
                      <div className="text-xs text-gray-400">
                        ({generalData.restrictions.join(', ')})
                      </div>
                    </div>
                  )}
                  
                  {generalData.hasEvent && (
                    <div className="flex items-center gap-2 bg-purple-500/20 rounded-lg p-2 border border-purple-500/30">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-xs text-purple-300 font-medium">Event Impact</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-700/50">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors font-medium">
                    Edit Rate
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors font-medium">
                    Update Inventory
                  </button>
                </div>
              </div>
            );
          }
          break;

        default:
          return null;
      }
    };

    return (
      <div 
        className="fixed z-[1000] pointer-events-auto"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {/* Tooltip Container with Word-like styling */}
        <div className="relative">
          {/* Main Tooltip */}
          <div 
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 p-4 transform transition-all duration-300 ease-out word-tooltip relative overflow-hidden"
            style={{ width: `${position.width}px` }}
          >
            <div className="relative">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none"></div>
              
              {/* Content */}
              <div className="relative">
                {renderTooltipContent()}
              </div>
            </div>
            
            {/* Enhanced Arrow - positioned based on placement */}
            {position.placement === 'right' && (
              <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-gray-800 filter drop-shadow-lg"></div>
              </div>
            )}
            {position.placement === 'left' && (
              <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-gray-800 filter drop-shadow-lg"></div>
              </div>
            )}
            {position.placement === 'top' && (
              <div className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-800 filter drop-shadow-lg"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Sample room types and products
  const sampleRoomTypes: RoomType[] = useMemo(() => [
    {
      id: '1',
      name: 'Standard Room',
      category: 'Standard',
      isExpanded: true,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 35 - (i % 10), // Deterministic pattern instead of random
        isActive: true,
        restrictions: i % 8 === 0 ? ['Maintenance block'] : i % 12 === 0 ? ['Hold for walk-ins'] : []
      })),
      products: [
        {
          id: 'p1',
          name: 'Best Available Rate',
          type: 'BAR',
          description: 'Flexible rate with free cancellation',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 6500 + (i * 100) + (dates[i]?.isWeekend ? 800 : 0), // Deterministic pricing
            restrictions: [],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: i === 5 ? [sampleInsights[0]] : [],
            riskLevel: 'low' as const,
            confidenceScore: 88,
            isActive: true,
            competitorIndicator: (i % 3 === 0) ? 'competitive' : 'higher',
            eventImpact: i === 5 ? sampleEvents[0] : undefined,
            competitorData: {
              competitors: [
                { name: 'Grand Plaza Hotel', rate: 6200 + (i * 95), availability: 65 + (i % 20), distance: 0.8, rating: 4.2, trend: i % 3 === 0 ? 'up' : 'stable' },
                { name: 'City Center Inn', rate: 5900 + (i * 85), availability: 78 + (i % 15), distance: 1.2, rating: 3.9, trend: 'down' },
                { name: 'Business Hotel', rate: 6800 + (i * 110), availability: 45 + (i % 25), distance: 0.6, rating: 4.0, trend: 'stable' },
                { name: 'Luxury Suites', rate: 7200 + (i * 120), availability: 30 + (i % 30), distance: 1.5, rating: 4.5, trend: 'up' }
              ],
              marketPosition: 'competitive' as const,
              averageRate: Math.round((6200 + 5900 + 6800 + 7200) / 4 + (i * (95 + 85 + 110 + 120) / 4)),
              priceAdvantage: Math.round(((6500 + (i * 100) + (dates[i]?.isWeekend ? 800 : 0)) - ((6200 + 5900 + 6800 + 7200) / 4 + (i * (95 + 85 + 110 + 120) / 4))) / ((6200 + 5900 + 6800 + 7200) / 4 + (i * (95 + 85 + 110 + 120) / 4)) * 100),
              marketShare: 23 + (i % 8)
            },
          }))
        },
        {
          id: 'p2',
          name: 'Advance Purchase',
          type: 'ADV',
          description: 'Non-refundable advance booking discount',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 5800 + (i * 80) + (dates[i]?.isWeekend ? 600 : 0),
            restrictions: ['Non-refundable', '7-day advance booking'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 92,
            isActive: true,
            competitorIndicator: (i % 4 === 0) ? 'higher' : (i % 4 === 1) ? 'competitive' : 'lower',
            competitorData: {
              competitors: [
                { name: 'Grand Plaza Hotel', rate: 5500 + (i * 75), availability: 60 + (i % 25), distance: 0.8, rating: 4.2, trend: i % 3 === 0 ? 'up' : 'stable' },
                { name: 'City Center Inn', rate: 5200 + (i * 70), availability: 80 + (i % 15), distance: 1.2, rating: 3.9, trend: 'down' },
                { name: 'Business Hotel', rate: 6000 + (i * 85), availability: 50 + (i % 20), distance: 0.6, rating: 4.0, trend: 'stable' },
                { name: 'Luxury Suites', rate: 6400 + (i * 95), availability: 35 + (i % 25), distance: 1.5, rating: 4.5, trend: 'up' }
              ],
              marketPosition: (i % 3 === 0) ? 'premium' : (i % 3 === 1) ? 'competitive' : 'value',
              averageRate: Math.round((5500 + 5200 + 6000 + 6400) / 4 + (i * (75 + 70 + 85 + 95) / 4)),
              priceAdvantage: Math.round(((5800 + (i * 80) + (dates[i]?.isWeekend ? 600 : 0)) - ((5500 + 5200 + 6000 + 6400) / 4 + (i * (75 + 70 + 85 + 95) / 4))) / ((5500 + 5200 + 6000 + 6400) / 4 + (i * (75 + 70 + 85 + 95) / 4)) * 100),
              marketShare: 20 + (i % 12)
            }
          }))
        },
        {
          id: 'p3',
          name: 'Corporate Rate',
          type: 'CORP',
          description: 'Special rate for corporate clients',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 6200 + (i * 90) + (dates[i]?.isWeekend ? 500 : 0),
            restrictions: ['Corporate ID required', 'Business purpose only'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 85,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        }
      ]
    },
    {
      id: '2',
      name: 'Deluxe Room',
      category: 'Standard',
      isExpanded: true,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 25 - (i % 8), // Deterministic pattern instead of random
        isActive: true,
        restrictions: i % 6 === 0 ? ['Overbooking not allowed'] : i % 9 === 0 ? ['Hold for VIP guests', 'No walk-ins'] : []
      })),
      products: [
        {
          id: 'p4',
          name: 'Best Available Rate',
          type: 'BAR',
          description: 'Flexible rate with free cancellation',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 8500 + (i * 150) + (dates[i]?.isWeekend ? 1000 : 0), // Deterministic pricing
            restrictions: [],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: i === 7 ? [sampleInsights[0]] : [],
            riskLevel: 'low' as const,
            confidenceScore: 85,
            isActive: true,
            competitorIndicator: (i % 3 === 0) ? 'competitive' : 'higher', // Deterministic pattern
            eventImpact: i === 7 ? sampleEvents[0] : undefined,
            competitorData: {
              competitors: [
                { name: 'Grand Plaza Hotel', rate: 8200 + (i * 140), availability: 65 + (i % 20), distance: 0.8, rating: 4.2, trend: i % 3 === 0 ? 'up' : 'stable' },
                { name: 'City Center Inn', rate: 7800 + (i * 130), availability: 78 + (i % 15), distance: 1.2, rating: 3.9, trend: 'down' },
                { name: 'Business Hotel', rate: 9000 + (i * 160), availability: 45 + (i % 25), distance: 0.6, rating: 4.0, trend: 'stable' },
                { name: 'Luxury Suites', rate: 9500 + (i * 180), availability: 30 + (i % 30), distance: 1.5, rating: 4.5, trend: 'up' }
              ],
              marketPosition: 'competitive' as const,
              averageRate: Math.round((8200 + 7800 + 9000 + 9500) / 4 + (i * (140 + 130 + 160 + 180) / 4)),
              priceAdvantage: Math.round(((8500 + (i * 150) + (dates[i]?.isWeekend ? 1000 : 0)) - (8200 + 7800 + 9000 + 9500) / 4) / ((8200 + 7800 + 9000 + 9500) / 4) * 100),
              marketShare: 23 + (i % 8)
            },
          }))
        },
        {
          id: 'p5',
          name: 'Advance Purchase',
          type: 'ADV',
          description: 'Non-refundable advance booking',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 7500 + (i * 100) + (dates[i]?.isWeekend ? 800 : 0), // Deterministic pricing
            restrictions: ['Non-refundable'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 90,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        },
        {
          id: 'p6',
          name: 'Package Deal',
          type: 'PKG',
          description: 'Includes breakfast and WiFi',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 9200 + (i * 120) + (dates[i]?.isWeekend ? 1200 : 0),
            restrictions: ['Package includes breakfast', 'Minimum 2 nights'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'medium' as const,
            confidenceScore: 82,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        }
      ]
    },
    {
      id: '3',
      name: 'Premium Room',
      category: 'Premium',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 18 - (i % 6), // Deterministic pattern
        isActive: true,
        restrictions: i % 7 === 0 ? ['Premium service required'] : i % 11 === 0 ? ['Executive floor access'] : []
      })),
      products: [
        {
          id: 'p7',
          name: 'Premium Rate',
          type: 'PREM',
          description: 'Enhanced room with premium amenities',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 12000 + (i * 180) + (dates[i]?.isWeekend ? 1500 : 0),
            restrictions: i % 5 === 0 ? ['Executive lounge access included'] : [],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: i === 10 ? [sampleInsights[1]] : [],
            riskLevel: 'medium' as const,
            confidenceScore: 79,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        },
        {
          id: 'p8',
          name: 'Corporate Premium',
          type: 'CORP',
          description: 'Corporate rate for premium rooms',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 11200 + (i * 160) + (dates[i]?.isWeekend ? 1200 : 0),
            restrictions: ['Corporate agreement required', 'Business center access'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 87,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        }
      ]
    },
    {
      id: '4',
      name: 'Executive Room',
      category: 'Premium',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 12 - (i % 5), // Deterministic pattern
        isActive: true,
        restrictions: i % 9 === 0 ? ['Executive benefits included'] : i % 6 === 0 ? ['Concierge service'] : []
      })),
      products: [
        {
          id: 'p9',
          name: 'Executive Rate',
          type: 'EXEC',
          description: 'Executive floor with lounge access',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 14500 + (i * 200) + (dates[i]?.isWeekend ? 1800 : 0),
            restrictions: ['Executive lounge access', 'Late checkout included'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'medium' as const,
            confidenceScore: 83,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        },
        {
          id: 'p10',
          name: 'Business Package',
          type: 'BIZ',
          description: 'Executive room with business amenities',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 15200 + (i * 180) + (dates[i]?.isWeekend ? 1600 : 0),
            restrictions: ['Meeting room access', 'Business center included'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'medium' as const,
            confidenceScore: 81,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        }
      ]
    },
    {
      id: '5',
      name: 'Family Room',
      category: 'Specialty',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 15 - (i % 7), // Deterministic pattern
        isActive: true,
        restrictions: i % 8 === 0 ? ['Child-friendly amenities'] : i % 10 === 0 ? ['Connecting rooms available'] : []
      })),
      products: [
        {
          id: 'p11',
          name: 'Family Rate',
          type: 'FAM',
          description: 'Spacious room perfect for families',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 10500 + (i * 140) + (dates[i]?.isWeekend ? 1300 : 0),
            restrictions: ['Up to 4 guests', 'Child amenities included'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 86,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        },
        {
          id: 'p12',
          name: 'Kids Stay Free',
          type: 'KIDS',
          description: 'Children under 12 stay free',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 11200 + (i * 160) + (dates[i]?.isWeekend ? 1400 : 0),
            restrictions: ['Kids under 12 free', 'Maximum 2 children'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'low' as const,
            confidenceScore: 88,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        }
      ]
    },
    {
      id: '6',
      name: 'Junior Suite',
      category: 'Suite',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 10 - (i % 4), // Deterministic pattern
        isActive: true,
        restrictions: i % 8 === 0 ? ['Suite amenities included'] : i % 5 === 0 ? ['Minimum 2 nights on weekends'] : []
      })),
      products: [
        {
          id: 'p13',
          name: 'Junior Suite Rate',
          type: 'JSUITE',
          description: 'Compact suite with separate living area',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 16500 + (i * 220) + (dates[i]?.isWeekend ? 2000 : 0),
            restrictions: i % 6 === 0 ? ['Living area included', 'Premium amenities'] : [],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'medium' as const,
            confidenceScore: 80,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        }
      ]
    },
    {
      id: '7',
      name: 'Suite',
      category: 'Suite',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 8 - (i % 4), // Deterministic pattern
        isActive: true,
        restrictions: i % 8 === 0 ? ['Premium guests only'] : i % 5 === 0 ? ['Minimum 2 nights'] : []
      })),
      products: [
        {
          id: 'p14',
          name: 'Suite Rate',
          type: 'SUITE',
          description: 'Luxury suite experience',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 22000 + (i * 300) + (dates[i]?.isWeekend ? 2500 : 0), // Deterministic pricing
            restrictions: i % 7 === 0 ? ['Minimum 2 nights', 'No group bookings'] : i % 5 === 0 ? ['Advance purchase required'] : [],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: i === 12 ? [sampleInsights[2]] : [],
            riskLevel: 'medium' as const,
            confidenceScore: 78,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        },
        {
          id: 'p15',
          name: 'Group Rate',
          type: 'GRP',
          description: 'Special rate for group bookings',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 19500 + (i * 250) + (dates[i]?.isWeekend ? 2000 : 0),
            restrictions: ['Minimum 5 rooms', 'Group contract required'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'high' as const,
            confidenceScore: 75,
            isActive: true,
            competitorIndicator: 'competitive'
          }))
        }
      ]
    },
    {
      id: '8',
      name: 'Presidential Suite',
      category: 'Luxury',
      isExpanded: false,
      inventoryData: Array.from({ length: 21 }, (_, i) => ({
        inventory: 2 - (i % 2), // Very limited inventory
        isActive: true,
        restrictions: i % 3 === 0 ? ['VIP approval required'] : i % 4 === 0 ? ['Butler service included'] : []
      })),
      products: [
        {
          id: 'p16',
          name: 'Presidential Rate',
          type: 'PRES',
          description: 'Ultimate luxury experience',
          data: Array.from({ length: 21 }, (_, i) => ({
            rate: 45000 + (i * 500) + (dates[i]?.isWeekend ? 5000 : 0),
            restrictions: ['VIP services included', 'Minimum 3 nights', 'Personal butler'],
            isWeekend: dates[i]?.isWeekend || false,
            aiInsights: [],
            riskLevel: 'high' as const,
            confidenceScore: 70,
            isActive: true,
            competitorIndicator: 'higher'
          }))
        }
      ]
    }
  ], [dates, sampleInsights, sampleEvents]);

  // Initialize roomTypes state from sampleRoomTypes only once when component mounts
  useEffect(() => {
    console.log('🔄 Initializing roomTypes with sampleRoomTypes');
    setRoomTypes(sampleRoomTypes);
  }, []); // Empty dependency array - only run once on mount

  // Event Handlers
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
  };

  const navigateDates = (direction: 'prev' | 'next') => {
    setDateOffset(prev => prev + (direction === 'next' ? 7 : -7));
  };

  const toggleRoomExpansion = (roomId: string) => {
    setRoomTypes((prev: RoomType[]) => 
      prev.map((room: RoomType) => 
        room.id === roomId 
          ? { ...room, isExpanded: !room.isExpanded }
          : room
      )
    );
  };

  const handleCellClick = (roomName: string, productName: string, price: number, dateIndex: number) => {
    if (inlineEdit) return; // Don't open modal if inline editing
    
    // Delay single click to allow for double-click detection
    const timeout = setTimeout(() => {
      setSelectedProduct({ room: roomName, product: productName, price });
      setIsPriceModalOpen(true);
    }, 200);
    
    setClickTimeout(timeout);
  };

  const handleCellDoubleClick = (roomId: string, productId: string, dateIndex: number, currentValue: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the single-click timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    
    startInlineEdit('price', roomId, productId, dateIndex, currentValue, e);
  };

  const handleInventoryClick = (roomName: string, currentInventory: number, dateIndex: number) => {
    if (inlineEdit) return; // Don't open modal if inline editing
    
    // Delay single click to allow for double-click detection
    const timeout = setTimeout(() => {
      setSelectedInventory({ room: roomName, inventory: currentInventory, dateIndex });
      setIsInventoryModalOpen(true);
    }, 200);
    
    setClickTimeout(timeout);
  };

  const handleInventoryDoubleClick = (roomId: string, dateIndex: number, currentValue: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the single-click timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    
    startInlineEdit('inventory', roomId, undefined, dateIndex, currentValue, e);
  };

  // Event Logging Functions
  const logEvent = (eventData: Omit<EventLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'ipAddress'>) => {
    const newEvent: EventLog = {
      ...eventData,
      id: Date.now().toString(),
      timestamp: new Date(),
      userId: 'user_001',
      userName: 'Revenue Manager',
      ipAddress: '192.168.1.100'
    };
    
    setEventLogs(prev => [newEvent, ...prev]);
    console.log('Event logged:', newEvent);
  };

  const handlePriceSave = (newPrice: number) => {
    // Create change record for publishing
    if (selectedProduct && newPrice !== selectedProduct.price) {
      const change = {
        id: Date.now().toString(),
        type: 'price' as const,
        room: selectedProduct.room,
        product: selectedProduct.product,
        date: dates.find((_, index) => index === 0)?.dateStr || '', // This should be updated to get the correct date
        oldValue: selectedProduct.price,
        newValue: newPrice,
        timestamp: new Date()
      };
      setChanges(prev => [...prev, change]);
    }

    // Log the price change
    logEvent({
      eventType: 'price_update',
      roomType: selectedProduct?.room,
      ratePlan: selectedProduct?.product,
      oldValue: selectedProduct?.price,
      newValue: newPrice,
      changeAmount: newPrice - (selectedProduct?.price || 0),
      changePercentage: selectedProduct?.price ? ((newPrice - selectedProduct.price) / selectedProduct.price) * 100 : 0,
      source: 'manual',
      severity: Math.abs(newPrice - (selectedProduct?.price || 0)) > 1000 ? 'high' : 'medium',
      category: 'pricing',
      description: `Updated ${selectedProduct?.room} ${selectedProduct?.product} rate from ₹${selectedProduct?.price} to ₹${newPrice}`
    });

    setSelectedProduct(null);
    setIsPriceModalOpen(false);
    console.log('Saving new price:', newPrice);
  };

  const handleInventorySave = (newInventory: number) => {
    // Clear cache for the changed inventory
    if (selectedInventory) {
      const cacheKey = `${selectedInventory.room}-${dates[selectedInventory.dateIndex]?.dateStr}-${selectedInventory.inventory}`;
      inventoryStatusCache.current.delete(cacheKey);
    }
    
    // Create change record for publishing
    if (selectedInventory && newInventory !== selectedInventory.inventory) {
      const change = {
        id: Date.now().toString(),
        type: 'inventory' as const,
        room: selectedInventory.room,
        date: dates[selectedInventory.dateIndex]?.dateStr || '',
        oldValue: selectedInventory.inventory,
        newValue: newInventory,
        timestamp: new Date()
      };
      setChanges(prev => [...prev, change]);
    }
    
    setRoomTypes(prev => 
      prev.map(roomType => {
        if (roomType.name === selectedInventory?.room) {
          const updatedInventoryData = [...roomType.inventoryData];
          const dateIndex = selectedInventory?.dateIndex;
          if (dateIndex !== undefined && updatedInventoryData[dateIndex]) {
            updatedInventoryData[dateIndex] = {
              ...updatedInventoryData[dateIndex],
              inventory: newInventory,
              originalInventory: updatedInventoryData[dateIndex].originalInventory || updatedInventoryData[dateIndex].inventory,
              isChanged: newInventory !== (updatedInventoryData[dateIndex].originalInventory || updatedInventoryData[dateIndex].inventory),
              lastModified: new Date()
            };
          }
          return { ...roomType, inventoryData: updatedInventoryData };
        }
        return roomType;
      })
    );

    // Log the inventory change
    logEvent({
      eventType: 'inventory_update',
      roomType: selectedInventory?.room,
      dateAffected: dates[selectedInventory?.dateIndex || 0]?.dateStr,
      oldValue: selectedInventory?.inventory,
      newValue: newInventory,
      changeAmount: newInventory - (selectedInventory?.inventory || 0),
      changePercentage: selectedInventory?.inventory ? ((newInventory - selectedInventory.inventory) / selectedInventory.inventory) * 100 : 0,
      source: 'manual',
      severity: Math.abs(newInventory - (selectedInventory?.inventory || 0)) > 10 ? 'high' : 'medium',
      category: 'inventory',
      description: `Updated ${selectedInventory?.room} inventory from ${selectedInventory?.inventory} to ${newInventory} rooms`
    });

    setSelectedInventory(null);
    setIsInventoryModalOpen(false);
  };

  const publishChanges = () => {
    if (changes.length === 0) return;
    
    // Show the detailed confirmation modal
    setShowPublishConfirmation(true);
  };

  const handlePublishConfirmed = () => {
    console.log('Publishing changes:', changes);
    setShowPublishConfirmation(false);
    setShowChangesSummary(true);
    
    // In real app, this would send changes to backend
    setTimeout(() => {
      setChanges([]);
      setShowChangesSummary(false);
      alert(`Successfully published ${changes.length} changes!`);
    }, 2000);
  };

  const handleApplyInsight = (insight: AIInsight) => {
    console.log('Applying insight:', insight);
  };

  const handleDismissInsight = (insight: AIInsight) => {
    console.log('Dismissing insight:', insight);
  };


  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event);
  };

  const handleEventHover = (event: Event, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  const handleTooltipShow = (content: string, e: React.MouseEvent) => {
    // Get the trigger element's bounding rect for better positioning
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    setHoveredTooltip({
      content,
      position: { 
        x: rect.right, // Start from right edge of trigger
        y: rect.top + (rect.height / 2) // Center vertically on trigger
      }
    });
  };

  const handleTooltipHide = () => {
    setHoveredTooltip(null);
  };

  // Rich Tooltip Handlers
  const showRichTooltip = (type: 'event' | 'ai' | 'competitor' | 'general' | 'inventory_analysis', data: any, e: React.MouseEvent) => {
    // Clear any existing hide timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    // Get the trigger element's bounding rect for better positioning
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Add a small delay before showing to prevent rapid show/hide
    const showTimeout = setTimeout(() => {
      setRichTooltip({
        type,
        data,
        position: { 
          x: rect.right, // Start from right edge of trigger 
          y: rect.top + (rect.height / 2) // Center vertically on trigger
        }
      });
    }, 150); // 150ms delay before showing
    
    setTooltipTimeout(showTimeout);
  };

  const hideRichTooltip = () => {
    // Clear any existing show timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    // Add a longer delay before hiding to prevent flickering
    const hideTimeout = setTimeout(() => {
      setRichTooltip(null);
    }, 300); // 300ms delay before hiding
    
    setTooltipTimeout(hideTimeout);
  };

  // Keep tooltip visible when hovering over the tooltip itself
  const handleTooltipMouseEnter = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
  };

  const handleTooltipMouseLeave = () => {
    hideRichTooltip();
  };

  // Inline Editing Handlers
  const startInlineEdit = (type: 'price' | 'inventory', roomId: string, productId: string | undefined, dateIndex: number, currentValue: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    setInlineEdit({
      type,
      roomId,
      productId,
      dateIndex,
      value: currentValue.toString(),
      originalValue: currentValue
    });
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  const saveInlineEdit = () => {
    if (!inlineEdit) return;
    
    const newValue = Number(inlineEdit.value);
    if (isNaN(newValue) || newValue < 0 || (inlineEdit.type === 'inventory' && newValue > 999) || (inlineEdit.type === 'price' && newValue > 999999)) {
      // Invalid value, cancel edit
      cancelInlineEdit();
      return;
    }

    if (newValue !== inlineEdit.originalValue) {
      // Create change record
      const change = {
        id: Date.now().toString(),
        type: inlineEdit.type,
        room: sampleRoomTypes.find(r => r.id === inlineEdit.roomId)?.name || '',
        product: inlineEdit.productId ? sampleRoomTypes.find(r => r.id === inlineEdit.roomId)?.products.find(p => p.id === inlineEdit.productId)?.name : undefined,
        date: dates[inlineEdit.dateIndex]?.dateStr || '',
        oldValue: inlineEdit.originalValue,
        newValue: newValue,
        timestamp: new Date()
      };
      setChanges(prev => [...prev, change]);
      
      // Update the data (in real app, this would update the state/database)
      console.log(`Inline ${inlineEdit.type} update:`, change);
    }
    
    setInlineEdit(null);
  };

  const cancelInlineEdit = () => {
    setInlineEdit(null);
  };

  // Focus inline input when edit starts
  useEffect(() => {
    if (inlineEdit && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [inlineEdit]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel any inline edit
      if (e.key === 'Escape' && inlineEdit) {
        cancelInlineEdit();
      }
      
      // Escape to close rich tooltips
      if (e.key === 'Escape' && richTooltip) {
        hideRichTooltip();
      }
      
      // Ctrl/Cmd + S to save changes
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && changes.length > 0) {
        e.preventDefault();
        publishChanges();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inlineEdit, richTooltip, changes.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [clickTimeout, tooltipTimeout]);

  const pendingInsightsCount = sampleInsights.filter(i => i.status === 'pending').length;

  // Helper function to get restriction descriptions
  const getRestrictionDescription = (restriction: string): string => {
    const descriptions: { [key: string]: string } = {
      'Non-refundable': 'Booking cannot be cancelled or refunded once confirmed',
      'Minimum 2 nights': 'Guest must book at least 2 consecutive nights',
      'Minimum 3 nights': 'Guest must book at least 3 consecutive nights',
      'No group bookings': 'Not available for group reservations (8+ rooms)',
      'Advance purchase required': 'Must be booked at least 7 days in advance',
      'No modifications': 'Booking dates and details cannot be changed',
      'Weekend only': 'Only available for weekend stays (Fri-Sun)',
      'Corporate rate': 'Available only for corporate clients',
      'Member rate': 'Exclusive rate for loyalty program members',
      'Package rate': 'Includes additional services (meals, spa, etc.)',
      'Closed to arrival': 'Check-in not permitted on this date',
      'Closed to departure': 'Check-out not permitted on this date',
      'Minimum age 21': 'Primary guest must be at least 21 years old'
    };
    
    return descriptions[restriction] || 'Special booking conditions apply';
  };

  // Filter and Export Handlers
  const applyFilters = (roomTypes: RoomType[]) => {
    return roomTypes.filter(roomType => {
      // Room type filter
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(roomType.name)) {
        return false;
      }
      
      // Check if any products match the filters
      const hasMatchingProducts = roomType.products.some(product => {
        // Product type filter
        if (filters.productTypes.length > 0 && !filters.productTypes.includes(product.type)) {
          return false;
        }
        
        // Check if any data points match
        return product.data.some(data => {
          // Price range filter
          if (data.rate < filters.priceRange.min || data.rate > filters.priceRange.max) {
            return false;
          }
          
          // Risk level filter
          if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(data.riskLevel)) {
            return false;
          }
          
          // Competitor position filter
          if (filters.competitorPosition.length > 0 && data.competitorIndicator && 
              !filters.competitorPosition.includes(data.competitorIndicator)) {
            return false;
          }
          
          // Confidence range filter
          if (data.confidenceScore < filters.confidenceRange.min || 
              data.confidenceScore > filters.confidenceRange.max) {
            return false;
          }
          
          // Restrictions filter
          if (filters.hasRestrictions && (!data.restrictions || data.restrictions.length === 0)) {
            return false;
          }
          
          // AI insights filter
          if (filters.hasAIInsights && data.aiInsights.length === 0) {
            return false;
          }
          
          return true;
        });
      });
      
      // Inventory restrictions filter
      if (filters.hasRestrictions) {
        const hasInventoryRestrictions = roomType.inventoryData.some(inv => 
          inv.restrictions && inv.restrictions.length > 0
        );
        if (!hasInventoryRestrictions && !hasMatchingProducts) {
          return false;
        }
      }
      
      return hasMatchingProducts;
    });
  };

  const handleExport = () => {
    const dataToExport = {
      roomTypes: applyFilters(roomTypes),
      dates: dates,
      filters: filters,
      exportOptions: exportOptions,
      timestamp: new Date().toISOString()
    };
    
    console.log('Exporting data:', dataToExport);
    
    // In a real app, this would trigger the actual export
    switch (exportOptions.format) {
      case 'excel':
        console.log('Exporting to Excel...');
        break;
      case 'csv':
        console.log('Exporting to CSV...');
        break;
      case 'pdf':
        console.log('Exporting to PDF...');
        break;
    }
    
    setIsExportOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      roomTypes: [],
      productTypes: [],
      priceRange: { min: 0, max: 50000 },
      dateRange: { start: '', end: '' },
      hasRestrictions: false,
      hasAIInsights: false,
      hasEvents: false,
      riskLevel: [],
      competitorPosition: [],
      confidenceRange: { min: 0, max: 100 }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.roomTypes.length > 0) count++;
    if (filters.productTypes.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.hasRestrictions) count++;
    if (filters.hasAIInsights) count++;
    if (filters.hasEvents) count++;
    if (filters.riskLevel.length > 0) count++;
    if (filters.competitorPosition.length > 0) count++;
    if (filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) count++;
    return count;
  };

  // Apply filters to room types
  const filteredRoomTypes = applyFilters(roomTypes);

  // Helper Functions for Restrictions
  const getApplicableRestrictions = (roomTypeName: string, productType: string, dateStr: string) => {
    return bulkRestrictions.filter(restriction => {
      if (restriction.status !== 'active') return false;
      
      // Check date range
      const restrictionStart = new Date(restriction.dateRange.start);
      const restrictionEnd = new Date(restriction.dateRange.end);
      const currentDate = new Date(dateStr);
      
      if (currentDate < restrictionStart || currentDate > restrictionEnd) return false;
      
      // Check room type
      if (restriction.targets.roomTypes.length > 0 && 
          !restriction.targets.roomTypes.includes(roomTypeName)) return false;
      
      // Check rate plan
      if (restriction.targets.ratePlans.length > 0 && 
          !restriction.targets.ratePlans.includes(productType)) return false;
      
      return true;
    });
  };

  const isCloseoutApplied = (roomTypeName: string, productType: string, dateStr: string) => {
    const restrictions = getApplicableRestrictions(roomTypeName, productType, dateStr);
    return restrictions.some(r => 
      r.restrictionType.id === 'closeout' || 
      r.restrictionType.id === 'ctd' || 
      r.restrictionType.id === 'no_arrival'
    );
  };

  const getHighestPriorityRestriction = (roomTypeName: string, productType: string, dateStr: string) => {
    const restrictions = getApplicableRestrictions(roomTypeName, productType, dateStr);
    if (restrictions.length === 0) return null;
    
    return restrictions.reduce((highest, current) => 
      current.restrictionType.priority > highest.restrictionType.priority ? current : highest
    );
  };

  const getCellRestrictionClasses = (roomTypeName: string, productType: string, dateStr: string) => {
    const highestRestriction = getHighestPriorityRestriction(roomTypeName, productType, dateStr);
    if (!highestRestriction) return '';
    
    const restrictionType = highestRestriction.restrictionType;
    
    // Closeout gets special highlighting
    if (restrictionType.id === 'closeout' || restrictionType.id === 'ctd' || restrictionType.id === 'no_arrival') {
      return 'closeout-cell bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100';
    }
    
    // Other restrictions get colored borders
    return `restriction-cell border-${restrictionType.color}-300 dark:border-${restrictionType.color}-700 bg-${restrictionType.color}-50 dark:bg-${restrictionType.color}-900/20`;
  };

  const getRestrictionTooltipData = (roomTypeName: string, productType: string, dateStr: string) => {
    const restrictions = getApplicableRestrictions(roomTypeName, productType, dateStr);
    if (restrictions.length === 0) return null;
    
    return {
      type: 'restrictions' as const,
      restrictions: restrictions.map(r => ({
        name: r.restrictionType.name,
        code: r.restrictionType.code,
        description: r.restrictionType.description,
        value: r.value,
        notes: r.notes
      })),
      count: restrictions.length
    };
  };

  // Filter Panel Component
  const FilterPanel = () => {
    if (!isFiltersOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Advanced Filters</h2>
                <p className="text-blue-100 mt-1">Customize your data view with precision filters</p>
              </div>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Room Types */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Room Types
                </label>
                <div className="space-y-2">
                  {['Deluxe Room', 'Suite'].map((roomType) => (
                    <label key={roomType} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.roomTypes.includes(roomType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, roomTypes: [...prev.roomTypes, roomType] }));
                          } else {
                            setFilters(prev => ({ ...prev, roomTypes: prev.roomTypes.filter(t => t !== roomType) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{roomType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Rate Plans
                </label>
                <div className="space-y-2">
                  {['BAR', 'ADV', 'SUITE'].map((productType) => (
                    <label key={productType} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.productTypes.includes(productType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, productTypes: [...prev.productTypes, productType] }));
                          } else {
                            setFilters(prev => ({ ...prev, productTypes: prev.productTypes.filter(t => t !== productType) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{productType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Price Range (₹)
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Risk Level
                </label>
                <div className="space-y-2">
                  {['low', 'medium', 'high'].map((risk) => (
                    <label key={risk} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
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
                        risk === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {risk} Risk
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Competitor Position */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Market Position
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'higher', label: 'Above Market', icon: ArrowUp, color: 'text-green-600 dark:text-green-400' },
                    { value: 'competitive', label: 'Competitive', icon: null, color: 'text-yellow-600 dark:text-yellow-400' },
                    { value: 'lower', label: 'Below Market', icon: ArrowDown, color: 'text-red-600 dark:text-red-400' }
                  ].map((position) => (
                    <label key={position.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.competitorPosition.includes(position.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, competitorPosition: [...prev.competitorPosition, position.value] }));
                          } else {
                            setFilters(prev => ({ ...prev, competitorPosition: prev.competitorPosition.filter(p => p !== position.value) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        {position.icon && <position.icon className={`w-4 h-4 ${position.color}`} />}
                        {!position.icon && <div className={`w-4 h-4 rounded-full bg-yellow-500`} />}
                        <span className={`text-sm ${position.color}`}>{position.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Special Filters
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasRestrictions}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasRestrictions: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Has Restrictions</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasAIInsights}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasAIInsights: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Has AI Insights</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasEvents}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasEvents: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Has Events</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Export Panel Component
  const ExportPanel = () => {
    if (!isExportOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Export Data</h2>
                <p className="text-green-100 mt-1">Choose your export format and options</p>
              </div>
              <button 
                onClick={() => setIsExportOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Export Content */}
          <div className="p-6 space-y-6">
            
            {/* Export Format */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'excel', label: 'Excel', icon: FileText, description: 'XLSX format with multiple sheets' },
                  { value: 'csv', label: 'CSV', icon: Download, description: 'Comma-separated values' },
                  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Formatted PDF report' }
                ].map((format) => (
                  <label key={format.value} className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    exportOptions.format === format.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={exportOptions.format === format.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <format.icon className={`w-8 h-8 mx-auto mb-2 ${
                        exportOptions.format === format.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-medium ${
                        exportOptions.format === format.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {format.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format.description}
                      </div>
                    </div>
                    {exportOptions.format === format.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Date Range
              </label>
              <div className="space-y-3">
                {[
                  { value: 'visible', label: 'Current View', description: 'Export currently visible dates' },
                  { value: 'all', label: 'All Data', description: 'Export all available data' },
                  { value: 'custom', label: 'Custom Range', description: 'Select specific date range' }
                ].map((range) => (
                  <label key={range.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange"
                      value={range.value}
                      checked={exportOptions.dateRange === range.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{range.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{range.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              {exportOptions.dateRange === 'custom' && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.customDateRange.start}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          customDateRange: { ...prev.customDateRange, start: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.customDateRange.end}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          customDateRange: { ...prev.customDateRange, end: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Include in Export
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeRestrictions}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeRestrictions: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Restrictions & Policies</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAIInsights}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeAIInsights: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">AI Insights & Recommendations</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeEvents}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeEvents: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <CalendarIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Events & Market Impact</span>
                </label>
              </div>
            </div>

            {/* Export Preview */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Export Preview</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div>• Format: {exportOptions.format.toUpperCase()}</div>
                <div>• Date Range: {exportOptions.dateRange === 'visible' ? 'Current view' : 
                                   exportOptions.dateRange === 'all' ? 'All data' : 'Custom range'}</div>
                <div>• Room Types: {filteredRoomTypes.length} included</div>
                <div>• Additional Data: {[
                  exportOptions.includeRestrictions && 'Restrictions',
                  exportOptions.includeAIInsights && 'AI Insights', 
                  exportOptions.includeEvents && 'Events'
                ].filter(Boolean).join(', ') || 'None'}</div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Ready to export {filteredRoomTypes.length} room type{filteredRoomTypes.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsExportOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Restrictions Panel Component
  const BulkRestrictionsPanel = () => {
    // Move all hooks to the top level - before any conditional returns
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isBulkRestrictionsOpen) return null;

    const handleCreateRestriction = () => {
      console.log('Creating restriction with form data:', restrictionForm);
      console.log('Selected restriction type:', selectedRestrictionType);
      
      // Enhanced validation with specific error messages
      const errors: string[] = [];
      
      if (!selectedRestrictionType) {
        errors.push('Please select a restriction type');
      }
      
      if (!restrictionForm.dateRange.start || !restrictionForm.dateRange.end) {
        errors.push('Please select both start and end dates');
      }
      
      if (restrictionForm.dateRange.start && restrictionForm.dateRange.end) {
        const startDate = new Date(restrictionForm.dateRange.start);
        const endDate = new Date(restrictionForm.dateRange.end);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
          errors.push('Start date cannot be in the past');
        }
        
        if (endDate < startDate) {
          errors.push('End date must be after start date');
        }
        
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 365) {
          errors.push('Date range cannot exceed 365 days');
        }
      }
      
      // Check if restriction needs a value
      if (selectedRestrictionType && ['minlos', 'maxlos', 'booking_window'].includes(selectedRestrictionType.id)) {
        if (!restrictionForm.value || parseInt(restrictionForm.value) <= 0) {
          errors.push(`Please enter a valid ${selectedRestrictionType.name.toLowerCase()} value`);
        }
        
        const maxValue = selectedRestrictionType.id === 'booking_window' ? 365 : 30;
        if (parseInt(restrictionForm.value) > maxValue) {
          errors.push(`${selectedRestrictionType.name} cannot exceed ${maxValue} ${selectedRestrictionType.id === 'booking_window' ? 'days' : 'nights'}`);
        }
      }
      
      if (restrictionForm.roomTypes.length === 0 && restrictionForm.ratePlans.length === 0 && restrictionForm.channels.length === 0) {
        errors.push('Please select at least one room type, rate plan, or channel');
      }
      
      if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return;
      }

      // Create the restriction
      const newRestriction: BulkRestriction = {
        id: `restriction-${Date.now()}`,
        restrictionType: selectedRestrictionType!,
        value: restrictionForm.value || undefined,
        dateRange: restrictionForm.dateRange,
        targets: {
          roomTypes: restrictionForm.roomTypes,
          ratePlans: restrictionForm.ratePlans,
          channels: restrictionForm.channels
        },
        status: 'active',
        createdBy: 'Current User',
        createdAt: new Date(),
        notes: restrictionForm.notes
      };

      setBulkRestrictions(prev => [...prev, newRestriction]);

      // Log the event
      logEvent({
        eventType: 'bulk_restriction_applied',
        roomType: restrictionForm.roomTypes.join(', '),
        ratePlan: restrictionForm.ratePlans.join(', '),
        channel: restrictionForm.channels.join(', '),
        dateAffected: `${restrictionForm.dateRange.start} to ${restrictionForm.dateRange.end}`,
        newValue: restrictionForm.value || selectedRestrictionType!.name,
        source: 'bulk_operation',
        metadata: {
          restrictionType: selectedRestrictionType!.id,
          affectedCells: (restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length) * 
                         Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))
        },
        severity: 'medium',
        category: 'restrictions',
        description: `Applied ${selectedRestrictionType!.name} restriction to ${restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length} targets for ${Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days`
      });

      // Reset form and close
      setSelectedRestrictionType(null);
      setRestrictionForm({
        value: '',
        dateRange: { start: '', end: '' },
        roomTypes: [],
        ratePlans: [],
        channels: [],
        notes: ''
      });
      setIsBulkRestrictionsOpen(false);
      
      alert(`✅ Bulk restriction "${selectedRestrictionType!.name}" applied successfully!`);
    };

    const handleDeleteRestriction = (restrictionId: string) => {
      setBulkRestrictions(prev => prev.filter(r => r.id !== restrictionId));
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Bulk Restrictions</h2>
                  <p className="text-orange-100 mt-1">Apply restrictions to multiple room types, rate plans, and channels</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBulkRestrictionsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)]">
            {/* Form Section */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-8">
                {/* 1. Restriction Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    1. Choose Restriction Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {restrictionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedRestrictionType(type)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedRestrictionType?.id === type.id
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            type.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                            type.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                            type.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {type.icon === 'X' && <X className={`w-5 h-5 ${
                              type.color === 'red' ? 'text-red-600 dark:text-red-400' :
                              type.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                              type.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                              'text-purple-600 dark:text-purple-400'
                            }`} />}
                            {type.icon === 'XCircle' && <XCircle className={`w-5 h-5 ${
                              type.color === 'red' ? 'text-red-600 dark:text-red-400' :
                              'text-orange-600 dark:text-orange-400'
                            }`} />}
                            {type.icon === 'ArrowRight' && <ArrowUp className={`w-5 h-5 text-orange-600 dark:text-orange-400`} />}
                            {type.icon === 'ArrowLeft' && <ArrowDown className={`w-5 h-5 text-orange-600 dark:text-orange-400`} />}
                            {type.icon === 'Calendar' && <CalendarIcon className={`w-5 h-5 text-blue-600 dark:text-blue-400`} />}
                            {type.icon === 'Ban' && <Minus className={`w-5 h-5 text-red-600 dark:text-red-400`} />}
                            {type.icon === 'Link' && <Archive className={`w-5 h-5 text-purple-600 dark:text-purple-400`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">
                              {type.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {type.code} • {type.category.replace('_', ' ')}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        {selectedRestrictionType?.id === type.id && (
                          <div className="mt-3 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Parameters (if needed) */}
                {selectedRestrictionType && ['minlos', 'maxlos', 'booking_window'].includes(selectedRestrictionType.id) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      2. Set Value
                    </h3>
                    <div className="max-w-xs">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        {selectedRestrictionType.id === 'minlos' ? 'Minimum Nights' :
                         selectedRestrictionType.id === 'maxlos' ? 'Maximum Nights' :
                         'Advance Booking Days'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={restrictionForm.value}
                          onChange={(e) => {
                            setRestrictionForm(prev => ({ ...prev, value: e.target.value }));
                          }}
                          className="w-full px-4 py-3 text-lg font-bold text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                          min="1"
                          max={selectedRestrictionType.id === 'booking_window' ? '365' : '30'}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          {selectedRestrictionType.id === 'booking_window' ? 'days' : 'nights'}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Range: 1-{selectedRestrictionType.id === 'booking_window' ? '365' : '30'} {selectedRestrictionType.id === 'booking_window' ? 'days' : 'nights'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Date Range */}
                {selectedRestrictionType && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {['minlos', 'maxlos', 'booking_window'].includes(selectedRestrictionType.id) ? '3' : '2'}. Date Range
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={restrictionForm.dateRange.start}
                          onChange={(e) => {
                            setRestrictionForm(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, start: e.target.value }
                            }));
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={restrictionForm.dateRange.end}
                          onChange={(e) => {
                            setRestrictionForm(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, end: e.target.value }
                            }));
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          min={restrictionForm.dateRange.start}
                        />
                      </div>
                    </div>
                    
                    {restrictionForm.dateRange.start && restrictionForm.dateRange.end && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl max-w-md">
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Duration:</strong> {
                            Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24) + 1)
                          } day{Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24) + 1) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Target Selection */}
                {selectedRestrictionType && restrictionForm.dateRange.start && restrictionForm.dateRange.end && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      {['minlos', 'maxlos', 'booking_window'].includes(selectedRestrictionType.id) ? '4' : '3'}. Select Targets
                    </h3>
                    <div className="space-y-6">
                      {/* Room Types */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Room Types
                          {restrictionForm.roomTypes.length > 0 && (
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                              {restrictionForm.roomTypes.length} selected
                            </span>
                          )}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {['Deluxe Room', 'Suite'].map((roomType) => (
                            <label key={roomType} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              restrictionForm.roomTypes.includes(roomType)
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}>
                              <input
                                type="checkbox"
                                checked={restrictionForm.roomTypes.includes(roomType)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRestrictionForm(prev => ({
                                      ...prev,
                                      roomTypes: [...prev.roomTypes, roomType]
                                    }));
                                  } else {
                                    setRestrictionForm(prev => ({
                                      ...prev,
                                      roomTypes: prev.roomTypes.filter(rt => rt !== roomType)
                                    }));
                                  }
                                }}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">{roomType}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {roomType === 'Deluxe Room' ? '45 rooms available' : '12 rooms available'}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Rate Plans */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Rate Plans
                          {restrictionForm.ratePlans.length > 0 && (
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                              {restrictionForm.ratePlans.length} selected
                            </span>
                          )}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {['BAR', 'ADV', 'SUITE'].map((ratePlan) => (
                            <label key={ratePlan} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              restrictionForm.ratePlans.includes(ratePlan)
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}>
                              <input
                                type="checkbox"
                                checked={restrictionForm.ratePlans.includes(ratePlan)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRestrictionForm(prev => ({
                                      ...prev,
                                      ratePlans: [...prev.ratePlans, ratePlan]
                                    }));
                                  } else {
                                    setRestrictionForm(prev => ({
                                      ...prev,
                                      ratePlans: prev.ratePlans.filter(rp => rp !== ratePlan)
                                    }));
                                  }
                                }}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">{ratePlan}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {ratePlan === 'BAR' ? 'Best Available Rate' : 
                                   ratePlan === 'ADV' ? 'Advance Purchase' : 'Suite Package'}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Channels */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Distribution Channels
                          {restrictionForm.channels.length > 0 && (
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                              {restrictionForm.channels.length} selected
                            </span>
                          )}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {['Booking.com', 'Expedia', 'Direct', 'Agoda', 'GDS'].map((channel) => (
                            <label key={channel} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              restrictionForm.channels.includes(channel)
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}>
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
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">{channel}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {channel === 'Direct' ? 'Hotel website' : 
                                   channel === 'GDS' ? 'Global Distribution' : 'Online Travel Agency'}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Notes (Optional)
                        </h4>
                        <textarea
                          value={restrictionForm.notes}
                          onChange={(e) => setRestrictionForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add any additional notes about this restriction..."
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview/Summary Section */}
            <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-700 p-6 border-l border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </h3>
              
              {selectedRestrictionType ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedRestrictionType.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                        selectedRestrictionType.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        selectedRestrictionType.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        <Shield className={`w-4 h-4 ${
                          selectedRestrictionType.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          selectedRestrictionType.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                          selectedRestrictionType.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedRestrictionType.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedRestrictionType.code}
                        </div>
                      </div>
                    </div>
                    
                    {['minlos', 'maxlos', 'booking_window'].includes(selectedRestrictionType.id) && restrictionForm.value && (
                      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Value</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {restrictionForm.value} {selectedRestrictionType.id === 'booking_window' ? 'days' : 'nights'}
                        </div>
                      </div>
                    )}
                    
                    {restrictionForm.dateRange.start && restrictionForm.dateRange.end && (
                      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Date Range</div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {restrictionForm.dateRange.start} → {restrictionForm.dateRange.end}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {restrictionForm.roomTypes.length > 0 && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Room Types</div>
                          <div className="text-xs text-purple-700 dark:text-purple-300">
                            {restrictionForm.roomTypes.join(', ')}
                          </div>
                        </div>
                      )}
                      
                      {restrictionForm.ratePlans.length > 0 && (
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-sm text-green-600 dark:text-green-400 font-medium">Rate Plans</div>
                          <div className="text-xs text-green-700 dark:text-green-300">
                            {restrictionForm.ratePlans.join(', ')}
                          </div>
                        </div>
                      )}
                      
                      {restrictionForm.channels.length > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Channels</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            {restrictionForm.channels.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Impact Summary */}
                  {restrictionForm.dateRange.start && restrictionForm.dateRange.end && 
                   (restrictionForm.roomTypes.length > 0 || restrictionForm.ratePlans.length > 0 || restrictionForm.channels.length > 0) && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <div className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">Impact Summary</div>
                      <div className="space-y-1 text-xs text-orange-600 dark:text-orange-400">
                        <div>• {restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length} targets affected</div>
                        <div>• {Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24) + 1)} days duration</div>
                        <div>• {(restrictionForm.roomTypes.length + restrictionForm.ratePlans.length + restrictionForm.channels.length) * Math.ceil((new Date(restrictionForm.dateRange.end).getTime() - new Date(restrictionForm.dateRange.start).getTime()) / (1000 * 60 * 60 * 24) + 1)} total applications</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-gray-500 dark:text-gray-400">
                    Select a restriction type to see preview
                  </div>
                </div>
              )}

              {/* Active Restrictions */}
              {bulkRestrictions.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Active Restrictions</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bulkRestrictions.map((restriction) => (
                      <div key={restriction.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {restriction.restrictionType.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {restriction.dateRange.start} → {restriction.dateRange.end}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteRestriction(restriction.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsBulkRestrictionsOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              
              <button
                onClick={handleCreateRestriction}
                disabled={!selectedRestrictionType || !restrictionForm.dateRange.start || !restrictionForm.dateRange.end || 
                         (restrictionForm.roomTypes.length === 0 && restrictionForm.ratePlans.length === 0 && restrictionForm.channels.length === 0)}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Apply Restriction
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
              💡 Tip: Select restriction type, set dates, and choose targets to apply bulk restrictions
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Event Logs Panel Component
  const EventLogsPanel = () => {
    if (!isEventLogsOpen) return null;

    const getSeverityColor = (severity: EventLog['severity']) => {
      switch (severity) {
        case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
        case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
        case 'critical': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
        default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
      }
    };

    const getCategoryIcon = (category: EventLog['category']) => {
      switch (category) {
        case 'pricing': return <DollarSign className="w-4 h-4" />;
        case 'inventory': return <Package className="w-4 h-4" />;
        case 'restrictions': return <Lock className="w-4 h-4" />;
        case 'ai': return <Brain className="w-4 h-4" />;
        case 'export': return <Download className="w-4 h-4" />;
        case 'system': return <Settings className="w-4 h-4" />;
        default: return <Activity className="w-4 h-4" />;
      }
    };

    const getSourceBadge = (source: EventLog['source']) => {
      const badges = {
        manual: { label: 'Manual', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
        ai: { label: 'AI', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
        bulk_operation: { label: 'Bulk', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
        import: { label: 'Import', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
        api: { label: 'API', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' }
      };
      return badges[source] || badges.manual;
    };

    const filteredLogs = eventLogs.filter(log => {
      if (eventLogsFilter.category !== 'all' && log.category !== eventLogsFilter.category) return false;
      if (eventLogsFilter.severity !== 'all' && log.severity !== eventLogsFilter.severity) return false;
      if (eventLogsFilter.source !== 'all' && log.source !== eventLogsFilter.source) return false;
      if (eventLogsFilter.searchTerm && !log.description.toLowerCase().includes(eventLogsFilter.searchTerm.toLowerCase()) && 
          !log.userName.toLowerCase().includes(eventLogsFilter.searchTerm.toLowerCase())) return false;
      return true;
    });

    const formatTimeAgo = (timestamp: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Event Logs</h2>
                  <p className="text-purple-100 mt-1">System activity and audit trail</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEventLogsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={eventLogsFilter.category}
                  onChange={(e) => setEventLogsFilter(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="pricing">Pricing</option>
                  <option value="inventory">Inventory</option>
                  <option value="restrictions">Restrictions</option>
                  <option value="ai">AI Actions</option>
                  <option value="export">Exports</option>
                  <option value="system">System</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity
                </label>
                <select
                  value={eventLogsFilter.severity}
                  onChange={(e) => setEventLogsFilter(prev => ({ ...prev, severity: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source
                </label>
                <select
                  value={eventLogsFilter.source}
                  onChange={(e) => setEventLogsFilter(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Sources</option>
                  <option value="manual">Manual</option>
                  <option value="ai">AI</option>
                  <option value="bulk_operation">Bulk Operation</option>
                  <option value="import">Import</option>
                  <option value="api">API</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={eventLogsFilter.searchTerm}
                    onChange={(e) => setEventLogsFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Total Events: <strong className="text-gray-900 dark:text-white">{eventLogs.length}</strong></span>
              <span>Filtered: <strong className="text-gray-900 dark:text-white">{filteredLogs.length}</strong></span>
              <span>Critical: <strong className="text-red-600 dark:text-red-400">{eventLogs.filter(l => l.severity === 'critical').length}</strong></span>
            </div>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto max-h-[50vh]">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Events Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {eventLogsFilter.searchTerm || eventLogsFilter.category !== 'all' || eventLogsFilter.severity !== 'all' || eventLogsFilter.source !== 'all'
                    ? 'Try adjusting your filters to see more events.'
                    : 'No events have been logged yet.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getSeverityColor(log.severity).split(' ').slice(-2).join(' ')}`}>
                        {getCategoryIcon(log.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {log.description}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center justify-center gap-2">
                                <User className="w-3 h-3" />
                                {log.userName}
                              </span>
                              <span className="flex items-center justify-center gap-2">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(log.timestamp)}
                              </span>
                              {log.roomType && (
                                <span className="flex items-center justify-center gap-2">
                                  <Building className="w-3 h-3" />
                                  {log.roomType}
                                </span>
                              )}
                              {log.ratePlan && (
                                <span className="flex items-center justify-center gap-2">
                                  <Tag className="w-3 h-3" />
                                  {log.ratePlan}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                              {log.severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(log.source).color}`}>
                              {getSourceBadge(log.source).label}
                            </span>
                          </div>
                        </div>

                        {/* Value Changes */}
                        {(log.oldValue !== undefined && log.newValue !== undefined) && (
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              {typeof log.oldValue === 'number' && log.eventType.includes('price') ? `₹${log.oldValue.toLocaleString()}` : log.oldValue}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {typeof log.newValue === 'number' && log.eventType.includes('price') ? `₹${log.newValue.toLocaleString()}` : log.newValue}
                            </span>
                            {log.changePercentage && (
                              <span className={`text-sm font-medium ${
                                log.changePercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                ({log.changePercentage > 0 ? '+' : ''}{log.changePercentage.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Reason */}
                        {log.reason && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{log.reason}"
                          </p>
                        )}

                        {/* Metadata */}
                        {log.metadata && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            {log.metadata.affectedCells && (
                              <span>Affected {log.metadata.affectedCells} cells • </span>
                            )}
                            {log.metadata.confidence && (
                              <span>AI Confidence: {log.metadata.confidence}% • </span>
                            )}
                            {log.ipAddress && (
                              <span>IP: {log.ipAddress}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Events are automatically logged and retained for 90 days
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEventLogsFilter({
                    category: 'all',
                    severity: 'all',
                    source: 'all',
                    dateRange: { start: '', end: '' },
                    searchTerm: '',
                    userId: 'all'
                  })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsEventLogsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add this near the top with other state/references
  const inventoryStatusCache = React.useRef<Map<string, SmartInventoryStatus>>(new Map());

  // Stable seeded random function to ensure consistent results
  const seededRandom = (seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Normalize to 0-1 range
    return Math.abs(hash) / 2147483647;
  };

  const calculateSmartInventoryStatus = (
    inventory: number, 
    roomTypeName: string, 
    dateStr: string,
    roomTypeCapacity: number = 100 // This should come from room type data
  ): SmartInventoryStatus => {
    // Create cache key for stable results
    const cacheKey = `${roomTypeName}-${dateStr}-${inventory}`;
    
    // Return cached result if available
    if (inventoryStatusCache.current.has(cacheKey)) {
      return inventoryStatusCache.current.get(cacheKey)!;
    }
    
    const reasoning: string[] = [];
    let level: SmartInventoryStatus['level'] = 'optimal';
    let urgency: SmartInventoryStatus['urgency'] = 'routine';
    let confidence = 85;
    
    // Get contextual data for this date
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const daysOut = Math.ceil((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    // Create deterministic seed from room name, date, and inventory
    const seed = `${roomTypeName}-${dateStr}-${inventory}`;
    const random1 = seededRandom(seed);
    const random2 = seededRandom(seed + 'demand');
    const random3 = seededRandom(seed + 'pace');
    const random4 = seededRandom(seed + 'comp');
    const random5 = seededRandom(seed + 'event');
    
    // Stable mock demand data - consistent results per room/date combination
    const mockDemandData = {
      currentDemand: Math.floor(inventory * (0.6 + random1 * 0.4)), // 60-100% of inventory
      predictedDemand: Math.floor(inventory * (0.7 + random2 * 0.4)), // 70-110% of inventory  
      lastYearPace: Math.floor(inventory * (0.5 + random3 * 0.4)), // 50-90% of inventory
      competitorAvgAvailability: Math.floor(roomTypeCapacity * (0.3 + random4 * 0.3)), // 30-60% of capacity
      eventImpact: random5 > 0.8 ? 'positive' : random5 > 0.95 ? 'negative' : 'none'
    };
    
    // Simple, intuitive inventory assessment for revenue managers
    const demandRate = mockDemandData.currentDemand / inventory;
    const occupancyProjection = Math.min(demandRate * 100, 100);
    
    // Clear business logic that revenue managers understand
    if (inventory <= 5) {
      level = 'critical';
      urgency = 'immediate';
      reasoning.push(`🚨 SELLOUT RISK: Only ${inventory} rooms left`);
      reasoning.push(`Action: Apply restrictions or increase rates immediately`);
      confidence = 95;
    } else if (demandRate > 0.8) {
      // More than 80% demand rate = close to selling out
      level = 'critical';
      urgency = 'immediate';
      reasoning.push(`📈 HIGH DEMAND: ${Math.round(occupancyProjection)}% likely to sell`);
      reasoning.push(`Action: Consider rate increases or minimum stay restrictions`);
      confidence = 90;
    } else if (demandRate > 0.6) {
      // 60-80% demand rate = good pace
      level = 'optimal';
      urgency = 'routine';
      reasoning.push(`✅ GOOD PACE: ${Math.round(occupancyProjection)}% occupancy projected`);
      reasoning.push(`Action: Monitor and maintain current strategy`);
      confidence = 85;
    } else if (demandRate > 0.3) {
      // 30-60% demand rate = moderate demand
      level = 'low';
      urgency = 'monitor';
      reasoning.push(`⚠️ SLOW PACE: ${Math.round(occupancyProjection)}% occupancy projected`);
      reasoning.push(`Action: Consider promotional rates or package deals`);
      confidence = 80;
    } else {
      // Less than 30% demand rate = poor demand
      level = 'oversupply';
      urgency = 'immediate';
      reasoning.push(`📉 POOR DEMAND: Only ${Math.round(occupancyProjection)}% likely to sell`);
      reasoning.push(`Action: Aggressive promotional pricing needed`);
      confidence = 85;
    }
    
    // Add contextual insights that matter to revenue managers
    if (daysOut <= 3) {
      reasoning.push(`🗓️ LAST MINUTE: ${daysOut} days until arrival`);
    } else if (daysOut <= 14) {
      reasoning.push(`🗓️ BOOKING WINDOW: ${daysOut} days advance booking`);
    }
    
    if (isWeekend) {
      reasoning.push(`📅 WEEKEND DATE: Higher demand expected`);
    }
    
    if (mockDemandData.eventImpact === 'positive') {
      reasoning.push(`🎯 EVENT IMPACT: Major event driving demand`);
      if (level === 'oversupply') level = 'low';
      if (level === 'low') level = 'optimal';
    }
    
    // Competitive context
    if (inventory < mockDemandData.competitorAvgAvailability) {
      reasoning.push(`🏆 COMPETITIVE ADVANTAGE: Less inventory than competitors`);
    } else {
      reasoning.push(`⚖️ MARKET PARITY: Similar inventory to competitors`);
    }
    
    // Determine display properties
    let displayText: string;
    let colorClass: string;
    let actionRequired: string | undefined;
    
    switch (level) {
      case 'critical':
        displayText = 'sellout risk';
        colorClass = 'bg-red-500 text-white font-medium';
        actionRequired = 'Immediate inventory action required';
        break;
      case 'low':
        displayText = 'slow pace';
        colorClass = 'bg-orange-500 text-white font-medium';
        actionRequired = 'Consider promotional pricing';
        break;
      case 'optimal':
        displayText = 'good pace';
        colorClass = 'bg-green-500 text-white font-medium';
        actionRequired = 'Monitor and maintain strategy';
        break;
      case 'oversupply':
        displayText = 'poor demand';
        colorClass = 'bg-purple-500 text-white font-medium';
        actionRequired = 'Aggressive pricing needed';
        break;
    }
    
    const result: SmartInventoryStatus = {
      level,
      reasoning,
      urgency,
      confidence: Math.min(confidence, 100),
      factors: {
        demandPace: (mockDemandData.currentDemand - mockDemandData.lastYearPace) / mockDemandData.lastYearPace * 100,
        competitorPosition: inventory > mockDemandData.competitorAvgAvailability ? 'advantage' : 'disadvantage',
        eventImpact: mockDemandData.eventImpact as 'none' | 'positive' | 'negative',
        seasonalTrend: isWeekend ? 'peak' : 'shoulder'
      },
      displayText,
      colorClass,
      actionRequired
    };
    
    // Cache the result
    inventoryStatusCache.current.set(cacheKey, result);
    
    return result;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Sticky Header */}
      <header className="sticky-header">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Revenue Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered pricing optimization platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                         flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              {/* Inline Edit Status */}
              {inlineEdit && (
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
                  <Edit3 className="w-4 h-4" />
                  <span>Editing {inlineEdit.type} - Press Enter to save, Esc to cancel</span>
                </div>
              )}

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Revenue Manager</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 space-y-8">
        {/* Revenue Grid */}
        <div className="space-y-6">
          {/* View Tabs - Moved to top for cleaner layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              <button 
                onClick={() => setCurrentView('daily')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'daily' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Daily View
              </button>
              <button 
                onClick={() => setCurrentView('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'monthly' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly View
              </button>
            </div>

            {/* Changes Indicator & Publish Button */}
            {changes.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg text-sm font-medium">
                  {changes.length} unsaved change{changes.length !== 1 ? 's' : ''}
                </div>
                <button 
                  onClick={publishChanges}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Publish Changes
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Rates & Inventory Grid
              </h2>
              
              {/* Date Navigation (only for Daily view) */}
              {currentView === 'daily' && (
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                  <button 
                    onClick={() => navigateDates('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Previous week"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px] text-center">
                    {dates[0]?.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - {dates[20]?.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                  <button 
                    onClick={() => navigateDates('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Next week"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Inline Edit Help */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                <Info className="w-4 h-4" />
                <span>Double-click to edit inline • Click for detailed modal</span>
              </div>

              {/* Enhanced Filter Button */}
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  getActiveFiltersCount() > 0 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* Enhanced Export Button */}
              <button 
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              {/* Bulk Restrictions Button */}
              <button 
                onClick={() => setIsBulkRestrictionsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Lock className="w-4 h-4" />
                <span>Bulk Restrictions</span>
                {bulkRestrictions.filter(r => r.status === 'active').length > 0 && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded-full">
                    {bulkRestrictions.filter(r => r.status === 'active').length}
                  </span>
                )}
              </button>

              {/* Event Logs Button */}
              <button 
                onClick={() => setIsEventLogsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>Event Logs</span>
                {eventLogs.length > 0 && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {eventLogs.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* View Content - Conditional Rendering */}
          {currentView === 'daily' ? (
            // Daily View - Complete Enhanced Grid with All Functionality
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <div className="revenue-grid min-w-max">
                {/* Date Headers with Events */}
                <div className="grid gap-1" style={{ gridTemplateColumns: '240px repeat(21, minmax(120px, 1fr))' }}>
                  {/* Room/Product Column Header */}
                  <div className="sticky left-0 bg-gray-50 dark:bg-gray-800 p-4 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                    Room Type / Product
                  </div>
                  
                  {/* Enhanced Date Headers with Events */}
                  {dates.map((day, index) => (
                    <div key={index} className="relative group">
                      <div className={`p-3 text-center border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                        day.isWeekend ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'
                      } ${day.events.length > 0 ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/40' : ''}`}>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day.dayName}</div>
                        <div className={`font-semibold mb-2 ${day.isWeekend ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                          {day.date.getDate()}
                        </div>
                        
                        {/* Event Indicators */}
                        {day.events.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-center gap-1 flex-wrap">
                              {day.events.slice(0, 2).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className={`event-dot ${event.impact}-impact cursor-pointer hover:scale-110 transition-transform`}
                                  title={event.title}
                                  onMouseEnter={(e) => handleEventHover(event, e)}
                                  onMouseLeave={handleEventLeave}
                                  onClick={() => handleEventClick(event)}
                                />
                              ))}
                            </div>
                            {day.events.length > 2 && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                +{day.events.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Month indicator for first day of month */}
                        {day.date.getDate() === 1 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {day.date.toLocaleDateString('en', { month: 'short' })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Room Types and Products */}
                {filteredRoomTypes.map((roomType) => (
                  <div key={roomType.id} className="space-y-1">
                    {/* Room Type Header */}
                    <div className="grid gap-1" style={{ gridTemplateColumns: '240px repeat(21, minmax(120px, 1fr))' }}>
                      <div 
                        className="sticky left-0 bg-blue-50 dark:bg-blue-900/20 p-4 font-semibold text-blue-900 dark:text-blue-100 border-r border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors duration-200"
                        onClick={() => toggleRoomExpansion(roomType.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {roomType.isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                            <div>
                              <div className="font-bold">{roomType.name}</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">{roomType.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                              {roomType.products.length} rates
                            </div>
                            <div className="text-xs text-blue-500 dark:text-blue-400 opacity-70">
                              {roomType.isExpanded ? 'Click to collapse' : 'Click to expand'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Clean & Minimal Inventory Cells */}
                      {roomType.inventoryData.map((inv, dateIndex) => (
                        <div 
                          key={dateIndex} 
                          className={`grid-cell bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 
                                   transition-all duration-200 cursor-pointer group relative border border-blue-200/30 dark:border-blue-800/30
                                   ${inv.isChanged ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600' : ''}`}
                          onClick={() => handleInventoryClick(roomType.name, inv.inventory, dateIndex)}
                          onDoubleClick={(e) => handleInventoryDoubleClick(roomType.id, dateIndex, inv.inventory, e)}
                        >
                          <div className="flex flex-col items-center justify-center h-full p-3">
                            {/* Change Indicator */}
                            {inv.isChanged && (
                              <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                            )}
                            
                            {/* Inline Edit Input or Display */}
                            {inlineEdit?.type === 'inventory' && 
                             inlineEdit.roomId === roomType.id && 
                             inlineEdit.dateIndex === dateIndex ? (
                              <input
                                ref={inlineInputRef}
                                type="number"
                                value={inlineEdit.value}
                                onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                                onKeyDown={handleInlineKeyDown}
                                onBlur={saveInlineEdit}
                                className="w-16 h-8 text-center text-lg font-bold bg-white dark:bg-gray-700 border border-blue-500 
                                         rounded px-1 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                max="999"
                                autoFocus
                              />
                            ) : (
                              <>
                                {/* Large, Clear Number */}
                                <div className={`text-2xl font-bold mb-1 ${
                                  inv.isChanged ? 'text-orange-600 dark:text-orange-400' : 'text-blue-900 dark:text-blue-100'
                                }`}>
                                  {inv.inventory}
                                </div>
                                
                                {/* Change Value Indicator */}
                                {inv.isChanged && inv.originalInventory !== undefined && (
                                  <div className="absolute bottom-1 right-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                                    {inv.originalInventory} → {inv.inventory}
                                  </div>
                                )}

                                {/* Smart Status Indicator - Enhanced */}
                                <div className="flex items-center justify-center gap-2">
                                  {/* Restriction Indicator - Inline */}
                                  {inv.restrictions && inv.restrictions.length > 0 && (
                                    <Lock className="w-3 h-3 text-orange-500 opacity-80 hover:opacity-100 transition-opacity duration-200" />
                                  )}
                                  {(() => {
                                    const smartStatus = calculateSmartInventoryStatus(
                                      inv.inventory, 
                                      roomType.name, 
                                      dates[dateIndex]?.dateStr || new Date().toISOString(),
                                      100 // Room type capacity - should come from room type data
                                    );
                                    
                                    return (
                                      <>
                                        <div 
                                          className="cursor-pointer"
                                          onMouseEnter={(e) => showRichTooltip('inventory_analysis', { 
                                            status: smartStatus,
                                            inventory: inv.inventory,
                                            roomType: roomType.name
                                          }, e)}
                                          onMouseLeave={hideRichTooltip}
                                        >
                                          <span className={`text-[10px] px-1 py-0.5 font-medium rounded-full ${
                                            smartStatus.level === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            smartStatus.level === 'low' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hidden' :
                                            smartStatus.level === 'optimal' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            smartStatus.level === 'oversupply' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                          }`}>
                                            <CompactInventoryStatus status={smartStatus} inventory={inv.inventory} onMouseEnter={(e, tooltipData) => showRichTooltip("inventory_analysis", { status: smartStatus, inventory: inv.inventory, roomType: roomType.name }, e)} onMouseLeave={hideRichTooltip} />
                                          </span>
                                          {smartStatus.urgency === 'immediate' && (
                                            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping absolute -top-1 -right-1"></div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </>
                            )}
                            
                            {/* Edit Indicators */}
                            {!(inlineEdit?.type === 'inventory' && 
                               inlineEdit.roomId === roomType.id && 
                               inlineEdit.dateIndex === dateIndex) && (
                              <>
                                {/* Subtle Edit Indicator on Hover */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Edit3 className="w-3 h-3 text-blue-500" />
                                </div>
                                
                                
                                {/* Double-click hint */}
                                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                                  <span className="text-xs text-blue-500 font-medium">2x</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Products - Only show when expanded */}
                    {roomType.isExpanded && roomType.products.map((product) => (
                      <div key={product.id} className="grid gap-1" style={{ gridTemplateColumns: '240px repeat(21, minmax(120px, 1fr))' }}>
                        <div className="sticky left-0 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.description}</div>
                          <div className="text-xs text-gray-400 mt-1">{product.type}</div>
                        </div>
                      
                        {/* Enhanced Price Cells */}
                        {product.data.map((data, dateIndex) => (
                          <div 
                            key={dateIndex} 
                            className={`grid-cell cursor-pointer group relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                              ${data.isChanged ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600' : ''}
                              ${data.aiInsights.length > 0 ? 'has-ai-insight ring-1 ring-purple-200 dark:ring-purple-800' : ''} 
                              ${data.eventImpact ? 'has-event ring-1 ring-orange-200 dark:ring-orange-800' : ''}
                              ${dates[dateIndex]?.events.length > 0 ? 'event-affected bg-orange-50 dark:bg-orange-900/10' : ''}
                              ${inlineEdit?.type === 'price' && inlineEdit.roomId === roomType.id && inlineEdit.productId === product.id && inlineEdit.dateIndex === dateIndex ? 'ring-2 ring-blue-500' : ''}
                              ${getCellRestrictionClasses(roomType.name, product.type, dates[dateIndex]?.dateStr || '')}
                              hover:shadow-lg hover:scale-105 transition-all duration-200`}
                            onClick={(e) => handleCellClick(roomType.name, product.name, data.rate, dateIndex)}
                            onDoubleClick={(e) => handleCellDoubleClick(roomType.id, product.id, dateIndex, data.rate, e)}
                          >
                            <div className="text-center p-2">
                              {/* Change Indicator */}
                              {data.isChanged && (
                                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                              )}
                              
                              {/* Inline Edit Input or Display */}
                              {inlineEdit?.type === 'price' && 
                               inlineEdit.roomId === roomType.id && 
                               inlineEdit.productId === product.id && 
                               inlineEdit.dateIndex === dateIndex ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">₹</div>
                                  <input
                                    ref={inlineInputRef}
                                    type="number"
                                    value={inlineEdit.value}
                                    onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                                    onKeyDown={handleInlineKeyDown}
                                    onBlur={saveInlineEdit}
                                    className="w-20 h-8 text-center text-sm font-bold bg-white dark:bg-gray-700 border border-blue-500 
                                             rounded px-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max="999999"
                                    autoFocus
                                  />
                                  <div className="text-xs text-blue-600 dark:text-blue-400">Enter/Esc</div>
                                </div>
                              ) : (
                                <>
                                  {/* Enhanced Price Display with Competitor Icon */}
                                  <div className={`font-bold mb-1 ${
                                    data.isChanged ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    ₹{data.rate.toLocaleString()}
                                  </div>
                                  
                                  {/* Change Value Indicator */}
                                  {data.isChanged && data.originalRate !== undefined && (
                                    <div className="absolute bottom-1 right-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                                      ₹{data.originalRate.toLocaleString()} → ₹{data.rate.toLocaleString()}
                                    </div>
                                  )}
                                  
                                  {/* Competitor Position Indicator */}
                                  {data.competitorData && data.competitorIndicator && (
                                    <div className="absolute top-1 right-1 group/competitor">
                                      <div className={`flex items-center gap-1 px-1 py-0.5 rounded-full transition-all duration-200 ${
                                        data.competitorIndicator === 'higher' 
                                          ? 'bg-emerald-100 dark:bg-emerald-900/30 group-hover/competitor:bg-emerald-200 dark:group-hover/competitor:bg-emerald-900/50' :
                                        data.competitorIndicator === 'competitive' 
                                          ? 'bg-yellow-100 dark:bg-yellow-900/30 group-hover/competitor:bg-yellow-200 dark:group-hover/competitor:bg-yellow-900/50' :
                                          'bg-red-100 dark:bg-red-900/30 group-hover/competitor:bg-red-200 dark:group-hover/competitor:bg-red-900/50'
                                      }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                          data.competitorIndicator === 'higher' ? 'bg-emerald-500' :
                                          data.competitorIndicator === 'competitive' ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}></div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Other Indicators Row */}
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    {data.restrictions && data.restrictions.length > 0 && (
                                      <div 
                                        className="tooltip-icon-area"
                                        onMouseEnter={(e) => showRichTooltip('general', { 
                                          type: 'restrictions', 
                                          restrictions: data.restrictions,
                                          count: data.restrictions.length
                                        }, e)}
                                        onMouseLeave={handleTooltipMouseLeave}
                                      >
                                        <Lock className="w-3 h-3 text-orange-500 tooltip-icon" />
                                      </div>
                                    )}
                                    
                                    {data.aiInsights && data.aiInsights.length > 0 && (
                                      <div 
                                        className="tooltip-icon-area"
                                        onMouseEnter={(e) => showRichTooltip('ai', data.aiInsights, e)}
                                        onMouseLeave={handleTooltipMouseLeave}
                                      >
                                        <Brain className="w-3 h-3 text-blue-500 tooltip-icon" />
                                      </div>
                                    )}
                                    
                                    {data.competitorData && (
                                      <div 
                                        className="tooltip-icon-area"
                                        onMouseEnter={(e) => showRichTooltip('competitor', { ...data.competitorData, currentPrice: data.rate }, e)}
                                        onMouseLeave={handleTooltipMouseLeave}
                                      >
                                        <Users className="w-3 h-3 text-purple-500 tooltip-icon" />
                                      </div>
                                    )}
                                    
                                    {dates[dateIndex]?.events.length > 0 && (
                                      <div 
                                        className="tooltip-icon-area"
                                        onMouseEnter={(e) => showRichTooltip('event', dates[dateIndex].events, e)}
                                        onMouseLeave={handleTooltipMouseLeave}
                                      >
                                        <CalendarIcon className="w-3 h-3 text-orange-500" />
                                      </div>
                                    )}
                                  </div>
                                  
                                </>
                              )}
                            </div>
                            
                            {/* Enhanced Hover overlay and Edit Indicators */}
                            {!(inlineEdit?.type === 'price' && 
                               inlineEdit.roomId === roomType.id && 
                               inlineEdit.productId === product.id && 
                               inlineEdit.dateIndex === dateIndex) && (
                              <>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded" />
                                
                                {/* Edit indicators */}
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Edit3 className="w-3 h-3 text-blue-500" />
                                </div>
                                
                                {/* Double-click hint */}
                                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                                  <span className="text-xs text-blue-500 font-medium">2x</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Enhanced Monthly View - World-Class Component
            <MonthlyCalendarView
              selectedRoomTypeForMonthly={selectedRoomTypeForMonthly}
              setSelectedRoomTypeForMonthly={setSelectedRoomTypeForMonthly}
              selectedRatePlanForMonthly={selectedRatePlanForMonthly}
              setSelectedRatePlanForMonthly={setSelectedRatePlanForMonthly}
              monthlyViewDate={monthlyViewDate}
              setMonthlyViewDate={setMonthlyViewDate}
              sampleRoomTypes={sampleRoomTypes}
              getApplicableRestrictions={getApplicableRestrictions}
              isCloseoutApplied={isCloseoutApplied}
              getRestrictionTooltipData={getRestrictionTooltipData}
              getCellRestrictionClasses={getCellRestrictionClasses}
              showRichTooltip={showRichTooltip}
              hideRichTooltip={hideRichTooltip}
              handleCellClick={handleCellClick}
              handleCellDoubleClick={handleCellDoubleClick}
              handleInventoryClick={handleInventoryClick}
              handleInventoryDoubleClick={handleInventoryDoubleClick}
              startInlineEdit={startInlineEdit}
              inlineEdit={inlineEdit}
              handleInlineKeyDown={handleInlineKeyDown}
              setInlineEdit={setInlineEdit}
              inlineInputRef={inlineInputRef}
              sampleInsights={sampleInsights}
              dates={dates}
              sampleEvents={sampleEvents}
              dateOffset={dateOffset}
              calculateSmartInventoryStatus={calculateSmartInventoryStatus}
              seededRandom={seededRandom}
            />
          )}
        </div>

        {/* AI Insights Drawer */}
        <AIInsightsDrawer
          isOpen={isAIDrawerOpen}
          onClose={() => setIsAIDrawerOpen(false)}
          insights={sampleInsights}
          isDark={isDark}
          onApplyInsight={handleApplyInsight}
          onDismissInsight={handleDismissInsight}
        />

        {/* Enhanced Price Modal */}
        {selectedProduct && (
          <EnhancedPriceModal
            isOpen={isPriceModalOpen}
            onClose={() => setIsPriceModalOpen(false)}
            roomName={selectedProduct.room}
            productName={selectedProduct.product}
            currentPrice={selectedProduct.price}
            onSave={handlePriceSave}
            competitorData={{
              competitors: [
                { name: 'Hotel Paradise', rate: 7500, availability: 12, distance: 0.8, rating: 4.2, trend: 'down' },
                { name: 'Grand Plaza', rate: 9200, availability: 8, distance: 1.2, rating: 4.5, trend: 'up' },
                { name: 'City Inn', rate: 6800, availability: 15, distance: 2.1, rating: 3.9, trend: 'stable' },
                { name: 'Luxury Suites', rate: 12000, availability: 3, distance: 0.5, rating: 4.8, trend: 'up' }
              ],
              marketPosition: 'competitive',
              priceAdvantage: 5.2
            }}
            events={sampleEvents}
            aiInsights={sampleInsights}
            isDark={isDark}
          />
        )}

        {/* Inventory Modal */}
        {selectedInventory && (
          <EnhancedInventoryModal
            isOpen={isInventoryModalOpen}
            onClose={() => setIsInventoryModalOpen(false)}
            roomName={selectedInventory.room}
            currentInventory={selectedInventory.inventory}
            date={dates[selectedInventory.dateIndex]?.dateStr || ''}
            onSave={handleInventorySave}
            demandData={{
              historical: [
                { date: '2024-01-15', occupancy: 78, demand: 42, dayOfWeek: 'Monday' },
                { date: '2024-01-16', occupancy: 85, demand: 51, dayOfWeek: 'Tuesday' },
                { date: '2024-01-17', occupancy: 92, demand: 38, dayOfWeek: 'Wednesday' },
                { date: '2024-01-18', occupancy: 88, demand: 45, dayOfWeek: 'Thursday' },
              ],
              currentDemand: 45,
              predictedDemand: 52,
              demandTrend: 'up',
              optimalInventory: 60,
              riskLevel: 'medium',
              
              // Enhanced RM Context
              competitorSnapshot: {
                avgAvailability: 28,
                pricePosition: 'premium',
                marketShare: 18,
                competitorData: [
                  { name: 'Grand Plaza', availability: 23, rate: 8500, distance: 0.5, occupancyRate: 85 },
                  { name: 'City Heights', availability: 31, rate: 7200, distance: 1.2, occupancyRate: 72 },
                  { name: 'Business Center', availability: 19, rate: 9200, distance: 0.8, occupancyRate: 91 },
                  { name: 'Metro Inn', availability: 42, rate: 6800, distance: 1.8, occupancyRate: 58 }
                ]
              },
              
              bookingPace: {
                vsLastYear: 15,
                vsForecast: -8,
                velocityTrend: 'accelerating',
                daysOut: 14,
                criticalBookingWindow: true,
                pickupVsCompSet: 22
              },
              
              channelPerformance: [
                { channel: 'Direct', conversion: 12.5, trend: 'up', recommendedAction: 'Increase rate by 5%', marketShare: 35, efficiency: 88 },
                { channel: 'Booking.com', conversion: 8.2, trend: 'stable', recommendedAction: 'Maintain current strategy', marketShare: 28, efficiency: 76 },
                { channel: 'Expedia', conversion: 6.8, trend: 'down', recommendedAction: 'Review rate parity', marketShare: 22, efficiency: 64 },
                { channel: 'Corporate', conversion: 15.2, trend: 'up', recommendedAction: 'Expand corporate partnerships', marketShare: 15, efficiency: 92 }
              ],
              
              restrictionRecommendations: [
                {
                  type: 'length_of_stay',
                  action: 'add',
                  reasoning: 'High demand window - implement 2-night minimum to maximize revenue',
                  revenueImpact: 12500,
                  urgency: 'immediate',
                  confidence: 85
                },
                {
                  type: 'advance_purchase',
                  action: 'modify', 
                  reasoning: 'Adjust advance purchase requirements to capture more bookings',
                  revenueImpact: 8200,
                  urgency: 'recommended',
                  confidence: 72
                },
                {
                  type: 'channel_closeout',
                  action: 'add',
                  reasoning: 'Close low-performing OTA channels during peak demand',
                  revenueImpact: 15800,
                  urgency: 'immediate',
                  confidence: 90
                }
              ]
            }}
            events={sampleEvents}
            aiInsights={sampleInsights}
            isDark={isDark}
          />
        )}

        {/* Filter Panel */}
        <FilterPanel />

        {/* Export Panel */}
        <ExportPanel />

        {/* Bulk Restrictions Panel */}
        <BulkRestrictionsPanel />

        {/* Event Logs Panel */}
        <EventLogsPanel />

        {/* Global News Insights Panel */}
        <GlobalNewsInsights 
          isOpen={isGlobalNewsOpen}
          onClose={() => setIsGlobalNewsOpen(false)}
          insights={globalNewsInsights}
          isDark={isDark}
          onApplyInsight={applyNewsInsight}
          onDismissInsight={dismissNewsInsight}
          onRefreshInsights={refreshNewsInsights}
          isLoading={isNewsLoading}
        />

        {/* Promotion Assistant - AI-Powered Promotion Management */}
        <PromotionAssistant isDark={isDark} />

        {/* Publish Confirmation Modal */}
        {showPublishConfirmation && (
          <PublishConfirmation
            isOpen={showPublishConfirmation}
            onClose={() => setShowPublishConfirmation(false)}
            onConfirm={handlePublishConfirmed}
            changes={changes}
            isDark={isDark}
          />
        )}

        {/* Tooltip Components - Essential for hover functionality */}
        {hoveredEvent && (
          <EventTooltip event={hoveredEvent} position={tooltipPosition} />
        )}

        {hoveredTooltip && (
          <div 
            className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none"
            style={{
              left: hoveredTooltip.position.x,
              top: hoveredTooltip.position.y - 40,
              transform: 'translateX(-50%)'
            }}
          >
            {hoveredTooltip.content}
          </div>
        )}

        {richTooltip && (
          <RichTooltip tooltip={richTooltip} />
        )}


        {/* Floating Agentic AI Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsGlobalNewsOpen(true)}
            className="group relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            <Brain className="w-8 h-8" />
            
            {/* Notification Badge for Critical Insights */}
            {newsStats.critical > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                {newsStats.critical}
              </div>
            )}
            
            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 animate-ping"></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Global AI Insights
            </div>
          </button>
        </div>

      </main>
    </div>
  );
}
