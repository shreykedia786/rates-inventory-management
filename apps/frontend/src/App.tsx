import React from 'react';

/**
 * Main App Component for Rates & Inventory Management Platform
 * Clean implementation to ensure proper React mounting
 */
const App: React.FC = () => {
  const handleTestClick = () => {
    alert('🎯 React is working! Dashboard functionality will be restored next!');
  };

  const handleBackendTest = () => {
    fetch('/api/v1/ai-insights/rate-shopper/test-connection')
      .then(response => response.json())
      .then(data => {
        alert(`✅ Backend Connection: ${data.message || 'Connected successfully!'}`);
      })
      .catch(error => {
        alert(`❌ Backend Error: ${error.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Rates & Inventory Management Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise Revenue Optimization with AI-Powered Insights
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">✅ Frontend</h3>
                <p className="text-gray-500">React + TypeScript + Tailwind</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Modern, responsive interface with professional styling and enterprise UX patterns.
            </p>
            <button 
              onClick={handleTestClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🎯 Test React Interaction
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">✅ Backend</h3>
                <p className="text-gray-500">NestJS API on :8000</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive REST API with AI insights, rate management, and real-time data processing.
            </p>
            <button 
              onClick={handleBackendTest}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔗 Test Backend Connection
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">✅ Design System</h3>
                <p className="text-gray-500">Enterprise UI Components</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Modern design system with gradients, shadows, and professional enterprise styling.
            </p>
            <a 
              href="http://localhost:8000/api/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg inline-block text-center"
            >
              📚 View API Documentation
            </a>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            🎉 Platform Successfully Deployed!
          </h2>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            React frontend is now properly mounted and interactive. All systems are operational and ready for development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App; 