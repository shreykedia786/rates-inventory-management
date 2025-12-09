/**
 * Integrated Header Component
 * Header with title, property selector, and competitor tracking
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building, Target, Eye, EyeOff, Plus, Sun, Moon, User, Edit3, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  rooms: number;
  avatar: string;
}

interface Competitor {
  id: string;
  name: string;
  type: string;
  distance: string;
  avatar: string;
}

interface IntegratedHeaderProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
  inlineEdit?: any;
  onPropertyChange?: (property: Property) => void;
  onCompetitorsChange?: (competitors: Competitor[]) => void;

}

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Ocean View Resort & Spa',
    location: 'Maldives',
    type: 'Resort',
    rooms: 150,
    avatar: '🏖️'
  },
  {
    id: 'prop-2', 
    name: 'Downtown Business Hotel',
    location: 'New York, USA',
    type: 'Business Hotel',
    rooms: 280,
    avatar: '🏢'
  },
  {
    id: 'prop-3',
    name: 'Mountain Lodge Retreat',
    location: 'Swiss Alps',
    type: 'Lodge',
    rooms: 85,
    avatar: '🏔️'
  },
  {
    id: 'prop-4',
    name: 'City Center Boutique',
    location: 'London, UK', 
    type: 'Boutique Hotel',
    rooms: 65,
    avatar: '🏛️'
  },
  {
    id: 'prop-5',
    name: 'Beachfront Paradise',
    location: 'Bali, Indonesia',
    type: 'Beach Resort',
    rooms: 200,
    avatar: '🌴'
  }
];

const mockCompetitors: Record<string, Competitor[]> = {
  'prop-1': [
    { id: 'comp-1', name: 'Paradise Resort', type: 'Luxury Resort', distance: '2.1 km', avatar: '🏝️' },
    { id: 'comp-2', name: 'Azure Waters Hotel', type: 'Beach Resort', distance: '3.5 km', avatar: '🌊' },
    { id: 'comp-3', name: 'Coral Bay Resort', type: 'Resort', distance: '5.2 km', avatar: '🐠' },
    { id: 'comp-4', name: 'Sunset Villa Resort', type: 'Villa Resort', distance: '7.8 km', avatar: '🌅' }
  ],
  'prop-2': [
    { id: 'comp-5', name: 'Manhattan Grand', type: 'Business Hotel', distance: '0.8 km', avatar: '🏙️' },
    { id: 'comp-6', name: 'Times Square Inn', type: 'City Hotel', distance: '1.2 km', avatar: '🎭' },
    { id: 'comp-7', name: 'Broadway Suites', type: 'Business Hotel', distance: '1.5 km', avatar: '🎪' },
    { id: 'comp-8', name: 'Central Park Hotel', type: 'Luxury Hotel', distance: '2.3 km', avatar: '🌳' }
  ],
  'prop-3': [
    { id: 'comp-9', name: 'Alpine Peak Lodge', type: 'Mountain Lodge', distance: '1.5 km', avatar: '⛰️' },
    { id: 'comp-10', name: 'Snow Valley Resort', type: 'Ski Resort', distance: '3.2 km', avatar: '🎿' },
    { id: 'comp-11', name: 'Glacier View Hotel', type: 'Mountain Hotel', distance: '4.7 km', avatar: '🏔️' }
  ],
  'prop-4': [
    { id: 'comp-12', name: 'Thames Boutique', type: 'Boutique Hotel', distance: '0.5 km', avatar: '🇬🇧' },
    { id: 'comp-13', name: 'Covent Garden Inn', type: 'Historic Hotel', distance: '1.1 km', avatar: '🎭' },
    { id: 'comp-14', name: 'Westminster Palace', type: 'Luxury Hotel', distance: '1.8 km', avatar: '👑' }
  ],
  'prop-5': [
    { id: 'comp-15', name: 'Bali Breeze Resort', type: 'Beach Resort', distance: '1.2 km', avatar: '🌺' },
    { id: 'comp-16', name: 'Tropical Paradise', type: 'Resort', distance: '2.5 km', avatar: '🥥' },
    { id: 'comp-17', name: 'Sunset Beach Hotel', type: 'Beach Hotel', distance: '3.8 km', avatar: '🏄' }
  ]
};

export default function IntegratedHeader({ 
  isDark, 
  onToggleDarkMode, 
  inlineEdit,
  onPropertyChange,
  onCompetitorsChange
}: IntegratedHeaderProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'competitors'>('properties');
  const [selectedCompetitors, setSelectedCompetitors] = useState<Set<string>>(new Set(['comp-1', 'comp-2']));
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure proper client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (isMounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMounted]);

  const handlePropertySelect = (property: Property) => {
    console.log('Property selected:', property);
    setSelectedProperty(property);
    onPropertyChange?.(property);
    // Reset competitors for new property
    const newCompetitors = mockCompetitors[property.id]?.slice(0, 2).map(c => c.id) || [];
    setSelectedCompetitors(new Set(newCompetitors));
    setShowDropdown(false);
  };

  const handleCompetitorToggle = (competitorId: string) => {
    console.log('Toggling competitor:', competitorId);
    const newSelected = new Set(selectedCompetitors);
    if (newSelected.has(competitorId)) {
      newSelected.delete(competitorId);
    } else {
      newSelected.add(competitorId);
    }
    setSelectedCompetitors(newSelected);
    
    // Notify parent component
    const competitors = mockCompetitors[selectedProperty.id]?.filter(c => newSelected.has(c.id)) || [];
    onCompetitorsChange?.(competitors);
  };

  const handleDropdownClick = () => {
    console.log('Dropdown button clicked, current state:', showDropdown);
    setShowDropdown(!showDropdown);
  };

  const currentCompetitors = mockCompetitors[selectedProperty.id] || [];
  const selectedCompetitorsList = currentCompetitors.filter(c => selectedCompetitors.has(c.id));

  return (
    <header className="sticky-header">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Revenue Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered pricing optimization platform
              </p>
            </div>

            {/* Property & Competitor Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownClick}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                         rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 
                         shadow-sm hover:shadow-md min-w-[320px]"
              >
                <span className="text-2xl">{selectedProperty.avatar}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {selectedProperty.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedProperty.location} • {selectedProperty.rooms} rooms
                    {selectedCompetitorsList.length > 0 && (
                      <span className="ml-2">• {selectedCompetitorsList.length} competitors tracked</span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Enhanced Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                              rounded-xl shadow-xl z-[9999] max-h-96 overflow-hidden">
                  
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setActiveTab('properties')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'properties'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Building className="w-4 h-4 inline mr-2" />
                      Properties
                    </button>
                    <button
                      onClick={() => setActiveTab('competitors')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'competitors'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Target className="w-4 h-4 inline mr-2" />
                      Competitors ({selectedCompetitors.size})
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {activeTab === 'properties' && (
                      <div className="p-2">
                        {mockProperties.map((property) => (
                          <button
                            key={property.id}
                            onClick={() => handlePropertySelect(property)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                              ${selectedProperty.id === property.id
                                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                          >
                            <span className="text-xl">{property.avatar}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white text-sm">
                                {property.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {property.location} • {property.type}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {property.rooms} rooms
                              </div>
                            </div>
                            {selectedProperty.id === property.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </button>
                        ))}
                        
                        {/* Add Property Option */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="w-5 h-5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                              <Plus className="w-3 h-3 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                Add New Property
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Connect another property to your account
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'competitors' && (
                      <div className="p-2">
                        <div className="mb-3 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Competitor Tracking for {selectedProperty.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Select competitors to monitor pricing and availability
                          </div>
                        </div>

                        {currentCompetitors.map((competitor) => (
                          <div
                            key={competitor.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <button
                              onClick={() => handleCompetitorToggle(competitor.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                selectedCompetitors.has(competitor.id)
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                              }`}
                            >
                              {selectedCompetitors.has(competitor.id) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </button>
                            
                            <span className="text-lg">{competitor.avatar}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white text-sm">
                                {competitor.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {competitor.type} • {competitor.distance}
                              </div>
                            </div>
                            
                            {selectedCompetitors.has(competitor.id) ? (
                              <Eye className="w-4 h-4 text-blue-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        ))}

                        {currentCompetitors.length === 0 && (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <div className="text-sm">No competitors found for this property</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Competitive Intelligence Dashboard Link */}
            <Link
              href="/competitive-intelligence"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
              title="View Competitive Intelligence Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Competitive Intelligence</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Inline Edit Status */}
            {inlineEdit && (
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
                <Edit3 className="w-4 h-4" />
                <span>Editing {inlineEdit.type} - Press Enter to save, Esc to cancel</span>
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Revenue Manager</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 