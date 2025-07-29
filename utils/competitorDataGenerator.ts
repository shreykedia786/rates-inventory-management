/**
 * Competitor Data Generator Utility
 * Generates dynamic competitor data based on selected competitors from header dropdown
 */

export interface Competitor {
  id: string;
  name: string;
  type: string;
  distance: string;
  avatar: string;
}

export interface CompetitorData {
  competitors: Array<{
    name: string;
    rate: number;
    availability: number;
    distance: number;
    rating: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  marketPosition: 'premium' | 'competitive' | 'value';
  averageRate: number;
  lowestRate: number;
  highestRate: number;
  priceAdvantage: number;
  marketShare: number;
}

/**
 * Generate dynamic competitor data based on selected competitors from header
 * @param selectedCompetitors - Array of selected competitors from header
 * @param baseRate - The base rate for calculating competitor rates
 * @param dateIndex - Index for deterministic variation
 * @param isWeekend - Whether it's a weekend
 * @returns CompetitorData object with rates based on selected competitors
 */
export function generateDynamicCompetitorData(
  selectedCompetitors: Competitor[],
  baseRate: number,
  dateIndex: number,
  isWeekend: boolean = false
): CompetitorData {
  if (!selectedCompetitors || selectedCompetitors.length === 0) {
    // Fallback to default competitors if none selected
    const fallbackCompetitors = [
      { name: 'Grand Plaza Hotel', rate: Math.round(baseRate * 0.95) + (dateIndex * 140), availability: 65 + (dateIndex % 20), distance: 0.8, rating: 4.2, trend: dateIndex % 3 === 0 ? 'up' as const : 'stable' as const },
      { name: 'City Center Inn', rate: Math.round(baseRate * 0.88) + (dateIndex * 130), availability: 78 + (dateIndex % 15), distance: 1.2, rating: 3.9, trend: 'down' as const }
    ];
    
    const rates = fallbackCompetitors.map(c => c.rate);
    const averageRate = Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
    
    return {
      competitors: fallbackCompetitors,
      marketPosition: 'competitive' as const,
      averageRate,
      lowestRate: Math.min(...rates),
      highestRate: Math.max(...rates),
      priceAdvantage: Math.round(((baseRate - averageRate) / averageRate) * 100),
      marketShare: 23 + (dateIndex % 8)
    };
  }

  // Generate competitor rates based on selected competitors from header
  const competitors = selectedCompetitors.map((competitor, index) => {
    // Base rate variations for different types of competitors
    const rateMultipliers = [0.92, 0.88, 1.05, 1.15, 1.25, 0.95, 1.08, 1.12];
    const multiplier = rateMultipliers[index % rateMultipliers.length];
    
    // Convert distance from string (e.g., "2.1 km") to number
    const distanceNum = parseFloat(competitor.distance?.replace(' km', '') || '1.0');
    
    // Generate rating based on competitor type
    const getRating = (type: string): number => {
      if (type.includes('Luxury') || type.includes('Resort')) return Math.round((4.3 + (index * 0.1)) * 10) / 10;
      if (type.includes('Business') || type.includes('City')) return Math.round((3.8 + (index * 0.1)) * 10) / 10;
      if (type.includes('Boutique') || type.includes('Historic')) return Math.round((4.0 + (index * 0.1)) * 10) / 10;
      return Math.round((3.9 + (index * 0.1)) * 10) / 10;
    };

    // Generate trend based on competitor type and date index (deterministic)
    const getTrend = (): 'up' | 'down' | 'stable' => {
      const trendOptions = ['up', 'down', 'stable'] as const;
      return trendOptions[(dateIndex + index) % 3];
    };

    return {
      name: competitor.name,
      rate: Math.round(baseRate * multiplier) + (dateIndex * (100 + index * 20)) + (isWeekend ? (400 + index * 100) : 0),
      availability: Math.min(Math.max(45 + (dateIndex % 30) + (index * 8), 10), 95), // Keep between 10-95%
      distance: distanceNum,
      rating: getRating(competitor.type),
      trend: getTrend()
    };
  });

  // Calculate market metrics based on actual competitor data
  const rates = competitors.map(c => c.rate);
  const averageRate = rates.length > 0 ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length) : 0;
  const lowestRate = rates.length > 0 ? Math.min(...rates) : 0;
  const highestRate = rates.length > 0 ? Math.max(...rates) : 0;
  const priceAdvantage = rates.length > 0 && averageRate > 0 ? Math.round(((baseRate - averageRate) / averageRate) * 100) : 0;

  return {
    competitors,
    marketPosition: 'competitive' as const,
    averageRate,
    lowestRate,
    highestRate,
    priceAdvantage,
    marketShare: 23 + (dateIndex % 8)
  };
} 