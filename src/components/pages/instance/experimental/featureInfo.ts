// Feature metadata with descriptions and documentation links
export const FEATURE_INFO: Record<string, { description: string; docLink?: string }> = {
  metrics: {
    description: 'Exposes Prometheus-compatible analytics data for monitoring',
    docLink: 'https://www.meilisearch.com/docs/reference/api/metrics'
  },
  logsRoute: {
    description: 'Enables API route to customize log output and set up log streams',
    docLink: 'https://www.meilisearch.com/docs/reference/api/logs'
  },
  containsFilter: {
    description: 'Enables CONTAINS operator in filter expressions for substring matching',
    docLink: 'https://www.meilisearch.com/docs/learn/filtering_and_sorting/filter_expression_reference#contains'
  },
  editDocumentsByFunction: {
    description: 'Use RHAI functions to edit documents directly in the database',
    docLink: 'https://www.meilisearch.com/docs/reference/api/documents#update-documents-with-function'
  },
  network: {
    description: 'Enable network route for horizontal database partitioning and federated search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/network'
  },
  chatCompletions: {
    description: 'Enable conversational search with LLM-powered chat completions',
    docLink: 'https://www.meilisearch.com/docs/reference/api/chats'
  },
  multimodal: {
    description: 'Enable multimodal search capabilities for diverse data types',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  vectorStoreSetting: {
    description: 'Enable experimental vector store for advanced similarity search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  customScorers: {
    description: 'Enable custom ranking functions for fine-tuned search relevancy',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  exportPuffinReports: {
    description: 'Enable export of Puffin performance profiling reports',
    docLink: 'https://www.meilisearch.com/docs/reference/api/experimental_features'
  },
  // Legacy names that might appear
  experimentalVectorStore: {
    description: 'Enable experimental vector store for advanced similarity search',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  },
  multimodalSearch: {
    description: 'Enable multimodal search capabilities for diverse data types',
    docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
  }
};

// Convert camelCase to Title Case for display
export const formatFeatureName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};