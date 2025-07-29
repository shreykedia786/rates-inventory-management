'use client';

import PropertySelector from '../../components/PropertySelector';

export default function PropertySelectorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Property Selector Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive demonstration of the multi-property selector component
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Multi-Property Selector Component
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Property:
              </label>
              <PropertySelector />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Features Included:
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  5 sample properties with different locations and types
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Property avatars and detailed information display
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Smooth dropdown animations and hover effects
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Dark mode support with proper theming
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Add new property option for portfolio expansion
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Responsive design with proper z-index handling
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Sample Properties:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { emoji: '🏖️', name: 'Ocean View Resort & Spa', location: 'Maldives', rooms: 150 },
                  { emoji: '🏢', name: 'Downtown Business Hotel', location: 'New York, USA', rooms: 280 },
                  { emoji: '🏔️', name: 'Mountain Lodge Retreat', location: 'Swiss Alps', rooms: 85 },
                  { emoji: '🏛️', name: 'City Center Boutique', location: 'London, UK', rooms: 65 },
                  { emoji: '🌴', name: 'Beachfront Paradise', location: 'Bali, Indonesia', rooms: 200 }
                ].map((property, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-2xl">{property.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {property.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {property.location} • {property.rooms} rooms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Main Application
          </a>
        </div>
      </div>
    </div>
  );
} 