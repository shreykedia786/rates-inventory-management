/**
 * Revenue Analytics Component
 * Advanced analytics panel with charts, KPIs, and comparative analysis for revenue managers
 */
'use client';

import React from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Target, 
  Calendar, Users, DollarSign, Package, AlertCircle, Star
} from 'lucide-react';

interface RevenueAnalyticsProps {
  monthlyData: any[];
  selectedMetric: string;
  monthlyViewDate: Date;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  monthlyData,
  selectedMetric,
  monthlyViewDate
}) => {
  // Calculate KPIs
  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revpar * d.inventory, 0);
  const avgOccupancy = monthlyData.reduce((sum, d) => sum + d.occupancy, 0) / monthlyData.length;
  const avgADR = monthlyData.reduce((sum, d) => sum + d.adr, 0) / monthlyData.length;
  const avgRevPAR = monthlyData.reduce((sum, d) => sum + d.revpar, 0) / monthlyData.length;
  
  // Performance indicators
  const weekendData = monthlyData.filter(d => {
    const date = new Date(d.date);
    return date.getDay() === 0 || date.getDay() === 6;
  });
  const weekdayData = monthlyData.filter(d => {
    const date = new Date(d.date);
    return date.getDay() !== 0 && date.getDay() !== 6;
  });

  const weekendRevPAR = weekendData.reduce((sum, d) => sum + d.revpar, 0) / weekendData.length;
  const weekdayRevPAR = weekdayData.reduce((sum, d) => sum + d.revpar, 0) / weekdayData.length;

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
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Executive Summary - {monthlyViewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% vs last month
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg RevPAR</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(avgRevPAR)}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +8.3% vs budget
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Occupancy</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatPercentage(avgOccupancy)}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              -2.1% vs last year
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg ADR</span>
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(avgADR)}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +15.2% vs last year
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekend vs Weekday Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekend vs Weekday Performance
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Weekend RevPAR</span>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(weekendRevPAR)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">Premium</span>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  +{formatPercentage((weekendRevPAR - weekdayRevPAR) / weekdayRevPAR * 100)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Weekday RevPAR</span>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {formatCurrency(weekdayRevPAR)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base Rate</span>
                <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Standard
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Days */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Days
          </h4>
          <div className="space-y-3">
            {monthlyData
              .sort((a, b) => b.revpar - a.revpar)
              .slice(0, 5)
              .map((day, index) => {
                const date = new Date(day.date);
                return (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPercentage(day.occupancy)} Occupancy
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(day.revpar)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        RevPAR
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          AI-Powered Insights & Recommendations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-400">Opportunity</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Weekday rates are 15% below market average. Consider increasing ADR by ₹800-1200 for Tuesday-Thursday.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-400">Market Alert</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Competitor A has reduced rates by 8% for next month. Monitor booking pace and adjust strategy accordingly.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800 dark:text-purple-400">Seasonal Pattern</span>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Historical data shows 22% increase in demand during weeks 2-3. Consider implementing dynamic pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 