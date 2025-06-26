import React, { useState } from 'react';
import { 
  ArrowLeft,
  BarChart3, 
  Brain, 
  Calendar,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  TrendingUp,
  Upload
} from 'lucide-react';

/**
 * Simplified Rates & Inventory Dashboard Component
 * Enterprise design with Tailwind CSS styling
 */
export function RatesInventoryDashboard() {
  const [selectedView, setSelectedView] = useState('grid');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Overview</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rates & Inventory Dashboard</h1>
                <p className="text-sm text-gray-500">Manage pricing and availability across all channels</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Sync</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties, room types..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Properties</option>
                <option>Grand Hotel Downtown</option>
                <option>Seaside Resort</option>
              </select>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Rate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rates Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Rates & Inventory Grid</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sample Grid Data */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5].map((row) => (
                      <tr key={row} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Standard Room
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Best Available Rate
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          2025-06-{12 + row}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            defaultValue={150 + row * 10}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            defaultValue={25 - row}
                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Synced
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900">AI Insights</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Rate Recommendations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Rate Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Standard Room</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">High Confidence</span>
                      </div>
                      <p className="text-sm text-blue-800">Increase rate to $185 (+15%)</p>
                      <p className="text-xs text-blue-600 mt-1">Based on demand surge</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-900">Deluxe Suite</span>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Medium</span>
                      </div>
                      <p className="text-sm text-yellow-800">Consider rate of $275</p>
                      <p className="text-xs text-yellow-600 mt-1">Market competitive</p>
                    </div>
                  </div>
                </div>

                {/* Market Trends */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Market Trends</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Demand Index</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Competitor ADR</span>
                      <span className="text-sm font-medium text-gray-900">$168</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Occupancy Forecast</span>
                      <span className="text-sm font-medium text-blue-600">87%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Apply AI Recommendations
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Refresh Market Data
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Export Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Status */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Sync Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Booking.com', status: 'synced', lastSync: '2 min ago' },
                { name: 'Expedia', status: 'synced', lastSync: '5 min ago' },
                { name: 'Agoda', status: 'pending', lastSync: '10 min ago' },
                { name: 'Hotels.com', status: 'synced', lastSync: '3 min ago' },
                { name: 'Direct', status: 'synced', lastSync: '1 min ago' },
              ].map((channel) => (
                <div key={channel.name} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      channel.status === 'synced' ? 'bg-green-500' : 
                      channel.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-xs text-gray-500">Last sync: {channel.lastSync}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 