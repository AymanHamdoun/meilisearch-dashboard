import React, { useEffect, useState, useCallback } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { getExperimentalFeatures, updateExperimentalFeatures, ExperimentalFeaturesResponse } from '../../../../services/meilisearch/settings';
import ConfirmationModal from '../../../commons/ConfirmationModal';

// Feature metadata with descriptions and documentation links
const FEATURE_INFO: Record<string, { description: string; docLink?: string }> = {
  metrics: {
    description: 'Exposes Prometheus-compatible analytics data for monitoring',
    docLink: 'https://www.meilisearch.com/docs/reference/api/metrics'
  },
  logsRoute: {
    description: 'Enables API route to customize log output and set up log streams',
    docLink: 'https://www.meilisearch.com/docs/reference/api/logs'
  },
  containsFilter: {
    description: 'Enables CONTAINS operator in filter expressions for substring matching',
    docLink: 'https://www.meilisearch.com/docs/learn/filtering_and_sorting/filter_expression_reference#contains'
  },
  editDocumentsByFunction: {
    description: 'Use RHAI functions to edit documents directly in the database',
    docLink: 'https://www.meilisearch.com/docs/reference/api/documents#update-documents-with-function'
  },
  network: {
    description: 'Enable network route for horizontal database partitioning and federated search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/network'
  },
  chatCompletions: {
    description: 'Enable conversational search with LLM-powered chat completions',
    docLink: 'https://www.meilisearch.com/docs/reference/api/chats'
  },
  multimodal: {
    description: 'Enable multimodal search capabilities for diverse data types',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  vectorStoreSetting: {
    description: 'Enable experimental vector store for advanced similarity search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  // Legacy names that might appear
  experimentalVectorStore: {
    description: 'Enable experimental vector store for advanced similarity search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  multimodalSearch: {
    description: 'Enable multimodal search capabilities for diverse data types',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  }
};

// Convert camelCase to Title Case for display
const formatFeatureName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const ExperimentalFeaturesPage: React.FC = () => {
  const { instanceState } = useMeiliInstance();
  const [features, setFeatures] = useState<ExperimentalFeaturesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModalState, setConfirmModalState] = useState<{
    isVisible: boolean;
    featureKey: string;
    newValue: boolean;
  }>({
    isVisible: false,
    featureKey: '',
    newValue: false
  });

  const fetchFeatures = useCallback(async () => {
    if (!instanceState.isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getExperimentalFeatures(instanceState);
      setFeatures(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load experimental features';
      setError(message);
      console.error('Error fetching experimental features:', err);
    } finally {
      setIsLoading(false);
    }
  }, [instanceState]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleToggleClick = (featureKey: string) => {
    if (!features) return;

    const newValue = !features[featureKey];
    setConfirmModalState({
      isVisible: true,
      featureKey,
      newValue
    });
  };

  const handleConfirmToggle = async () => {
    const { featureKey, newValue } = confirmModalState;
    setError(null);

    try {
      const updatedFeatures = await updateExperimentalFeatures(instanceState, {
        [featureKey]: newValue
      });
      setFeatures(updatedFeatures);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update feature';
      setError(message);
      console.error('Error updating experimental feature:', err);
      // Refresh features to ensure UI is in sync
      await fetchFeatures();
      throw err; // Re-throw to let modal handle the error
    }
  };

  const handleCloseModal = () => {
    setConfirmModalState({
      isVisible: false,
      featureKey: '',
      newValue: false
    });
  };

  const handleRefresh = () => {
    fetchFeatures();
  };

  if (!instanceState.isLoaded) {
    return (
      <div className="px-4 py-5">
        <p className="text-gray-500">Loading instance...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-semibold mb-3 sm:mb-0">Experimental Features</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent self-start sm:self-auto"
          aria-label="Refresh features"
          disabled={isLoading}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && !features ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : features ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Warning:</span> Experimental features may change or be removed in future versions. Use with caution in production environments.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {Object.keys(features).sort().map((featureKey) => {
                const info = FEATURE_INFO[featureKey];
                return (
                  <li key={featureKey} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
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
                        <span className={`text-sm mr-3 ${features[featureKey] ? 'text-primary' : 'text-gray-500'}`}>
                          {features[featureKey] ? 'Enabled' : 'Disabled'}
                        </span>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleToggleClick(featureKey)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                              ${features[featureKey] ? 'bg-primary hover:bg-primary' : 'bg-gray-200 hover:bg-gray-300'}
                            `}
                            role="switch"
                            aria-checked={features[featureKey]}
                            aria-label={`Toggle ${formatFeatureName(featureKey)}`}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${features[featureKey] ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {Object.keys(features).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No experimental features available
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> Changes to experimental features take effect immediately. Some features may require reindexing or additional configuration.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={confirmModalState.isVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmToggle}
        message={`Are you sure you want to ${confirmModalState.newValue ? 'enable' : 'disable'} ${formatFeatureName(confirmModalState.featureKey)}?`}
        description={`${confirmModalState.newValue ? 'Enabling' : 'Disabling'} this experimental feature will take effect immediately and may impact your Meilisearch instance behavior.`}
        confirmButtonText={confirmModalState.newValue ? 'Enable' : 'Disable'}
        confirmButtonColor={'primary'}
      />
    </div>
  );
};

export default ExperimentalFeaturesPage;