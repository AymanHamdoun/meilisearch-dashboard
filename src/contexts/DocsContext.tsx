import React, { createContext, useCallback, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { VersionDocs, SettingDoc, FeatureDoc } from '../docs/types';
import { getDocsForVersion, getLatestDocs } from '../docs/index';
import useMeiliInstance from '../hooks/useMeiliInstance';
import { getVersion } from '../services/meilisearch/indexes';

interface DocsContextType {
  docs: VersionDocs;
  getSettingDoc: (key: string) => SettingDoc | undefined;
  getFeatureDoc: (key: string) => FeatureDoc | undefined;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

interface DocsProviderProps {
  children: ReactNode;
}

export const DocsProvider: React.FC<DocsProviderProps> = ({ children }) => {
  const { instanceState } = useMeiliInstance();
  const [docs, setDocs] = useState<VersionDocs>(getLatestDocs());

  useEffect(() => {
    if (!instanceState.isLoaded) return;

    getVersion(instanceState.host, instanceState.key)
      .then((versionInfo) => {
        if (versionInfo?.pkgVersion) {
          setDocs(getDocsForVersion(versionInfo.pkgVersion));
        }
      })
      .catch(() => {
        // Fallback to latest docs if version fetch fails
      });
  }, [instanceState.isLoaded, instanceState.host, instanceState.key]);

  const getSettingDoc = useCallback((key: string): SettingDoc | undefined => {
    return docs.settings[key];
  }, [docs]);

  const getFeatureDoc = useCallback((key: string): FeatureDoc | undefined => {
    return docs.experimentalFeatures[key];
  }, [docs]);

  const value = useMemo(
    () => ({ docs, getSettingDoc, getFeatureDoc }),
    [docs, getSettingDoc, getFeatureDoc]
  );

  return (
    <DocsContext.Provider value={value}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocs = (): DocsContextType => {
  const context = useContext(DocsContext);
  if (context === undefined) {
    throw new Error('useDocs must be used within a DocsProvider');
  }
  return context;
};

export default DocsContext;
