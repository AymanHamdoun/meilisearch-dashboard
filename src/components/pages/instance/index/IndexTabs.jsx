import React, { useEffect } from "react";
import SearchWidget from './SearchWidget.tsx'
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
        <div className="flex flex-col md:flex-row justify-end px-3">
            <ManageIndexDropdown/>
        </div>
        <div className="mb-8 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id={tabsID}
                data-tabs-toggle={tabsContentID}
                data-tabs-active-classes="text-primary border-b-2 hover:text-primary border-primary"
                data-tabs-inactive-classes="text-gray-500 hover:text-gray-600 border-gray-100"
                role="tablist">
                {tabs.map((tab, i) => {
                    return <li className="me-2" role="presentation" key={i}>
                        <button className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-b-2"
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
            {tabs.map((tab, i) => {
                return <div className="rounded-lg"
                    key={i}
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



const ManageIndexDropdown = () => {
    return <div className="relative flex flex-col gap-0">
        <button id="dropdownDividerButton" 
                data-dropdown-toggle="dropdownDivider" 
                class="flex flex-row items-center bg-white rounded border border-gray-300 px-3 py-1">
            <span className="bg-white">Manage Index</span>
            <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
        </button>

        <div id="dropdownDivider" class="hidden bg-white w-full border border-gray-200">
            <ul class="py-2 text-sm" aria-labelledby="dropdownDividerButton">
                <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Delete</a>
                </li>
            </ul>
        </div>
    </div>
}