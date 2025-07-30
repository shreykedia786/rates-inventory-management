/**
 * Publish Confirmation Modal - Enhanced List View
 * Clear overview of rate plans, room types and dates affected by changes
 * Inspired by Oliver Magazine Design System for clean, data-dense interfaces
 */
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Save, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Building,
  Package,
  Target,
  Users,
  BarChart3,
  Clock,
  ArrowUp,
  ArrowDown,
  Zap,
  Shield,
  Eye,
  FileText,
  Tag
} from 'lucide-react';

interface Change {
  id: string;
  type: 'price' | 'inventory';
  room: string;
  ratePlan?: string; // Added rate plan for price changes
  product?: string;
  date: string;
  oldValue: number;
  newValue: number;
  timestamp: Date;
}

interface PublishConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: Change[];
  isDark?: boolean;
}

interface RevenueImpact {
  totalRevenue: number;
  adrImpact: number;
  occupancyImpact: number;
  revparImpact: number;
  competitiveRisk: 'low' | 'medium' | 'high';
  marketPosition: 'aggressive' | 'competitive' | 'conservative';
}

interface ChangeAnalysis {
  priceChanges: Change[];
  inventoryChanges: Change[];
  affectedRooms: string[];
  affectedRatePlans: string[];
  affectedDates: string[];
  totalImpact: RevenueImpact;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  };
}

export default function PublishConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  changes, 
  isDark = false 
}: PublishConfirmationProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Analyze changes and calculate impact
   */
  const analyzeChanges = (): ChangeAnalysis => {
    const priceChanges = changes.filter(c => c.type === 'price');
    const inventoryChanges = changes.filter(c => c.type === 'inventory');
    
    const affectedRooms = Array.from(new Set(changes.map(c => c.room)));
    const affectedRatePlans = Array.from(new Set(priceChanges.filter(c => c.ratePlan).map(c => c.ratePlan!)));
    const affectedDates = Array.from(new Set(changes.map(c => c.date)));

    // Calculate revenue impact (mock calculation)
    const totalRevenue = priceChanges.reduce((sum, change) => {
      const priceChange = change.newValue - change.oldValue;
      return sum + (priceChange * 30); // Assume 30 rooms affected
    }, 0);

    const adrImpact = priceChanges.length > 0 
      ? priceChanges.reduce((sum, change) => {
          const percentChange = ((change.newValue - change.oldValue) / change.oldValue) * 100;
          return sum + percentChange;
        }, 0) / priceChanges.length
      : 0;

    const occupancyImpact = inventoryChanges.length > 0
      ? inventoryChanges.reduce((sum, change) => {
          const percentChange = ((change.newValue - change.oldValue) / change.oldValue) * 100;
          return sum + percentChange;
        }, 0) / inventoryChanges.length
      : 0;

    const revparImpact = adrImpact + (occupancyImpact * 0.3);

    // Risk assessment
    const riskFactors = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (Math.abs(adrImpact) > 10) {
      riskFactors.push('Significant ADR changes detected');
      riskLevel = 'medium';
    }
    if (Math.abs(occupancyImpact) > 20) {
      riskFactors.push('Large inventory adjustments');
      riskLevel = 'high';
    }
    if (priceChanges.length > 10) {
      riskFactors.push('High volume of price changes');
      riskLevel = 'medium';
    }

    const recommendations = [];
    if (adrImpact < -5) {
      recommendations.push('Consider competitor response to rate decreases');
    }
    if (occupancyImpact > 15) {
      recommendations.push('Monitor booking pace after inventory increases');
    }
    if (changes.length > 20) {
      recommendations.push('Implement changes gradually to monitor impact');
    }

    return {
      priceChanges,
      inventoryChanges,
      affectedRooms,
      affectedRatePlans,
      affectedDates,
      totalImpact: {
        totalRevenue,
        adrImpact,
        occupancyImpact,
        revparImpact,
        competitiveRisk: riskLevel,
        marketPosition: adrImpact > 5 ? 'aggressive' : adrImpact < -5 ? 'conservative' : 'competitive'
      },
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors,
        recommendations
      }
    };
  };

  const analysis = analyzeChanges();

  const handleConfirm = async () => {
    setIsPublishing(true);
    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    onConfirm();
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getImpactColor = (value: number) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group changes by type for better organization
  const groupedPriceChanges = useMemo(() => {
    const grouped: { [key: string]: Change[] } = {};
    analysis.priceChanges.forEach(change => {
      const key = `${change.ratePlan || 'Unknown'}-${change.room}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(change);
    });
    return grouped;
  }, [analysis.priceChanges]);

  const groupedInventoryChanges = useMemo(() => {
    const grouped: { [key: string]: Change[] } = {};
    analysis.inventoryChanges.forEach(change => {
      const key = change.room;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(change);
    });
    return grouped;
  }, [analysis.inventoryChanges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden rounded-xl shadow-2xl ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Publish Confirmation</h2>
              <p className="text-sm text-gray-500">
                Review {changes.length} changes across {analysis.affectedRooms.length} room types, {analysis.affectedRatePlans.length} rate plans and {analysis.affectedDates.length} dates
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Changes</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{changes.length}</div>
              <div className="text-xs text-blue-600 mt-1">
                {analysis.priceChanges.length} rates • {analysis.inventoryChanges.length} inventory
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Revenue Impact</span>
              </div>
              <div className={`text-2xl font-bold ${getImpactColor(analysis.totalImpact.totalRevenue)}`}>
                {analysis.totalImpact.totalRevenue > 0 ? '+' : ''}
                ${Math.abs(analysis.totalImpact.totalRevenue).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">RevPAR Impact</span>
              </div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${getImpactColor(analysis.totalImpact.revparImpact)}`}>
                {analysis.totalImpact.revparImpact > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(analysis.totalImpact.revparImpact).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Risk Level</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(analysis.riskAssessment.level)}`}>
                {analysis.riskAssessment.level.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Changes Overview - Enhanced List View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rate Changes with Rate Plans */}
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Rate Changes ({analysis.priceChanges.length})
                </h3>
                <p className="text-xs text-gray-600 mt-1">Organized by rate plan and room type</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {Object.keys(groupedPriceChanges).length > 0 ? (
                  Object.entries(groupedPriceChanges).map(([key, groupChanges]) => {
                    const [ratePlan, roomType] = key.split('-');
                    return (
                      <div key={key} className="border-b border-gray-100 last:border-b-0">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span>{ratePlan}</span>
                            <span className="text-gray-400">•</span>
                            <Building className="w-4 h-4 text-gray-600" />
                            <span>{roomType}</span>
                          </div>
                        </div>
                        {groupChanges.map(change => (
                          <div key={change.id} className="flex items-center justify-between p-3 text-sm">
                            <div>
                              <span className="text-gray-600 text-xs">{formatDateShort(change.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-right">
                              <span className="text-gray-500">${change.oldValue}</span>
                              <span className="text-gray-400">→</span>
                              <span className={`font-medium ${getImpactColor(change.newValue - change.oldValue)}`}>
                                ${change.newValue}
                              </span>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                change.newValue > change.oldValue 
                                  ? 'bg-green-100 text-green-700' 
                                  : change.newValue < change.oldValue 
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}>
                                {change.newValue > change.oldValue ? '+' : ''}
                                {(((change.newValue - change.oldValue) / change.oldValue) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No rate changes</div>
                )}
              </div>
            </div>

            {/* Inventory Changes */}
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Inventory Changes ({analysis.inventoryChanges.length})
                </h3>
                <p className="text-xs text-gray-600 mt-1">Organized by room type</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {Object.keys(groupedInventoryChanges).length > 0 ? (
                  Object.entries(groupedInventoryChanges).map(([roomType, groupChanges]) => (
                    <div key={roomType} className="border-b border-gray-100 last:border-b-0">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Building className="w-4 h-4 text-blue-600" />
                          <span>{roomType}</span>
                        </div>
                      </div>
                      {groupChanges.map(change => (
                        <div key={change.id} className="flex items-center justify-between p-3 text-sm">
                          <div>
                            <span className="text-gray-600 text-xs">{formatDateShort(change.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="text-gray-500">{change.oldValue}</span>
                            <span className="text-gray-400">→</span>
                            <span className={`font-medium ${getImpactColor(change.newValue - change.oldValue)}`}>
                              {change.newValue}
                            </span>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              change.newValue > change.oldValue 
                                ? 'bg-green-100 text-green-700' 
                                : change.newValue < change.oldValue 
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              {change.newValue > change.oldValue ? '+' : ''}
                              {change.newValue - change.oldValue}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No inventory changes</div>
                )}
              </div>
            </div>
          </div>

          {/* Affected Scope Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-600" />
              Affected Scope Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Room Types ({analysis.affectedRooms.length})</div>
                <div className="flex flex-wrap gap-1">
                  {analysis.affectedRooms.map(room => (
                    <span key={room} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {room}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Rate Plans ({analysis.affectedRatePlans.length})</div>
                <div className="flex flex-wrap gap-1">
                  {analysis.affectedRatePlans.map(ratePlan => (
                    <span key={ratePlan} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {ratePlan}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Dates ({analysis.affectedDates.length})</div>
                <div className="flex flex-wrap gap-1">
                  {analysis.affectedDates.slice(0, 5).map(date => (
                    <span key={date} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {formatDateShort(date)}
                    </span>
                  ))}
                  {analysis.affectedDates.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      +{analysis.affectedDates.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          {analysis.riskAssessment.level !== 'low' && (
            <div className={`border rounded-lg p-4 ${getRiskColor(analysis.riskAssessment.level)}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
              </h3>
              <div className="space-y-2">
                {analysis.riskAssessment.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                    {factor}
                  </div>
                ))}
                {analysis.riskAssessment.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <div className="text-sm font-medium mb-2">Recommendations:</div>
                    {analysis.riskAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                        {rec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            Changes will be published immediately and cannot be undone
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isPublishing}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Confirm & Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 