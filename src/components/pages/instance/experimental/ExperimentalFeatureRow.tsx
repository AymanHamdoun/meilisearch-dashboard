import React from 'react';
import { FEATURE_INFO, formatFeatureName } from './featureInfo';

interface ExperimentalFeatureRowProps {
  featureKey: string;
  isEnabled: boolean;
  onToggle: (featureKey: string) => void;
}

const ExperimentalFeatureRow: React.FC<ExperimentalFeatureRowProps> = ({
  featureKey,
  isEnabled,
  onToggle
}) => {
  const info = FEATURE_INFO[featureKey];

  return (
    <li className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 mb-4 sm:mb-0 sm:mr-6">
          <div className="flex items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {formatFeatureName(featureKey)}
              </h3>
              {info?.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {info.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                {info?.docLink ? (
                  <a
                    href={info.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-1 text-xs bg-primary-midfaint hover:bg-primary rounded-2xl text-grey-300 hover:text-white transition-colors"
                  >
                    <span className="mr-1">{featureKey}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <code className="inline-block px-2 py-1 text-xs bg-gray-100 rounded text-gray-700">
                    {featureKey}
                  </code>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end">
          <span className={`text-sm mr-3 ${isEnabled ? 'text-primary' : 'text-gray-500'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <div className="flex items-center">
            <button
              onClick={() => onToggle(featureKey)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${isEnabled ? 'bg-primary hover:bg-primary' : 'bg-gray-200 hover:bg-gray-300'}
              `}
              role="switch"
              aria-checked={isEnabled}
              aria-label={`Toggle ${formatFeatureName(featureKey)}`}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ExperimentalFeatureRow;