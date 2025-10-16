import React from 'react';

interface InfoBannerProps {
  title?: string;
  message: string;
  className?: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({
  title = 'Note',
  message,
  className = ''
}) => {
  return (
    <div className={`p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex">
        <svg className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{title}:</span> {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;