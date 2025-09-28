import React, { useEffect, useState } from "react";

import IndexManager from "./IndexManager";
import IndexTabs from "./IndexTabs";
import { getIndexStats } from "../../../../services/meilisearch/indexes.ts";

import useIndex from '../../../../hooks/useMeiliIndex'
import useMeiliInstance from "../../../../hooks/useMeiliInstance";

const Page = () => {
    return <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
        <IndexStats />
        <IndexManager/>
        <IndexTabs/>
    </div>
}


const IndexStats = () => {
    const { meiliIndexState, refreshIndexes } = useIndex()
    const {instanceState} = useMeiliInstance()

    const [stats, setStats] = useState({})

    useEffect(() => {
        if (!instanceState.isLoaded || meiliIndexState.selectedIndex === "") {
            return
        }
        getIndexStats(instanceState.host, instanceState.key, meiliIndexState.selectedIndex)
            .then((stats) => {
                setStats(stats)
            })
            .catch(async (error) => {
                // If the index was not found, refresh the index list
                // The reducer will automatically select a new index if available
                if (error.code === 'index_not_found') {
                    console.log(`Index '${meiliIndexState.selectedIndex}' not found, refreshing index list...`);
                    await refreshIndexes();
                    // Clear the stats since the index doesn't exist
                    setStats({});
                } else {
                    // For other errors, log them but don't crash
                    console.error('Error fetching index stats:', error);
                }
            })
    }, [instanceState, meiliIndexState.selectedIndex])


    return <div className="mb-8">
        <h3 className="text-3xl font-semibold mb-3">Index</h3>
        <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
                <div className="text-gray-500 font-semibold"># records</div>
                <div className="text-gray-500 font-semibold">{stats.numberOfDocuments !== undefined ? stats.numberOfDocuments.toLocaleString() : '-'}</div>
            </div>
        </div>
    </div>
}

export default Page;