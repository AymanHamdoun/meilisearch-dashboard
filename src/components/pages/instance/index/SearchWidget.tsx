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

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i
const isImageUrl = (s: string) => (s.startsWith('http://') || s.startsWith('https://')) && IMAGE_EXT.test(s)

const TruncatedString = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false)
    const parsed = parse(text)
    if (text.length <= 200) return <span>{parsed}</span>
    return (
        <span>
            {expanded ? parsed : <>{parse(text.slice(0, 200))}<span className="text-gray-300">…</span></>}
            <button
                onClick={() => setExpanded(v => !v)}
                className="ml-1 text-xs text-primary hover:underline"
            >
                {expanded ? 'less' : 'more'}
            </button>
        </span>
    )
}

const CollapsedObject = ({ obj }: { obj: Record<string, any> }) => {
    const [expanded, setExpanded] = useState(false)
    const keys = Object.keys(obj)
    return (
        <span>
            <button
                onClick={() => setExpanded(v => !v)}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary border border-gray-200 rounded px-1.5 py-0.5 mr-1"
            >
                <svg className={`w-2.5 h-2.5 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                {`{${keys.length} key${keys.length !== 1 ? 's' : ''}}`}
            </button>
            {expanded && (
                <span className="flex flex-col gap-0.5 mt-1">
                    {keys.map(k => (
                        <span key={k} className="block text-xs pl-2 border-l-2 border-gray-200">
                            <span className="text-gray-500 font-medium">{k}:</span>{' '}
                            <span className="text-gray-400">{typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : String(obj[k])}</span>
                        </span>
                    ))}
                </span>
            )}
        </span>
    )
}

const renderValue = (val: any) => {
    if (Array.isArray(val)) return <ArrayValue value={val} />
    if (typeof val === 'string') {
        if (isImageUrl(val)) return (
            <span className="flex items-center gap-2">
                <img
                    src={val}
                    alt=""
                    className="w-10 h-10 object-cover rounded border border-gray-100 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <TruncatedString text={val} />
            </span>
        )
        return <TruncatedString text={val} />
    }
    if (typeof val === 'object' && val !== null) return <CollapsedObject obj={val} />
    return <span>{String(val)}</span>
}

const HitCard = ({ index, hit, printableObj, primaryKey, restKeys, onEditDoc }: {
    index: number
    hit: any
    printableObj: any
    primaryKey: string | undefined
    restKeys: string[]
    onEditDoc?: (doc: Record<string, any>) => void
}) => {
    const [showScores, setShowScores] = useState(false)
    const hasScores = typeof hit["_rankingScoreDetails"] === 'object'

    return (
        <div className="bg-white mb-6 border border-gray-200 rounded p-4 shadow-sm relative">
            <span className="absolute top-4 left-4 text-sm rounded-3xl bg-primary-faint font-semibold px-1.5 py-0 border border-gray-300 text-gray-400">{index + 1}</span>

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

            {/* Primary field — promoted */}
            {primaryKey && (
                <div className="pl-8 pr-8 mb-3 pb-3 border-b border-gray-100">
                    <span className="text-xs text-gray-400 mr-1">{primaryKey}</span>
                    <span className="font-semibold text-gray-800 text-sm">{renderValue(printableObj[primaryKey])}</span>
                </div>
            )}

            {/* Remaining fields */}
            {restKeys.map((key) => (
                <div key={key} className="search-result-hit-detail md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                    <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-semibold text-sm">{key}</div>
                    <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0 text-gray-500 text-sm">
                        {renderValue(printableObj[key])}
                    </div>
                </div>
            ))}

            {/* Collapsible ranking scores */}
            {hasScores && (
                <div className="mt-3">
                    <button
                        onClick={() => setShowScores(v => !v)}
                        className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"
                    >
                        <svg className={`w-3 h-3 transition-transform ${showScores ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        Ranking scores
                    </button>
                    {showScores && <RankingInfoBar hit={hit} />}
                </div>
            )}
        </div>
    )
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

            const visibleKeys = Object.keys(printableObj).filter(k => !k.startsWith("_"))
            const primaryKey = visibleKeys[0]
            const restKeys = visibleKeys.slice(1)

            return <HitCard
                key={i}
                index={i}
                hit={hit}
                printableObj={printableObj}
                primaryKey={primaryKey}
                restKeys={restKeys}
                onEditDoc={onEditDoc}
            />
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
