import React from 'react';
import { APISettings } from '../../../../../services/meilisearch/types';
import useModalState from '../../../../../hooks/useModalState';

interface SettingDiffPreviewModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    originalSettings: APISettings;
    modifiedSettings: APISettings;
}

const SettingDiffPreviewModal: React.FC<SettingDiffPreviewModalProps> = ({
    isVisible,
    onClose,
    onConfirm,
    originalSettings,
    modifiedSettings
}) => {
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    const getChangedFields = () => {
        const changes: { field: string; original: any; modified: any }[] = [];

        // Helper function to recursively compare and flatten nested objects
        const compareValues = (path: string, original: any, modified: any) => {
            const originalStr = JSON.stringify(original);
            const modifiedStr = JSON.stringify(modified);

            if (originalStr !== modifiedStr) {
                // Handle nested objects
                if (typeof original === 'object' && typeof modified === 'object' &&
                    original !== null && modified !== null &&
                    !Array.isArray(original) && !Array.isArray(modified)) {

                    // Get all keys from both objects
                    const allKeys = new Set([...Object.keys(original), ...Object.keys(modified)]);

                    allKeys.forEach(key => {
                        const newPath = path ? `${path}.${key}` : key;
                        compareValues(newPath, original[key], modified[key]);
                    });
                } else {
                    // For primitive values, arrays, or when structure changes
                    changes.push({
                        field: path,
                        original: original,
                        modified: modified
                    });
                }
            }
        };

        // Compare each top-level field
        Object.keys(modifiedSettings).forEach(key => {
            const originalValue = (originalSettings as any)[key];
            const modifiedValue = (modifiedSettings as any)[key];
            compareValues(key, originalValue, modifiedValue);
        });

        return changes;
    };

    const formatValue = (value: any): string => {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        if (typeof value === 'string') return value || '""';
        if (typeof value === 'number') return String(value);
        if (Array.isArray(value)) {
            if (value.length === 0) return 'empty list';
            if (value.length <= 3) {
                return value.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(', ');
            }
            return `${value.slice(0, 3).map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(', ')}, ... (${value.length} items)`;
        }
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) return 'empty object';
            // For complex objects, show a simplified representation
            if (keys.length <= 2) {
                return keys.map(k => `${k}: ${formatValue(value[k])}`).join(', ');
            }
            return `{${keys.slice(0, 2).join(', ')}, ...}`;
        }
        return String(value);
    };

    const changes = getChangedFields();

    const handleConfirm = async () => {
        await handleAsyncOperation(onConfirm, undefined, onClose, 1000);
    };

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            onClose();
        }
    };

    if (!isVisible) return null;

    const getConfirmButtonColor = () => {
        if (isLoading) return 'bg-gray-400 cursor-not-allowed';
        if (success) return 'bg-primary hover:primary-midfaint';
        return 'bg-primary hover:bg-primary-dark';
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] shadow-lg">
                <h2 className="pb-2 text-lg font-semibold mb-4 border-b border-b-gray-200">Review Settings Changes</h2>

                <div className="max-h-96 overflow-y-auto mb-4">
                    {changes.length === 0 ? (
                        <p className="text-gray-600">No changes detected.</p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-gray-700 font-medium mb-3">The following settings will be updated:</p>
                            {changes.map((change, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <code className="font-mono text-sm font-medium text-gray-800">
                                            {change.field}
                                        </code>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono">
                                                {formatValue(change.original)}
                                            </span>
                                            <span className="text-gray-400">→</span>
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono">
                                                {formatValue(change.modified)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-600">Settings saved successfully!</p>
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded transition-all ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || success}
                        className={`px-4 py-2 text-sm text-white rounded transition-all ${
                            getConfirmButtonColor()
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </div>
                        ) : success ? (
                            '✓ Success'
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingDiffPreviewModal;