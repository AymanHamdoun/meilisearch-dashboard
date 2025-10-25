import React from 'react';

const ChatCompletionsPage: React.FC = () => {
  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold">Chat Completions</h1>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
            In Development
          </span>
        </div>
        <p className="text-gray-600">
          AI-powered chat completions for enhanced search experiences
        </p>
      </div>

      {/* Main Content - Development Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
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
                className="text-blue-600"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="10" r="1"/>
                <circle cx="8" cy="10" r="1"/>
                <circle cx="16" cy="10" r="1"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Coming Soon!
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            We're working hard to bring you an amazing Chat Completions feature that will revolutionize
            how you interact with your search data. This feature will enable AI-powered conversational
            search capabilities, making it easier than ever to find what you need.
          </p>

          {/* Feature Highlights */}
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What to expect:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Natural language queries for intuitive search</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Context-aware responses based on your data</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Multi-turn conversations for refined results</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Customizable AI models and parameters</span>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div className="bg-blue-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Development Status:</strong> Our team is actively working on this feature.
              Enable experimental features in your settings to be among the first to try it when available!
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              disabled
            >
              Notify Me When Available
            </button>
            <a
              href="/instance/experimental"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              View Experimental Features
            </a>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
          <p className="text-sm text-gray-600">
            Comprehensive guides and API references will be available once the feature is released.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
          <p className="text-sm text-gray-600">
            Join our community forums to discuss ideas and provide feedback on this upcoming feature.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Beta Access</h3>
          <p className="text-sm text-gray-600">
            Early access will be available for select users. Stay tuned for announcements!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCompletionsPage;