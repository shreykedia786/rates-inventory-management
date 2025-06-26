import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  Target, 
  AlertCircle,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';

interface RateRecommendation {
  id: string;
  propertyId: string;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
  currentRate: number;
  suggestedRate: number;
  confidence: number;
  reasoning: string;
  factors: {
    competitorAverage: number;
    marketTrend: 'up' | 'down' | 'stable';
    demandLevel: 'low' | 'medium' | 'high';
    occupancyForecast: number;
  };
}

interface CompetitorInsight {
  competitorId: string;
  competitorName: string;
  roomTypeCode: string;
  rate: number;
  currency: string;
  availability: boolean;
  lastUpdated: Date;
}

interface AiInsightsPanelProps {
  propertyId: string;
  selectedDate?: Date;
  selectedRoomType?: string;
  onApplyRecommendation?: (recommendationId: string) => void;
}

/**
 * AI Insights Panel Component
 * 
 * Displays AI-powered rate recommendations and competitor analysis:
 * - Rate optimization suggestions with confidence scores
 * - Competitor rate comparison and market positioning
 * - Market trend indicators and demand forecasting
 * - One-click recommendation application
 * - Real-time insights refresh
 */
export function AiInsightsPanel({
  propertyId,
  selectedDate,
  selectedRoomType,
  onApplyRecommendation,
}: AiInsightsPanelProps) {
  const [recommendations, setRecommendations] = useState<RateRecommendation[]>([]);
  const [competitorInsights, setCompetitorInsights] = useState<CompetitorInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId && selectedDate) {
      loadAiInsights();
    }
  }, [propertyId, selectedDate, selectedRoomType]);

  const loadAiInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, these would be API calls
      // For now, we'll generate mock data
      const mockRecommendations = generateMockRecommendations();
      const mockCompetitorInsights = generateMockCompetitorInsights();

      setRecommendations(mockRecommendations);
      setCompetitorInsights(mockCompetitorInsights);
    } catch (err) {
      setError('Failed to load AI insights');
      console.error('AI insights error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyRecommendation = (recommendationId: string) => {
    if (onApplyRecommendation) {
      onApplyRecommendation(recommendationId);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDemandColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-green-700 bg-green-100 border-green-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-700 bg-green-100 border-green-200';
    if (confidence >= 60) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-500">Loading recommendations...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-red-600">Error loading insights</p>
          </div>
        </div>
        <div className="text-red-600 text-sm mb-4">{error}</div>
        <button
          onClick={loadAiInsights}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              <p className="text-sm text-gray-500">Powered by machine learning</p>
            </div>
          </div>
          <button
            onClick={loadAiInsights}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Rate Recommendations */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Rate Recommendations</h4>
          </div>
          
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No recommendations available</p>
              <p className="text-gray-400 text-xs mt-1">Check back later for AI insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-gray-900">
                        ${rec.currentRate} → ${rec.suggestedRate}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}% confidence
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Apply
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {rec.reasoning}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Market Avg</div>
                        <div className="text-sm font-medium">${rec.factors.competitorAverage}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(rec.factors.marketTrend)}
                      <div>
                        <div className="text-xs text-gray-500">Trend</div>
                        <div className="text-sm font-medium capitalize">{rec.factors.marketTrend}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        rec.factors.demandLevel === 'high' ? 'bg-red-500' :
                        rec.factors.demandLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="text-xs text-gray-500">Demand</div>
                        <div className="text-sm font-medium capitalize">{rec.factors.demandLevel}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">Occupancy</div>
                        <div className="text-sm font-medium">{rec.factors.occupancyForecast}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Competitor Insights */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Competitor Analysis</h4>
          </div>
          
          {competitorInsights.length === 0 ? (
            <div className="text-center py-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No competitor data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {competitorInsights.map((competitor) => (
                <div key={competitor.competitorId} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      competitor.availability ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {competitor.competitorName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {competitor.roomTypeCode} • Updated {competitor.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      ${competitor.rate}
                    </div>
                    <div className="text-xs text-gray-500">
                      {competitor.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-lg">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <h5 className="font-medium text-indigo-900">Market Summary</h5>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-indigo-600 font-medium">Market Position</div>
              <div className="text-indigo-800">Competitive</div>
            </div>
            <div>
              <div className="text-indigo-600 font-medium">Optimization</div>
              <div className="text-indigo-800">+12% potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced mock data generators
function generateMockRecommendations(): RateRecommendation[] {
  const recommendations: RateRecommendation[] = [];
  const today = new Date();
  
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const currentRate = 150 + Math.floor(Math.random() * 50);
    const suggestedRate = currentRate + Math.floor(Math.random() * 40) - 20;
    const confidence = 60 + Math.floor(Math.random() * 40);
    
    recommendations.push({
      id: `rec_${i + 1}`,
      propertyId: 'prop_001',
      roomTypeId: 'std_room',
      ratePlanId: 'bar_plan',
      date,
      currentRate,
      suggestedRate,
      confidence,
      reasoning: generateReasoning(currentRate, suggestedRate),
      factors: {
        competitorAverage: 160 + Math.floor(Math.random() * 30),
        marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        demandLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        occupancyForecast: 70 + Math.floor(Math.random() * 25),
      },
    });
  }
  
  return recommendations;
}

function generateMockCompetitorInsights(): CompetitorInsight[] {
  const competitors = ['Hotel Luxe', 'Grand Plaza', 'City Center Inn', 'Business Hotel'];
  const insights: CompetitorInsight[] = [];
  
  competitors.forEach((name, index) => {
    insights.push({
      competitorId: `comp_${index + 1}`,
      competitorName: name,
      roomTypeCode: 'STD',
      rate: 140 + Math.floor(Math.random() * 60),
      currency: 'USD',
      availability: Math.random() > 0.2,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
    });
  });
  
  return insights;
}

function generateReasoning(currentRate: number, suggestedRate: number): string {
  const change = suggestedRate - currentRate;
  const changePercent = Math.abs((change / currentRate) * 100);
  
  if (change > 0) {
    return `Market conditions support a ${changePercent.toFixed(0)}% rate increase. Strong demand and competitive positioning indicate revenue optimization opportunity.`;
  } else if (change < 0) {
    return `Consider a ${changePercent.toFixed(0)}% rate adjustment to improve market competitiveness and capture additional demand.`;
  } else {
    return `Current rate is well-positioned. Market analysis suggests maintaining current pricing strategy.`;
  }
} 