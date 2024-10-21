import React, { useEffect, useState } from "react";

import IndexTabs from "./IndexTabs";
import { getIndexStats } from "../../../../services/meilisearch/indexes";

import useIndex from '../../../../hooks/useMeiliIndex'
import useMeiliInstance from "../../../../hooks/useMeiliInstance";

const Page = () => {
    return <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
        <IndexStats />
        <IndexTabs/>
    </div>
}


const IndexStats = () => {
    const { meiliIndexState } = useIndex()
    const {instanceState} = useMeiliInstance()

    const [stats, setStats] = useState({})

    useEffect(() => {
        if (!instanceState.isSet) {
            return
        }
        getIndexStats(instanceState.host, instanceState.key, meiliIndexState.selectedIndex).then((stats) => {
            setStats(stats)
        })
    }, [instanceState])


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