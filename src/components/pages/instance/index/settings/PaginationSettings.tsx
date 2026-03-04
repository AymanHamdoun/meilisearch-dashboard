// @ts-ignore
import React, { useEffect, useState } from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const PaginationSettings = () => {
    const { settings, dispatch } = useIndexSettings()
    const [pagination, setPagination] = useState(settings.pagination)

    useEffect(() => {
        setPagination(settings.pagination)
    }, [settings.pagination])

    const updatePagination = (newPagination: typeof pagination) => {
        setPagination(newPagination);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { pagination: newPagination }
        });
    }

    return <div>
        <DocHeader
            title={"Pagination"}
            badge={"pagination"}
            description={"Maximum number of documents a search query can return. Default value: 1000"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#pagination"}
        />
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">maxTotalHits</label>
            <input
                type="number"
                value={pagination.maxTotalHits}
                onChange={(e) => {
                    updatePagination({
                        ...pagination,
                        maxTotalHits: parseInt(e.target.value) || 0
                    })
                }}
                min={0}
                className="w-full p-2 border border-gray-300"
            />
        </div>
    </div>
}

export default PaginationSettings
