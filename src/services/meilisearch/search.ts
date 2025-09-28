import { string } from "prop-types"
import { QueryType } from "./types"
import { InstanceState } from "../../contexts/InstanceContext"
import { fetchWithTimeout } from "./fetchWithTimeout"

type SearchWrapperOptions = {
    instance: InstanceState,
    queryType: QueryType,
    query: string,
    indexName: string
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
                // Check for index not found error
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

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const queryParams = new URLSearchParams({
        q: options.query,
        showRankingScoreDetails: "true",
        showRankingScore: "true",
        attributesToHighlight: "*",
        showMatchesPosition: "true"
    })

    const url = `${options.instance.host}/indexes/${options.indexName}/search?${queryParams.toString()}`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                // Check for index not found error
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
                // Check for index not found or document not found
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

export {
    indexSearchWrapper,
    federatedSearch
}