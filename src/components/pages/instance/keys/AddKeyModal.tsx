import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CreateKeyPayload } from '../../../../services/meilisearch/keys';
import { MEILISEARCH_PERMISSIONS, PERMISSION_CATEGORIES, getPermissionsByCategory } from '../../../../constants/permissions';
import { BaseModal } from '../../../commons/modal/ModalComponents';

interface AddKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateKeyPayload) => Promise<void>;
}

const AddKeyModal: React.FC<AddKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<CreateKeyPayload>({
        name: '',
        description: '',
        actions: [],
        indexes: [],
        expiresAt: null
    });
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [isPermissionsDropdownOpen, setIsPermissionsDropdownOpen] = useState(false);
    const [permissionsSearch, setPermissionsSearch] = useState('');
    const [indexInput, setIndexInput] = useState('');
    const [customIndexes, setCustomIndexes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const permissionsDropdownRef = useRef<HTMLDivElement>(null);
    const permissionsButtonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (isPermissionsDropdownOpen && permissionsButtonRef.current) {
            const rect = permissionsButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isPermissionsDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (permissionsDropdownRef.current && !permissionsDropdownRef.current.contains(event.target as Node) &&
                permissionsButtonRef.current && !permissionsButtonRef.current.contains(event.target as Node)) {
                setIsPermissionsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePermissionToggle = (value: string) => {
        const newSelected = new Set(selectedPermissions);
        if (value === '*') {
            // If selecting "All Actions", clear all others and only select this
            if (!newSelected.has('*')) {
                newSelected.clear();
                newSelected.add('*');
            } else {
                newSelected.delete('*');
            }
        } else {
            // If selecting anything else, remove "All Actions" if present
            newSelected.delete('*');
            if (newSelected.has(value)) {
                newSelected.delete(value);
            } else {
                newSelected.add(value);
            }
        }
        setSelectedPermissions(newSelected);
        setFormData({ ...formData, actions: Array.from(newSelected) });
    };

    const handleSelectAllInCategory = (category: string) => {
        const categoryPermissions = getPermissionsByCategory(category);
        const newSelected = new Set(selectedPermissions);

        // Remove "All Actions" if present
        newSelected.delete('*');

        categoryPermissions.forEach(p => {
            if (p.value !== '*') {
                newSelected.add(p.value);
            }
        });

        setSelectedPermissions(newSelected);
        setFormData({ ...formData, actions: Array.from(newSelected) });
    };

    const addCustomIndex = () => {
        if (indexInput.trim() && !customIndexes.includes(indexInput.trim())) {
            const newIndexes = indexInput === '*' ? ['*'] :
                customIndexes[0] === '*' ? [indexInput.trim()] :
                [...customIndexes, indexInput.trim()];
            setCustomIndexes(newIndexes);
            setFormData({ ...formData, indexes: newIndexes });
            setIndexInput('');
        }
    };

    const removeIndex = (index: string) => {
        const newIndexes = customIndexes.filter(i => i !== index);
        setCustomIndexes(newIndexes);
        setFormData({ ...formData, indexes: newIndexes });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.actions.length === 0) {
            newErrors.actions = 'At least one permission is required';
        }

        // Empty indexes array means all indexes are allowed, so it's valid

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Failed to create key:', error);
            setErrors({ submit: error instanceof Error ? error.message : 'Failed to create key' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            actions: [],
            indexes: [],
            expiresAt: null
        });
        setSelectedPermissions(new Set());
        setCustomIndexes([]);
        setIndexInput('');
        setPermissionsSearch('');
        setErrors({});
        onClose();
    };

    const filteredPermissions = MEILISEARCH_PERMISSIONS.filter(p =>
        p.label.toLowerCase().includes(permissionsSearch.toLowerCase()) ||
        p.value.toLowerCase().includes(permissionsSearch.toLowerCase())
    );

    return (
        <BaseModal
            isVisible={isOpen}
            onClose={handleClose}
            title="Create New API Key"
            width="xl"
            isLoading={isSubmitting}
        >
            <div className="max-h-96 overflow-y-auto p-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Dashboard Read-Only Key"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Describe the purpose of this key..."
                        />
                    </div>

                    {/* Permissions Multi-Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Permissions <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <button
                                ref={permissionsButtonRef}
                                type="button"
                                onClick={() => setIsPermissionsDropdownOpen(!isPermissionsDropdownOpen)}
                                className={`w-full px-3 py-2 text-left border ${errors.actions ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white`}
                            >
                                {selectedPermissions.size === 0 ? (
                                    <span className="text-gray-400">Select permissions...</span>
                                ) : selectedPermissions.has('*') ? (
                                    <span>All Actions (*)</span>
                                ) : (
                                    <span>{selectedPermissions.size} permission(s) selected</span>
                                )}
                                <svg
                                    className={`absolute right-3 top-3 w-4 h-4 transition-transform ${isPermissionsDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isPermissionsDropdownOpen && ReactDOM.createPortal(
                                <div
                                    ref={permissionsDropdownRef}
                                    className="fixed bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto z-50"
                                    style={{
                                        top: `${dropdownPosition.top}px`,
                                        left: `${dropdownPosition.left}px`,
                                        width: `${dropdownPosition.width}px`
                                    }}
                                >
                                    <div className="sticky top-0 bg-white p-2 border-b">
                                        <input
                                            type="text"
                                            value={permissionsSearch}
                                            onChange={(e) => setPermissionsSearch(e.target.value)}
                                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="Search permissions..."
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    <div className="p-2">
                                        {/* All Actions option */}
                                        {(permissionsSearch === '' || '*'.includes(permissionsSearch.toLowerCase())) && (
                                            <label className="flex items-start p-2 hover:bg-gray-50 cursor-pointer rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.has('*')}
                                                    onChange={() => handlePermissionToggle('*')}
                                                    className="mt-1 mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm">All Actions (*)</div>
                                                    <div className="text-xs text-gray-500">Grants all permissions</div>
                                                </div>
                                            </label>
                                        )}

                                        {/* Group permissions by category */}
                                        {PERMISSION_CATEGORIES.map(category => {
                                            const categoryPerms = filteredPermissions.filter(p => p.category === category && p.value !== '*');
                                            if (categoryPerms.length === 0) return null;

                                            return (
                                                <div key={category} className="mb-4">
                                                    <div className="flex items-center justify-between px-2 py-1">
                                                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            {category}
                                                        </h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectAllInCategory(category)}
                                                            className="text-xs text-primary hover:text-primary-dark"
                                                        >
                                                            Select all
                                                        </button>
                                                    </div>
                                                    {categoryPerms.map(permission => (
                                                        <label
                                                            key={permission.value}
                                                            className="flex items-start p-2 hover:bg-gray-50 cursor-pointer rounded"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions.has(permission.value)}
                                                                onChange={() => handlePermissionToggle(permission.value)}
                                                                disabled={selectedPermissions.has('*')}
                                                                className="mt-1 mr-3"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm">{permission.label}</div>
                                                                <div className="text-xs text-gray-500">{permission.description}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                        {errors.actions && (
                            <p className="mt-1 text-sm text-red-600">{errors.actions}</p>
                        )}

                        {/* Display selected permissions */}
                        {selectedPermissions.size > 0 && !selectedPermissions.has('*') && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {Array.from(selectedPermissions).map(value => {
                                    const permission = MEILISEARCH_PERMISSIONS.find(p => p.value === value);
                                    return (
                                        <span
                                            key={value}
                                            className="inline-flex items-center px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded"
                                        >
                                            {permission?.label || value}
                                            <button
                                                type="button"
                                                onClick={() => handlePermissionToggle(value)}
                                                className="ml-1 hover:text-primary-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Authorized Indexes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Authorized Indexes <span className="text-gray-500">(leave empty for all)</span>
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={indexInput}
                                onChange={(e) => setIndexInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomIndex())}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter index name or * for all"
                            />
                            <button
                                type="button"
                                onClick={addCustomIndex}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {customIndexes.length === 0 ? (
                                <span className="text-sm text-gray-500 italic">All indexes will be accessible</span>
                            ) : customIndexes.map(index => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md"
                                >
                                    {index === '*' ? 'All Indexes (*)' : index}
                                    {customIndexes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIndex(index)}
                                            className="ml-2 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                        {errors.indexes && (
                            <p className="mt-1 text-sm text-red-600">{errors.indexes}</p>
                        )}
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    checked={formData.expiresAt === null}
                                    onChange={() => setFormData({ ...formData, expiresAt: null })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Never expires</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    checked={formData.expiresAt !== null}
                                    onChange={() => {
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        setFormData({ ...formData, expiresAt: tomorrow.toISOString() });
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm">Set expiration date</span>
                            </label>
                            {formData.expiresAt !== null && (
                                <input
                                    type="datetime-local"
                                    value={formData.expiresAt ? formData.expiresAt.slice(0, 16) : ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null
                                    })}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create Key'}
                </button>
            </div>
        </BaseModal>
    );
};

export default AddKeyModal;