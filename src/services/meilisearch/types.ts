// --------------------- Custom Types ---------------------

export enum QueryType {
    ByQuery = "query",
    ByObjectID = "object_id"
}

// --------------------- Meilisearch Response Types ---------------------

// ------ Tasks API ------
export interface GetTaskResponse {
    results: _api_task_object[]
    total: number
    limit: number
    from: number
    next: number | null
  }

export interface _api_task_object {
    uid: number
    indexUid: string
    status: string
    type: string
    canceledBy: any
    details: _api_task_details
    error: _api_task_error
    duration: string
    enqueuedAt: string
    startedAt: string
    finishedAt: string
    batchUid?: number
}

export interface _api_task_details {
    receivedDocuments?: number
    indexedDocuments?: number
    deletedDocuments?: number
    providedIds?: number
    originalFilter?: string
    typoTolerance?: _api_task_details_typo_tolerance
    [key: string]: any
}

export interface _api_task_error {
    message: string
    code: string
    type: string
    link: string
}


export interface _api_task_details_typo_tolerance {
    minWordSizeForTypos: _api_task_details_typo_tolerance_thresholds;
    disableOnWords:      string[];
    disableOnAttributes: string[];
}

export interface _api_task_details_typo_tolerance_thresholds {
    oneTypo:  number;
    twoTypos: number;
}

// ------ Batches API ------
export interface GetBatchResponse {
    results: _api_batch_object[]
    total: number
    limit: number
    from: number
    next: number | null
}

export interface _api_batch_object {
    uid: number
    details: Record<string, any>
    stats: {
        totalNbTasks: number
        status: Record<string, number>
        types: Record<string, number>
        indexUids: Record<string, number>
    }
    duration: string
    startedAt: string
    finishedAt: string
    progress: any
}

// ------ Documents API ------
export interface DocumentListResponse {
    results: Record<string, any>[]
    total: number
    limit: number
    offset: number
}

// ------ Settings API ------

export interface ApiSettingsEmbedder {
    source: string;
    model?: string;
    apiKey?: string;
    dimensions?: number;
    url?: string;
    documentTemplate?: string;
    documentTemplateMaxBytes?: number;
    distribution?: { mean: number; sigma: number };
    [key: string]: any;
}

export interface ApiSettingsLocalizedAttribute {
    attributePatterns: string[];
    locales: string[];
}

export interface APISettings {
    displayedAttributes:  string[];
    searchableAttributes: string[];
    filterableAttributes: string[];
    sortableAttributes:   string[];
    rankingRules:         string[];
    stopWords:            string[];
    nonSeparatorTokens:   string[];
    separatorTokens:      string[];
    dictionary:           string[];
    synonyms:             Record<string, string[]>;
    distinctAttribute:    string | null;
    proximityPrecision:   string;
    typoTolerance:        ApiSettingsTypoTolerance;
    faceting:             ApiSettingsFaceting;
    pagination:           ApiSettingsPagination;
    searchCutoffMs:       number | null;
    localizedAttributes:  ApiSettingsLocalizedAttribute[] | null;
    embedders:            Record<string, ApiSettingsEmbedder> | null;
    facetSearch:          boolean;
    prefixSearch:         string;
}

export interface ApiSettingsFaceting {
    maxValuesPerFacet: number;
    sortFacetValuesBy: { [key: string]: string } ;
}

export interface ApiSettingsPagination {
    maxTotalHits: number;
}

export interface ApiSettingsTypoTolerance {
    enabled:             boolean;
    minWordSizeForTypos: MinWordSizeForTypos;
    disableOnWords:      string[];
    disableOnAttributes: string[];
}

export interface MinWordSizeForTypos {
    oneTypo:  number;
    twoTypos: number;
}
