import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DateTime } from 'luxon';
import { KeyResource } from '../../../../services/meilisearch/keys';
import { getPermissionByValue } from '../../../../constants/permissions';

interface KeysTableProps {
    keys: KeyResource[];
    isLoading: boolean;
    onViewDetails: (key: KeyResource) => void;
    onDelete: (key: KeyResource) => void;
}

const KeysTable: React.FC<KeysTableProps> = ({ keys, isLoading, onViewDetails, onDelete }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss');
    };

    const formatPermissions = (actions: string[]) => {
        if (actions.includes('*')) return 'All Actions';
        if (actions.length > 3) return `${actions.length} permissions`;
        return actions.map(action => {
            const permission = getPermissionByValue(action);
            return permission?.label || action;
        }).join(', ');
    };

    const formatIndexes = (indexes: string[]) => {
        if (indexes.includes('*')) return 'All Indexes';
        if (indexes.length > 3) return `${indexes.length} indexes`;
        return indexes.join(', ');
    };

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indexes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...Array(3)].map((_, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (keys.length === 0) {
        return (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-500">No API keys found</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Permissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Indexes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expires At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {keys.map((key) => (
                        <KeyRow
                            key={key.uid}
                            apiKey={key}
                            formatDate={formatDate}
                            formatPermissions={formatPermissions}
                            formatIndexes={formatIndexes}
                            onViewDetails={onViewDetails}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

interface KeyRowProps {
    apiKey: KeyResource;
    formatDate: (date: string | null) => string;
    formatPermissions: (actions: string[]) => string;
    formatIndexes: (indexes: string[]) => string;
    onViewDetails: (key: KeyResource) => void;
    onDelete: (key: KeyResource) => void;
}

const KeyRow: React.FC<KeyRowProps> = ({
    apiKey,
    formatDate,
    formatPermissions,
    formatIndexes,
    onViewDetails,
    onDelete
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isDropdownOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right - 192 + window.scrollX // 192px is w-48 (12rem)
            });
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const maskKey = (key: string) => {
        if (key.length <= 8) return key;
        return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    };

    const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {apiKey.name || <span className="text-gray-400">Unnamed</span>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {maskKey(apiKey.key)}
                </code>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPermissions(apiKey.actions)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatIndexes(apiKey.indexes)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={isExpired ? 'text-red-600 font-semibold' : ''}>
                    {formatDate(apiKey.expiresAt)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center gap-1"
                        aria-label="Actions menu"
                        aria-expanded={isDropdownOpen}
                    >
                        Actions
                        <svg
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                </div>
                    {isDropdownOpen && ReactDOM.createPortal(
                        <div
                            ref={dropdownRef}
                            className="fixed w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                            style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`
                            }}
                        >
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        onViewDetails(apiKey);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Details
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(apiKey);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Key
                                    </div>
                                </button>
                            </div>
                        </div>,
                        document.body
                    )}
            </td>
        </tr>
    );
};

export default KeysTable;