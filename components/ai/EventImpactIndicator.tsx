/**
 * Event Impact Indicator Component
 * Shows events on date columns with their predicted demand impact
 * Integrates with AI recommendations for event-driven pricing strategies
 */
'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Info,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Star,
  Cloud,
  Sun,
  CloudRain,
  Thermometer
} from 'lucide-react';

import { Event, EventImpact, WeatherForecast } from '../../types';

interface EventImpactIndicatorProps {
  date: Date;
  events: Event[];
  onEventClick?: (event: Event) => void;
  isDark?: boolean;
  showTooltip?: boolean;
  compact?: boolean;
}

export function EventImpactIndicator({
  date,
  events,
  onEventClick,
  isDark = false,
  showTooltip = true,
  compact = false
}: EventImpactIndicatorProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (events.length === 0) return null;

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'conference':
        return <Users className="w-3 h-3" />;
      case 'festival':
        return <Star className="w-3 h-3" />;
      case 'sports':
        return <TrendingUp className="w-3 h-3" />;
      case 'holiday':
        return <Calendar className="w-3 h-3" />;
      case 'exhibition':
        return <MapPin className="w-3 h-3" />;
      case 'concert':
        return <Star className="w-3 h-3" />;
      case 'business':
        return <Users className="w-3 h-3" />;
      case 'weather':
        return <Cloud className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const getImpactColor = (impact: EventImpact) => {
    const multiplier = impact.demandMultiplier;
    if (multiplier >= 1.5) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (multiplier >= 1.2) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (multiplier >= 1.0) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getImpactLabel = (impact: EventImpact) => {
    const multiplier = impact.demandMultiplier;
    if (multiplier >= 1.5) return 'High Impact';
    if (multiplier >= 1.2) return 'Medium Impact';
    if (multiplier >= 1.0) return 'Low Impact';
    return 'Negative Impact';
  };

  const getWeatherIcon = (condition: WeatherForecast['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-3 h-3 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-3 h-3 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-3 h-3 text-blue-400" />;
      default:
        return <Cloud className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const formatAttendance = (attendance?: number) => {
    if (!attendance) return 'Unknown';
    if (attendance >= 1000000) return `${(attendance / 1000000).toFixed(1)}M`;
    if (attendance >= 1000) return `${(attendance / 1000).toFixed(1)}K`;
    return attendance.toString();
  };

  // Sort events by impact (highest first)
  const sortedEvents = [...events].sort((a, b) => b.impact.demandMultiplier - a.impact.demandMultiplier);
  const primaryEvent = sortedEvents[0];
  const totalImpact = events.reduce((sum, event) => sum + (event.impact.demandMultiplier - 1), 0);

  const updateTooltipPosition = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  return (
    <>
      <div
        className={`
          relative inline-flex items-center gap-1 cursor-pointer transition-all duration-200
          ${compact ? 'px-1 py-0.5' : 'px-2 py-1'}
          ${compact ? 'text-xs' : 'text-xs'}
          rounded-full border backdrop-blur-sm font-medium
          ${getImpactColor(primaryEvent.impact)}
          hover:scale-105 hover:shadow-lg
        `}
        onMouseEnter={(e) => {
          if (showTooltip) {
            setIsTooltipVisible(true);
            updateTooltipPosition(e);
          }
        }}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={() => onEventClick?.(primaryEvent)}
      >
        {getEventTypeIcon(primaryEvent.type)}
        {!compact && (
          <span className="truncate max-w-16">
            {events.length > 1 ? `${events.length} Events` : primaryEvent.title.split(' ')[0]}
          </span>
        )}
        
        {/* Impact indicator */}
        <div className={`
          w-2 h-2 rounded-full
          ${totalImpact >= 0.5 ? 'bg-green-400 animate-pulse' : 
            totalImpact >= 0.2 ? 'bg-blue-400' : 
            totalImpact >= 0 ? 'bg-yellow-400' : 'bg-red-400'}
        `} />
      </div>

      {/* Enhanced Tooltip */}
      {isTooltipVisible && showTooltip && (
        <div
          className={`
            fixed z-[9999] w-80 p-4 rounded-xl shadow-2xl border backdrop-blur-xl
            animate-in fade-in-0 zoom-in-95 duration-200
            ${isDark 
              ? 'bg-gray-900/95 border-gray-700 text-white' 
              : 'bg-white/95 border-gray-200 text-gray-900'
            }
          `}
          style={{
            left: `${tooltipPosition.x - 160}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-100%)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">
              {events.length === 1 ? 'Event Impact' : `${events.length} Events`}
            </h4>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${getImpactColor(primaryEvent.impact).split(' ')[0]}`}>
                {getImpactLabel(primaryEvent.impact)}
              </span>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {sortedEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getImpactColor(event.impact).split(' ')[0]} bg-current/20`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <h5 className="font-medium text-sm truncate max-w-40">{event.title}</h5>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span className="capitalize">{event.type}</span>
                        {event.location.distanceFromProperty < 10 && (
                          <>
                            <span>•</span>
                            <span>{formatDistance(event.location.distanceFromProperty)} away</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs font-medium ${getImpactColor(event.impact).split(' ')[0]}`}>
                      +{Math.round((event.impact.demandMultiplier - 1) * 100)}%
                    </div>
                    <div className="text-xs opacity-60">
                      {Math.round(event.confidence * 100)}% conf.
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-2 text-xs opacity-75">
                  {event.impact.expectedAttendance && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{formatAttendance(event.impact.expectedAttendance)} attendees</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {event.startDate.toLocaleDateString() === event.endDate.toLocaleDateString() 
                        ? 'Single day'
                        : `${Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                      }
                    </span>
                  </div>

                  {event.location.venue && (
                    <div className="flex items-center gap-1 col-span-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location.venue}</span>
                    </div>
                  )}
                </div>

                {/* Weather Forecast */}
                {event.metadata.weatherForecast && (
                  <div className="mt-2 pt-2 border-t border-opacity-20">
                    <div className="flex items-center gap-2 text-xs">
                      {getWeatherIcon(event.metadata.weatherForecast.condition)}
                      <span className="capitalize">{event.metadata.weatherForecast.condition}</span>
                      <Thermometer className="w-3 h-3" />
                      <span>{event.metadata.weatherForecast.temperature}°C</span>
                      {event.metadata.weatherForecast.precipitation > 0 && (
                        <>
                          <CloudRain className="w-3 h-3" />
                          <span>{event.metadata.weatherForecast.precipitation}%</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Historical Performance */}
                {event.impact.historicalData && event.impact.historicalData.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-opacity-20">
                    <div className="text-xs opacity-75">
                      <span className="font-medium">Historical avg:</span>
                      <span className="ml-1">
                        +{Math.round(event.impact.historicalData[0].avgRateIncrease)}% rate,
                      </span>
                      <span className="ml-1">
                        {Math.round(event.impact.historicalData[0].occupancyRate)}% occupancy
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {events.length > 3 && (
              <div className="text-center py-2 text-xs opacity-60">
                +{events.length - 3} more events
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="mt-4 pt-3 border-t border-opacity-20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm">AI Recommendations</span>
            </div>
            
            <div className="space-y-2 text-xs">
              {totalImpact >= 0.3 && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>Consider increasing rates by {Math.round(totalImpact * 100)}%</span>
                </div>
              )}
              
              {sortedEvents.some(e => e.impact.expectedAttendance && e.impact.expectedAttendance > 10000) && (
                <div className="flex items-center gap-2 text-blue-400">
                  <Info className="w-3 h-3" />
                  <span>Apply minimum stay restrictions</span>
                </div>
              )}
              
              {totalImpact < 0 && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Monitor for booking cancellations</span>
                </div>
              )}
            </div>
          </div>

          {/* External Links */}
          {primaryEvent.metadata.website && (
            <div className="mt-3 pt-3 border-t border-opacity-20">
              <a
                href={primaryEvent.metadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View event details
              </a>
            </div>
          )}

          {/* Tooltip arrow */}
          <div
            className={`absolute w-3 h-3 rotate-45 ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } border-b border-r top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          />
        </div>
      )}
    </>
  );
}

export default EventImpactIndicator; 