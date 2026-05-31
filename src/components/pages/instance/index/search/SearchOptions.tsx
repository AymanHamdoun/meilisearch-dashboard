import React, { useState } from 'react';

interface SearchOptionsProps {
    matchingStrategy: string;
    onMatchingStrategyChange: (val: string) => void;
    attributesToSearchOn: string[];
    onAttributesToSearchOnChange: (val: string[]) => void;
    limit: number;
    onLimitChange: (val: number) => void;
    showPerformanceDetails: boolean;
    onShowPerformanceDetailsChange: (val: boolean) => void;
    embedderNames?: string[];
    hybridSemanticRatio?: number | null;
    hybridEmbedder?: string;
    onHybridSemanticRatioChange?: (val: number | null) => void;
    onHybridEmbedderChange?: (val: string) => void;
}

const SearchOptions: React.FC<SearchOptionsProps> = ({
    matchingStrategy,
    onMatchingStrategyChange,
    attributesToSearchOn,
    onAttributesToSearchOnChange,
    limit,
    onLimitChange,
    showPerformanceDetails,
    onShowPerformanceDetailsChange,
    embedderNames = [],
    hybridSemanticRatio,
    hybridEmbedder = '',
    onHybridSemanticRatioChange,
    onHybridEmbedderChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [attrInput, setAttrInput] = useState('');

    const hybridEnabled = hybridSemanticRatio !== null && hybridSemanticRatio !== undefined;

    const handleAddAttr = () => {
        if (attrInput.trim()) {
            onAttributesToSearchOnChange([...attributesToSearchOn, attrInput.trim()]);
            setAttrInput('');
        }
    };

    const handleRemoveAttr = (index: number) => {
        onAttributesToSearchOnChange(attributesToSearchOn.filter((_, i) => i !== index));
    };

    const handleHybridToggle = (enabled: boolean) => {
        if (enabled) {
            onHybridSemanticRatioChange?.(0.5);
            if (!hybridEmbedder && embedderNames.length > 0) {
                onHybridEmbedderChange?.(embedderNames[0]);
            }
        } else {
            onHybridSemanticRatioChange?.(null);
        }
    };

    return (
        <div className="border border-gray-200 rounded">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
                <span>Advanced Options</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-3 border-t border-gray-200 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 w-40">Matching Strategy</label>
                        <select
                            value={matchingStrategy}
                            onChange={(e) => onMatchingStrategyChange(e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm flex-1"
                        >
                            <option value="last">last</option>
                            <option value="all">all</option>
                            <option value="frequency">frequency</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 w-40">Results Limit</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => onLimitChange(parseInt(e.target.value) || 20)}
                            min={1}
                            max={1000}
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 w-40">Performance Details</label>
                        <input
                            type="checkbox"
                            checked={showPerformanceDetails}
                            onChange={(e) => onShowPerformanceDetailsChange(e.target.checked)}
                            className="rounded"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Attributes to Search On</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {attributesToSearchOn.map((attr, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm">
                                    {attr}
                                    <button onClick={() => handleRemoveAttr(i)} className="text-gray-400 hover:text-red-500">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={attrInput}
                                onChange={(e) => setAttrInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddAttr()}
                                placeholder="Attribute name"
                                className="px-2 py-1.5 border border-gray-300 rounded text-sm flex-1"
                            />
                            <button onClick={handleAddAttr} className="px-3 py-1.5 text-sm text-primary border border-primary rounded hover:bg-primary hover:text-white">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Hybrid Search — only shown when embedders are configured */}
                    {embedderNames.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <span className="inline-block w-2 h-2 rounded-full bg-violet-400"></span>
                                    Hybrid Search
                                    <span className="text-xs font-normal text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded ml-1">Meilisearch exclusive</span>
                                </label>
                                <button
                                    onClick={() => handleHybridToggle(!hybridEnabled)}
                                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${hybridEnabled ? 'bg-violet-500' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${hybridEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {hybridEnabled && (
                                <div className="flex flex-col gap-2 pl-1">
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs text-gray-500 w-36 shrink-0">
                                            Semantic ratio
                                            <span className="block text-violet-600 font-semibold">{hybridSemanticRatio?.toFixed(2)}</span>
                                        </label>
                                        <div className="flex-1 flex items-center gap-2">
                                            <span className="text-xs text-gray-400">keyword</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.05}
                                                value={hybridSemanticRatio ?? 0.5}
                                                onChange={(e) => onHybridSemanticRatioChange?.(parseFloat(e.target.value))}
                                                className="flex-1 accent-violet-500"
                                            />
                                            <span className="text-xs text-gray-400">semantic</span>
                                        </div>
                                    </div>
                                    {embedderNames.length > 1 && (
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs text-gray-500 w-36 shrink-0">Embedder</label>
                                            <select
                                                value={hybridEmbedder || embedderNames[0]}
                                                onChange={(e) => onHybridEmbedderChange?.(e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                                            >
                                                {embedderNames.map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchOptions;
