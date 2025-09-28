import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">{title}</h1>
          <p className="text-xl text-gray-500">{description || 'To be implemented'}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;