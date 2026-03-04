export interface SettingDoc {
  summary: string;
  details: string;
  defaultValue?: string;
  tips?: string[];
  examples?: string[];
  docLink: string;
}

export interface FeatureDoc {
  summary: string;
  details: string;
  setupSteps?: string[];
  tips?: string[];
  requirements?: string[];
  docLink?: string;
}

export interface VersionDocs {
  version: string;
  settings: Record<string, SettingDoc>;
  experimentalFeatures: Record<string, FeatureDoc>;
  pages: Record<string, { title: string; description: string }>;
}
