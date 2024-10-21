import React, { useEffect } from "react"
import { initFlowbite } from 'flowbite';
import { SearchableAttrs } from "./settings/SearchableAttrs";
import TypoTolerance from "./settings/TypoTolerance";

import { IndexSettingsProvider } from "../../../../contexts/IndexSettingsContext"


const tabs = [
    {
        key: "searchable-attrs",
        label: "Searchable Attributes",
        element: <SearchableAttrs />
    },
    {
        key: "ranking",
        label: "Ranking and Sorting",
        element: <div>Ranking & Sorting ... to be done</div>
    },
    {
        key: "typos",
        label: "Typo Tolerance",
        element: <TypoTolerance />
    },
    {
        key: "synonyms",
        label: "Synonyms",
        element: <div>Synonyms ... to be done</div>
    },
]

const tabsID = "meili-index-settings-tabs"
const tabsContentID = `#${tabsID}-content`

const IndexSettingsTabs = () => {
    useEffect(() => {
        initFlowbite();
    }, []);

    return <IndexSettingsProvider>
        <div className="md:flex bg-white rounded-md border-2 border-gray-100 shadow-sm w-full">
            <ul className="flex-column text-sm font-medium text-gray-500 dark:text-gray-400 md:w-1/3 sm:w-full border-r border-r-gray-100"
                id={tabsID}
                data-tabs-toggle={tabsContentID}
                data-tabs-active-classes="text-primary border-l-2 border-b-0 hover:text-primary border-primary bg-gray-50"
                data-tabs-inactive-classes="text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300"
                role="tablist">
                {tabs.map((tab, i) => {
                    return <li key={i} className="w-full" role="presentation">
                        <button className="w-full text-left inline-block py-4 px-4 hover:text-primary hover:bg-gray-50 hover:border-l-2 hover:border-l-primary"
                            id={`${tabsID}-${tab.key}-tab`}
                            data-tabs-target={`#${tabsID}-${tab.key}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.key}
                            aria-selected="false">
                            {tab.label}
                        </button>
                    </li>
                })}
            </ul>
            <div id={tabsContentID} className="md:w-2/3">
                {tabs.map((settingTab, i) => {
                    return <div className="p-4 w-full h-full"
                        key={i}
                        id={`${tabsID}-${settingTab.key}`}
                        role="tabpanel"
                        aria-labelledby={settingTab.key}>
                        {React.cloneElement(settingTab.element, {key: i})}
                    </div>
                })}
            </div>
        </div>
    </IndexSettingsProvider>
}

export default IndexSettingsTabs;