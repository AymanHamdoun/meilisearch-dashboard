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
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [attrInput, setAttrInput] = useState('');

    const handleAddAttr = () => {
        if (attrInput.trim()) {
            onAttributesToSearchOnChange([...attributesToSearchOn, attrInput.trim()]);
            setAttrInput('');
        }
    };

    const handleRemoveAttr = (index: number) => {
        onAttributesToSearchOnChange(attributesToSearchOn.filter((_, i) => i !== index));
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
                </div>
            )}
        </div>
    );
};

export default SearchOptions;
