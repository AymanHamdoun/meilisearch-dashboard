import React, { useEffect, useState } from "react";

import { basicSearch } from "../../../services/meilisearch/search"
import useDebouncedValue from "../../../hooks/useDebounce"
import useMeiliIndex from "../../../hooks/useMeiliIndex"

const SearchWidget = () => {
    const { meiliIndexState } = useMeiliIndex()
    const index = meiliIndexState.selectedIndex
    
    const [query, setQuery] = useState("")
    const [hits, setHits] = useState([])

    const debouncedSearchTerm = useDebouncedValue(query, 100);


    useEffect(() => {
        if (debouncedSearchTerm.length == 0) {
            setHits([])
            return
        }

        basicSearch(index, debouncedSearchTerm).then(resp => {
            if (resp == undefined) {
                return
            }
            setHits(resp.hits)
        })

    }, [debouncedSearchTerm])


    return <div className="">
        <div className="mb-6">
            <input type="text"
                className="bg-white border rounded p-3 border-gray-400 block w-full"
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
            return <div key={i} className="bg-white mb-10 border border-gray-200 rounded p-4 shadow-lg">
                {Object.keys(hit).map((key, j) => {
                    return <div key={j} className="md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-bold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0">{hit[key]}</div>
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