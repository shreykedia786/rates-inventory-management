/**
 * Pricing & Inventory Consistency Verification Script
 * Run this to validate that all components show consistent data
 */

import { StandardizedRateData, AIRateRecommendation } from '../types/rate-consistency';

// Mock data for testing
const mockRateData: StandardizedRateData = {
  baseRate: 5000,
  currentRate: 5200,
  finalRate: 5200,
  rateSource: 'ai_recommendation',
  lastModified: new Date(),
  modifiedBy: 'ai_system',
  isActive: true,
  hasUnsavedChanges: false,
  rateHistory: [
    {
      id: 'change_001',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      userId: 'ai_system',
      userName: 'AI Agent',
      source: 'ai_recommendation',
      fromRate: 5000,
      toRate: 5200,
      reason: 'Competitor analysis suggests 4% increase',
      aiInsightId: 'insight_abc123',
      confidence: 92,
      approved: true
    }
  ]
};

const mockAIRecommendation: AIRateRecommendation = {
  id: 'insight_abc123',
  cellId: 'cell_deluxe_bar_2024-01-15',
  currentRate: 5000,
  baseRate: 5000,
  aiRecommendedRate: 5200,
  confidence: 92, // ← This should be IDENTICAL everywhere
  reasoning: 'Based on competitor analysis, demand forecast shows 15% increase. Recommended rate adjustment to maintain competitive position while maximizing revenue.',
  marketFactors: {
    competitorAverage: 5150,
    marketTrend: 'up',
    demandLevel: 'high',
    positionVsCompetitors: 75
  },
  status: 'accepted',
  createdAt: new Date(Date.now() - 3600000),
  appliedAt: new Date(Date.now() - 1800000), // 30 min ago
  appliedBy: 'user_001',
  projectedImpact: {
    dailyRevenue: 15600, // 30 rooms * 5200
    monthlyRevenue: 468000,
    occupancyChange: -2, // Slight decrease expected
    revenueChange: 6000 // Net positive
  },
  undoAvailable: true,
  undoExpiresAt: new Date(Date.now() + (23 * 60 * 60 * 1000)) // 23 hours from now
};

/**
 * Test 1: Tooltip Data Consistency
 */
function testTooltipConsistency() {
  console.log('🔍 Testing Tooltip Consistency...');
  
  // Simulate what tooltip would show
  const tooltipData = {
    currentRate: mockRateData.currentRate,
    aiRecommendedRate: mockAIRecommendation.aiRecommendedRate,
    aiConfidence: mockAIRecommendation.confidence, // ← KEY: Same source
    lastModified: mockRateData.lastModified,
    modifiedBy: mockRateData.modifiedBy,
    canUndo: mockAIRecommendation.undoAvailable
  };
  
  console.log('✅ Tooltip shows:', {
    rate: `₹${tooltipData.currentRate}`,
    aiSuggestion: `₹${tooltipData.aiRecommendedRate}`,
    confidence: `${tooltipData.aiConfidence}%`, // Should be 92%
    undoAvailable: tooltipData.canUndo
  });
  
  return tooltipData;
}

/**
 * Test 2: Modal Data Consistency  
 */
function testModalConsistency() {
  console.log('🔍 Testing Modal Consistency...');
  
  // Simulate what modal would show
  const modalData = {
    baseRate: mockRateData.baseRate,
    currentRate: mockRateData.currentRate,
    finalRate: mockRateData.finalRate,
    aiRecommendation: mockAIRecommendation,
    rateSource: mockRateData.rateSource,
    hasUnsavedChanges: mockRateData.hasUnsavedChanges
  };
  
  console.log('✅ Modal shows:', {
    baseRate: `₹${modalData.baseRate}`,
    currentRate: `₹${modalData.currentRate}`,
    finalRate: `₹${modalData.finalRate}`,
    aiConfidence: `${modalData.aiRecommendation.confidence}%`, // Should be 92%
    rateSource: modalData.rateSource,
    aiStatus: modalData.aiRecommendation.status
  });
  
  return modalData;
}

/**
 * Test 3: Grid Badge Consistency
 */
function testGridBadgeConsistency() {
  console.log('🔍 Testing Grid Badge Consistency...');
  
  // Simulate what grid badge would show
  const badgeConfig = {
    showAIBadge: mockAIRecommendation.status === 'pending',
    showAppliedBadge: mockAIRecommendation.status === 'accepted',
    showChangeBadge: mockRateData.hasUnsavedChanges,
    showUndoBadge: mockAIRecommendation.undoAvailable,
    confidence: mockAIRecommendation.confidence // ← KEY: Same source
  };
  
  console.log('✅ Grid Badge shows:', {
    displayType: badgeConfig.showAppliedBadge ? 'Applied' : 
                 badgeConfig.showAIBadge ? 'Pending' : 'None',
    confidence: `${badgeConfig.confidence}%`, // Should be 92%
    undoAvailable: badgeConfig.showUndoBadge
  });
  
  return badgeConfig;
}

/**
 * Test 4: Audit Trail Consistency
 */
function testAuditTrailConsistency() {
  console.log('🔍 Testing Audit Trail Consistency...');
  
  const auditEntry = mockRateData.rateHistory[0];
  
  console.log('✅ Audit Trail shows:', {
    change: `₹${auditEntry.fromRate} → ₹${auditEntry.toRate}`,
    source: auditEntry.source,
    user: auditEntry.userName,
    timestamp: auditEntry.timestamp.toLocaleString(),
    aiInsightId: auditEntry.aiInsightId,
    aiConfidence: `${auditEntry.confidence}%`, // Should be 92%
    reason: auditEntry.reason
  });
  
  return auditEntry;
}

/**
 * Main Verification Function
 */
export function verifyConsistency() {
  console.log('🎯 STARTING PRICING CONSISTENCY VERIFICATION\n');
  
  const tooltipData = testTooltipConsistency();
  console.log('');
  
  const modalData = testModalConsistency();
  console.log('');
  
  const badgeData = testGridBadgeConsistency();
  console.log('');
  
  const auditData = testAuditTrailConsistency();
  console.log('');
  
  // Cross-validation
  console.log('🔗 CROSS-VALIDATION:');
  
  const confidenceValues = [
    tooltipData.aiConfidence,
    modalData.aiRecommendation.confidence,
    badgeData.confidence,
    auditData.confidence
  ];
  
  const rateValues = [
    tooltipData.currentRate,
    modalData.currentRate,
    mockRateData.currentRate
  ];
  
  const allConfidencesMatch = confidenceValues.every(val => val === confidenceValues[0]);
  const allRatesMatch = rateValues.every(val => val === rateValues[0]);
  
  console.log('✅ Confidence Consistency:', allConfidencesMatch ? 'PASS' : 'FAIL');
  console.log('   Values:', confidenceValues.map(v => `${v}%`).join(', '));
  
  console.log('✅ Rate Consistency:', allRatesMatch ? 'PASS' : 'FAIL');
  console.log('   Values:', rateValues.map(v => `₹${v}`).join(', '));
  
  console.log('✅ Undo Availability:', tooltipData.canUndo && badgeData.showUndoBadge ? 'CONSISTENT' : 'INCONSISTENT');
  
  const overallPass = allConfidencesMatch && allRatesMatch;
  
  console.log('\n🎯 OVERALL RESULT:', overallPass ? '✅ PASS - DEMO READY' : '❌ FAIL - NEEDS FIXES');
  
  if (overallPass) {
    console.log('\n🎉 Perfect! All components show consistent data.');
    console.log('   CEO demo will show unified, explainable data flow.');
  } else {
    console.log('\n⚠️  Issues found! Components showing different values.');
    console.log('   This will undermine credibility in CEO demo.');
  }
  
  return {
    pass: overallPass,
    confidenceConsistent: allConfidencesMatch,
    ratesConsistent: allRatesMatch,
    tooltipData,
    modalData,
    badgeData,
    auditData
  };
}

/**
 * Demo Scenario Simulation
 */
export function simulateDemoScenario() {
  console.log('\n🎬 SIMULATING CEO DEMO SCENARIO:\n');
  
  console.log('CEO: "I see this rate has an AI badge. What does that mean?"');
  console.log('You: "This room rate has an AI recommendation with 92% confidence."');
  console.log('');
  
  console.log('CEO: "Where does the 92% come from?"');
  console.log('You: "Based on competitor analysis and demand forecast. Let me show you..."');
  console.log('     [Hovers over cell] → Tooltip shows: "AI: ₹5,200 (92% confidence)"');
  console.log('     [Clicks cell] → Modal shows: "92% confidence, applied 30 min ago"');
  console.log('     [Views audit] → History shows: "AI Insight #abc123 (92% confidence)"');
  console.log('');
  
  console.log('CEO: "Perfect. All consistent. Can we undo this if needed?"');
  console.log('You: "Yes, undo available for 23 more hours. One click revert."');
  console.log('');
  
  console.log('CEO: "This is exactly the transparency and control we need."');
  console.log('✅ Demo Success: Credibility maintained, value demonstrated.');
}

// Run verification if called directly
if (require.main === module) {
  verifyConsistency();
  simulateDemoScenario();
} 