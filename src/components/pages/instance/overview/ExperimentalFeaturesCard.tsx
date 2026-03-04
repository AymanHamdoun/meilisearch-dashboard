import React from 'react';
import { Link } from 'react-router-dom';

interface ExperimentalFeaturesCardProps {
    features: Record<string, boolean> | null;
}

const formatFeatureName = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

const ExperimentalFeaturesCard: React.FC<ExperimentalFeaturesCardProps> = ({ features }) => {
    if (!features) {
        return (
            <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Experimental Features</h3>
                <div className="text-gray-400 text-sm">Feature data unavailable</div>
            </div>
        );
    }

    const entries = Object.entries(features).sort(([, a], [, b]) => (b ? 1 : 0) - (a ? 1 : 0));

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Experimental Features</h3>
                <Link to="/instance/experimental" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            {entries.length === 0 ? (
                <div className="text-gray-400 text-sm">No experimental features available</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {entries.map(([key, enabled]) => (
                        <span
                            key={key}
                            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                enabled
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {formatFeatureName(key)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperimentalFeaturesCard;
