import {useEffect, useState} from "react";
import {federatedSearch} from "../../../../../services/meilisearch/search";
import useIndex from "../../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";
import {SearchHits} from "../../index/SearchWidget";

const defaultIndexOptions = {
    attributesToRetrieve: ["*"],
    weight: 1.0
}

const Page = () => {
    const [query, setQuery] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [indexOptions, setIndexOptions] = useState({})
    const [searchResponse, setSearchResponse] = useState({hits: []})
    const {meiliIndexState} = useIndex();
    const {instanceState} = useMeiliInstance()

    const opts = (indexName: string) => {
        if (indexOptions[indexName] === undefined) {
            return defaultIndexOptions;
        }

        return indexOptions[indexName]
    }

    const toggleIndexCheckBox = (indexName: string, isChecked: boolean) => {
        let newSelectedIndices = selectedIndices
        if (!isChecked) {
            newSelectedIndices = newSelectedIndices.filter((selectedIndexName) => {
                return selectedIndexName != indexName
            })
        } else {
            newSelectedIndices.push(indexName)
        }

        setSelectedIndices([
            ...newSelectedIndices,
        ])
    }

    useEffect(() => {
        federatedSearch({
            instance: instanceState,
            queries: selectedIndices.map((selectedIndex) => {
                return {
                    indexUid: selectedIndex,
                    q: query,
                    federationOptions: {weight: opts(selectedIndex).weight},
                    attributesToRetrieve: opts(selectedIndex).attributesToRetrieve,
                    showRankingScoreDetails: true,
                    showRankingScore: true,
                    attributesToHighlight: ["*"],
                    showMatchesPosition: true
                }
            }),
            federation: {
                offset: 0,
                limit: 50
            }
        }).then(r => {
            setSearchResponse(r)
        })
    }, [query]);

    return <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
        <div className="mb-1 flex flex-row">
            <input type="text"
                   className="bg-white border rounded p-3 border-gray-400 block w-full rounded-l-none"
                   placeholder="What are you looking for ?"
                   required={true}
                   value={query}
                   onChange={(e) => {
                       let newQuery = e.target.value
                       setQuery(newQuery.trim())
                   }}
            />
        </div>
        <div className={"flex flex-row"}>
            <div className="w-1/4 mb-6 flex flex-col gap-3 align-items-center py-3 ">
                {meiliIndexState.availableIndexes.map((index: string, key: number) => {
                    return <div
                        className={"flex flex-col gap-1 bg-white shadow p-1"}
                        key={key}
                    >
                        <div className={"flex flex-row gap-1"}>
                            <input type="checkbox"
                                   className={"p-1"}
                                   value={index}
                                   onChange={(e) => {
                                       toggleIndexCheckBox(index, e.target.checked)
                                   }}
                                   checked={selectedIndices.includes(index)}
                            />
                            <label className={"p-1"}>
                                {index}
                            </label>
                        </div>
                        <input
                            className={"p-2 border border-gray-200"}
                            type="number"
                            name={"weight_" + index}
                            placeholder={"Weight (Default 1.0)"}
                            defaultValue={opts(index).weight}
                            onChange={(e) => {
                                setIndexOptions({
                                    ...indexOptions,
                                    [index]: {
                                        ...opts(index),
                                        weight: parseFloat(e.target.value)
                                    }
                                })
                            }}
                        />
                    </div>
                })}
            </div>
            <div className={"w-3/4 p-4"}>
                <SearchHits response={searchResponse}/>
            </div>
        </div>
    </div>
}

export default Page;
