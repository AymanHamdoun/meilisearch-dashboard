import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { getExperimentalFeatures, ExperimentalFeaturesResponse } from '../services/meilisearch/settings';
import useMeiliInstance from '../hooks/useMeiliInstance';

interface ExperimentalFeaturesContextType {
  features: ExperimentalFeaturesResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshFeatures: () => Promise<void>;
}

const ExperimentalFeaturesContext = createContext<ExperimentalFeaturesContextType | undefined>(undefined);

interface ExperimentalFeaturesProviderProps {
  children: ReactNode;
}

export const ExperimentalFeaturesProvider: React.FC<ExperimentalFeaturesProviderProps> = ({ children }) => {
  const { instanceState } = useMeiliInstance();
  const [features, setFeatures] = useState<ExperimentalFeaturesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFeatures = useCallback(async () => {
    if (!instanceState.isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getExperimentalFeatures(instanceState);
      setFeatures(data || {});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load experimental features';
      setError(message);
      console.error('Error fetching experimental features:', err);
      // Set empty object on error to prevent breaking the UI
      setFeatures({});
    } finally {
      setIsLoading(false);
    }
  }, [instanceState.isLoaded, instanceState.host, instanceState.key]);

  // Fetch features on mount and when instance changes
  useEffect(() => {
    refreshFeatures();
  }, [refreshFeatures]);

  const value = useMemo<ExperimentalFeaturesContextType>(
    () => ({ features, isLoading, error, refreshFeatures }),
    [features, isLoading, error, refreshFeatures]
  );

  return (
    <ExperimentalFeaturesContext.Provider value={value}>
      {children}
    </ExperimentalFeaturesContext.Provider>
  );
};

// Custom hook to use experimental features context
export const useExperimentalFeatures = (): ExperimentalFeaturesContextType => {
  const context = useContext(ExperimentalFeaturesContext);
  if (context === undefined) {
    throw new Error('useExperimentalFeatures must be used within an ExperimentalFeaturesProvider');
  }
  return context;
};

// Utility hook to check if a specific feature is enabled
export const useIsFeatureEnabled = (featureFlag: string): boolean => {
  const { features } = useExperimentalFeatures();
  return features?.[featureFlag] === true;
};