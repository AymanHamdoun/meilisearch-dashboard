import React from 'react';

const VectorStorePage: React.FC = () => {
  return (
    <div className="px-4 py-5">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Vector Store</h1>
        <p className="text-gray-600">
          Semantic search with vector embeddings
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
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vector Store Feature</h2>
          <p className="text-gray-600">
            This experimental feature will be available soon. Enable it in experimental features when ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VectorStorePage;