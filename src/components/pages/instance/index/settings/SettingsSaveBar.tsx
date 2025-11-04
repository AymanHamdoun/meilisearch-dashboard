import React from 'react';

interface SettingsSaveBarProps {
    onPreviewChanges: () => void;
    onReset: () => void;
    saveSuccess: boolean;
}

const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
    onPreviewChanges,
    onReset,
    saveSuccess
}) => {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-md border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">You have unsaved changes</span>
                {saveSuccess && (
                    <span className="text-sm text-green-600 font-medium">✓ Settings saved successfully</span>
                )}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Reset
                </button>
                <button
                    onClick={onPreviewChanges}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Preview Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsSaveBar;