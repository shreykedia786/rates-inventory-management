/**
 * AI-Powered Pricing Tutorial Overlay
 * Guided tour for CEO-level understanding of AI pricing intelligence
 * Enhanced for visibility, professional alignment, and novice users
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Brain, Target, Shield, Clock, CheckCircle, Sparkles, HelpCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlightType: 'element' | 'area' | 'modal';
  content: React.ReactNode;
  metrics?: {
    label: string;
    value: string;
    description: string;
  }[];
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: '👋 Welcome to Smart Pricing',
      description: 'Let\'s take a quick tour of your AI-powered pricing system',
      targetSelector: 'main',
      position: 'bottom',
      highlightType: 'modal',
      content: (
        <div className="text-center py-6">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Revenue Intelligence</h3>
            <p className="text-gray-600 max-w-sm mx-auto text-sm leading-relaxed">
              In the next 3 minutes, you'll learn how our AI helps you make smarter pricing decisions while keeping you in complete control.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">87%</div>
              <div className="text-xs text-green-700">AI Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">+13%</div>
              <div className="text-xs text-blue-700">More Revenue</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
              <div className="text-xl font-bold text-purple-600">2 min</div>
              <div className="text-xs text-purple-700">Setup Time</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">New to AI pricing? Don't worry - we'll guide you step by step!</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pricing-grid',
      title: '📊 Your Pricing Dashboard',
      description: 'This grid shows all your room rates - think of it like a smart spreadsheet',
      targetSelector: '.revenue-grid, .grid-cell',
      position: 'right',
      highlightType: 'area',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Understanding Your Grid
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Each box (called a "cell") shows a price for a specific room type on a specific date. Different colors tell you different things:
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded flex-shrink-0"></div>
              <div>
                <div className="text-sm font-medium text-blue-900">Blue cells = Room inventory</div>
                <div className="text-xs text-blue-700">Shows how many rooms are available</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded flex-shrink-0"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">White cells = Room prices</div>
                <div className="text-xs text-gray-700">Shows the rate guests will pay</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-4 h-4 bg-green-50 border-2 border-green-400 rounded flex-shrink-0"></div>
              <div>
                <div className="text-sm font-medium text-green-900">Green border = AI suggestion</div>
                <div className="text-xs text-green-700">Our AI thinks this price could be better</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-yellow-900">Pro Tip</div>
                <div className="text-xs text-yellow-800 leading-relaxed">Double-click any price to edit it. Single-click to see more details.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-insights',
      title: '🧠 Spotting AI Suggestions',
      description: 'Look for colored borders around price cells - these show where AI can help',
      targetSelector: '.has-ai-insight, .grid-cell[class*="ring-purple"], .grid-cell[class*="ring-green"]',
      position: 'left',
      highlightType: 'element',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              AI Is Working Behind the Scenes
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Our AI constantly analyzes market conditions, competitor prices, and booking patterns. When it finds an opportunity, you'll see colored borders:
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-purple-900 text-sm">Purple Border</span>
              </div>
              <div className="text-xs text-purple-700">AI has a pricing suggestion for this date</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-900 text-sm">Green Border</span>
              </div>
              <div className="text-xs text-green-700">You've already applied an AI suggestion</div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-900 text-sm">Orange Background</span>
              </div>
              <div className="text-xs text-orange-700">Special events are affecting this price</div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-900">What to do next</div>
                <div className="text-xs text-blue-800 leading-relaxed">Click on any colored cell to see why AI is suggesting a change and what the potential revenue impact could be.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-interaction',
      title: '💡 Understanding AI Recommendations',
      description: 'Click on any highlighted cell to see the AI\'s detailed reasoning and revenue impact',
      targetSelector: '.has-ai-insight, .grid-cell',
      position: 'top',
      highlightType: 'element',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Complete AI Transparency
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Unlike other AI systems that work like "black boxes," ours shows you exactly why it makes each suggestion with detailed calculations and market analysis:
            </p>
          </div>

          <div className="space-y-3">
            {/* Confidence Score Section */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 text-sm">AI Confidence Level</span>
                <span className="text-blue-600 font-bold text-sm">87%</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Based on 15,000+ similar pricing scenarios</div>
                <div>• 92% historical success rate for this type of suggestion</div>
                <div>• High confidence due to strong market signals</div>
              </div>
            </div>
            
            {/* Urgency Section */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">HIGH PRIORITY</span>
                <span className="text-xs text-red-700 font-medium">Act by 3:00 PM today</span>
              </div>
              <div className="text-xs text-red-700 space-y-1">
                <div><strong>Why urgent:</strong> Competitor just raised rates 18%</div>
                <div><strong>Booking window:</strong> 73% of bookings happen before 4 PM</div>
                <div><strong>Risk:</strong> Missing $2,400 in potential revenue today</div>
              </div>
            </div>

            {/* Revenue Impact Section */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-900 mb-2">Detailed Revenue Analysis</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-700">Current rate (48 rooms)</span>
                  <span className="text-xs font-bold text-green-900">$260 × 48 = $12,480</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-700">AI suggested rate</span>
                  <span className="text-xs font-bold text-green-900">$285 × 45 = $12,825</span>
                </div>
                <div className="border-t border-green-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-green-700">Net gain today</span>
                    <span className="text-sm font-bold text-green-600">+$345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-green-700">Weekly potential</span>
                    <span className="text-sm font-bold text-green-600">+$1,850</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis Section */}
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Market Intelligence Analysis
              </div>
              <div className="text-xs text-purple-700 space-y-2">
                <div>
                  <div className="font-medium">Competitor Analysis (Last 24 hours):</div>
                  <div className="ml-3 space-y-1">
                    <div>• Hotel Paradise: $260 → $295 (+13.5%)</div>
                    <div>• Grand Plaza: $275 → $310 (+12.7%)</div>
                    <div>• City Suites: $240 → $280 (+16.7%)</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Demand Indicators:</div>
                  <div className="ml-3 space-y-1">
                    <div>• Search volume: +34% vs last week</div>
                    <div>• Booking velocity: +22% in last 6 hours</div>
                    <div>• Price sensitivity: Low (luxury segment)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Impact Section */}
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="text-sm font-medium text-orange-900 mb-2">Event Impact Analysis</div>
              <div className="text-xs text-orange-700 space-y-2">
                <div>
                  <div className="font-medium">Identified Events:</div>
                  <div className="ml-3 space-y-1">
                    <div>• Tech Conference (2,500 attendees) - 0.3 miles</div>
                    <div>• Concert at Arena (15,000 capacity) - 1.2 miles</div>
                    <div>• Corporate meetings surge (+40%)</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Historical Impact:</div>
                  <div className="ml-3 space-y-1">
                    <div>• Similar events: +28% ADR on average</div>
                    <div>• Occupancy typically: 95-98%</div>
                    <div>• Premium positioning success: 89%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Actions */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Recommended Actions
              </div>
              <div className="text-xs text-gray-700 space-y-2">
                <div>
                  <div className="font-medium text-green-700">✓ Primary Recommendation:</div>
                  <div className="ml-3">Increase rate to $285 immediately for maximum revenue capture</div>
                </div>
                <div>
                  <div className="font-medium text-blue-700">📊 Alternative Option:</div>
                  <div className="ml-3">Conservative increase to $275 for 95% confidence level</div>
                </div>
                <div>
                  <div className="font-medium text-orange-700">⚠️ Risk Assessment:</div>
                  <div className="ml-3">Low risk - premium positioning matches market conditions</div>
                </div>
                <div>
                  <div className="font-medium text-purple-700">📈 Future Outlook:</div>
                  <div className="ml-3">Monitor competitor response, consider $295 tomorrow if uptake strong</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-yellow-900">Try It Yourself</div>
                <div className="text-xs text-yellow-800 leading-relaxed">Click on any cell with a colored border in the pricing grid to see this level of detailed analysis for that specific date and room type.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'manual-control',
      title: '✋ You\'re Always in Control',
      description: 'You can edit any price manually - AI provides suggestions, but you make the final decisions',
      targetSelector: '.grid-cell',
      position: 'top',
      highlightType: 'element',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Human Authority = Final Say
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              AI provides smart suggestions, but every pricing decision is ultimately yours. Here's how to make changes:
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                How to Edit Prices
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <strong>Double-click</strong> any price cell to edit it</div>
                <div>• Press <strong>Enter</strong> to save, <strong>Esc</strong> to cancel</div>
                <div>• Changes show up with orange highlighting</div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-yellow-900">Impact Warning</div>
                  <div className="text-xs text-yellow-700 leading-relaxed">When you manually set a price, AI optimization turns off for that specific date. We'll show you the revenue impact of your decision.</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-900 mb-2">Revenue Forecast Example</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-base font-bold text-green-600">$4,275</div>
                  <div className="text-xs text-green-700">Expected revenue</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold text-sm">+13.2%</div>
                  <div className="text-xs text-green-700">vs current rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">Try it now!</div>
                <div className="text-xs text-gray-600 leading-relaxed">Find any white price cell in the grid and double-click it to practice editing.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'real-time-sync',
      title: '🔄 Everything Stays in Sync',
      description: 'Your changes automatically update across all booking channels',
      targetSelector: '.sticky-header, header, [class*="publish"], [class*="changes"]',
      position: 'bottom',
      highlightType: 'area',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Automatic Distribution
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              When you make pricing changes, they automatically sync to all your booking channels. Look at the header for unsaved changes and publish controls.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-1">🧠</div>
              <div className="text-xs font-medium text-blue-900">AI Analyzes</div>
              <div className="text-xs text-blue-700">Market data</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">👤</div>
              <div className="text-xs font-medium text-purple-900">You Decide</div>
              <div className="text-xs text-purple-700">Accept or edit</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-1">🌐</div>
              <div className="text-xs font-medium text-green-900">Auto Sync</div>
              <div className="text-xs text-green-700">All channels</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-700">Booking.com</span>
              <span className="text-green-600 font-medium text-xs">✓ Updated</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-700">Expedia</span>
              <span className="text-green-600 font-medium text-xs">✓ Synced</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-700">Your Website</span>
              <span className="text-green-600 font-medium text-xs">✓ Live</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Average Sync Time</span>
            </div>
            <div className="text-lg font-bold text-blue-600">Under 2 minutes</div>
            <div className="text-xs text-blue-700">From decision to all booking sites</div>
          </div>
        </div>
      )
    },
    {
      id: 'audit-trail',
      title: '📝 Complete Record Keeping',
      description: 'Every pricing change is automatically logged - find the "Event Logs" button to see the history',
      targetSelector: '[class*="Activity"], [class*="event"], [class*="log"], .EventLogsPanel',
      position: 'top',
      highlightType: 'area',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Full Accountability
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Every pricing decision is automatically recorded with complete details. Perfect for audits, compliance, and understanding what worked. Look for "Event Logs" in the header toolbar.
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-900">Rate Applied: $260 → $285</div>
              <div className="text-xs text-green-700">AI suggestion accepted • Expected gain: +$1,850</div>
              <div className="text-xs text-gray-500 mt-1">Today, 2:34 PM • John Smith</div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900">AI Recommendation Generated</div>
              <div className="text-xs text-blue-700">87% confidence • Event + competitor analysis</div>
              <div className="text-xs text-gray-500 mt-1">Today, 2:32 PM • AI System</div>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm font-medium text-yellow-900">Manual Override Applied</div>
              <div className="text-xs text-yellow-700">$270 → $260 • Reason: "Corporate rate"</div>
              <div className="text-xs text-gray-500 mt-1">11:15 AM • Sarah Davis</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="text-base font-bold text-green-600">94%</div>
              <div className="text-xs text-green-700">AI Acceptance</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-base font-bold text-blue-600">12</div>
              <div className="text-xs text-blue-700">Changes Today</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-base font-bold text-yellow-600">$12.5K</div>
              <div className="text-xs text-yellow-700">Revenue Impact</div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">Find Event Logs</div>
                <div className="text-xs text-gray-600 leading-relaxed">Look for the "Event Logs" button in the header toolbar to access the complete history of all pricing decisions.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: '🎉 You\'re All Set!',
      description: 'You now understand how to use AI-powered pricing effectively',
      targetSelector: '',
      position: 'bottom',
      highlightType: 'modal',
      content: (
        <div className="text-center py-6">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tutorial Complete!</h3>
            <p className="text-gray-600 max-w-sm mx-auto text-sm leading-relaxed mb-6">
              You now understand how our AI-powered pricing system works. Remember: AI suggests, you decide, everything syncs automatically.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h4 className="text-base font-bold text-blue-900 mb-3">🚀 Key Takeaways</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>AI helps optimize pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Complete transparency in logic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>You control final decisions</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Real-time channel sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Complete audit trail</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Measurable results</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h4 className="text-sm font-medium text-yellow-900 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ready to Start?
            </h4>
            <div className="text-xs text-yellow-800 space-y-1">
              <div>✓ Try double-clicking on pricing cells to edit rates</div>
              <div>✓ Click on colored borders to see AI insights</div>
              <div>✓ Use "Event Logs" to explore the audit trail</div>
              <div>✓ Look for the AI suggestions and test them safely</div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            You can restart this tutorial anytime using the tutorial button (📖) in the bottom-right corner.
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const skipTutorial = () => {
    onClose();
  };

  // Highlight target element
  useEffect(() => {
    if (!isOpen || !currentStepData.targetSelector) return;

    const targetElement = document.querySelector(currentStepData.targetSelector);
    if (targetElement) {
      targetElement.classList.add('tutorial-highlight');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      const highlightedElements = document.querySelectorAll('.tutorial-highlight');
      highlightedElements.forEach(el => el.classList.remove('tutorial-highlight'));
    };
  }, [currentStep, isOpen, currentStepData.targetSelector]);

  if (!isOpen) return null;

  const isModalStep = currentStepData.highlightType === 'modal';

  return (
    <>
      {/* Overlay backdrop with cutout for highlighted elements */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] transition-opacity duration-300"
        onClick={isModalStep ? undefined : skipTutorial}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Optional: Cutout effect for highlighted elements */}
        {!isModalStep && (
          <div className="absolute inset-0 bg-black/20"></div>
        )}
      </div>

      {/* Tutorial content with better responsive design */}
      <div className={`fixed z-[10000] transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${
        isModalStep 
          ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4'
          : 'top-4 right-4 w-full max-w-sm mx-4 sm:mx-0 sm:w-96'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                  {currentStep === 0 && <Brain className="w-4 h-4" />}
                  {currentStep === 1 && <Target className="w-4 h-4" />}
                  {currentStep === 2 && <Sparkles className="w-4 h-4" />}
                  {currentStep === 3 && <Brain className="w-4 h-4" />}
                  {currentStep === 4 && <Shield className="w-4 h-4" />}
                  {currentStep === 5 && <Clock className="w-4 h-4" />}
                  {currentStep === 6 && <Shield className="w-4 h-4" />}
                  {currentStep === 7 && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base leading-tight">{currentStepData.title}</h3>
                  <p className="text-white/80 text-sm leading-tight mt-1">{currentStepData.description}</p>
                </div>
              </div>
              <button
                onClick={skipTutorial}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {currentStepData.content}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-purple-600' : 
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={previousStep}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
                {currentStep < tutorialSteps.length - 1 && <ArrowRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced styles for highlighting with better visibility */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 9998 !important;
          box-shadow: 
            0 0 0 4px rgba(139, 92, 246, 0.8), 
            0 0 0 8px rgba(139, 92, 246, 0.4),
            0 0 30px rgba(139, 92, 246, 0.6) !important;
          border-radius: 8px !important;
          animation: tutorialPulse 2s infinite;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        @keyframes tutorialPulse {
          0%, 100% { 
            box-shadow: 
              0 0 0 4px rgba(139, 92, 246, 0.8), 
              0 0 0 8px rgba(139, 92, 246, 0.4),
              0 0 30px rgba(139, 92, 246, 0.6);
          }
          50% { 
            box-shadow: 
              0 0 0 6px rgba(139, 92, 246, 0.9), 
              0 0 0 12px rgba(139, 92, 246, 0.3),
              0 0 40px rgba(139, 92, 246, 0.8);
          }
        }

        .tutorial-highlight::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 3px solid #8b5cf6;
          border-radius: 12px;
          pointer-events: none;
          animation: tutorialBorder 2s infinite;
          z-index: 9999;
          background: rgba(139, 92, 246, 0.05);
        }

        @keyframes tutorialBorder {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.02);
          }
        }

        /* Ensure highlighted elements are not affected by backdrop blur */
        .tutorial-highlight * {
          backdrop-filter: none !important;
        }
      `}</style>
    </>
  );
} 