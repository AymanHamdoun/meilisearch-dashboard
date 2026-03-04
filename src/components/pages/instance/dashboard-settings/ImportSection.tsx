import React, { useState, useRef } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { DashboardBlueprint } from '../../../../types/blueprint';
import { importBlueprint, validateBlueprint, ImportResult } from '../../../../services/blueprint';
import BlueprintPreview from './BlueprintPreview';

const ImportSection: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blueprint, setBlueprint] = useState<DashboardBlueprint | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [importSettings, setImportSettings] = useState(true);
    const [importDocuments, setImportDocuments] = useState(true);
    const [importFeatures, setImportFeatures] = useState(true);
    const [overwriteExisting, setOverwriteExisting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setParseError(null);
        setImportResult(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                const validation = validateBlueprint(data);
                if (!validation.valid) {
                    setParseError(validation.errors.join(', '));
                    setBlueprint(null);
                    return;
                }
                setBlueprint(data);
            } catch {
                setParseError('Invalid JSON file');
                setBlueprint(null);
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImport = async () => {
        if (!blueprint) return;

        setIsImporting(true);
        setImportResult(null);

        try {
            const result = await importBlueprint(instanceState, blueprint, {
                importSettings,
                importDocuments,
                importExperimentalFeatures: importFeatures,
                overwriteExisting,
            });
            setImportResult(result);
        } catch (err: any) {
            setImportResult({
                success: false,
                indexesCreated: [],
                indexesUpdated: [],
                documentsImported: 0,
                featuresUpdated: false,
                errors: [err.message || 'Import failed'],
            });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Import Blueprint</h2>

            <div className="space-y-4">
                {/* File upload */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload a blueprint JSON file</p>
                    <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                {parseError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{parseError}</div>
                )}

                {/* Blueprint preview */}
                {blueprint && <BlueprintPreview blueprint={blueprint} />}

                {/* Import options */}
                {blueprint && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Import Options</h3>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={importSettings} onChange={e => setImportSettings(e.target.checked)} className="rounded" />
                            Import index settings
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={importDocuments} onChange={e => setImportDocuments(e.target.checked)} className="rounded" />
                            Import documents
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={importFeatures} onChange={e => setImportFeatures(e.target.checked)} className="rounded" />
                            Import experimental features
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={overwriteExisting} onChange={e => setOverwriteExisting(e.target.checked)} className="rounded" />
                            Overwrite existing indexes
                        </label>
                    </div>
                )}

                {/* Import result */}
                {importResult && (
                    <div className={`p-4 rounded border ${importResult.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <h3 className={`font-medium text-sm mb-2 ${importResult.success ? 'text-green-700' : 'text-yellow-700'}`}>
                            Import {importResult.success ? 'Complete' : 'Completed with warnings'}
                        </h3>
                        <div className="text-sm space-y-1">
                            {importResult.indexesCreated.length > 0 && (
                                <p className="text-gray-700">Indexes created: {importResult.indexesCreated.join(', ')}</p>
                            )}
                            {importResult.indexesUpdated.length > 0 && (
                                <p className="text-gray-700">Indexes updated: {importResult.indexesUpdated.join(', ')}</p>
                            )}
                            {importResult.documentsImported > 0 && (
                                <p className="text-gray-700">Documents imported: {importResult.documentsImported}</p>
                            )}
                            {importResult.featuresUpdated && (
                                <p className="text-gray-700">Experimental features updated</p>
                            )}
                            {importResult.errors.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium text-red-600">Errors:</p>
                                    <ul className="list-disc list-inside text-red-600">
                                        {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Import button */}
                {blueprint && (
                    <button
                        onClick={handleImport}
                        disabled={isImporting}
                        className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                    >
                        {isImporting ? 'Importing...' : 'Import Blueprint'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImportSection;
