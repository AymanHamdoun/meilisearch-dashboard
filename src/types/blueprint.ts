export interface BlueprintIndex {
  uid: string;
  primaryKey: string | null;
  settings: Record<string, any>;
  documents?: Record<string, any>[];
  documentCount?: number;
}

export interface DashboardBlueprint {
  version: "1.0";
  exportedAt: string;
  meiliVersion: string;
  dashboardVersion: string;
  experimentalFeatures: Record<string, boolean>;
  indexes: BlueprintIndex[];
}

export interface BlueprintImportOptions {
  importSettings: boolean;
  importDocuments: boolean;
  importExperimentalFeatures: boolean;
  overwriteExisting: boolean;
  maxDocumentsPerIndex?: number;
}
