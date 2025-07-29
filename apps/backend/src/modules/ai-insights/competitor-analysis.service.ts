import { Injectable, Logger } from '@nestjs/common';

export interface CompetitorInsight {
  competitorId: string;
  competitorName: string;
  roomTypeCode: string;
  rate: number;
  currency: string;
  availability: boolean;
  lastUpdated: Date;
}

export interface MarketPosition {
  percentile: number; // 0-100, where 50 is median
  position: 'premium' | 'competitive' | 'value';
  gapToMedian: number;
  gapToClosestCompetitor: number;
}

export interface CompetitiveGap {
  competitorName: string;
  rateDifference: number;
  percentageDifference: number;
  recommendation: 'increase' | 'decrease' | 'maintain';
}

export interface MarketSegmentation {
  premiumTier: CompetitorInsight[];
  midTier: CompetitorInsight[];
  valueTier: CompetitorInsight[];
  averageRates: {
    premium: number;
    mid: number;
    value: number;
  };
}

/**
 * Competitor Analysis Service
 * 
 * Advanced competitive intelligence and market positioning analysis:
 * - Market segmentation and tier analysis
 * - Competitive gap identification and recommendations
 * - Market positioning and percentile ranking
 * - Price elasticity and demand correlation analysis
 * - Strategic pricing recommendations based on competitive landscape
 * - Real-time market trend detection
 */
@Injectable()
export class CompetitorAnalysisService {
  private readonly logger = new Logger(CompetitorAnalysisService.name);

  /**
   * Generate market recommendations based on competitive analysis
   */
  async generateMarketRecommendations(
    currentRate: number | null,
    marketAverage: number,
    competitorInsights: CompetitorInsight[],
  ): Promise<string[]> {
    try {
      const recommendations: string[] = [];

      if (!currentRate || competitorInsights.length === 0) {
        recommendations.push('Insufficient data for competitive analysis');
        return recommendations;
      }

      // Analyze market position
      const marketPosition = this.analyzeMarketPosition(currentRate, competitorInsights);
      
      // Segment the market
      const marketSegmentation = this.segmentMarket(competitorInsights);
      
      // Identify competitive gaps
      const competitiveGaps = this.identifyCompetitiveGaps(currentRate, competitorInsights);
      
      // Generate positioning recommendations
      recommendations.push(...this.generatePositioningRecommendations(
        currentRate,
        marketPosition,
        marketSegmentation,
      ));
      
      // Generate competitive gap recommendations
      recommendations.push(...this.generateGapRecommendations(competitiveGaps));
      
      // Generate market trend recommendations
      recommendations.push(...this.generateTrendRecommendations(
        currentRate,
        marketAverage,
        competitorInsights,
      ));

      return recommendations;

    } catch (error) {
      this.logger.error(`Failed to generate market recommendations: ${error.message}`);
      return ['Unable to generate recommendations due to analysis error'];
    }
  }

  /**
   * Analyze current market position relative to competitors
   */
  analyzeMarketPosition(currentRate: number, competitors: CompetitorInsight[]): MarketPosition {
    const rates = competitors.map(c => c.rate).sort((a, b) => a - b);
    
    // Calculate percentile position
    const lowerRates = rates.filter(rate => rate < currentRate).length;
    const percentile = (lowerRates / rates.length) * 100;
    
    // Determine position category
    let position: 'premium' | 'competitive' | 'value';
    if (percentile >= 75) {
      position = 'premium';
    } else if (percentile >= 25) {
      position = 'competitive';
    } else {
      position = 'value';
    }
    
    // Calculate gaps
    const median = this.calculateMedian(rates);
    const gapToMedian = currentRate - median;
    
    // Find closest competitor
    const closestRate = rates.reduce((closest, rate) => {
      return Math.abs(rate - currentRate) < Math.abs(closest - currentRate) ? rate : closest;
    }, rates[0]);
    const gapToClosestCompetitor = currentRate - closestRate;

    return {
      percentile: Math.round(percentile),
      position,
      gapToMedian,
      gapToClosestCompetitor,
    };
  }

  /**
   * Segment market into tiers based on rate distribution
   */
  segmentMarket(competitors: CompetitorInsight[]): MarketSegmentation {
    const sortedCompetitors = [...competitors].sort((a, b) => b.rate - a.rate);
    const totalCount = sortedCompetitors.length;
    
    // Define tier boundaries (top 30%, middle 40%, bottom 30%)
    const premiumCount = Math.ceil(totalCount * 0.3);
    const midCount = Math.ceil(totalCount * 0.4);
    
    const premiumTier = sortedCompetitors.slice(0, premiumCount);
    const midTier = sortedCompetitors.slice(premiumCount, premiumCount + midCount);
    const valueTier = sortedCompetitors.slice(premiumCount + midCount);
    
    // Calculate average rates for each tier
    const averageRates = {
      premium: this.calculateAverage(premiumTier.map(c => c.rate)),
      mid: this.calculateAverage(midTier.map(c => c.rate)),
      value: this.calculateAverage(valueTier.map(c => c.rate)),
    };

    return {
      premiumTier,
      midTier,
      valueTier,
      averageRates,
    };
  }

  /**
   * Identify competitive gaps and opportunities
   */
  identifyCompetitiveGaps(currentRate: number, competitors: CompetitorInsight[]): CompetitiveGap[] {
    return competitors.map(competitor => {
      const rateDifference = currentRate - competitor.rate;
      const percentageDifference = (rateDifference / competitor.rate) * 100;
      
      let recommendation: 'increase' | 'decrease' | 'maintain';
      
      if (percentageDifference > 15) {
        recommendation = 'decrease'; // Significantly above competitor
      } else if (percentageDifference < -15) {
        recommendation = 'increase'; // Significantly below competitor
      } else {
        recommendation = 'maintain'; // Within reasonable range
      }

      return {
        competitorName: competitor.competitorName,
        rateDifference,
        percentageDifference,
        recommendation,
      };
    });
  }

  /**
   * Generate positioning recommendations based on market analysis
   */
  private generatePositioningRecommendations(
    currentRate: number,
    marketPosition: MarketPosition,
    marketSegmentation: MarketSegmentation,
  ): string[] {
    const recommendations: string[] = [];

    switch (marketPosition.position) {
      case 'premium':
        if (marketPosition.percentile > 90) {
          recommendations.push('You are positioned in the top 10% of the market - ensure value proposition justifies premium pricing');
        } else {
          recommendations.push('Strong premium positioning - consider highlighting unique amenities and services');
        }
        break;
        
      case 'value':
        if (marketPosition.percentile < 10) {
          recommendations.push('Very aggressive value positioning - monitor for potential revenue optimization opportunities');
        } else {
          recommendations.push('Value positioning may attract price-sensitive guests - ensure operational efficiency');
        }
        break;
        
      default: // competitive
        recommendations.push('Well-positioned in the competitive middle tier - good balance of rate and market appeal');
    }

    // Gap-based recommendations
    if (Math.abs(marketPosition.gapToMedian) > 20) {
      const direction = marketPosition.gapToMedian > 0 ? 'above' : 'below';
      recommendations.push(`Rate is $${Math.abs(marketPosition.gapToMedian).toFixed(0)} ${direction} market median - consider market positioning strategy`);
    }

    return recommendations;
  }

  /**
   * Generate recommendations based on competitive gaps
   */
  private generateGapRecommendations(competitiveGaps: CompetitiveGap[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze gap patterns
    const increaseCount = competitiveGaps.filter(gap => gap.recommendation === 'increase').length;
    const decreaseCount = competitiveGaps.filter(gap => gap.recommendation === 'decrease').length;
    const maintainCount = competitiveGaps.filter(gap => gap.recommendation === 'maintain').length;
    
    const totalGaps = competitiveGaps.length;
    
    if (decreaseCount > totalGaps * 0.6) {
      recommendations.push('Rate appears high relative to most competitors - consider competitive adjustment');
    } else if (increaseCount > totalGaps * 0.6) {
      recommendations.push('Rate appears low relative to most competitors - opportunity for rate optimization');
    } else if (maintainCount > totalGaps * 0.5) {
      recommendations.push('Rate is well-aligned with competitive set - maintain current positioning');
    }

    // Identify specific competitor concerns
    const significantGaps = competitiveGaps.filter(gap => Math.abs(gap.percentageDifference) > 25);
    if (significantGaps.length > 0) {
      const competitor = significantGaps[0];
      const direction = competitor.percentageDifference > 0 ? 'higher' : 'lower';
      recommendations.push(`Significant rate gap with ${competitor.competitorName} (${Math.abs(competitor.percentageDifference).toFixed(0)}% ${direction})`);
    }

    return recommendations;
  }

  /**
   * Generate trend-based recommendations
   */
  private generateTrendRecommendations(
    currentRate: number,
    marketAverage: number,
    competitors: CompetitorInsight[],
  ): string[] {
    const recommendations: string[] = [];
    
    // Analyze rate distribution
    const rates = competitors.map(c => c.rate);
    const standardDeviation = this.calculateStandardDeviation(rates);
    const coefficientOfVariation = standardDeviation / marketAverage;
    
    // Market volatility analysis
    if (coefficientOfVariation > 0.2) {
      recommendations.push('High market volatility detected - monitor competitor rate changes closely');
    } else if (coefficientOfVariation < 0.1) {
      recommendations.push('Stable market conditions - good environment for strategic positioning');
    }
    
    // Availability analysis
    const availableCompetitors = competitors.filter(c => c.availability);
    const availabilityRate = availableCompetitors.length / competitors.length;
    
    if (availabilityRate < 0.7) {
      recommendations.push('Limited competitor availability suggests strong demand - consider rate optimization');
    } else if (availabilityRate > 0.9) {
      recommendations.push('High competitor availability indicates competitive market conditions');
    }
    
    // Rate clustering analysis
    const rateClusters = this.identifyRateClusters(rates);
    if (rateClusters.length > 1) {
      const currentCluster = this.findRateCluster(currentRate, rateClusters);
      if (currentCluster) {
        recommendations.push(`Rate aligns with ${currentCluster.size}-property cluster around $${currentCluster.center.toFixed(0)}`);
      }
    }

    return recommendations;
  }

  /**
   * Identify rate clusters in the market
   */
  private identifyRateClusters(rates: number[]): Array<{ center: number; size: number; rates: number[] }> {
    const sortedRates = [...rates].sort((a, b) => a - b);
    const clusters: Array<{ center: number; size: number; rates: number[] }> = [];
    
    let currentCluster: number[] = [];
    const clusterThreshold = 20; // $20 threshold for clustering
    
    for (const rate of sortedRates) {
      if (currentCluster.length === 0 || rate - currentCluster[currentCluster.length - 1] <= clusterThreshold) {
        currentCluster.push(rate);
      } else {
        if (currentCluster.length >= 2) {
          clusters.push({
            center: this.calculateAverage(currentCluster),
            size: currentCluster.length,
            rates: [...currentCluster],
          });
        }
        currentCluster = [rate];
      }
    }
    
    // Add the last cluster if it has enough members
    if (currentCluster.length >= 2) {
      clusters.push({
        center: this.calculateAverage(currentCluster),
        size: currentCluster.length,
        rates: currentCluster,
      });
    }
    
    return clusters;
  }

  /**
   * Find which cluster a rate belongs to
   */
  private findRateCluster(
    rate: number,
    clusters: Array<{ center: number; size: number; rates: number[] }>,
  ): { center: number; size: number; rates: number[] } | null {
    for (const cluster of clusters) {
      const minRate = Math.min(...cluster.rates);
      const maxRate = Math.max(...cluster.rates);
      if (rate >= minRate && rate <= maxRate) {
        return cluster;
      }
    }
    return null;
  }

  // Utility methods

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private calculateStandardDeviation(numbers: number[]): number {
    const avg = this.calculateAverage(numbers);
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - avg, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }
} 