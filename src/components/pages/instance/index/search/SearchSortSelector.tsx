import React from 'react';

interface SearchSortSelectorProps {
    sortableAttributes: string[];
    sort: string[];
    onSortChange: (sort: string[]) => void;
}

const SearchSortSelector: React.FC<SearchSortSelectorProps> = ({ sortableAttributes, sort, onSortChange }) => {
    const handleAddSort = () => {
        if (sortableAttributes.length > 0) {
            onSortChange([...sort, `${sortableAttributes[0]}:asc`]);
        }
    };

    const handleRemoveSort = (index: number) => {
        onSortChange(sort.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, attr: string, dir: string) => {
        const newSort = [...sort];
        newSort[index] = `${attr}:${dir}`;
        onSortChange(newSort);
    };

    return (
        <div className="flex flex-col gap-2">
            {sort.map((s, i) => {
                const [attr, dir] = s.split(':');
                return (
                    <div key={i} className="flex items-center gap-2">
                        <select
                            value={attr}
                            onChange={(e) => handleChange(i, e.target.value, dir || 'asc')}
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                        >
                            {sortableAttributes.map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                        <select
                            value={dir || 'asc'}
                            onChange={(e) => handleChange(i, attr, e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <button onClick={() => handleRemoveSort(i)} className="px-2 py-1.5 text-red-500 hover:bg-red-50 rounded text-sm">
                            Remove
                        </button>
                    </div>
                );
            })}
            {sortableAttributes.length > 0 && (
                <button onClick={handleAddSort} className="text-sm text-primary hover:underline self-start">
                    + Add Sort
                </button>
            )}
        </div>
    );
};

export default SearchSortSelector;
