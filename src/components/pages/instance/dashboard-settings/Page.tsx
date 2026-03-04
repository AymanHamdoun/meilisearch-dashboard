import React from 'react';
import ExportSection from './ExportSection';
import ImportSection from './ImportSection';

const DashboardSettingsPage: React.FC = () => {
    return (
        <div className="px-4 py-5">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">Dashboard Settings</h1>
                <p className="text-gray-600">
                    Export and import dashboard blueprints to replicate your Meilisearch configuration across instances.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExportSection />
                <ImportSection />
            </div>
        </div>
    );
};

export default DashboardSettingsPage;
