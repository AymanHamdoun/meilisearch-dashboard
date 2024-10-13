import React from "react"

export const SearchableAttrs = ({settings}) => {
    return <div>
        {JSON.stringify(settings.searchableAttributes)}
    </div>
}