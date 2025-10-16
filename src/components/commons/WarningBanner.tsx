import React from 'react';

interface WarningBannerProps {
  title?: string;
  message: string;
  className?: string;
}

const WarningBanner: React.FC<WarningBannerProps> = ({
  title = 'Warning',
  message,
  className = ''
}) => {
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <svg className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">{title}:</span> {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;