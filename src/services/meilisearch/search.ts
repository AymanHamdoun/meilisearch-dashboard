import { QueryType } from "./types"
import { InstanceState } from "../../contexts/InstanceContext"
import { fetchWithTimeout } from "./fetchWithTimeout"

export interface SearchParams {
    q: string;
    filter?: string;
    sort?: string[];
    facets?: string[];
    matchingStrategy?: string;
    attributesToSearchOn?: string[];
    offset?: number;
    limit?: number;
    showRankingScoreDetails?: boolean;
    showRankingScore?: boolean;
    attributesToHighlight?: string[];
    showMatchesPosition?: boolean;
    showPerformanceDetails?: boolean;
    hybrid?: { semanticRatio?: number; embedder?: string };
    vector?: number[];
}

type SearchWrapperOptions = {
    instance: InstanceState,
    queryType: QueryType,
    query: string,
    indexName: string,
    searchParams?: Partial<SearchParams>
}

const indexSearchWrapper = (options: SearchWrapperOptions) => {
    if (!options.instance.isLoaded) {
        return new Promise(() => {
            return {hits: []}
        })
    }

    if (options.queryType == QueryType.ByQuery) {
        return basicSearch(options)
    }

    return getDocByObjectID(options).then((res) => {
        return {hits: [res]}
    })
}

interface QueryFederationOptions {
    weight: number;
};

interface MultiSearchQuery {
    q: string;
    indexUid: string;
    federationOptions: QueryFederationOptions;
};

interface FederationOptions {
    offset?: number
    limit?: number
}

interface MultiSearchOptions {
    instance: InstanceState,
    queries: MultiSearchQuery[]
    federation: FederationOptions
}

const federatedSearch = (options: MultiSearchOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify({
            queries: options.queries,
            federation: options.federation,
        })
    };

    const url = `${options.instance.host}/multi-search`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 404 && data.code === 'index_not_found') {
                    const error = new Error(data.message || 'Index not found');
                    (error as any).code = 'index_not_found';
                    (error as any).status = 404;
                    throw error;
                }
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Search API error:', error);
            throw error;
        });
}


const basicSearch = (options: SearchWrapperOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const body: SearchParams = {
        q: options.query,
        showRankingScoreDetails: true,
        showRankingScore: true,
        attributesToHighlight: ["*"],
        showMatchesPosition: true,
        ...options.searchParams,
    };

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(body)
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/search`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 404 && data.code === 'index_not_found') {
                    const error = new Error(data.message || 'Index not found');
                    (error as any).code = 'index_not_found';
                    (error as any).status = 404;
                    throw error;
                }
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Search API error:', error);
            throw error;
        });
}

const getDocByObjectID = (options: SearchWrapperOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/documents/${options.query}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 404) {
                    if (data.code === 'index_not_found') {
                        const error = new Error(data.message || 'Index not found');
                        (error as any).code = 'index_not_found';
                        (error as any).status = 404;
                        throw error;
                    } else if (data.code === 'document_not_found') {
                        const error = new Error(data.message || 'Document not found');
                        (error as any).code = 'document_not_found';
                        (error as any).status = 404;
                        throw error;
                    }
                }
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Search API error:', error);
            throw error;
        });
}

const facetSearch = (instance: InstanceState, indexName: string, facetName: string, facetQuery?: string, filter?: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const body: any = { facetName };
    if (facetQuery) body.facetQuery = facetQuery;
    if (filter) body.filter = filter;

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(body)
    };

    const url = `${instance.host}/indexes/${indexName}/facet-search`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Facet search error:', error);
            throw error;
        });
}

const similarDocuments = (instance: InstanceState, indexName: string, id: string | number, options?: { limit?: number; offset?: number; embedder?: string; attributesToRetrieve?: string[] }) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const body: any = { id, ...options };

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(body)
    };

    const url = `${instance.host}/indexes/${indexName}/similar`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Similar documents error:', error);
            throw error;
        });
}

const chatCompletions = (instance: InstanceState, body: any) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(body)
    };

    const url = `${instance.host}/chat/completions`;

    return fetch(url, requestOptions);
}

export {
    indexSearchWrapper,
    federatedSearch,
    facetSearch,
    similarDocuments,
    chatCompletions
}
