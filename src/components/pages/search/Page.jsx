import React, { useEffect, useState } from "react";
import { basicSearch } from "../../../services/meilisearch/search"
import useDebouncedValue from "../../../hooks/useDebounce"
import Navbar from "../../Navbar"
import useMeiliMeiliIndex from "../../../hooks/useMeiliIndex";

const Page = () => {
    return <div className="bg-content p-4 sm:ml-64">
        <Navbar />
        <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
            <IndexStats />
            <SearchWidget />
        </div>
    </div>
}


const IndexStats = () => {
    return <div className="mb-8">
        <h3 className="text-3xl font-semibold mb-3">Index</h3>
        <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
                <div className="text-gray-500"># records</div>
                <div className="text-black font-semibold">3.2M</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="text-gray-500">index size</div>
                <div className="text-black font-semibold">2.3 GB</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="text-gray-500">data size</div>
                <div className="text-black font-semibold">1.5 GB</div>
            </div>
        </div>
    </div>
}
const SearchWidget = () => {
    const [query, setQuery] = useState("")
    const index = "cars_lb"
    const [hits, setHits] = useState([])

    const debouncedSearchTerm = useDebouncedValue(query, 100);


    useEffect(() => {
        if (debouncedSearchTerm.length == 0) {
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
        {hits.map((hit) => {
            return <div className="bg-white mb-10 border border-gray-200 rounded p-4 shadow-lg">
                {Object.keys(hit).map((key) => {
                    return <div className="md:flex sm:flex md:flex-row sm:flex-col p-1 w-full">
                        <div className="md:w-1/3 md:text-right md:pr-2 sm:w-full sm:pr-0 font-bold">{key}</div>
                        <div className="md:w-2/3 md:text-left md:pl-2 sm:w-full sm:pl-0">{hit[key]}</div>
                    </div>
                })}
            </div>
        })}
    </div>
}

export default Page;