import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"

export const SearchableAttrs = ({ settings }) => {

    return <div>
        <Header/>
        <DynamicTextBoxes
            buttonText="+ Add a Searchable Attribute"
            initialTextboxValues={settings.searchableAttributes}
        />
    </div>
}

const Header = () => {
    return <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-row gap-3 items-center">
            <h3 className="font-medium text-xl text-gray-800">Searchable attributes</h3>
            <span className="bg-primary-midfaint rounded-2xl border border-gray-300 px-5 text-gray-700">searchableAttributes</span>
        </div>
        <p className="text-gray-700">The complete list of attributes that will be used for searching. Default value: ['*']</p>
    </div>
}