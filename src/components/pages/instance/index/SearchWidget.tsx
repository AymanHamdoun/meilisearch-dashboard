import React, { useEffect, useState } from "react";

import { indexSearchWrapper } from "../../../../services/meilisearch/search"
import useDebouncedValue from "../../../../hooks/useDebounce"
import useMeiliIndex from "../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import {QueryType} from "../../../../services/meilisearch/types"

const SearchWidget = () => {
    const { meiliIndexState } = useMeiliIndex()
    const { instanceState } = useMeiliInstance()

    const index = meiliIndexState.selectedIndex
    
    const [query, setQuery] = useState("")
    const [queryType, setQueryType] = useState<QueryType>(QueryType.ByQuery)

    const [hits, setHits] = useState([])

    const debouncedSearchTerm = useDebouncedValue(query, 100);


    useEffect(() => {
        if (debouncedSearchTerm.length == 0) {
            setHits([])
            return
        }

        indexSearchWrapper({
            instanceKey: instanceState.key, 
            indexName: index, 
            query: debouncedSearchTerm,
            queryType: queryType
        }).then(resp => {
            if (resp == undefined) {
                return
            }
            setHits(resp.hits)
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
                    setQuery(newQuery.trim().toLowerCase())
                }}
            />
        </div>
        <SearchHits hits={hits} />
    </div>
}


const SearchHits = ({ hits }) => {
    return <div className="flex flex-col mb-6">
        {hits.map((hit, i) => {
            return <div key={i} className="bg-white mb-10 border border-gray-200 rounded p-4 shadow-lg relative">
                <span className="absolute top-4 left-4 text-sm rounded-3xl bg-faint-primary font-semibold px-1.5 py-0 border border-gray-300 text-gray-400">{i+1}</span>

                {Object.keys(hit).map((key, j) => {
                    return <div key={j} className="md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-semibold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0 text-gray-500">{hit[key]}</div>
                    </div>
                })}
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