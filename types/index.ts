/**
 * Core Type Definitions for Rates & Inventory Management Platform
 * Based on UX Design specifications and business requirements
 */

// =============================================================================
// CORE BUSINESS ENTITIES
// =============================================================================

export interface Property {
  id: string;
  name: string;
  brand?: string;
  location: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  settings: PropertySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertySettings {
  timezone: string;
  currency: string;
  defaultLeadTime: number;
  maxAdvanceBooking: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface RoomType {
  id: string;
  name: string;
  code?: string;
  capacity?: number;
  baseRate?: number;
  inventory?: number;
  amenities?: string[];
  isActive?: boolean;
  description?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// =============================================================================
// CALENDAR GRID SYSTEM
// =============================================================================

export interface Cell {
  id: string;
  date: string;
  roomTypeId: string;
  value: number;
  type: 'rate' | 'inventory';
  isModified?: boolean;
  hasAIRecommendation?: boolean;
}

export interface GridData {
  cells: GridCell[][];
  roomTypes: RoomType[];
  dates: Date[];
  dateRange: {
    start: string;
    end: string;
  };
  metadata?: GridMetadata;
}

export interface GridCell {
  id: string;
  rowId: string;
  columnId: string;
  date: Date;
  roomTypeId: string;
  cellType: CellType;
  value: number | string;
  originalValue: number | string;
  isEditable: boolean;
  isSelected: boolean;
  isEditing: boolean;
  hasChanges: boolean;
  restrictions?: RateRestrictions;
  aiRecommendation?: AIRecommendation;
  validationErrors?: ValidationError[];
  lastModified?: {
    timestamp: Date;
    userId: string;
    source: 'manual' | 'bulk' | 'ai' | 'import';
  };
}

export type CellType = 'rate' | 'inventory' | 'minStay' | 'maxStay' | 'closedToArrival' | 'closedToDeparture';

export interface GridMetadata {
  totalCells: number;
  loadedCells: number;
  hasUnsavedChanges: boolean;
  lastSyncTime: Date;
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface RateRestrictions {
  minRate?: number;
  maxRate?: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  stopSell: boolean;
}

// =============================================================================
// AI RECOMMENDATIONS SYSTEM
// =============================================================================

export interface AIRecommendation {
  id: string;
  cellId: string;
  suggestedValue: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
  status: 'pending' | 'accepted' | 'dismissed';
}

export interface AIReasoning {
  strategy: 'conservative' | 'balanced' | 'aggressive';
  primaryDriver: string;
  expectedOutcome: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

export interface ImpactMetric {
  label: string;
  currentValue: string;
  projectedValue: string;
  change: number;
  unit: string;
}

export interface AIFactor {
  name: string;
  type: 'market' | 'demand' | 'competition' | 'historical' | 'events' | 'weather';
  weight: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface AlternativeRecommendation {
  value: number;
  confidence: number;
  strategy: string;
  description: string;
}

// =============================================================================
// ANOMALY DETECTION
// =============================================================================

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedCells: string[];
  detectedAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  actions: AnomalyAction[];
  metadata: Record<string, any>;
}

export type AnomalyType = 
  | 'price_variance'
  | 'inventory_oversold' 
  | 'unusual_demand'
  | 'competitor_alert'
  | 'data_sync_error'
  | 'performance_issue';

export interface AnomalyAction {
  id: string;
  label: string;
  action: string;
  isPrimary: boolean;
  requiresConfirmation: boolean;
}

// =============================================================================
// USER MANAGEMENT & PERMISSIONS
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  properties: string[];
  preferences: UserPreferences;
  lastLoginAt: Date;
  isActive: boolean;
}

export type UserRole = 'revenue_manager' | 'distribution_manager' | 'corporate_admin' | 'property_manager' | 'viewer';

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  gridSettings: GridPreferences;
  aiSettings: AIPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  anomalyAlerts: boolean;
  aiRecommendations: boolean;
  syncUpdates: boolean;
}

export interface GridPreferences {
  defaultView: 'weekly' | 'monthly';
  cellSize: 'compact' | 'comfortable' | 'spacious';
  showWeekends: boolean;
  highlightChanges: boolean;
  autoSave: boolean;
  keyboardShortcuts: boolean;
}

export interface AIPreferences {
  recommendationFrequency: 'realtime' | 'hourly' | 'daily';
  confidenceThreshold: number;
  strategy: 'conservative' | 'balanced' | 'aggressive';
  autoAcceptThreshold?: number;
  showExplanations: boolean;
}

// =============================================================================
// API & DATA MANAGEMENT
// =============================================================================

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: APIError[];
  pagination?: PaginationInfo;
  meta?: Record<string, any>;
}

export interface APIError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BulkOperation {
  id: string;
  type: BulkOperationType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  affectedCells: string[];
  changes: BulkChange[];
  userId: string;
  createdAt: Date;
  completedAt?: Date;
  errors?: BulkError[];
}

export type BulkOperationType = 
  | 'update_rates'
  | 'update_inventory'
  | 'apply_restrictions'
  | 'copy_period'
  | 'apply_template';

export interface BulkChange {
  cellId: string;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface BulkError {
  cellId: string;
  error: string;
  code?: string;
}

// =============================================================================
// UI STATE MANAGEMENT
// =============================================================================

export interface UIState {
  isSidebarOpen: boolean;
  isBulkOperationsOpen: boolean;
  isAIModalOpen: boolean;
  activeAIRecommendationId: string | null;
}

export interface GridState {
  gridData: GridData | null;
  selectedCells: string[];
  editingCell: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AIState {
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: string;
  isPrimary?: boolean;
}

// =============================================================================
// VALIDATION & ERROR HANDLING
// =============================================================================

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'min' | 'max' | 'range' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, context?: any) => boolean;
}

// =============================================================================
// ANALYTICS & REPORTING
// =============================================================================

export interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: number;
}

// =============================================================================
// COMPONENT PROPS INTERFACES
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface GridCellProps extends BaseComponentProps {
  cell: GridCell;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (cellId: string) => void;
  onEdit: (cellId: string, value: string) => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface AIRecommendationModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: AIRecommendation;
  onAccept: (recommendationId: string, value?: number) => void;
  onDismiss: (recommendationId: string, reason: string) => void;
  onFeedback: (recommendationId: string, feedback: string) => void;
}

export interface BulkOperationsPanelProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCells: string[];
  onApply: (operation: BulkOperationType, changes: Record<string, any>) => void;
}

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export type {
  // Add any additional type exports here as needed
};

// =============================================================================
// ENHANCED AI AGENT SYSTEM
// =============================================================================

export interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'learning' | 'maintenance';
  capabilities: AICapability[];
  settings: AIAgentSettings;
  lastAnalysisAt: Date;
  performance: AIPerformanceMetrics;
  version: string;
}

export interface AICapability {
  type: 'rate_optimization' | 'inventory_management' | 'restriction_analysis' | 'event_monitoring' | 'competitor_tracking' | 'demand_forecasting';
  enabled: boolean;
  confidenceThreshold: number;
  autoApplyThreshold?: number;
  analysisFrequency: 'realtime' | 'hourly' | 'daily';
}

export interface AIAgentSettings {
  autoApplyRecommendations: boolean;
  autoApplyThreshold: number;
  maxAutoChangesPerDay: number;
  requireConfirmationFor: ('high_value_changes' | 'inventory_reductions' | 'rate_increases' | 'restrictions')[];
  analysisScope: {
    lookaheadDays: number;
    competitorTracking: boolean;
    eventIntegration: boolean;
    weatherFactors: boolean;
  };
  notifications: {
    critical: boolean;
    recommendations: boolean;
    autoActions: boolean;
    performanceReports: boolean;
  };
}

export interface AIPerformanceMetrics {
  totalRecommendations: number;
  acceptedRecommendations: number;
  dismissedRecommendations: number;
  autoAppliedActions: number;
  accuracyScore: number;
  revenueDeltaGenerated: number;
  avgConfidenceScore: number;
  responseTime: number;
}

// Enhanced AI Recommendation with more granular data
export interface EnhancedAIRecommendation extends AIRecommendation {
  category: 'pricing' | 'inventory' | 'restrictions' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  reasoning: AIReasoning;
  impactMetrics: ImpactMetric[];
  alternatives: AlternativeRecommendation[];
  enhancedFactors: AIFactor[];
  relatedEvents?: Event[];
  competitorContext?: CompetitorContext;
  riskAssessment: RiskAssessment;
  autoApplicable: boolean;
  expiresAt?: Date;
  appliedAt?: Date;
  appliedBy?: string;
  undoAvailable: boolean;
  undoExpiresAt?: Date;
  feedback?: RecommendationFeedback;
}

export interface CompetitorContext {
  averageMarketRate: number;
  competitorRates: CompetitorRate[];
  marketPosition: 'premium' | 'competitive' | 'value';
  priceGap: number;
  marketShare: number;
}

export interface CompetitorRate {
  competitorName: string;
  rate: number;
  availability: number;
  lastUpdated: Date;
  source: string;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigation: string[];
  reversible: boolean;
  maxImpact: number;
}

export interface RiskFactor {
  type: 'revenue' | 'occupancy' | 'competitive' | 'operational';
  probability: number;
  impact: number;
  description: string;
}

export interface RecommendationFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  outcome: 'positive' | 'negative' | 'neutral';
  actualImpact?: number;
  providedAt: Date;
  providedBy: string;
}

// =============================================================================
// EVENT INTEGRATION SYSTEM
// =============================================================================

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  impact: EventImpact;
  confidence: number;
  source: EventSource;
  metadata: EventMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type EventType = 
  | 'conference' 
  | 'festival' 
  | 'sports' 
  | 'holiday' 
  | 'exhibition' 
  | 'concert' 
  | 'business' 
  | 'weather' 
  | 'local' 
  | 'national' 
  | 'international';

export type EventCategory = 
  | 'demand_driver' 
  | 'demand_suppressor' 
  | 'neutral' 
  | 'uncertain';

export interface EventLocation {
  name: string;
  address?: string;
  coordinates: [number, number];
  distanceFromProperty: number;
  venue?: string;
}

export interface EventImpact {
  expectedAttendance?: number;
  demandMultiplier: number;
  confidenceLevel: number;
  affectedDateRange: DateRange;
  roomTypeImpact: Record<string, number>;
  priceElasticity: number;
  historicalData?: HistoricalEventData[];
}

export interface HistoricalEventData {
  year: number;
  actualDemandIncrease: number;
  avgRateIncrease: number;
  occupancyRate: number;
  revparDelta: number;
}

export type EventSource = 'manual' | 'api' | 'scraper' | 'calendar' | 'news' | 'social_media';

export interface EventMetadata {
  organizer?: string;
  website?: string;
  ticketPrice?: number;
  tags: string[];
  relatedEvents?: string[];
  weatherForecast?: WeatherForecast;
}

export interface WeatherForecast {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  precipitation: number;
  impactOnEvent: 'positive' | 'negative' | 'neutral';
}

// =============================================================================
// AUTONOMOUS ACTIONS SYSTEM
// =============================================================================

export interface AutonomousAction {
  id: string;
  type: AutonomousActionType;
  triggeredBy: ActionTrigger;
  status: ActionStatus;
  scheduledAt: Date;
  executedAt?: Date;
  target: ActionTarget;
  changes: ActionChange[];
  reasoning: string;
  confidence: number;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  rollbackPlan: RollbackPlan;
  auditTrail: AuditEntry[];
  metadata: Record<string, any>;
}

export type AutonomousActionType = 
  | 'rate_adjustment'
  | 'inventory_update'
  | 'restriction_change'
  | 'bulk_optimization'
  | 'emergency_override'
  | 'competitor_response';

export interface ActionTrigger {
  type: 'ai_recommendation' | 'threshold_breach' | 'event_detected' | 'competitor_change' | 'demand_spike' | 'manual_override';
  source: string;
  data: Record<string, any>;
  timestamp: Date;
}

export type ActionStatus = 
  | 'scheduled'
  | 'pending_approval'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'rolled_back';

export interface ActionTarget {
  roomTypeId?: string;
  productId?: string;
  dateRange: DateRange;
  scope: 'single_cell' | 'room_type' | 'product' | 'date_range' | 'property_wide';
}

export interface ActionChange {
  field: string;
  oldValue: any;
  newValue: any;
  delta: number;
  unit: string;
}

export interface RollbackPlan {
  autoRollback: boolean;
  rollbackConditions: RollbackCondition[];
  rollbackExpiresAt: Date;
  rollbackData: Record<string, any>;
}

export interface RollbackCondition {
  metric: string;
  threshold: number;
  operator: '>' | '<' | '=' | '>=' | '<=';
  checkFrequency: 'realtime' | 'hourly' | 'daily';
}

export interface AuditEntry {
  timestamp: Date;
  action: string;
  userId?: string;
  details: Record<string, any>;
  source: 'user' | 'ai' | 'system';
}

// =============================================================================
// CONVERSATIONAL AI ASSISTANT
// =============================================================================

export interface AIAssistant {
  id: string;
  name: string;
  version: string;
  capabilities: AssistantCapability[];
  personality: AssistantPersonality;
  context: ConversationContext;
  settings: AssistantSettings;
}

export interface AssistantCapability {
  type: 'query_data' | 'explain_insights' | 'suggest_actions' | 'analyze_trends' | 'compare_performance' | 'generate_reports';
  enabled: boolean;
  confidenceLevel: number;
}

export interface AssistantPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'technical';
  verbosity: 'concise' | 'detailed' | 'comprehensive';
  expertise: 'beginner' | 'intermediate' | 'expert';
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  currentView: string;
  selectedCells: string[];
  recentActions: string[];
  domainContext: Record<string, any>;
}

export interface AssistantSettings {
  proactiveInsights: boolean;
  contextAwareness: boolean;
  learningMode: boolean;
  responseDelay: number;
  maxResponseLength: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: ConversationContext;
  attachments?: ChatAttachment[];
  actions?: ChatAction[];
  feedback?: MessageFeedback;
}

export interface ChatAttachment {
  id: string;
  type: 'chart' | 'table' | 'image' | 'document' | 'grid_reference';
  title: string;
  data: any;
  metadata: Record<string, any>;
}

export interface ChatAction {
  id: string;
  type: 'apply_suggestion' | 'show_data' | 'navigate_to' | 'export_data' | 'schedule_action';
  label: string;
  action: string;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
}

export interface MessageFeedback {
  helpful: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  timestamp: Date;
}

// =============================================================================
// PROACTIVE ALERTS SYSTEM
// =============================================================================

export interface ProactiveAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  category: AlertCategory;
  source: AlertSource;
  triggerConditions: AlertCondition[];
  affectedEntities: AlertEntity[];
  recommendations: EnhancedAIRecommendation[];
  status: AlertStatus;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  snoozeUntil?: Date;
  metadata: Record<string, any>;
}

export type AlertType = 
  | 'opportunity'
  | 'risk'
  | 'anomaly'
  | 'threshold_breach'
  | 'competitor_action'
  | 'event_impact'
  | 'performance_issue'
  | 'data_quality';

export type AlertSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type AlertCategory = 
  | 'revenue_optimization'
  | 'inventory_management'
  | 'competitive_intelligence'
  | 'demand_forecasting'
  | 'operational_efficiency'
  | 'data_integrity';

export type AlertSource = 'ai_agent' | 'monitoring_system' | 'external_api' | 'user_defined' | 'scheduled_check';

export interface AlertCondition {
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=' | '!=' | 'contains' | 'between';
  value: any;
  timeframe?: string;
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export interface AlertEntity {
  type: 'room_type' | 'product' | 'date' | 'property' | 'competitor';
  id: string;
  name: string;
  impact: number;
}

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'snoozed' | 'expired';

// =============================================================================
// BULK OPERATIONS WITH AI
// =============================================================================

export interface AIBulkOperation extends BulkOperation {
  aiGenerated: boolean;
  recommendation: EnhancedAIRecommendation;
  previewResults: BulkOperationPreview;
  riskAssessment: RiskAssessment;
  rollbackPlan: RollbackPlan;
  approvalWorkflow?: ApprovalWorkflow;
}

export interface BulkOperationPreview {
  affectedCells: number;
  estimatedImpact: {
    revenue: number;
    occupancy: number;
    adr: number;
    revpar: number;
  };
  risks: RiskFactor[];
  timeline: BulkOperationStep[];
}

export interface BulkOperationStep {
  step: number;
  description: string;
  estimatedDuration: number;
  dependencies: string[];
  rollbackPoint: boolean;
}

export interface ApprovalWorkflow {
  required: boolean;
  approvers: string[];
  threshold: number;
  autoApprove: boolean;
  escalation: EscalationRule[];
}

export interface EscalationRule {
  condition: string;
  delay: number;
  escalateTo: string[];
  notification: NotificationTemplate;
}

export interface NotificationTemplate {
  subject: string;
  body: string;
  channels: ('email' | 'sms' | 'push' | 'slack' | 'teams')[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

// =============================================================================
// AI TRANSPARENCY & EXPLAINABILITY
// =============================================================================

export interface AIExplanation {
  id: string;
  recommendationId: string;
  type: 'why' | 'how' | 'what_if' | 'confidence';
  explanation: string;
  visualizations?: ExplanationVisualization[];
  dataPoints: ExplanationDataPoint[];
  methodology: string;
  limitations: string[];
  confidence: number;
  generatedAt: Date;
}

export interface ExplanationVisualization {
  type: 'chart' | 'graph' | 'heatmap' | 'table' | 'timeline';
  title: string;
  data: any;
  config: Record<string, any>;
}

export interface ExplanationDataPoint {
  metric: string;
  value: any;
  weight: number;
  source: string;
  timestamp: Date;
  reliability: number;
}

// =============================================================================
// UI STATE EXTENSIONS
// =============================================================================

export interface EnhancedUIState extends UIState {
  aiAgentPanel: {
    isOpen: boolean;
    activeTab: 'recommendations' | 'actions' | 'performance' | 'settings';
  };
  alertsPanel: {
    isOpen: boolean;
    filter: AlertSeverity | 'all';
    unreadCount: number;
  };
  chatAssistant: {
    isOpen: boolean;
    isMinimized: boolean;
    unreadCount: number;
    currentSessionId: string;
  };
  bulkOperationsPanel: {
    isOpen: boolean;
    selectedOperation?: BulkOperationType;
    previewMode: boolean;
  };
  auditTrail: {
    isOpen: boolean;
    filter: {
      dateRange: DateRange;
      source: 'all' | 'user' | 'ai' | 'system';
      entityType: 'all' | 'room_type' | 'product' | 'date';
    };
  };
}

export interface AIAgentState {
  agent: AIAgent;
  recommendations: EnhancedAIRecommendation[];
  actions: AutonomousAction[];
  alerts: ProactiveAlert[];
  performance: AIPerformanceMetrics;
  isLoading: boolean;
  error: string | null;
  lastSyncAt: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  currentSession: string;
  isLoading: boolean;
  isTyping: boolean;
  context: ConversationContext;
  assistant: AIAssistant;
} 