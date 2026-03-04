import React, { useState } from 'react';

interface SearchFiltersProps {
    filterableAttributes: string[];
    onFilterChange: (filter: string) => void;
    currentFilter: string;
}

interface FilterRule {
    attribute: string;
    operator: string;
    value: string;
}

const OPERATORS = ['=', '!=', '>', '>=', '<', '<=', 'EXISTS', 'NOT EXISTS', 'IS EMPTY', 'IS NOT EMPTY'];

const SearchFilters: React.FC<SearchFiltersProps> = ({ filterableAttributes, onFilterChange, currentFilter }) => {
    const [rules, setRules] = useState<FilterRule[]>([]);

    const buildFilterString = (newRules: FilterRule[]) => {
        const parts = newRules
            .filter(r => r.attribute && r.value || ['EXISTS', 'NOT EXISTS', 'IS EMPTY', 'IS NOT EMPTY'].includes(r.operator))
            .map(r => {
                if (['EXISTS', 'NOT EXISTS', 'IS EMPTY', 'IS NOT EMPTY'].includes(r.operator)) {
                    return `${r.attribute} ${r.operator}`;
                }
                // Check if value is numeric
                const numVal = Number(r.value);
                if (!isNaN(numVal) && r.value.trim() !== '') {
                    return `${r.attribute} ${r.operator} ${r.value}`;
                }
                return `${r.attribute} ${r.operator} "${r.value}"`;
            });
        return parts.join(' AND ');
    };

    const handleAddRule = () => {
        setRules([...rules, { attribute: filterableAttributes[0] || '', operator: '=', value: '' }]);
    };

    const handleRemoveRule = (index: number) => {
        const newRules = rules.filter((_, i) => i !== index);
        setRules(newRules);
        onFilterChange(buildFilterString(newRules));
    };

    const handleRuleChange = (index: number, field: keyof FilterRule, val: string) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: val };
        setRules(newRules);
        onFilterChange(buildFilterString(newRules));
    };

    const needsValue = (op: string) => !['EXISTS', 'NOT EXISTS', 'IS EMPTY', 'IS NOT EMPTY'].includes(op);

    return (
        <div className="flex flex-col gap-2">
            {rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                    <select
                        value={rule.attribute}
                        onChange={(e) => handleRuleChange(i, 'attribute', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                        {filterableAttributes.map(attr => (
                            <option key={attr} value={attr}>{attr}</option>
                        ))}
                    </select>
                    <select
                        value={rule.operator}
                        onChange={(e) => handleRuleChange(i, 'operator', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                        {OPERATORS.map(op => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                    {needsValue(rule.operator) && (
                        <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => handleRuleChange(i, 'value', e.target.value)}
                            placeholder="Value"
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
                        />
                    )}
                    <button
                        onClick={() => handleRemoveRule(i)}
                        className="px-2 py-1.5 text-red-500 hover:bg-red-50 rounded text-sm"
                    >
                        Remove
                    </button>
                </div>
            ))}
            {filterableAttributes.length > 0 && (
                <button
                    onClick={handleAddRule}
                    className="text-sm text-primary hover:underline self-start"
                >
                    + Add Filter
                </button>
            )}
            {currentFilter && (
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded font-mono">
                    {currentFilter}
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
