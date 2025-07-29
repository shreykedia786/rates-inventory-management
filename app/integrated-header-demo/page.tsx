'use client';

import React, { useState } from 'react';
import IntegratedHeader from '../../components/IntegratedHeader';

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

export default function IntegratedHeaderDemo() {
  const [isDark, setIsDark] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);

  const handlePropertyChange = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCompetitorsChange = (competitors: Competitor[]) => {
    setSelectedCompetitors(competitors);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Integrated Header */}
      <IntegratedHeader 
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onPropertyChange={handlePropertyChange}
        onCompetitorsChange={handleCompetitorsChange}
      />

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Property Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              🏨 Selected Property Information
            </h2>
            
            {selectedProperty ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-3xl">{selectedProperty.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedProperty.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedProperty.location} • {selectedProperty.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {selectedProperty.rooms} rooms
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedProperty.rooms}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedProperty.type}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Property Type</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🏨</div>
                <p>Select a property from the header to see details</p>
              </div>
            )}
          </div>

          {/* Competitor Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              🎯 Competitor Tracking
            </h2>
            
            {selectedCompetitors.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Monitoring {selectedCompetitors.length} competitors
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                    Active Tracking
                  </span>
                </div>

                {selectedCompetitors.map((competitor) => (
                  <div key={competitor.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-xl">{competitor.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {competitor.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {competitor.type} • {competitor.distance}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                    📊 Competitor Intelligence
                  </div>
                  <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                    <div>• Real-time pricing updates</div>
                    <div>• Availability monitoring</div>
                    <div>• Rate positioning alerts</div>
                    <div>• Market share analysis</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🎯</div>
                <p>Select competitors from the header to track them</p>
                <p className="text-sm mt-2">Go to Competitors tab in the header dropdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            📋 How to Use the Integrated Header
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🏨 Property Selection
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Click on the property selector in the header</li>
                <li>• Browse through 5 available properties</li>
                <li>• Click any property to switch context</li>
                <li>• See instant updates in this demo page</li>
                <li>• Add new properties with the "+" option</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🎯 Competitor Tracking
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Switch to "Competitors" tab in dropdown</li>
                <li>• Toggle competitors on/off with checkboxes</li>
                <li>• Each property has different competitors</li>
                <li>• See live tracking status indicators</li>
                <li>• Monitor pricing and availability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            ← Back to Main Application
          </a>
          <a 
            href="/property-selector-demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Basic Property Selector →
          </a>
        </div>
      </div>
    </div>
  );
} 