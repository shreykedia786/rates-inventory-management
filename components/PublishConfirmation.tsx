/**
 * Publish Confirmation Modal
 * Comprehensive summary of changes before publishing
 * Shows revenue impact, change breakdown, and risk assessment
 */
'use client';

import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

interface Change {
  id: string;
  type: 'price' | 'inventory';
  room: string;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
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
              <p className="text-sm text-gray-500">Review your changes before publishing</p>
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
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Changes</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{changes.length}</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Revenue Impact</span>
              </div>
              <div className={`text-2xl font-bold ${getImpactColor(analysis.totalImpact.totalRevenue)}`}>
                {analysis.totalImpact.totalRevenue > 0 ? '+' : ''}
                ${Math.abs(analysis.totalImpact.totalRevenue).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">RevPAR Impact</span>
              </div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${getImpactColor(analysis.totalImpact.revparImpact)}`}>
                {analysis.totalImpact.revparImpact > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(analysis.totalImpact.revparImpact).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Risk Level</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(analysis.riskAssessment.level)}`}>
                {analysis.riskAssessment.level.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Revenue Impact Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Revenue Impact Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">ADR Impact</div>
                <div className={`font-bold flex items-center gap-1 ${getImpactColor(analysis.totalImpact.adrImpact)}`}>
                  {analysis.totalImpact.adrImpact > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(analysis.totalImpact.adrImpact).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Occupancy Impact</div>
                <div className={`font-bold flex items-center gap-1 ${getImpactColor(analysis.totalImpact.occupancyImpact)}`}>
                  {analysis.totalImpact.occupancyImpact > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(analysis.totalImpact.occupancyImpact).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Market Position</div>
                <div className={`font-bold ${
                  analysis.totalImpact.marketPosition === 'aggressive' ? 'text-red-600' :
                  analysis.totalImpact.marketPosition === 'conservative' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {analysis.totalImpact.marketPosition.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Change Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Changes */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Price Changes ({analysis.priceChanges.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {analysis.priceChanges.slice(0, 5).map(change => (
                  <div key={change.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{change.room}</span>
                      {change.product && <span className="text-gray-500"> • {change.product}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">${change.oldValue}</span>
                      <span>→</span>
                      <span className={`font-medium ${getImpactColor(change.newValue - change.oldValue)}`}>
                        ${change.newValue}
                      </span>
                    </div>
                  </div>
                ))}
                {analysis.priceChanges.length > 5 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{analysis.priceChanges.length - 5} more changes
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Changes */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Inventory Changes ({analysis.inventoryChanges.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {analysis.inventoryChanges.slice(0, 5).map(change => (
                  <div key={change.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{change.room}</span>
                      <span className="text-gray-500"> • {change.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{change.oldValue}</span>
                      <span>→</span>
                      <span className={`font-medium ${getImpactColor(change.newValue - change.oldValue)}`}>
                        {change.newValue}
                      </span>
                    </div>
                  </div>
                ))}
                {analysis.inventoryChanges.length > 5 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{analysis.inventoryChanges.length - 5} more changes
                  </div>
                )}
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

          {/* Affected Scope */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-600" />
              Affected Scope
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="text-sm text-gray-600 mb-2">Dates ({analysis.affectedDates.length})</div>
                <div className="flex flex-wrap gap-1">
                  {analysis.affectedDates.slice(0, 5).map(date => (
                    <span key={date} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {date}
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