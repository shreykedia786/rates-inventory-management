/**
 * Competitive Intelligence Dashboard Page
 * Uses dynamic import with SSR disabled to avoid hydration issues
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the dashboard component dynamically with SSR disabled to avoid hydration issues
// This ensures the component only renders on the client side
const CompetitiveIntelligenceDashboard = dynamic(
  () => import('./DashboardComponent'),
  { 
    ssr: false
  }
);

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading competitive intelligence data...</p>
      </div>
    </div>
  );
}

export default function CompetitiveIntelligencePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompetitiveIntelligenceDashboard />
    </Suspense>
  );
}
