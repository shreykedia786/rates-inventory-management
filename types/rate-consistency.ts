/**
 * Standardized Rate Data Model
 * SINGLE SOURCE OF TRUTH for all rate terminology across the application
 */

// Import required types
interface RoomType {
  id: string;
  name: string;
  code: string;
}

interface RatePlan {
  id: string;
  name: string;
  code: string;
}

interface Channel {
  id: string;
  name: string;
  code: string;
}

export interface StandardizedRateData {
  // Base Rates
  baseRate: number;           // Original rate from property setup
  currentRate: number;        // Currently active/published rate
  
  // AI & Recommendations
  aiRecommendedRate?: number; // AI-suggested rate
  aiAppliedRate?: number;     // Rate applied via AI (when accepted)
  aiConfidence?: number;      // AI confidence score (0-100)
  
  // Manual Overrides
  manualOverrideRate?: number; // User-set override rate
  overrideReason?: string;     // Why the override was applied
  
  // Final State
  finalRate: number;          // The rate that will be/is published
  rateSource: RateSource;     // How this rate was determined
  
  // Metadata
  lastModified: Date;
  modifiedBy: string;
  isActive: boolean;
  hasUnsavedChanges: boolean;
  
  // Audit Trail
  rateHistory: RateChangeEvent[];
}

export type RateSource = 
  | 'base_rate'        // From property setup
  | 'manual_override'  // User manually set
  | 'ai_recommendation' // AI suggested and accepted
  | 'ai_auto_applied'  // AI applied automatically
  | 'bulk_operation'   // From bulk update
  | 'channel_sync'     // From channel manager
  | 'import';          // From CSV/API import

export interface RateChangeEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  source: RateSource;
  fromRate: number;
  toRate: number;
  reason?: string;
  aiInsightId?: string;
  confidence?: number;
  approved?: boolean;
  approverId?: string;
}

/**
 * AI Recommendation with Complete Context
 */
export interface AIRateRecommendation {
  id: string;
  cellId: string;
  
  // Current State
  currentRate: number;
  baseRate: number;
  
  // AI Suggestion
  aiRecommendedRate: number;
  confidence: number;
  reasoning: string;
  
  // Context & Factors
  marketFactors: {
    competitorAverage: number;
    marketTrend: 'up' | 'down' | 'stable';
    demandLevel: 'low' | 'medium' | 'high';
    positionVsCompetitors: number; // percentile
  };
  
  // Status & Actions
  status: 'pending' | 'accepted' | 'dismissed' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
  appliedAt?: Date;
  appliedBy?: string;
  
  // Revenue Impact
  projectedImpact: {
    dailyRevenue: number;
    monthlyRevenue: number;
    occupancyChange: number;
    revenueChange: number;
  };
  
  // Undo Capability
  undoAvailable: boolean;
  undoExpiresAt?: Date;
}

/**
 * Complete Cell Data Model with Consistency
 */
export interface StandardizedCellData {
  // Identity
  id: string;
  propertyId: string;
  roomTypeId: string;
  ratePlanId: string;
  date: Date;
  
  // Rate Information (using standardized model)
  rateData: StandardizedRateData;
  
  // Inventory Information
  inventory: number;
  originalInventory: number;
  availableInventory: number;
  
  // AI Insights
  aiRecommendation?: AIRateRecommendation;
  hasAIInsights: boolean;
  
  // UI State
  isSelected: boolean;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: ValidationError[];
  
  // Visual Indicators
  showAIBadge: boolean;
  showChangeBadge: boolean;
  showWarningBadge: boolean;
  
  // Relationships
  roomType: RoomType;
  ratePlan: RatePlan;
  channel?: Channel;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
} 