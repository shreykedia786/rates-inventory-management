/**
 * Enhanced Agentic AI Intelligence Dashboard
 * Comprehensive actionable insights for Revenue Managers with real-time analytics
 */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, TrendingUp, TrendingDown, AlertTriangle, Clock, Target, BarChart3, Users, MapPin, ExternalLink, RefreshCw, Filter, ChevronDown, ChevronRight, Eye, EyeOff, Play, Pause, Settings, Bell, BellRing, CheckCircle, XCircle, AlertCircle, Info, Calendar, Building, DollarSign, Activity, Zap, Brain, Sparkles, ChevronUp, ArrowRight, Star, Shield, LineChart, PieChart, Gauge, Bot, Cpu, MessageSquare, Database, Layers, TrendingUp as TrendUp, Search, BookOpen, FileText, Monitor, Upload, Download, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  insights: any[];
  isDark: boolean;
  onApplyInsight: (insight: any) => void;
  onDismissInsight: (insight: any) => void;
  onRefreshInsights: () => Promise<void>;
  isLoading?: boolean;
}

export default function EnhancedAgenticAI({
  isOpen,
  onClose,
  insights,
  isDark,
  onApplyInsight,
  onDismissInsight,
  onRefreshInsights,
  isLoading = false
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'analytics' | 'automation' | 'settings'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Enhanced Revenue-Focused Metrics
  const revenueMetrics = useMemo(() => ({
    totalRevenue: 2847500,
    revenueGrowth: 12.5,
    revpar: 185.50,
    adr: 245.75,
    occupancy: 75.5,
    bookingPace: 8.3,
    cancellationRate: 4.2,
    denialRate: 2.1,
    segmentMix: {
      corporate: 35,
      leisure: 45,
      group: 20
    },
    channelMix: {
      direct: 30,
      ota: 50,
      corporate: 15,
      gds: 5
    }
  }), []);

  // Competitive Intelligence Data
  const competitorData = useMemo(() => [
    { name: 'Hotel A', adr: 235.00, occupancy: 78.2, revpar: 183.75, change: -2.3 },
    { name: 'Hotel B', adr: 255.50, occupancy: 72.8, change: 1.8 },
    { name: 'Hotel C', adr: 225.25, occupancy: 81.0, change: 3.2 },
    { name: 'Market Avg', adr: 240.15, occupancy: 76.5, change: 0.8 }
  ], []);

  // Real-time action items with specific instructions
  const actionItems = useMemo(() => [
    {
      id: 'pricing-opp-1',
      title: 'Weekend Premium Pricing Opportunity',
      urgency: 'high',
      impact: 'revenue_increase',
      timeframe: 'immediate',
      action: 'Increase weekend rates by 15% for Deluxe Rooms',
      rateCodes: ['BAR', 'ADV21', 'ADV7'],
      dates: ['2024-02-17', '2024-02-18', '2024-02-24', '2024-02-25'],
      expectedRevenue: 35000,
      confidence: 92,
      reasoning: 'Competitor rates 18% higher, demand surge detected'
    },
    {
      id: 'inventory-action-1',
      title: 'Corporate Block Availability Alert',
      urgency: 'critical',
      impact: 'revenue_protection',
      timeframe: '2 hours',
      action: 'Close out Standard rooms for corporate rates Feb 20-22',
      rateCodes: ['CORP', 'GOV'],
      expectedRevenue: -12000,
      confidence: 88,
      reasoning: 'High demand period, leisure rates 25% higher'
    },
    {
      id: 'channel-opt-1',
      title: 'OTA Commission Optimization',
      urgency: 'medium',
      impact: 'margin_improvement',
      timeframe: '24 hours',
      action: 'Reduce Booking.com allocation by 20%, increase direct booking rates',
      channels: ['Booking.com', 'Expedia'],
      expectedRevenue: 8500,
      confidence: 76,
      reasoning: 'Direct bookings trending up 15%, reduce commission costs'
    }
  ], []);

  // Enhanced Overview Dashboard
  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">RevPAR</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">₹{revenueMetrics.revpar}</div>
          <div className="text-xs text-green-500">+{revenueMetrics.revenueGrowth}% vs LY</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">ADR</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">₹{revenueMetrics.adr}</div>
          <div className="text-xs text-blue-500">+8.2% vs comp set</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Occupancy</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{revenueMetrics.occupancy}%</div>
          <div className="text-xs text-purple-500">Target: 78%</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Pickup Pace</span>
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">{revenueMetrics.bookingPace}%</div>
          <div className="text-xs text-orange-500">Above forecast</div>
        </div>
      </div>

      {/* Immediate Action Items */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Immediate Action Required
        </h3>
        <div className="space-y-4">
          {actionItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border-l-4 ${
              item.urgency === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
              item.urgency === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
              'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{item.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                    item.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.timeframe}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    ₹{item.expectedRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm mb-3">{item.action}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.reasoning}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Apply Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Analytics Dashboard
  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Performance Trends */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          Revenue Performance Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">7-Day Trend</h4>
            <div className="text-2xl font-bold text-green-500">+12.3%</div>
            <div className="text-sm text-gray-500">vs last week</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">30-Day Trend</h4>
            <div className="text-2xl font-bold text-blue-500">+8.7%</div>
            <div className="text-sm text-gray-500">vs last month</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">YTD Performance</h4>
            <div className="text-2xl font-bold text-purple-500">+15.2%</div>
            <div className="text-sm text-gray-500">vs budget</div>
          </div>
        </div>
      </div>

      {/* Competitive Positioning */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Competitive Intelligence
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Property</th>
                <th className="text-right p-2">ADR</th>
                <th className="text-right p-2">Occ %</th>
                <th className="text-right p-2">RevPAR</th>
                <th className="text-right p-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {competitorData.map((comp, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{comp.name}</td>
                  <td className="text-right p-2">₹{comp.adr}</td>
                  <td className="text-right p-2">{comp.occupancy}%</td>
                  <td className="text-right p-2">₹{(comp.adr * comp.occupancy / 100).toFixed(0)}</td>
                  <td className={`text-right p-2 ${comp.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {comp.change >= 0 ? '+' : ''}{comp.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Segment Analysis */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Revenue by Segment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(revenueMetrics.segmentMix).map(([segment, percentage]) => (
            <div key={segment} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium capitalize">{segment}</span>
                <span className="text-xl font-bold">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    segment === 'corporate' ? 'bg-blue-500' :
                    segment === 'leisure' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Automation Dashboard
  const AutomationDashboard = () => (
    <div className="space-y-6">
      {/* Automation Status */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Automation Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Auto-Pricing</h4>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
            <div className="text-xs text-gray-500">Last adjustment: 2 hours ago</div>
            <div className="text-xs text-gray-500">Revenue impact: +₹15,200</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Inventory Optimization</h4>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
            <div className="text-xs text-gray-500">Last optimization: 45 min ago</div>
            <div className="text-xs text-gray-500">Efficiency gain: +8.3%</div>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Active Automation Rules
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Weekend Premium Pricing', status: 'active', trigger: 'Occupancy > 75%', action: 'Increase rates by 10-20%' },
            { name: 'Last Minute Inventory Push', status: 'active', trigger: 'T-2 days, Occ < 60%', action: 'Open discounted rates' },
            { name: 'Corporate Rate Protection', status: 'paused', trigger: 'High demand period', action: 'Close corporate rates' }
          ].map((rule, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    <div>Trigger: {rule.trigger}</div>
                    <div>Action: {rule.action}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm capitalize">{rule.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Settings Dashboard
  const SettingsDashboard = () => (
    <div className="space-y-6">
      {/* AI Preferences */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Intelligence Settings
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Recommendation Sensitivity</h4>
              <p className="text-sm text-gray-500">How aggressive should AI recommendations be?</p>
            </div>
            <select className="border rounded-lg px-3 py-2">
              <option>Conservative</option>
              <option>Balanced</option>
              <option selected>Aggressive</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Auto-execution Threshold</h4>
              <p className="text-sm text-gray-500">Minimum confidence for automatic actions</p>
            </div>
            <input type="range" min="70" max="95" value="85" className="w-32" />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Real-time Notifications</h4>
              <p className="text-sm text-gray-500">Get instant alerts for critical opportunities</p>
            </div>
            <button className="toggle-switch bg-blue-500 w-12 h-6 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Performance Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">AI Accuracy Score</h4>
            <div className="text-3xl font-bold text-green-500">94.7%</div>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Revenue Generated</h4>
            <div className="text-3xl font-bold text-blue-500">₹2.3M</div>
            <div className="text-sm text-gray-500">From AI recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-7xl bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Enhanced Agentic AI</h1>
                <p className="text-blue-100 mt-1">Comprehensive Revenue Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
              <button onClick={onRefreshInsights} className="p-3 bg-white/10 rounded-xl hover:bg-white/20">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-3 bg-white/10 rounded-xl hover:bg-red-500/80">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6">
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              {[
                { id: 'overview', label: 'Overview', icon: Monitor },
                { id: 'insights', label: 'Insights', icon: Brain },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'automation', label: 'Automation', icon: Bot },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-200px)] overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'automation' && <AutomationDashboard />}
          {activeTab === 'settings' && <SettingsDashboard />}
          {activeTab === 'insights' && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Detailed Insights</h3>
              <p className="text-gray-500">Enhanced insights view with full details coming next...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 