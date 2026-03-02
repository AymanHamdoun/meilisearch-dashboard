// @ts-ignore
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { indexSearchWrapper, SearchParams } from "../../../../services/meilisearch/search"
import useDebouncedValue from "../../../../hooks/useDebounce"
import useMeiliIndex from "../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { QueryType } from "../../../../services/meilisearch/types"
import parse from 'html-react-parser';

import SearchFilters from "./search/SearchFilters";
import SearchSortSelector from "./search/SearchSortSelector";
import SearchOptions from "./search/SearchOptions";
import FacetDisplay from "./search/FacetDisplay";
import SearchPagination from "./search/SearchPagination";

const SearchWidget = () => {
    const { meiliIndexState, refreshIndexes } = useMeiliIndex()
    const { instanceState } = useMeiliInstance()
    const navigate = useNavigate()

    const index = meiliIndexState.selectedIndex

    const [query, setQuery] = useState("")
    const [queryType, setQueryType] = useState<QueryType>(QueryType.ByQuery)

    // Search params state
    const [filter, setFilter] = useState("")
    const [sort, setSort] = useState<string[]>([])
    const [facets, setFacets] = useState<string[]>([])
    const [matchingStrategy, setMatchingStrategy] = useState("last")
    const [attributesToSearchOn, setAttributesToSearchOn] = useState<string[]>([])
    const [limit, setLimit] = useState(20)
    const [offset, setOffset] = useState(0)
    const [showPerformanceDetails, setShowPerformanceDetails] = useState(false)

    // Index settings for attribute lists
    const [filterableAttributes, setFilterableAttributes] = useState<string[]>([])
    const [sortableAttributes, setSortableAttributes] = useState<string[]>([])

    const [response, setResponse] = useState<any>({hits: []})
    const [showAdvanced, setShowAdvanced] = useState(false)

    const debouncedSearchTerm = useDebouncedValue(query, 100);

    // Load index settings for filterable/sortable attributes
    useEffect(() => {
        if (!instanceState.isLoaded || !index) return;
        import("../../../../services/meilisearch/settings").then(({ getIndexSettings }) => {
            getIndexSettings({ host: instanceState.host, instanceKey: instanceState.key, indexName: index })
                .then((settings: any) => {
                    setFilterableAttributes(settings.filterableAttributes || [])
                    setSortableAttributes(settings.sortableAttributes || [])
                })
                .catch(() => {})
        })
    }, [instanceState, index])

    useEffect(() => {
        const searchParams: Partial<SearchParams> = {};
        if (filter) searchParams.filter = filter;
        if (sort.length > 0) searchParams.sort = sort;
        if (facets.length > 0) searchParams.facets = facets;
        if (matchingStrategy !== "last") searchParams.matchingStrategy = matchingStrategy;
        if (attributesToSearchOn.length > 0) searchParams.attributesToSearchOn = attributesToSearchOn;
        if (limit !== 20) searchParams.limit = limit;
        if (offset > 0) searchParams.offset = offset;
        if (showPerformanceDetails) searchParams.showPerformanceDetails = true;

        // Also request facets for filterable attributes
        if (filterableAttributes.length > 0 && facets.length === 0) {
            searchParams.facets = filterableAttributes;
        }

        indexSearchWrapper({
            instance: instanceState,
            indexName: index,
            query: debouncedSearchTerm,
            queryType: queryType,
            searchParams
        }).then(resp => {
            if (resp == undefined) return
            setResponse(resp)
        }).catch(async error => {
            console.error('Search error:', error);
            if (error.code === 'index_not_found') {
                await refreshIndexes();
                setResponse({hits: []});
                return;
            }
            if (error.errorType) {
                navigate('/instance/error', { state: { error } });
            }
        })

    }, [debouncedSearchTerm, queryType, index, filter, sort, matchingStrategy, attributesToSearchOn, limit, offset, showPerformanceDetails, facets])

    // Reset offset when query changes
    useEffect(() => {
        setOffset(0)
    }, [debouncedSearchTerm, filter, sort, matchingStrategy])

    return <div className="">
        <div className="mb-4 flex flex-row">
            <select name="search_type"
                className="text-gray-700 text-sm stl-select-input border border-gray-400 rounded-sm rounded-r-none text-center pl-4 pr-14 appearance-none"
                onChange={(e) => {
                    setQueryType(e.target.value as QueryType)
                }}
            >
                <option value={QueryType.ByQuery}>Search</option>
                <option value={QueryType.ByObjectID}>Object ID</option>
            </select>

            <input type="text"
                className="bg-white border rounded p-3 border-gray-400 block w-full rounded-l-none border-l-0"
                placeholder="What are you looking for ?" required
                onChange={(e) => {
                    let newQuery = e.target.value
                    setQuery(newQuery.trim())
                }}
            />
        </div>

        {queryType === QueryType.ByQuery && (
            <>
                <div className="mb-4">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
                    >
                        <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {showAdvanced ? 'Hide' : 'Show'} Search Options
                    </button>
                </div>

                {showAdvanced && (
                    <div className="mb-6 flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        {filterableAttributes.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Filters</h4>
                                <SearchFilters
                                    filterableAttributes={filterableAttributes}
                                    onFilterChange={setFilter}
                                    currentFilter={filter}
                                />
                            </div>
                        )}
                        {sortableAttributes.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Sort</h4>
                                <SearchSortSelector
                                    sortableAttributes={sortableAttributes}
                                    sort={sort}
                                    onSortChange={setSort}
                                />
                            </div>
                        )}
                        <SearchOptions
                            matchingStrategy={matchingStrategy}
                            onMatchingStrategyChange={setMatchingStrategy}
                            attributesToSearchOn={attributesToSearchOn}
                            onAttributesToSearchOnChange={setAttributesToSearchOn}
                            limit={limit}
                            onLimitChange={setLimit}
                            showPerformanceDetails={showPerformanceDetails}
                            onShowPerformanceDetailsChange={setShowPerformanceDetails}
                        />
                    </div>
                )}
            </>
        )}

        {/* Facet Display */}
        <FacetDisplay
            facetDistribution={response.facetDistribution}
            facetStats={response.facetStats}
        />

        <SearchHits response={response} />

        <SearchPagination
            offset={offset}
            limit={limit}
            totalHits={response.totalHits}
            estimatedTotalHits={response.estimatedTotalHits}
            onOffsetChange={setOffset}
        />
    </div>
}

export const SearchHits = ({ response }: { response: any }) => {
    const hits = response.hits;
    const processingTime = response.processingTimeMs;
    const totalHits = response.totalHits !== undefined ? response.totalHits : 0;
    const estimatedHits = response.estimatedTotalHits !== undefined ? response.estimatedTotalHits : 0;

    let hitCountMsg: any = totalHits;
    if (totalHits === 0 && estimatedHits > 0) {
        hitCountMsg = `estimated ${estimatedHits}`
    }

    return <div className="flex flex-col mb-6">
        {processingTime !== undefined ?
            <div className="text-center text-gray-400 px-3 mb-2">
                <span className="text-primary">{hitCountMsg} hits</span> matched in <span className="text-primary">{processingTime}ms</span>
            </div> : ""}

        {hits.map((hit: any, i: number) => {
            let printableObj = hit;
            if (typeof printableObj["_formatted"] == "object") {
                printableObj = printableObj["_formatted"]
            }

            return <div key={i} className="bg-white mb-10 border border-gray-200 rounded p-4 shadow-lg relative">
                <span className="absolute top-4 left-4 text-sm rounded-3xl bg-primary-faint font-semibold px-1.5 py-0 border border-gray-300 text-gray-400">{i + 1}</span>

                {Object.keys(printableObj).map((key, j) => {
                    if (key.startsWith("_")) {
                        return null
                    }

                    return <div key={j} className="search-result-hit-detail md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-semibold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0 text-gray-500">
                            {typeof printableObj[key] == 'string' ? parse(printableObj[key]) : typeof printableObj[key] === 'object' ? JSON.stringify(printableObj[key]) : String(printableObj[key])}
                        </div>
                    </div>
                })}

                <RankingInfoBar hit={hit} />
            </div>
        })}
        {hits.length === 0 && processingTime !== undefined ?
            <div className="flex items-center justify-center min-h-96 text-gray-500">
                No documents found
            </div>
            : <></>}
    </div>
}

export default SearchWidget;


const RankingInfoBar = ({ hit }: { hit: any }) => {
    if (typeof hit["_rankingScoreDetails"] !== 'object') {
        return <></>
    }

    return <div className="bg-gray-50 text-gray-400 mt-3 flex flex-col md:flex-row gap-3 p-3 rounded justify-evenly">
        <div>Ranking Score: {hit["_rankingScore"].toFixed(2)}</div>
        {
            hit["_rankingScoreDetails"]["words"] ?
                <div>Words: {hit["_rankingScoreDetails"]["words"]["matchingWords"]}</div>
                :
                <></>
        }
        {
            hit["_rankingScoreDetails"]["exactness"] ?
                <div>Exact: {hit["_rankingScoreDetails"]["exactness"]["matchType"]} : {hit["_rankingScoreDetails"]["exactness"]["score"].toFixed(2)}</div>
                :
                <></>
        }
        {
            hit["_rankingScoreDetails"]["typo"] ?
                <div>Typos: {hit["_rankingScoreDetails"]["typo"]["typoCount"]}</div>
                :
                <></>
        }
        {
            hit["_rankingScoreDetails"]["proximity"] ?
                <div>Proximity: {hit["_rankingScoreDetails"]["proximity"]["score"]}</div>
                :
                <></>
        }
        {
            hit["_rankingScoreDetails"]["attribute"] ?
                <div>Attribute: {hit["_rankingScoreDetails"]["attribute"]["attributeRankingOrderScore"]}</div>
                :
                <></>
        }
    </div>
}
