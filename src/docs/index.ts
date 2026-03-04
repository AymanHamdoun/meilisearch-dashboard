import { VersionDocs } from './types';
import v1_37_0 from './v1.37.0';

const versionDocsMap: Record<string, VersionDocs> = {
  '1.37': v1_37_0,
};

/**
 * Get docs for a specific Meilisearch version.
 * Uses prefix matching: "1.37.2" matches "1.37" docs.
 */
export const getDocsForVersion = (version: string): VersionDocs => {
  // Try exact match first (e.g., "1.37")
  const majorMinor = version.split('.').slice(0, 2).join('.');
  if (versionDocsMap[majorMinor]) {
    return versionDocsMap[majorMinor];
  }

  // Fallback to latest
  return getLatestDocs();
};

/**
 * Get the latest version docs as a fallback.
 */
export const getLatestDocs = (): VersionDocs => {
  return v1_37_0;
};
