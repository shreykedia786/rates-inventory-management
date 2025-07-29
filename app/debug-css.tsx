import React from 'react';

/**
 * CSS Debug Component
 * Simple component to test if Tailwind CSS is loading properly
 */
export function CSSDebugComponent() {
  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">CSS Debug Test</h3>
      <div className="space-y-2">
        <div className="bg-blue-600 p-2 rounded">Blue Background</div>
        <div className="bg-green-600 p-2 rounded">Green Background</div>
        <div className="bg-purple-600 p-2 rounded">Purple Background</div>
        <div className="text-yellow-400 font-bold">Yellow Text</div>
      </div>
      <p className="text-xs mt-2">
        If you can see this with colors and styling, Tailwind CSS is working!
      </p>
    </div>
  );
}

export default CSSDebugComponent; 