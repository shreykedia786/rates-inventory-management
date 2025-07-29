/**
 * Consistency Demo Page
 * Showcases the before/after data consistency improvements
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ConsistencyDemo } from '../../components/ConsistencyDemo';

export default function ConsistencyDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Main App</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Data Consistency Demo
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Before vs After: Perfect data synchronization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Demo Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ConsistencyDemo />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="max-w-4xl mx-auto px-6">
          <p>
            🎯 This demo shows how standardized data models ensure perfect consistency across tooltips, modals, and grid components.
          </p>
          <p className="mt-2">
            Ready for CEO-level presentations with complete transparency and explainability.
          </p>
        </div>
      </footer>
    </div>
  );
} 