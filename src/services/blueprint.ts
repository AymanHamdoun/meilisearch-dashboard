import { InstanceState } from '../contexts/InstanceContext';
import { DashboardBlueprint, BlueprintIndex, BlueprintImportOptions } from '../types/blueprint';
import { getVersion, listIndexes, listDocuments, createIndex, uploadDocuments } from './meilisearch/indexes';
import { getIndexSettings, getExperimentalFeatures, updateExperimentalFeatures, updateIndexSettings } from './meilisearch/settings';

export interface ExportOptions {
    includeSettings: boolean;
    includeDocuments: boolean;
    includeExperimentalFeatures: boolean;
    selectedIndexes?: string[];
    maxDocumentsPerIndex: number;
}

export interface ImportResult {
    success: boolean;
    indexesCreated: string[];
    indexesUpdated: string[];
    documentsImported: number;
    featuresUpdated: boolean;
    errors: string[];
}

export const exportBlueprint = async (
    instance: InstanceState,
    options: ExportOptions
): Promise<DashboardBlueprint> => {
    const versionInfo = await getVersion(instance.host, instance.key);
    const experimentalFeatures = options.includeExperimentalFeatures
        ? await getExperimentalFeatures(instance)
        : {};

    const indexesData = await listIndexes(instance.host, instance.key);
    const indexList = indexesData?.results || indexesData || [];

    const blueprintIndexes: BlueprintIndex[] = [];

    for (const idx of indexList) {
        if (options.selectedIndexes && !options.selectedIndexes.includes(idx.uid)) {
            continue;
        }

        const blueprintIndex: BlueprintIndex = {
            uid: idx.uid,
            primaryKey: idx.primaryKey || null,
            settings: {},
        };

        if (options.includeSettings) {
            try {
                blueprintIndex.settings = await getIndexSettings({
                    host: instance.host,
                    instanceKey: instance.key,
                    indexName: idx.uid,
                });
            } catch {
                // Skip settings if we can't fetch them
            }
        }

        if (options.includeDocuments && options.maxDocumentsPerIndex > 0) {
            try {
                const docsResult = await listDocuments({
                    instance,
                    indexName: idx.uid,
                    limit: options.maxDocumentsPerIndex,
                    offset: 0,
                });
                blueprintIndex.documents = docsResult.results || [];
                blueprintIndex.documentCount = docsResult.total || blueprintIndex.documents.length;
            } catch {
                blueprintIndex.documents = [];
                blueprintIndex.documentCount = 0;
            }
        }

        blueprintIndexes.push(blueprintIndex);
    }

    return {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        meiliVersion: versionInfo?.pkgVersion || 'unknown',
        dashboardVersion: '1.0.0',
        experimentalFeatures,
        indexes: blueprintIndexes,
    };
};

export const importBlueprint = async (
    instance: InstanceState,
    blueprint: DashboardBlueprint,
    options: BlueprintImportOptions
): Promise<ImportResult> => {
    const result: ImportResult = {
        success: true,
        indexesCreated: [],
        indexesUpdated: [],
        documentsImported: 0,
        featuresUpdated: false,
        errors: [],
    };

    // Import experimental features
    if (options.importExperimentalFeatures && blueprint.experimentalFeatures) {
        try {
            await updateExperimentalFeatures(instance, blueprint.experimentalFeatures);
            result.featuresUpdated = true;
        } catch (err: any) {
            result.errors.push(`Failed to update experimental features: ${err.message}`);
        }
    }

    // Import indexes
    for (const bpIndex of blueprint.indexes) {
        try {
            // Try to create the index
            try {
                await createIndex({
                    instance,
                    indexName: bpIndex.uid,
                    primaryKey: bpIndex.primaryKey || '',
                });
                result.indexesCreated.push(bpIndex.uid);
            } catch {
                // Index might already exist
                if (!options.overwriteExisting) {
                    result.errors.push(`Index "${bpIndex.uid}" already exists (skipped)`);
                    continue;
                }
                result.indexesUpdated.push(bpIndex.uid);
            }

            // Apply settings
            if (options.importSettings && bpIndex.settings && Object.keys(bpIndex.settings).length > 0) {
                try {
                    await updateIndexSettings(
                        { host: instance.host, instanceKey: instance.key, indexName: bpIndex.uid },
                        bpIndex.settings
                    );
                } catch (err: any) {
                    result.errors.push(`Failed to update settings for "${bpIndex.uid}": ${err.message}`);
                }
            }

            // Upload documents in batches
            if (options.importDocuments && bpIndex.documents && bpIndex.documents.length > 0) {
                const maxDocs = options.maxDocumentsPerIndex || bpIndex.documents.length;
                const docsToImport = bpIndex.documents.slice(0, maxDocs);
                const batchSize = 1000;

                for (let i = 0; i < docsToImport.length; i += batchSize) {
                    const batch = docsToImport.slice(i, i + batchSize);
                    try {
                        await uploadDocuments({
                            instance,
                            indexName: bpIndex.uid,
                            documents: batch,
                        });
                        result.documentsImported += batch.length;
                    } catch (err: any) {
                        result.errors.push(`Failed to upload documents batch for "${bpIndex.uid}": ${err.message}`);
                    }
                }
            }
        } catch (err: any) {
            result.errors.push(`Failed to process index "${bpIndex.uid}": ${err.message}`);
        }
    }

    result.success = result.errors.length === 0;
    return result;
};

export const validateBlueprint = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Invalid blueprint: not an object'] };
    }

    if (data.version !== '1.0') {
        errors.push(`Unknown blueprint version: ${data.version}`);
    }

    if (!Array.isArray(data.indexes)) {
        errors.push('Blueprint must contain an "indexes" array');
    } else {
        for (const idx of data.indexes) {
            if (!idx.uid || typeof idx.uid !== 'string') {
                errors.push('Each index must have a "uid" string');
            }
        }
    }

    return { valid: errors.length === 0, errors };
};

export const downloadBlueprint = (blueprint: DashboardBlueprint, filename?: string) => {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `meilisearch-blueprint-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};
