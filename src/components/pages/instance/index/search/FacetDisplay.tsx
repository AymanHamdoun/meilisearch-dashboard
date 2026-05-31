import React from 'react';

interface FacetDisplayProps {
    facetDistribution?: Record<string, Record<string, number>>;
    facetStats?: Record<string, { min: number; max: number }>;
    selectedFacets?: Record<string, string[]>;
    onFacetSelect?: (facetName: string, value: string) => void;
}

const FacetDisplay: React.FC<FacetDisplayProps> = ({
    facetDistribution,
    facetStats,
    selectedFacets = {},
    onFacetSelect,
}) => {
    if (!facetDistribution || Object.keys(facetDistribution).length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facets</h4>
            {Object.entries(facetDistribution).map(([facetName, values]) => {
                const activeValues = selectedFacets[facetName] ?? [];
                return (
                    <div key={facetName} className="border border-gray-100 rounded p-2 bg-white">
                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">{facetName}</h5>
                        {facetStats?.[facetName] && (
                            <div className="text-xs text-gray-400 mb-1">
                                Range: {facetStats[facetName].min} – {facetStats[facetName].max}
                            </div>
                        )}
                        <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto">
                            {Object.entries(values).map(([value, count]) => {
                                const isActive = activeValues.includes(value);
                                return (
                                    <button
                                        key={value}
                                        onClick={() => onFacetSelect?.(facetName, value)}
                                        className={`flex justify-between items-center text-sm w-full px-1.5 py-0.5 rounded text-left transition-colors ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <span className="truncate mr-2">{value}</span>
                                        <span className={`text-xs flex-shrink-0 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FacetDisplay;
