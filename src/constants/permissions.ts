export interface Permission {
    value: string;
    label: string;
    description: string;
    category: string;
}

// Permission Categories
export const CATEGORY_SEARCH = 'Search';
export const CATEGORY_DOCUMENTS = 'Documents';
export const CATEGORY_INDEXES = 'Indexes';
export const CATEGORY_TASKS = 'Tasks';
export const CATEGORY_SETTINGS = 'Settings';
export const CATEGORY_STATS = 'Stats';
export const CATEGORY_DUMPS = 'Dumps';
export const CATEGORY_SNAPSHOTS = 'Snapshots';
export const CATEGORY_VERSION = 'Version';
export const CATEGORY_KEYS = 'Keys';
export const CATEGORY_METRICS = 'Metrics';
export const CATEGORY_EXPERIMENTAL = 'Experimental';
export const CATEGORY_ADMIN = 'Admin';

// Search Permissions
export const PERMISSION_SEARCH = 'search';

// Documents Permissions
export const PERMISSION_DOCUMENTS_ADD = 'documents.add';
export const PERMISSION_DOCUMENTS_GET = 'documents.get';
export const PERMISSION_DOCUMENTS_DELETE = 'documents.delete';
export const PERMISSION_DOCUMENTS_ALL = 'documents.*';

// Indexes Permissions
export const PERMISSION_INDEXES_CREATE = 'indexes.create';
export const PERMISSION_INDEXES_GET = 'indexes.get';
export const PERMISSION_INDEXES_UPDATE = 'indexes.update';
export const PERMISSION_INDEXES_DELETE = 'indexes.delete';
export const PERMISSION_INDEXES_SWAP = 'indexes.swap';
export const PERMISSION_INDEXES_ALL = 'indexes.*';

// Tasks Permissions
export const PERMISSION_TASKS_GET = 'tasks.get';
export const PERMISSION_TASKS_CANCEL = 'tasks.cancel';
export const PERMISSION_TASKS_DELETE = 'tasks.delete';
export const PERMISSION_TASKS_ALL = 'tasks.*';

// Settings Permissions
export const PERMISSION_SETTINGS_GET = 'settings.get';
export const PERMISSION_SETTINGS_UPDATE = 'settings.update';
export const PERMISSION_SETTINGS_ALL = 'settings.*';

// Stats Permissions
export const PERMISSION_STATS_GET = 'stats.get';
export const PERMISSION_STATS_ALL = 'stats.*';

// Dumps Permissions
export const PERMISSION_DUMPS_CREATE = 'dumps.create';
export const PERMISSION_DUMPS_ALL = 'dumps.*';

// Snapshots Permissions
export const PERMISSION_SNAPSHOTS_CREATE = 'snapshots.create';
export const PERMISSION_SNAPSHOTS_ALL = 'snapshots.*';

// Version Permissions
export const PERMISSION_VERSION = 'version';

// Keys Permissions
export const PERMISSION_KEYS_GET = 'keys.get';
export const PERMISSION_KEYS_CREATE = 'keys.create';
export const PERMISSION_KEYS_UPDATE = 'keys.update';
export const PERMISSION_KEYS_DELETE = 'keys.delete';
export const PERMISSION_KEYS_ALL = 'keys.*';

// Metrics Permissions
export const PERMISSION_METRICS_GET = 'metrics.get';
export const PERMISSION_METRICS_ALL = 'metrics.*';

// Experimental Permissions
export const PERMISSION_EXPERIMENTAL_GET = 'experimental.get';
export const PERMISSION_EXPERIMENTAL_UPDATE = 'experimental.update';
export const PERMISSION_EXPERIMENTAL_ALL = 'experimental.*';

// Admin Permissions
export const PERMISSION_ALL = '*';

export const MEILISEARCH_PERMISSIONS: Permission[] = [
    // Search permissions
    {
        value: PERMISSION_SEARCH,
        label: 'Search',
        description: 'Allows searching indexes',
        category: CATEGORY_SEARCH
    },

    // Documents permissions
    {
        value: PERMISSION_DOCUMENTS_ADD,
        label: 'Add Documents',
        description: 'Allows adding or updating documents',
        category: CATEGORY_DOCUMENTS
    },
    {
        value: PERMISSION_DOCUMENTS_GET,
        label: 'Get Documents',
        description: 'Allows retrieving documents',
        category: CATEGORY_DOCUMENTS
    },
    {
        value: PERMISSION_DOCUMENTS_DELETE,
        label: 'Delete Documents',
        description: 'Allows deleting documents',
        category: CATEGORY_DOCUMENTS
    },
    {
        value: PERMISSION_DOCUMENTS_ALL,
        label: 'All Documents Actions',
        description: 'Allows all document operations',
        category: CATEGORY_DOCUMENTS
    },

    // Indexes permissions
    {
        value: PERMISSION_INDEXES_CREATE,
        label: 'Create Indexes',
        description: 'Allows creating new indexes',
        category: CATEGORY_INDEXES
    },
    {
        value: PERMISSION_INDEXES_GET,
        label: 'Get Indexes',
        description: 'Allows retrieving index information',
        category: CATEGORY_INDEXES
    },
    {
        value: PERMISSION_INDEXES_UPDATE,
        label: 'Update Indexes',
        description: 'Allows updating index settings',
        category: CATEGORY_INDEXES
    },
    {
        value: PERMISSION_INDEXES_DELETE,
        label: 'Delete Indexes',
        description: 'Allows deleting indexes',
        category: CATEGORY_INDEXES
    },
    {
        value: PERMISSION_INDEXES_SWAP,
        label: 'Swap Indexes',
        description: 'Allows swapping indexes',
        category: CATEGORY_INDEXES
    },
    {
        value: PERMISSION_INDEXES_ALL,
        label: 'All Indexes Actions',
        description: 'Allows all index operations',
        category: CATEGORY_INDEXES
    },

    // Tasks permissions
    {
        value: PERMISSION_TASKS_GET,
        label: 'Get Tasks',
        description: 'Allows retrieving task information',
        category: CATEGORY_TASKS
    },
    {
        value: PERMISSION_TASKS_CANCEL,
        label: 'Cancel Tasks',
        description: 'Allows canceling tasks',
        category: CATEGORY_TASKS
    },
    {
        value: PERMISSION_TASKS_DELETE,
        label: 'Delete Tasks',
        description: 'Allows deleting tasks',
        category: CATEGORY_TASKS
    },
    {
        value: PERMISSION_TASKS_ALL,
        label: 'All Tasks Actions',
        description: 'Allows all task operations',
        category: CATEGORY_TASKS
    },

    // Settings permissions
    {
        value: PERMISSION_SETTINGS_GET,
        label: 'Get Settings',
        description: 'Allows retrieving settings',
        category: CATEGORY_SETTINGS
    },
    {
        value: PERMISSION_SETTINGS_UPDATE,
        label: 'Update Settings',
        description: 'Allows updating settings',
        category: CATEGORY_SETTINGS
    },
    {
        value: PERMISSION_SETTINGS_ALL,
        label: 'All Settings Actions',
        description: 'Allows all settings operations',
        category: CATEGORY_SETTINGS
    },

    // Stats permissions
    {
        value: PERMISSION_STATS_GET,
        label: 'Get Stats',
        description: 'Allows retrieving statistics',
        category: CATEGORY_STATS
    },
    {
        value: PERMISSION_STATS_ALL,
        label: 'All Stats Actions',
        description: 'Allows all statistics operations',
        category: CATEGORY_STATS
    },

    // Dumps permissions
    {
        value: PERMISSION_DUMPS_CREATE,
        label: 'Create Dumps',
        description: 'Allows creating database dumps',
        category: CATEGORY_DUMPS
    },
    {
        value: PERMISSION_DUMPS_ALL,
        label: 'All Dumps Actions',
        description: 'Allows all dump operations',
        category: CATEGORY_DUMPS
    },

    // Snapshots permissions
    {
        value: PERMISSION_SNAPSHOTS_CREATE,
        label: 'Create Snapshots',
        description: 'Allows creating snapshots',
        category: CATEGORY_SNAPSHOTS
    },
    {
        value: PERMISSION_SNAPSHOTS_ALL,
        label: 'All Snapshots Actions',
        description: 'Allows all snapshot operations',
        category: CATEGORY_SNAPSHOTS
    },

    // Version permissions
    {
        value: PERMISSION_VERSION,
        label: 'Get Version',
        description: 'Allows retrieving version information',
        category: CATEGORY_VERSION
    },

    // Keys permissions
    {
        value: PERMISSION_KEYS_GET,
        label: 'Get Keys',
        description: 'Allows retrieving API keys',
        category: CATEGORY_KEYS
    },
    {
        value: PERMISSION_KEYS_CREATE,
        label: 'Create Keys',
        description: 'Allows creating API keys',
        category: CATEGORY_KEYS
    },
    {
        value: PERMISSION_KEYS_UPDATE,
        label: 'Update Keys',
        description: 'Allows updating API keys',
        category: CATEGORY_KEYS
    },
    {
        value: PERMISSION_KEYS_DELETE,
        label: 'Delete Keys',
        description: 'Allows deleting API keys',
        category: CATEGORY_KEYS
    },
    {
        value: PERMISSION_KEYS_ALL,
        label: 'All Keys Actions',
        description: 'Allows all key operations',
        category: CATEGORY_KEYS
    },

    // Metrics permissions
    {
        value: PERMISSION_METRICS_GET,
        label: 'Get Metrics',
        description: 'Allows retrieving metrics',
        category: CATEGORY_METRICS
    },
    {
        value: PERMISSION_METRICS_ALL,
        label: 'All Metrics Actions',
        description: 'Allows all metrics operations',
        category: CATEGORY_METRICS
    },

    // Experimental features permissions
    {
        value: PERMISSION_EXPERIMENTAL_GET,
        label: 'Get Experimental Features',
        description: 'Allows retrieving experimental features',
        category: CATEGORY_EXPERIMENTAL
    },
    {
        value: PERMISSION_EXPERIMENTAL_UPDATE,
        label: 'Update Experimental Features',
        description: 'Allows updating experimental features',
        category: CATEGORY_EXPERIMENTAL
    },
    {
        value: PERMISSION_EXPERIMENTAL_ALL,
        label: 'All Experimental Actions',
        description: 'Allows all experimental operations',
        category: CATEGORY_EXPERIMENTAL
    },

    // Wildcard permission
    {
        value: PERMISSION_ALL,
        label: 'All Actions',
        description: 'Allows all operations',
        category: CATEGORY_ADMIN
    }
];

export const PERMISSION_CATEGORIES = [
    CATEGORY_SEARCH,
    CATEGORY_DOCUMENTS,
    CATEGORY_INDEXES,
    CATEGORY_TASKS,
    CATEGORY_SETTINGS,
    CATEGORY_STATS,
    CATEGORY_DUMPS,
    CATEGORY_SNAPSHOTS,
    CATEGORY_VERSION,
    CATEGORY_KEYS,
    CATEGORY_METRICS,
    CATEGORY_EXPERIMENTAL,
    CATEGORY_ADMIN
];

export function getPermissionsByCategory(category: string): Permission[] {
    return MEILISEARCH_PERMISSIONS.filter(p => p.category === category);
}

export function getPermissionByValue(value: string): Permission | undefined {
    return MEILISEARCH_PERMISSIONS.find(p => p.value === value);
}