import { VersionDocs } from './types';

const v1_37_0: VersionDocs = {
  version: '1.37.0',
  settings: {
    searchableAttributes: {
      summary: 'Fields used for search queries, ordered by relevance.',
      details: 'The searchableAttributes setting determines which document fields are searched when a user makes a query. Fields listed first have a greater impact on relevance. By default, all fields are searchable in the order they appear in the first document indexed. Setting an explicit list lets you control which fields are searched and in what priority order.',
      defaultValue: '["*"]',
      tips: [
        'Order matters: fields listed first are considered more relevant for ranking.',
        'Use ["*"] to make all fields searchable. Set a specific list for production use.',
        'Removing a field from this list means it won\'t be searched but will still be returned in results if it\'s in displayedAttributes.'
      ],
      examples: [
        '["title", "description", "tags"]',
        '["name", "email", "bio"]'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#searchable-attributes'
    },
    displayedAttributes: {
      summary: 'Fields returned in search results.',
      details: 'Controls which fields appear in search results. By default, all fields are displayed. Restricting displayed attributes is useful for security (hiding internal fields) and performance (smaller response payloads).',
      defaultValue: '["*"]',
      tips: [
        'Hide sensitive fields like internal IDs or private data by excluding them.',
        'Reducing displayed fields can improve response times for large documents.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#displayed-attributes'
    },
    filterableAttributes: {
      summary: 'Fields available for filtering and faceting.',
      details: 'A field must be listed in filterableAttributes before it can be used in filter or facet queries. Adding fields here creates additional database structures to enable fast filtering. Only add fields you actually need to filter on, as each additional filterable attribute increases index size.',
      defaultValue: '[]',
      tips: [
        'Only add fields you actually need to filter by — each one increases storage.',
        'Commonly filtered fields: category, status, price, date, boolean flags.',
        'Filterable attributes are also required for geo-search (use _geo).'
      ],
      examples: [
        '["genre", "rating", "release_date"]',
        '["status", "category", "_geo"]'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#filterable-attributes'
    },
    sortableAttributes: {
      summary: 'Fields available for sorting search results.',
      details: 'List fields that users should be able to sort by at search time. Like filterable attributes, sortable attributes require additional indexing. Only add fields you need to sort on.',
      defaultValue: '[]',
      tips: [
        'Commonly sorted fields: price, date, popularity, alphabetical name.',
        'Sort at search time using the sort parameter: ["price:asc"].'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#sortable-attributes'
    },
    rankingRules: {
      summary: 'Rules that determine the order of search results.',
      details: 'Ranking rules are applied sequentially to sort search results. Meilisearch has built-in rules (words, typo, proximity, attribute, sort, exactness) applied in the default order. You can reorder them or add custom ranking rules based on document attributes.',
      defaultValue: '["words", "typo", "proximity", "attribute", "sort", "exactness"]',
      tips: [
        'The order of rules matters. The first rule has the highest priority.',
        'Add custom rules like "release_date:desc" to boost recent documents.',
        'The "sort" rule must be present for sort parameters at search time to work.'
      ],
      examples: [
        '["words", "typo", "proximity", "attribute", "sort", "exactness", "release_date:desc"]'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#ranking-rules'
    },
    stopWords: {
      summary: 'Words ignored during search.',
      details: 'Stop words are terms that are ignored by the search engine. Common examples include articles and prepositions (the, a, an, in, on). Removing these words can improve search relevance and performance. Stop words are language-dependent.',
      defaultValue: '[]',
      tips: [
        'Add common words for your content\'s language: "the", "a", "is", "at", "on".',
        'Don\'t add words that carry meaning in your domain (e.g. "IT" in tech).'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#stop-words'
    },
    synonyms: {
      summary: 'Map of equivalent terms for search.',
      details: 'Define synonym relationships so that searching for one term also matches documents containing its synonyms. Supports one-way and multi-way synonyms.',
      defaultValue: '{}',
      tips: [
        'Multi-way: {"phone": ["mobile", "cell"]} means all three are interchangeable.',
        'Useful for abbreviations, regional spellings, and domain-specific terminology.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#synonyms'
    },
    distinctAttribute: {
      summary: 'Field used to deduplicate search results.',
      details: 'When set, only one document per unique value of this field will appear in search results. Useful for deduplication when the same logical item has multiple documents (e.g., product variants).',
      defaultValue: 'null',
      tips: [
        'Common use: set to "product_id" to show one result per product.',
        'Only one distinct attribute can be set at a time.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#distinct-attribute'
    },
    typoTolerance: {
      summary: 'Configure tolerance for typographical errors in search queries.',
      details: 'Meilisearch tolerates typos by default. You can customize how many typos are tolerated, the minimum word length before typos are considered, disable typos on specific attributes or words, and enable/disable typo tolerance entirely.',
      tips: [
        'Short words (< 5 chars) have stricter typo tolerance by default.',
        'Disable typos on exact-match fields like codes or IDs.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance'
    },
    'minWordSizeForTypos.oneTypo': {
      summary: 'Minimum word length to allow one typo.',
      details: 'Sets the minimum number of characters a search term must have before Meilisearch considers matches with one typo. Increasing this value makes search more strict for shorter words.',
      defaultValue: '5',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object'
    },
    'minWordSizeForTypos.twoTypos': {
      summary: 'Minimum word length to allow two typos.',
      details: 'Sets the minimum number of characters a search term must have before Meilisearch considers matches with two typos.',
      defaultValue: '9',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object'
    },
    disableOnAttributes: {
      summary: 'Attributes where typo tolerance is disabled.',
      details: 'List attributes where exact matching is required and typo tolerance should not be applied. Useful for fields containing codes, identifiers, or technical terms.',
      defaultValue: '[]',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object'
    },
    disableOnWords: {
      summary: 'Specific words where typo tolerance is disabled.',
      details: 'List specific words that must be matched exactly without typo tolerance. Useful for brand names, product codes, or domain-specific terms that should never have typo corrections applied.',
      defaultValue: '[]',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object'
    },
    pagination: {
      summary: 'Configure pagination limits for search results.',
      details: 'Controls the maximum number of results that can be browsed through pagination. The default limit is 1000 results. Increasing this limit can impact performance.',
      defaultValue: '{ maxTotalHits: 1000 }',
      tips: [
        'For most use cases, 1000 total hits is more than sufficient.',
        'Use filters instead of deep pagination for better performance.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#pagination'
    },
    'faceting.maxValuesPerFacet': {
      summary: 'Maximum number of facet values returned per facet.',
      details: 'Controls how many distinct values are returned for each faceted field. Increase this if your facets have many distinct values and users need to see them all.',
      defaultValue: '100',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#faceting'
    },
    'faceting.sortFacetValuesBy': {
      summary: 'How facet values are sorted in results.',
      details: 'Choose between sorting facet values alphabetically or by count (most frequent first). Can be configured globally or per facet field.',
      defaultValue: '{ "*": "alpha" }',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#faceting'
    },
    separatorTokens: {
      summary: 'Custom characters treated as word separators.',
      details: 'Add characters that should break words apart during indexing and search. By default, Meilisearch uses standard separators (spaces, punctuation). Use this to handle special characters in your data.',
      defaultValue: '[]',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#separator-tokens'
    },
    nonSeparatorTokens: {
      summary: 'Characters that should NOT be treated as word separators.',
      details: 'Override the default behavior where certain characters split words. Useful when special characters are part of meaningful terms (e.g., C++, .NET, #hashtag).',
      defaultValue: '[]',
      tips: [
        'Add characters like "+", "#", "@" if they\'re meaningful in your data.',
        'Useful for programming language names, hashtags, and technical terms.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#non-separator-tokens'
    },
    dictionary: {
      summary: 'Custom words to add to the search dictionary.',
      details: 'Add multi-word phrases or special terms that Meilisearch should recognize as single search tokens. Useful for compound words and domain-specific terminology that should not be split.',
      defaultValue: '[]',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#dictionary'
    },
    proximityPrecision: {
      summary: 'Configure precision level for word proximity ranking.',
      details: 'Controls whether word proximity is calculated at the word level or attribute level. "byWord" provides more precise ranking but requires more processing. "byAttribute" is faster but less precise.',
      defaultValue: '"byWord"',
      tips: [
        'Use "byAttribute" for faster indexing with large documents.',
        '"byWord" gives better relevance for multi-word queries.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#proximity-precision'
    },
    embedders: {
      summary: 'Configure vector embedders for semantic/hybrid search.',
      details: 'Define embedding sources for vector-based semantic search. Supports OpenAI, HuggingFace, Ollama, REST-based embedders, and manual user-provided vectors. Each embedder generates vectors used for similarity matching alongside keyword search.',
      tips: [
        'OpenAI source: set your API key and model (e.g., text-embedding-3-small).',
        'HuggingFace source: specify model and optional revision.',
        'Multiple embedders can be configured for different use cases.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#embedders'
    },
    searchCutoffMs: {
      summary: 'Maximum time (ms) allowed for a search query.',
      details: 'Sets an upper bound on search query processing time. If a search takes longer than this, Meilisearch returns the best results found so far. Useful for ensuring consistent response times.',
      defaultValue: 'null (no limit)',
      tips: [
        'Set to 150-500ms for user-facing search to ensure responsive UX.',
        'Leave null for batch/background search operations.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#search-cutoff'
    },
    localizedAttributes: {
      summary: 'Map attributes to specific locales for language-aware search.',
      details: 'Configure language-specific tokenization and normalization for multilingual content. Different fields can be assigned to different locales for optimal search behavior per language.',
      tips: [
        'Useful for multilingual datasets with fields in different languages.',
        'Set the appropriate locale for each language field for best search results.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#localized-attributes'
    },
    prefixSearch: {
      summary: 'Configure prefix search behavior.',
      details: 'Controls whether the last word in a query is treated as a prefix, matching any word that starts with those characters. This enables "search-as-you-type" functionality.',
      defaultValue: '"indexingTime"',
      tips: [
        '"indexingTime" (default): prefix search is pre-computed at indexing time for fastest search.',
        '"disabled": no prefix matching, only exact words match.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#prefix-search'
    },
    facetSearch: {
      summary: 'Enable or disable searching within facet values.',
      details: 'When enabled, users can search for specific facet values. This is useful when a facet has many possible values and users need to find specific ones.',
      defaultValue: 'true',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings#facet-search'
    },
    settings: {
      summary: 'Full index settings configuration.',
      details: 'Export or import the complete settings configuration for an index. This includes all searchable attributes, ranking rules, filters, and other settings in a single JSON object.',
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
    }
  },
  experimentalFeatures: {
    chatCompletions: {
      summary: 'AI-powered chat completions using your Meilisearch data.',
      details: 'Enables conversational search by combining an LLM with your Meilisearch indexes. Users can ask natural language questions and receive synthesized answers grounded in your indexed data.',
      setupSteps: [
        'Enable the chatCompletions experimental feature.',
        'Configure a chat model in your Meilisearch instance settings.',
        'Index documents that will serve as the knowledge base.',
        'Use the /chats/completions API endpoint or the Chat page in this dashboard.'
      ],
      tips: [
        'Works best with well-structured, descriptive documents.',
        'The LLM uses your search results as context for generating answers.',
        'Supports streaming responses for real-time chat experiences.'
      ],
      requirements: [
        'An LLM API key (OpenAI or compatible) configured in Meilisearch.',
        'At least one index with documents to search against.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/chats'
    },
    vectorStore: {
      summary: 'Semantic search with vector embeddings.',
      details: 'Enables vector-based similarity search alongside keyword search. Documents are converted into numerical vectors using embedding models, allowing semantic matching beyond exact keyword matches.',
      setupSteps: [
        'Enable the vectorStore experimental feature.',
        'Configure an embedder in your index settings (OpenAI, HuggingFace, etc.).',
        'Re-index your documents to generate vectors.',
        'Use the similar documents API or vector search parameters.'
      ],
      tips: [
        'Choose an embedding model appropriate for your content language and domain.',
        'Hybrid search combines keyword and semantic results for best relevance.',
        'Vector indexing increases storage requirements and indexing time.'
      ],
      requirements: [
        'An embedding provider (OpenAI API key, local HuggingFace model, etc.).',
        'Sufficient memory for storing document vectors.'
      ],
      docLink: 'https://www.meilisearch.com/docs/learn/experimental/vector_search'
    },
    metrics: {
      summary: 'Prometheus-compatible analytics and performance metrics.',
      details: 'Exposes a /metrics endpoint providing Prometheus-format metrics about your Meilisearch instance. Includes search latency, document counts, indexing performance, and system resource usage.',
      setupSteps: [
        'Enable the metrics experimental feature.',
        'Access metrics at your-instance/metrics.',
        'Optionally configure Prometheus to scrape the endpoint.',
        'Use Grafana or this dashboard to visualize metrics.'
      ],
      tips: [
        'Useful for monitoring search performance in production.',
        'Set up alerts on search latency and error rates.',
        'Metrics are updated in real-time.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/metrics'
    },
    network: {
      summary: 'Horizontal database partitioning and federated search.',
      details: 'Enables multi-node Meilisearch deployments where different indexes can live on different nodes. Federated search queries can span multiple nodes, enabling horizontal scaling.',
      setupSteps: [
        'Enable the network experimental feature on all nodes.',
        'Configure the self URL for this node.',
        'Add remote node URLs to the network configuration.',
        'Use federated search with remotes to query across nodes.'
      ],
      tips: [
        'Distribute large datasets across multiple Meilisearch instances.',
        'Ensure network connectivity between all nodes.',
        'Use for horizontal scaling when a single instance isn\'t sufficient.'
      ],
      requirements: [
        'Multiple Meilisearch instances accessible over the network.',
        'Consistent API key configuration across nodes.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/network'
    },
    customScorers: {
      summary: 'Custom ranking functions for fine-tuned relevancy.',
      details: 'Define custom scoring functions that modify how search results are ranked. Allows you to incorporate business logic into search relevance beyond the default ranking rules.',
      setupSteps: [
        'Enable the customScorers experimental feature.',
        'Define scorer functions in your index settings.',
        'Re-index documents to apply custom scoring.',
        'Test search results to verify ranking changes.'
      ],
      docLink: 'https://www.meilisearch.com/docs/reference/api/settings'
    }
  },
  pages: {
    overview: {
      title: 'Overview',
      description: 'Dashboard showing instance health, database stats, and recent activity.'
    },
    index: {
      title: 'Index',
      description: 'Browse, search, and manage documents within a selected index.'
    },
    tasks: {
      title: 'Tasks',
      description: 'View and manage asynchronous tasks (indexing, settings updates, etc.).'
    },
    keys: {
      title: 'API Keys',
      description: 'Manage API keys and their permissions for accessing this Meilisearch instance.'
    },
    experimental: {
      title: 'Experimental Features',
      description: 'Toggle experimental features on your Meilisearch instance.'
    }
  }
};

export default v1_37_0;
