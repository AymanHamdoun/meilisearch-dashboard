import React from 'react';

interface FacetDisplayProps {
    facetDistribution?: Record<string, Record<string, number>>;
    facetStats?: Record<string, { min: number; max: number }>;
}

const FacetDisplay: React.FC<FacetDisplayProps> = ({ facetDistribution, facetStats }) => {
    if (!facetDistribution || Object.keys(facetDistribution).length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Facet Distribution</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(facetDistribution).map(([facetName, values]) => (
                    <div key={facetName} className="border border-gray-100 rounded p-2">
                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">{facetName}</h5>
                        {facetStats?.[facetName] && (
                            <div className="text-xs text-gray-400 mb-1">
                                Range: {facetStats[facetName].min} – {facetStats[facetName].max}
                            </div>
                        )}
                        <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto">
                            {Object.entries(values).map(([value, count]) => (
                                <div key={value} className="flex justify-between text-sm">
                                    <span className="text-gray-600 truncate mr-2">{value}</span>
                                    <span className="text-gray-400 text-xs flex-shrink-0">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacetDisplay;
