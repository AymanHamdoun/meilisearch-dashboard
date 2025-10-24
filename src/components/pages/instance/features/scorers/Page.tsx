import React from 'react';

const CustomScorersPage: React.FC = () => {
  return (
    <div className="px-4 py-5">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Custom Scorers</h1>
        <p className="text-gray-600">
          Define custom scoring functions for search results
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-gray-400"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Custom Scorers Feature</h2>
          <p className="text-gray-600">
            This experimental feature will be available soon. Enable it in experimental features when ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomScorersPage;