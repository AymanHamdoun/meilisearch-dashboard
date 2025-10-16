import React, { useEffect, useState, useCallback } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { getExperimentalFeatures, updateExperimentalFeatures, ExperimentalFeaturesResponse } from '../../../../services/meilisearch/settings';
import ConfirmationModal from '../../../commons/ConfirmationModal';
import WarningBanner from '../../../commons/WarningBanner';
import InfoBanner from '../../../commons/InfoBanner';
import ExperimentalFeatureRow from './ExperimentalFeatureRow';
import { formatFeatureName } from './featureInfo';

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
          <WarningBanner
            message="Experimental features may change or be removed in future versions. Use with caution in production environments."
            className="mb-6"
          />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {Object.keys(features).sort().map((featureKey) => (
                <ExperimentalFeatureRow
                  key={featureKey}
                  featureKey={featureKey}
                  isEnabled={features[featureKey]}
                  onToggle={handleToggleClick}
                />
              ))}
            </ul>
          </div>

          {Object.keys(features).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No experimental features available
            </div>
          )}

          <InfoBanner
            message="Changes to experimental features take effect immediately. Some features may require reindexing or additional configuration."
            className="mt-6"
          />
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