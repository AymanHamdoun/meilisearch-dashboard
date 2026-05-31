// @ts-ignore
import React, { useEffect, useState, useCallback } from "react";
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
import DocumentDetailModal from "./documents/DocumentDetailModal";
import DocIndexingModal from "./documents/DocIndexingModal";

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

    // Edit modal state
    const [editDoc, setEditDoc] = useState<Record<string, any> | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [addDocsOpen, setAddDocsOpen] = useState(false)

    // Facet filter selections
    const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({})

    const handleFacetSelect = useCallback((facetName: string, value: string) => {
        setSelectedFacets(prev => {
            const current = prev[facetName] ?? []
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value]
            return { ...prev, [facetName]: next }
        })
        setOffset(0)
    }, [])

    const clearFacets = useCallback(() => {
        setSelectedFacets({})
        setOffset(0)
    }, [])

    const handleEditDoc = useCallback((doc: Record<string, any>) => {
        setEditDoc(doc)
        setEditModalOpen(true)
    }, [])

    const handleEditClose = useCallback(() => {
        setEditModalOpen(false)
        setEditDoc(null)
    }, [])

    // Build filter string from selected facets + manual filter
    const buildFacetFilter = useCallback((facetSel: Record<string, string[]>): string => {
        const parts = Object.entries(facetSel)
            .filter(([, vals]) => vals.length > 0)
            .map(([attr, vals]) =>
                vals.length === 1
                    ? `${attr} = "${vals[0]}"`
                    : `${attr} IN [${vals.map(v => `"${v}"`).join(', ')}]`
            )
        return parts.join(' AND ')
    }, [])

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
        const facetFilter = buildFacetFilter(selectedFacets)
        const combinedFilter = [filter, facetFilter].filter(Boolean).join(' AND ')
        if (combinedFilter) searchParams.filter = combinedFilter;
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

    }, [debouncedSearchTerm, queryType, index, filter, selectedFacets, sort, matchingStrategy, attributesToSearchOn, limit, offset, showPerformanceDetails, facets])

    // Reset offset + facets when index or query changes
    useEffect(() => {
        setOffset(0)
        setSelectedFacets({})
    }, [index, debouncedSearchTerm, filter, sort, matchingStrategy])

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

        {/* Active facet filter chips */}
        {Object.values(selectedFacets).some(v => v.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-xs text-gray-400">Filtered by:</span>
                {Object.entries(selectedFacets).flatMap(([attr, vals]) =>
                    vals.map(val => (
                        <button
                            key={`${attr}:${val}`}
                            onClick={() => handleFacetSelect(attr, val)}
                            className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20 hover:bg-primary/20"
                        >
                            <span>{attr}: {val}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ))
                )}
                <button onClick={clearFacets} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
                    Clear all
                </button>
            </div>
        )}

        <div className="flex gap-4">
            {(response.facetDistribution && Object.keys(response.facetDistribution).length > 0) && (
                <div className="w-1/3 shrink-0">
                    <FacetDisplay
                        facetDistribution={response.facetDistribution}
                        facetStats={response.facetStats}
                        selectedFacets={selectedFacets}
                        onFacetSelect={handleFacetSelect}
                    />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <SearchHits
                    response={response}
                    onEditDoc={handleEditDoc}
                    onAddDocs={() => setAddDocsOpen(true)}
                />
                <SearchPagination
                    offset={offset}
                    limit={limit}
                    totalHits={response.totalHits}
                    estimatedTotalHits={response.estimatedTotalHits}
                    onOffsetChange={setOffset}
                />
            </div>
        </div>

        <DocumentDetailModal
            isVisible={editModalOpen}
            onClose={handleEditClose}
            document={editDoc}
            indexName={index ?? ""}
        />
        <DocIndexingModal
            isVisible={addDocsOpen}
            onClose={() => setAddDocsOpen(false)}
            indexName={index ?? ""}
        />
    </div>
}

const ArrayValue = ({ value }: { value: any[] }) => {
    const [expanded, setExpanded] = useState(false)
    return (
        <span>
            <button
                onClick={() => setExpanded(v => !v)}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary border border-gray-200 rounded px-1 py-0.5 mr-1"
            >
                <svg className={`w-2.5 h-2.5 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                {value.length}
            </button>
            {expanded ? (
                <span className="flex flex-col gap-0.5 mt-1">
                    {value.map((item, idx) => (
                        <span key={idx} className="block text-gray-500 pl-2 border-l-2 border-gray-200">
                            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                        </span>
                    ))}
                </span>
            ) : (
                <span className="text-gray-400 text-xs">[{value.map(v => typeof v === 'object' ? '{…}' : String(v)).join(', ')}]</span>
            )}
        </span>
    )
}

const renderValue = (val: any) => {
    if (Array.isArray(val)) return <ArrayValue value={val} />
    if (typeof val === 'string') return <span>{parse(val)}</span>
    if (typeof val === 'object' && val !== null) return <span className="text-gray-400 text-xs">{JSON.stringify(val)}</span>
    return <span>{String(val)}</span>
}

export const SearchHits = ({ response, onEditDoc, onAddDocs }: { response: any; onEditDoc?: (doc: Record<string, any>) => void; onAddDocs?: () => void }) => {
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

                {onEditDoc && (
                    <button
                        onClick={() => onEditDoc(hit)}
                        title="Edit document"
                        className="absolute top-3 right-3 p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                        </svg>
                    </button>
                )}

                {Object.keys(printableObj).map((key, j) => {
                    if (key.startsWith("_")) {
                        return null
                    }

                    return <div key={j} className="search-result-hit-detail md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-semibold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0 text-gray-500">
                            {renderValue(printableObj[key])}
                        </div>
                    </div>
                })}

                <RankingInfoBar hit={hit} />
            </div>
        })}
        {hits.length === 0 && processingTime !== undefined && (
            <div className="flex flex-col items-center justify-center min-h-64 gap-4 py-16">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-center">
                    <p className="text-gray-500 font-medium">No documents found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different query, or add records to this index</p>
                </div>
                {onAddDocs && (
                    <button
                        onClick={onAddDocs}
                        className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
                    >
                        + Add documents
                    </button>
                )}
            </div>
        )}
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
