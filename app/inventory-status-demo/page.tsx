'use client';

import React, { useState } from 'react';
import InventoryStatusIcon, { InventoryStatus } from '../../components/InventoryStatusIcon';
import InventoryStatusTooltip from '../../components/InventoryStatusTooltip';
import InventoryStatusLegend from '../../components/InventoryStatusLegend';

export default function InventoryStatusDemo() {
  const [isDark, setIsDark] = useState(false);
  const [tooltip, setTooltip] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    data?: any;
  }>({ isVisible: false, position: { x: 0, y: 0 } });

  // Mock inventory status data - FIXED LOGICAL INCONSISTENCIES
  const mockStatuses: InventoryStatus[] = [
    {
      level: 'critical',
      displayText: 'sellout risk',
      colorClass: 'bg-red-500',
      actionRequired: 'Immediate inventory action required',
      reasoning: ['Very low inventory levels', 'High booking pace detected', 'Peak season demand'],
      urgency: 'immediate',
      confidence: 95,
      factors: {
        demandPace: 15.5,           // High positive demand - makes sense for critical
        competitorPosition: 'advantage',  // FIXED: We have advantage because competitors likely sold out too
        eventImpact: 'positive',    // Event driving demand - logical
        seasonalTrend: 'peak'       // Peak season - consistent with high demand
      }
    },
    {
      level: 'low',
      displayText: 'slow pace',
      colorClass: 'bg-orange-500',
      actionRequired: 'Consider promotional pricing',
      reasoning: ['Below optimal inventory levels', 'Declining demand trend', 'Monitor booking pace'], // FIXED: Now matches negative pace
      urgency: 'monitor',
      confidence: 78,
      factors: {
        demandPace: -8.2,           // FIXED: More significant negative pace to justify "slow pace"
        competitorPosition: 'disadvantage', // We're struggling vs competitors
        eventImpact: 'none',        // No special events
        seasonalTrend: 'shoulder'   // Shoulder season - reasonable
      }
    },
    {
      level: 'optimal',
      displayText: 'good pace',
      colorClass: 'bg-green-500',
      actionRequired: 'Monitor and maintain strategy',
      reasoning: ['Healthy inventory levels', 'Strong booking pace', 'Competitive positioning'], // FIXED: More positive language
      urgency: 'stable',
      confidence: 88,
      factors: {
        demandPace: 12.4,           // FIXED: Positive pace for "good pace"
        competitorPosition: 'advantage',  // We're doing well vs competitors
        eventImpact: 'positive',    // FIXED: Some positive event impact supporting good pace
        seasonalTrend: 'shoulder'   // Shoulder season but still performing well
      }
    },
    {
      level: 'oversupply',
      displayText: 'poor demand',
      colorClass: 'bg-purple-500',
      actionRequired: 'Aggressive pricing needed',
      reasoning: ['High inventory levels', 'Weak booking pace', 'Market oversupply'], // FIXED: Consistent language
      urgency: 'monitor',
      confidence: 72,
      factors: {
        demandPace: -18.3,          // FIXED: Very negative pace for poor demand
        competitorPosition: 'disadvantage', // Market struggling overall
        eventImpact: 'none',        // FIXED: No event impact - oversupply is due to seasonal factor
        seasonalTrend: 'off-peak'   // Off-peak season explains the oversupply
      }
    }
  ];

  const sampleInventoryData = [
    { roomType: 'Deluxe Ocean View', inventory: 3, status: mockStatuses[0], date: '2024-02-15' },
    { roomType: 'Standard City View', inventory: 8, status: mockStatuses[1], date: '2024-02-16' },
    { roomType: 'Premium Suite', inventory: 15, status: mockStatuses[2], date: '2024-02-17' },
    { roomType: 'Executive Room', inventory: 25, status: mockStatuses[3], date: '2024-02-18' }
  ];

  const handleIconHover = (e: React.MouseEvent, tooltipData: any) => {
    setTooltip({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY },
      data: tooltipData
    });
  };

  const handleIconHoverEnd = () => {
    setTooltip({ isVisible: false, position: { x: 0, y: 0 } });
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Inventory Status Icons Demo
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  New icon-based status indicators with rich tooltips
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                         flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Before/After Comparison */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  🔄 Before vs After Comparison
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before: Text Labels */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      ❌ Before: Text Labels
                    </h3>
                    <div className="space-y-3">
                      {sampleInventoryData.map((item, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {item.roomType}
                            </span>
                            <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                              {item.inventory}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              item.status.level === 'critical' ? 'bg-red-500' :
                              item.status.level === 'low' ? 'bg-orange-500' :
                              item.status.level === 'optimal' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`} />
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.status.level === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              item.status.level === 'low' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              item.status.level === 'optimal' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {item.status.displayText}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* After: Icon Only */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      ✅ After: Icon Only (Hover for Details)
                    </h3>
                    <div className="space-y-3">
                      {sampleInventoryData.map((item, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {item.roomType}
                            </span>
                            <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                              {item.inventory}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                            <InventoryStatusIcon
                              status={item.status}
                              inventory={item.inventory}
                              roomType={item.roomType}
                              date={item.date}
                              onHover={handleIconHover}
                              onHoverEnd={handleIconHoverEnd}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Grid Demo */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  📊 Inventory Grid with Icons
                </h2>
                
                <div className="grid grid-cols-7 gap-2">
                  {/* Header */}
                  <div className="font-medium text-gray-900 dark:text-white text-sm p-2">Room Type</div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-medium text-gray-900 dark:text-white text-sm p-2 text-center">
                      {day}
                    </div>
                  ))}
                  
                  {/* Sample row */}
                  <div className="font-medium text-gray-900 dark:text-white text-sm p-2">Ocean Suite</div>
                  {[12, 3, 8, 15, 7, 2, 18].map((inventory, dayIndex) => {
                    const statusIndex = inventory <= 5 ? 0 : inventory <= 10 ? 1 : inventory <= 15 ? 2 : 3;
                    return (
                      <div key={dayIndex} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-800">
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
                          {inventory}
                        </div>
                        <div className="flex justify-center">
                          <InventoryStatusIcon
                            status={mockStatuses[statusIndex]}
                            inventory={inventory}
                            roomType="Ocean Suite"
                            date={`2024-02-${15 + dayIndex}`}
                            onHover={handleIconHover}
                            onHoverEnd={handleIconHoverEnd}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-6">
              <InventoryStatusLegend 
                isDark={isDark}
                isCollapsible={true}
                defaultCollapsed={false}
              />

              {/* Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🚀 Benefits of Icon-Based Status
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Cleaner, less cluttered interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Faster visual scanning of large grids</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Rich detailed information on hover</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Universal icon language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Better mobile experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Accessibility compliant</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              ← Back to Main Application
            </a>
            <a 
              href="/integrated-header-demo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Header Demo →
            </a>
          </div>
        </div>

        {/* Rich Tooltip */}
        {tooltip.isVisible && tooltip.data && (
          <InventoryStatusTooltip
            status={tooltip.data.status}
            inventory={tooltip.data.inventory}
            roomType={tooltip.data.roomType}
            date={tooltip.data.date}
            config={tooltip.data.config}
            position={tooltip.position}
            isVisible={tooltip.isVisible}
          />
        )}
      </div>
    </div>
  );
} 