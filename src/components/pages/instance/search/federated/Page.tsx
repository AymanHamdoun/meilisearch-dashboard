import {useEffect, useState} from "react";
import {federatedSearch} from "../../../../../services/meilisearch/search";
import useIndex from "../../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";

const Page = () => {
    const [query, setQuery] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [searchResponse, setSearchResponse] = useState({})
    const {meiliIndexState} = useIndex();
    const {instanceState} = useMeiliInstance()

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
                    federationOptions: {weight: 1.0}
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
        <div className="mb-6 flex flex-row gap-3 align-items-center">
            {meiliIndexState.availableIndexes.map((index, key) => (
                <div
                    className={"flex flex-row gap-1"}
                    key={key}
                >
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
            ))}
        </div>

        <div>
            <SearchResults response={searchResponse}/>
        </div>
    </div>
}


const SearchResults = ({response}) => {
    return <div>
        <pre>
            {JSON.stringify(response, null, 2)}
        </pre>
    </div>
}

export default Page;
