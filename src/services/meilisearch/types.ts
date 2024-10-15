import { number, string } from "prop-types"
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
    next: number
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
}

export interface _api_task_details {
    receivedDocuments?: number
    indexedDocuments?: number
    typoTolerance?: _api_task_details_typo_tolerance 
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

// ------ Settings API ------

export interface APISettings {
    displayedAttributes:  string[];
    searchableAttributes: string[];
    filterableAttributes: any[];
    sortableAttributes:   any[];
    rankingRules:         string[];
    stopWords:            any[];
    nonSeparatorTokens:   any[];
    separatorTokens:      any[];
    dictionary:           any[];
    synonyms:             ApiSettingsSynonyms;
    distinctAttribute:    null;
    proximityPrecision:   string;
    typoTolerance:        ApiSettingsTypoTolerance;
    faceting:             ApiSettingsFaceting;
    pagination:           ApiSettingsPagination;
    searchCutoffMs:       null;
    localizedAttributes:  null;
}

export interface ApiSettingsFaceting {
    maxValuesPerFacet: number;
    sortFacetValuesBy: { [key: string]: string } ;
}

export interface ApiSettingsPagination {
    maxTotalHits: number;
}

export interface ApiSettingsSynonyms {
}

export interface ApiSettingsTypoTolerance {
    enabled:             boolean;
    minWordSizeForTypos: MinWordSizeForTypos;
    disableOnWords:      any[];
    disableOnAttributes: any[];
}

export interface MinWordSizeForTypos {
    oneTypo:  number;
    twoTypos: number;
}
