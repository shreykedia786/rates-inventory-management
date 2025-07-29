/**
 * Property Selector Component
 * Multi-property dropdown for revenue managers
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  rooms: number;
  avatar: string;
}

interface PropertySelectorProps {
  isDark?: boolean;
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

export default function PropertySelector({ isDark = false }: PropertySelectorProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 
                 shadow-sm hover:shadow-md min-w-[280px]"
      >
        <span className="text-2xl">{selectedProperty.avatar}</span>
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900 dark:text-white text-sm">
            {selectedProperty.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {selectedProperty.location} • {selectedProperty.rooms} rooms
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          showDropdown ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Property Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                      rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {mockProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => {
                  setSelectedProperty(property);
                  setShowDropdown(false);
                }}
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
          </div>
          
          {/* Add Property Option */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-5 h-5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">+</span>
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
    </div>
  );
} 