import React, { useEffect } from "react";
import SearchWidget from './SearchWidget'
import IndexSettingsTabs from './IndexSettingsTabs'
import { initFlowbite } from 'flowbite';

const tabs = [
    {
        key: "search",
        label: "Browse",
        element: <SearchWidget />
    },
    {
        key: "settings",
        label: "Configuration",
        element: <IndexSettingsTabs />
    },
];

const tabsID = "meili-index-tabs"
const tabsContentID = `#${tabsID}-content`

const IndexTabs = () => {

    useEffect(() => {
        initFlowbite();
    }, []);

    return <div>
        <div className="mb-8 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id={tabsID}
                data-tabs-toggle={tabsContentID}
                data-tabs-active-classes="text-primary border-b-2 hover:text-primary border-primary"
                data-tabs-inactive-classes="text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300"
                role="tablist">
                {tabs.map((tab) => {
                    return <li className="me-2" role="presentation">
                        <button className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-b-2 hover:border-gray-300"
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
        </div>
        <div id={tabsContentID}>
            {tabs.map((tab) => {
                return <div className="rounded-lg"
                    id={`${tabsID}-${tab.key}`}
                    role="tabpanel"
                    aria-labelledby={tab.key}>
                    {tab.element}
                </div>
            })}
        </div>
    </div>
}

export default IndexTabs;