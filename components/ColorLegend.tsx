import React, { useState } from 'react';
import { X, Info, Brain, CheckCircle, Clock, AlertTriangle, TrendingDown, Target, Zap, Activity, Lock, Calendar, Sparkles, Edit3, Globe } from 'lucide-react';

interface ColorLegendProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Comprehensive Color Legend Component
 * 
 * Explains all color coding used throughout the rates & inventory management system.
 * Updated to match actual implementation in the codebase.
 */
export default function ColorLegend({ isOpen, onClose }: ColorLegendProps) {
  const [activeCategory, setActiveCategory] = useState<string>('cell-states');

  if (!isOpen) return null;

  const legendCategories = [
    {
      id: 'cell-states',
      title: 'Cell States & Indicators',
      icon: Edit3,
      items: [
        {
          color: 'bg-orange-50 border border-orange-300',
          indicator: 'w-3 h-3 bg-orange-500 rounded-full',
          label: 'Orange Ring/Background',
          description: 'Cell has been modified/changed from original value',
          example: 'Price or inventory updated, shows original → new value'
        },
        {
          color: 'bg-purple-50 border border-purple-200',
          indicator: 'w-3 h-3 bg-purple-500 rounded-full',
          label: 'Purple Ring/Border',
          description: 'AI has recommendations available for this cell',
          example: 'Cells with AI pricing or inventory suggestions'
        },
        {
          color: 'bg-orange-50 border border-orange-200',
          indicator: 'w-3 h-3 bg-orange-200 rounded-full',
          label: 'Orange Event Background',
          description: 'Cell affected by events (conferences, festivals, etc.)',
          example: 'Dates with high-impact events nearby'
        },
        {
          color: 'bg-red-100 border border-red-300',
          indicator: 'w-3 h-3 bg-red-500 rounded-full',
          label: 'Red Closeout',
          description: 'Room closed for arrival/departure',
          example: 'Restrictions preventing bookings'
        }
      ]
    },
    {
      id: 'ai-insights',
      title: 'AI Insights & Agent Status',
      icon: Brain,
      items: [
        {
          color: 'bg-green-50 border-l-4 border-green-400',
          indicator: 'w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center',
          iconComponent: Zap,
          iconColor: 'text-green-500',
          label: 'Green AI Icons',
          description: 'AI auto-execute capabilities active',
          example: 'AI agent can automatically apply suggestions'
        },
        {
          color: 'bg-purple-50 border-l-4 border-purple-400',
          indicator: 'w-4 h-4 bg-purple-100 border border-purple-200 rounded flex items-center justify-center',
          iconComponent: Brain,
          iconColor: 'text-purple-600',
          label: 'Purple AI Badges',
          description: 'AI insights available but require manual approval',
          example: 'Confidence scores, recommendations needing review'
        },
        {
          color: 'bg-red-50 border-l-4 border-red-400',
          indicator: 'w-4 h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center',
          iconComponent: AlertTriangle,
          iconColor: 'text-red-600',
          label: 'Red Confidence/Alerts',
          description: 'Low confidence AI recommendations or critical alerts',
          example: 'Confidence below 60%, critical impact warnings'
        }
      ]
    },
    {
      id: 'competitor-position',
      title: 'Competitive Position',
      icon: Globe,
      items: [
        {
          color: 'bg-green-100 border border-green-200',
          indicator: 'w-3 h-3 bg-green-500 rounded-full',
          label: 'Green Competitor Dots',
          description: 'Your rate is higher than competitors (premium positioning)',
          example: 'Rate advantage, higher pricing than market'
        },
        {
          color: 'bg-yellow-100 border border-yellow-200',
          indicator: 'w-3 h-3 bg-yellow-500 rounded-full',
          label: 'Yellow Competitor Dots',
          description: 'Your rate is competitive/at market parity',
          example: 'Similar pricing to competitor average'
        },
        {
          color: 'bg-red-100 border border-red-200',
          indicator: 'w-3 h-3 bg-red-500 rounded-full',
          label: 'Red Competitor Dots',
          description: 'Your rate is lower than competitors (value positioning)',
          example: 'Priced below market, potential for rate increase'
        }
      ]
    },
    {
      id: 'inventory-status',
      title: 'Inventory Status',
      icon: Target,
      items: [
        {
          color: 'bg-red-100 border border-red-200',
          indicator: 'w-4 h-4 bg-red-100 border border-red-200 rounded flex items-center justify-center',
          iconComponent: AlertTriangle,
          iconColor: 'text-red-600',
          label: 'Critical - Sellout Risk',
          description: 'Very low inventory with high demand',
          example: 'Under 5 rooms with strong booking pace'
        },
        {
          color: 'bg-orange-100 border border-orange-200',
          indicator: 'w-4 h-4 bg-orange-100 border border-orange-200 rounded flex items-center justify-center',
          iconComponent: Clock,
          iconColor: 'text-orange-600',
          label: 'Low - Slow Pace',
          description: 'Below optimal inventory levels',
          example: '5-10 rooms with moderate demand'
        },
        {
          color: 'bg-green-100 border border-green-200',
          indicator: 'w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center',
          iconComponent: CheckCircle,
          iconColor: 'text-green-600',
          label: 'Optimal - Good Pace',
          description: 'Healthy inventory levels with good demand balance',
          example: '10-20 rooms with steady booking pace'
        },
        {
          color: 'bg-purple-100 border border-purple-200',
          indicator: 'w-4 h-4 bg-purple-100 border border-purple-200 rounded flex items-center justify-center',
          iconComponent: TrendingDown,
          iconColor: 'text-purple-600',
          label: 'Oversupply - Poor Demand',
          description: 'High inventory with low demand',
          example: 'Over 20 rooms with slow booking pace'
        }
      ]
    },
    {
      id: 'date-highlighting',
      title: 'Date & Weekend Highlighting',
      icon: Calendar,
      items: [
        {
          color: 'bg-blue-50 border border-blue-200',
          indicator: 'w-3 h-3 bg-blue-500 rounded-full',
          label: 'Blue Weekend Headers',
          description: 'Weekend dates (Saturday & Sunday)',
          example: 'Weekend highlighting in date headers'
        },
        {
          color: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400',
          indicator: 'w-3 h-3 bg-blue-600 rounded-full',
          label: 'Blue Today Highlighting',
          description: 'Current date with enhanced styling',
          example: 'Today\'s date with gradient background'
        },
        {
          color: 'bg-gray-50 border border-gray-200',
          indicator: 'w-3 h-3 bg-gray-500 rounded-full',
          label: 'Gray Regular Days',
          description: 'Normal weekdays without special events',
          example: 'Monday-Friday standard styling'
        }
      ]
    },
    {
      id: 'text-colors',
      title: 'Text & Icon Colors',
      icon: Sparkles,
      items: [
        {
          color: 'bg-gray-50 border border-gray-200',
          indicator: 'w-8 h-4 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold',
          label: 'Orange Text',
          description: 'Changed values and modification indicators',
          example: 'Modified prices, changed inventory values'
        },
        {
          color: 'bg-gray-50 border border-gray-200',
          indicator: 'w-8 h-4 bg-blue-900 rounded text-white text-xs flex items-center justify-center font-bold',
          label: 'Blue Text',
          description: 'Default inventory values and normal states',
          example: 'Unchanged inventory numbers'
        },
        {
          color: 'bg-gray-50 border border-gray-200',
          indicator: 'w-4 h-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-center',
          iconComponent: Lock,
          iconColor: 'text-orange-500',
          label: 'Orange Restriction Icons',
          description: 'Active restrictions on dates',
          example: 'Minimum stay, closed to arrival restrictions'
        },
        {
          color: 'bg-gray-50 border border-gray-200',
          indicator: 'w-2 h-2 bg-yellow-500 rounded-full',
          label: 'Yellow Event Dots',
          description: 'Event impact indicators',
          example: 'Small dots showing event influence'
        }
      ]
    }
  ];

  const activeCategData = legendCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Color Legend
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understanding color coding in your rates & inventory system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Category Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {legendCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{category.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeCategData && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <activeCategData.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {activeCategData.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {activeCategData.items.map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${item.color} dark:bg-opacity-20`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Visual Indicator */}
                          <div className="flex-shrink-0 mt-1">
                            {item.iconComponent ? (
                              <div className={item.indicator}>
                                <item.iconComponent className={`w-3 h-3 ${item.iconColor}`} />
                              </div>
                            ) : (
                              <div className={item.indicator}></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                              {item.label}
                            </h4>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                              {item.description}
                            </p>
                            {item.example && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                                <span className="font-medium">Example:</span> {item.example}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Colors may appear differently based on your system's theme settings
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 