// @ts-ignore
import React, { useEffect, useState } from "react";

import { indexSearchWrapper } from "../../../../services/meilisearch/search"
import useDebouncedValue from "../../../../hooks/useDebounce"
import useMeiliIndex from "../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { QueryType } from "../../../../services/meilisearch/types"
import parse from 'html-react-parser';

const SearchWidget = () => {
    const { meiliIndexState } = useMeiliIndex()
    const { instanceState } = useMeiliInstance()

    const index = meiliIndexState.selectedIndex

    const [query, setQuery] = useState("")
    const [queryType, setQueryType] = useState<QueryType>(QueryType.ByQuery)

    const [response, setResponse] = useState({hits: []})

    const debouncedSearchTerm = useDebouncedValue(query, 100);


    useEffect(() => {
        if (debouncedSearchTerm.length == 0) {
            setResponse({hits: []})
            return
        }

        indexSearchWrapper({
            instance: instanceState,
            indexName: index,
            query: debouncedSearchTerm,
            queryType: queryType
        }).then(resp => {
            if (resp == undefined) {
                return
            }
            setResponse(resp)
        })

    }, [debouncedSearchTerm, queryType])


    return <div className="">
        <div className="mb-6 flex flex-row">
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
        <SearchHits response={response} />
    </div>
}

const SearchHits = ({ response }) => {
    const hits = response.hits;
    const processingTime = response.processingTimeMs;
    const totalHits = response.totalHits !== undefined ? response.totalHits : 0; 
    const estimatedHits = response.estimatedTotalHits !== undefined ? response.estimatedTotalHits : 0; 

    let hitCountMsg = totalHits;
    if (totalHits === 0 && estimatedHits > 0) {
        hitCountMsg = `estimated ${estimatedHits}`
    }

    console.log(response)
    return <div className="flex flex-col mb-6">
        {processingTime !== undefined ?
            <div className="text-center text-gray-400 px-3 mb-2">
                <span className="text-primary">{hitCountMsg} hits</span> matched in <span className="text-primary">{processingTime}ms</span>
            </div> : ""}

        {hits.map((hit, i) => {
            let printableObj = hit;
            if (typeof printableObj["_formatted"] == "object") {
                printableObj = printableObj["_formatted"]
            }

            return <div key={i} className="bg-white mb-10 border border-gray-200 rounded p-4 shadow-lg relative">
                <span className="absolute top-4 left-4 text-sm rounded-3xl bg-primary-faint font-semibold px-1.5 py-0 border border-gray-300 text-gray-400">{i + 1}</span>

                {Object.keys(printableObj).map((key, j) => {
                    if (key.startsWith("_")) {
                        return
                    }

                    return <div key={j} className="search-result-hit-detail md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-semibold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0 text-gray-500">
                            {typeof printableObj[key] == 'string' ? parse(printableObj[key]) : printableObj[key]}
                        </div>
                    </div>
                })}

                <RankingInfoBar hit={hit} />
            </div>
        })}
        {hits.length === 0 ?
            <div className="flex items-center justify-center min-h-96">
                No Hits
            </div>
            : <></>}
    </div>
}

export default SearchWidget;


const RankingInfoBar = ({ hit }) => {
    if (typeof hit["_rankingScoreDetails"] !== 'object') {
        return <></>
    }


    return <div className="bg-gray-50 text-gray-400 mt-3 flex flex-col md:flex-row gap-3 p-3 rounded justify-evenly">
        <div>Ranking Score: {hit["_rankingScore"].toFixed(2)}</div>
        {
            hit["_rankingScoreDetails"]["words"] ?
                <div>Typos: {hit["_rankingScoreDetails"]["words"]["matchingWords"]}</div>
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