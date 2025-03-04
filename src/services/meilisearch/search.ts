import { string } from "prop-types"
import { QueryType } from "./types"
import { InstanceState } from "../../contexts/InstanceContext"

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

    const queryParams = new URLSearchParams({
        showRankingScoreDetails: "true",
        showRankingScore: "true",
        attributesToHighlight: "*",
        showMatchesPosition: "true"
    })

    const url = `${options.instance.host}/multi-search?${queryParams.toString()}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
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


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
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


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    indexSearchWrapper,
    federatedSearch
}