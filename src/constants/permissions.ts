export interface Permission {
    value: string;
    label: string;
    description: string;
    category: string;
}

export const MEILISEARCH_PERMISSIONS: Permission[] = [
    // Search permissions
    {
        value: 'search',
        label: 'Search',
        description: 'Allows searching indexes',
        category: 'Search'
    },

    // Documents permissions
    {
        value: 'documents.add',
        label: 'Add Documents',
        description: 'Allows adding or updating documents',
        category: 'Documents'
    },
    {
        value: 'documents.get',
        label: 'Get Documents',
        description: 'Allows retrieving documents',
        category: 'Documents'
    },
    {
        value: 'documents.delete',
        label: 'Delete Documents',
        description: 'Allows deleting documents',
        category: 'Documents'
    },
    {
        value: 'documents.*',
        label: 'All Documents Actions',
        description: 'Allows all document operations',
        category: 'Documents'
    },

    // Indexes permissions
    {
        value: 'indexes.create',
        label: 'Create Indexes',
        description: 'Allows creating new indexes',
        category: 'Indexes'
    },
    {
        value: 'indexes.get',
        label: 'Get Indexes',
        description: 'Allows retrieving index information',
        category: 'Indexes'
    },
    {
        value: 'indexes.update',
        label: 'Update Indexes',
        description: 'Allows updating index settings',
        category: 'Indexes'
    },
    {
        value: 'indexes.delete',
        label: 'Delete Indexes',
        description: 'Allows deleting indexes',
        category: 'Indexes'
    },
    {
        value: 'indexes.swap',
        label: 'Swap Indexes',
        description: 'Allows swapping indexes',
        category: 'Indexes'
    },
    {
        value: 'indexes.*',
        label: 'All Indexes Actions',
        description: 'Allows all index operations',
        category: 'Indexes'
    },

    // Tasks permissions
    {
        value: 'tasks.get',
        label: 'Get Tasks',
        description: 'Allows retrieving task information',
        category: 'Tasks'
    },
    {
        value: 'tasks.cancel',
        label: 'Cancel Tasks',
        description: 'Allows canceling tasks',
        category: 'Tasks'
    },
    {
        value: 'tasks.delete',
        label: 'Delete Tasks',
        description: 'Allows deleting tasks',
        category: 'Tasks'
    },
    {
        value: 'tasks.*',
        label: 'All Tasks Actions',
        description: 'Allows all task operations',
        category: 'Tasks'
    },

    // Settings permissions
    {
        value: 'settings.get',
        label: 'Get Settings',
        description: 'Allows retrieving settings',
        category: 'Settings'
    },
    {
        value: 'settings.update',
        label: 'Update Settings',
        description: 'Allows updating settings',
        category: 'Settings'
    },
    {
        value: 'settings.*',
        label: 'All Settings Actions',
        description: 'Allows all settings operations',
        category: 'Settings'
    },

    // Stats permissions
    {
        value: 'stats.get',
        label: 'Get Stats',
        description: 'Allows retrieving statistics',
        category: 'Stats'
    },
    {
        value: 'stats.*',
        label: 'All Stats Actions',
        description: 'Allows all statistics operations',
        category: 'Stats'
    },

    // Dumps permissions
    {
        value: 'dumps.create',
        label: 'Create Dumps',
        description: 'Allows creating database dumps',
        category: 'Dumps'
    },
    {
        value: 'dumps.*',
        label: 'All Dumps Actions',
        description: 'Allows all dump operations',
        category: 'Dumps'
    },

    // Snapshots permissions
    {
        value: 'snapshots.create',
        label: 'Create Snapshots',
        description: 'Allows creating snapshots',
        category: 'Snapshots'
    },
    {
        value: 'snapshots.*',
        label: 'All Snapshots Actions',
        description: 'Allows all snapshot operations',
        category: 'Snapshots'
    },

    // Version permissions
    {
        value: 'version',
        label: 'Get Version',
        description: 'Allows retrieving version information',
        category: 'Version'
    },

    // Keys permissions
    {
        value: 'keys.get',
        label: 'Get Keys',
        description: 'Allows retrieving API keys',
        category: 'Keys'
    },
    {
        value: 'keys.create',
        label: 'Create Keys',
        description: 'Allows creating API keys',
        category: 'Keys'
    },
    {
        value: 'keys.update',
        label: 'Update Keys',
        description: 'Allows updating API keys',
        category: 'Keys'
    },
    {
        value: 'keys.delete',
        label: 'Delete Keys',
        description: 'Allows deleting API keys',
        category: 'Keys'
    },
    {
        value: 'keys.*',
        label: 'All Keys Actions',
        description: 'Allows all key operations',
        category: 'Keys'
    },

    // Metrics permissions
    {
        value: 'metrics.get',
        label: 'Get Metrics',
        description: 'Allows retrieving metrics',
        category: 'Metrics'
    },
    {
        value: 'metrics.*',
        label: 'All Metrics Actions',
        description: 'Allows all metrics operations',
        category: 'Metrics'
    },

    // Experimental features permissions
    {
        value: 'experimental.get',
        label: 'Get Experimental Features',
        description: 'Allows retrieving experimental features',
        category: 'Experimental'
    },
    {
        value: 'experimental.update',
        label: 'Update Experimental Features',
        description: 'Allows updating experimental features',
        category: 'Experimental'
    },
    {
        value: 'experimental.*',
        label: 'All Experimental Actions',
        description: 'Allows all experimental operations',
        category: 'Experimental'
    },

    // Wildcard permission
    {
        value: '*',
        label: 'All Actions',
        description: 'Allows all operations',
        category: 'Admin'
    }
];

export const PERMISSION_CATEGORIES = [
    'Search',
    'Documents',
    'Indexes',
    'Tasks',
    'Settings',
    'Stats',
    'Dumps',
    'Snapshots',
    'Version',
    'Keys',
    'Metrics',
    'Experimental',
    'Admin'
];

export function getPermissionsByCategory(category: string): Permission[] {
    return MEILISEARCH_PERMISSIONS.filter(p => p.category === category);
}

export function getPermissionByValue(value: string): Permission | undefined {
    return MEILISEARCH_PERMISSIONS.find(p => p.value === value);
}