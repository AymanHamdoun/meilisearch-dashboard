import React from 'react';
import { DashboardBlueprint } from '../../../../types/blueprint';

interface BlueprintPreviewProps {
    blueprint: DashboardBlueprint;
}

const BlueprintPreview: React.FC<BlueprintPreviewProps> = ({ blueprint }) => {
    const enabledFeatures = Object.entries(blueprint.experimentalFeatures || {})
        .filter(([, v]) => v);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Blueprint Preview</h3>
                <span className="text-xs text-gray-400">v{blueprint.version}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                    <div className="text-gray-400 text-xs">Meilisearch Version</div>
                    <div className="font-medium">{blueprint.meiliVersion}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Exported At</div>
                    <div className="font-medium">{new Date(blueprint.exportedAt).toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Indexes</div>
                    <div className="font-medium">{blueprint.indexes.length}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Features</div>
                    <div className="font-medium">{enabledFeatures.length} enabled</div>
                </div>
            </div>

            {blueprint.indexes.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Indexes</h4>
                    <div className="space-y-2">
                        {blueprint.indexes.map(idx => (
                            <div key={idx.uid} className="flex items-center justify-between bg-white rounded border border-gray-200 p-3">
                                <div>
                                    <span className="font-medium text-gray-800">{idx.uid}</span>
                                    {idx.primaryKey && (
                                        <span className="ml-2 text-xs text-gray-400">PK: {idx.primaryKey}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    {idx.settings && Object.keys(idx.settings).length > 0 && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">Settings</span>
                                    )}
                                    {idx.documents && idx.documents.length > 0 && (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded">
                                            {idx.documentCount || idx.documents.length} docs
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {enabledFeatures.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Enabled Features</h4>
                    <div className="flex flex-wrap gap-2">
                        {enabledFeatures.map(([key]) => (
                            <span key={key} className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                                {key}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlueprintPreview;
