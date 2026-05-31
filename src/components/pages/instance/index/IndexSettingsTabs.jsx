import React, { useEffect, useState } from "react"
import { initFlowbite } from 'flowbite';
import { SearchableAttrs } from "./settings/SearchableAttrs";
import { DisplayedAttrs } from "./settings/DisplayedAttrs";
import { FilterableAttrs } from "./settings/FilterableAttrs";
import { SortableAttrs } from "./settings/SortableAttrs";
import { StopWords } from "./settings/StopWords";
import { SeparatorTokens } from "./settings/SeparatorTokens";
import { NonSeparatorTokens } from "./settings/NonSeparatorTokens";
import { Dictionary } from "./settings/Dictionary";
import TypoTolerance from "./settings/TypoTolerance";
import DistinctAttribute from "./settings/DistinctAttribute";
import ProximityPrecision from "./settings/ProximityPrecision";
import SearchCutoffMs from "./settings/SearchCutoffMs";
import PaginationSettings from "./settings/PaginationSettings";
import FacetingSettings from "./settings/FacetingSettings";
import FacetSearchSetting from "./settings/FacetSearchSetting";
import PrefixSearchSetting from "./settings/PrefixSearchSetting";
import Synonyms from "./settings/Synonyms";
import LocalizedAttributes from "./settings/LocalizedAttributes";
import EmbeddersSettings from "./settings/EmbeddersSettings";
import ExportImportSettings from "./settings/ExportImportSettings";

import { IndexSettingsProvider } from "../../../../contexts/IndexSettingsContext"
import RankingInfo from "./settings/RankingInfo.tsx";
import useIndexSettings from "../../../../hooks/useIndexSettings";
import SettingsSaveBar from "./settings/SettingsSaveBar";
import SettingDiffPreviewModal from "./settings/SettingDiffPreviewModal";


const tabGroups = [
    {
        group: "Relevance",
        tabs: [
            { key: "searchable-attrs",    label: "Searchable Attributes", element: <SearchableAttrs /> },
            { key: "ranking",             label: "Ranking Rules",          element: <RankingInfo /> },
            { key: "typos",               label: "Typo Tolerance",         element: <TypoTolerance /> },
            { key: "proximity-precision", label: "Proximity Precision",    element: <ProximityPrecision /> },
            { key: "distinct-attr",       label: "Distinct Attribute",     element: <DistinctAttribute /> },
        ],
    },
    {
        group: "Filtering & Faceting",
        tabs: [
            { key: "filterable-attrs", label: "Filterable Attributes", element: <FilterableAttrs /> },
            { key: "faceting",         label: "Faceting",               element: <FacetingSettings /> },
            { key: "facet-search",     label: "Facet Search",           element: <FacetSearchSetting /> },
        ],
    },
    {
        group: "Display",
        tabs: [
            { key: "displayed-attrs", label: "Displayed Attributes", element: <DisplayedAttrs /> },
            { key: "sortable-attrs",  label: "Sortable Attributes",  element: <SortableAttrs /> },
            { key: "pagination",      label: "Pagination",           element: <PaginationSettings /> },
        ],
    },
    {
        group: "Language",
        tabs: [
            { key: "synonyms",             label: "Synonyms",              element: <Synonyms /> },
            { key: "stop-words",           label: "Stop Words",            element: <StopWords /> },
            { key: "separator-tokens",     label: "Separator Tokens",      element: <SeparatorTokens /> },
            { key: "non-separator-tokens", label: "Non-Separator Tokens",  element: <NonSeparatorTokens /> },
            { key: "dictionary",           label: "Dictionary",            element: <Dictionary /> },
            { key: "localized-attrs",      label: "Localized Attributes",  element: <LocalizedAttributes /> },
        ],
    },
    {
        group: "Performance",
        tabs: [
            { key: "search-cutoff", label: "Search Cutoff", element: <SearchCutoffMs /> },
            { key: "prefix-search", label: "Prefix Search", element: <PrefixSearchSetting /> },
            { key: "embedders",     label: "Embedders",     element: <EmbeddersSettings /> },
        ],
    },
    {
        group: "Advanced",
        tabs: [
            { key: "export-import", label: "Export / Import", element: <ExportImportSettings /> },
        ],
    },
]

const tabs = tabGroups.flatMap(g => g.tabs)

const tabsID = "meili-index-settings-tabs"
const tabsContentID = `#${tabsID}-content`

const IndexSettingsContent = () => {
    const { hasChanges, saveSettings, resetSettings, originalSettings, modifiedSettings } = useIndexSettings();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        initFlowbite();
    }, []);

    const handleSave = async () => {
        setSaveSuccess(false);
        try {
            await saveSettings();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            setShowPreviewModal(false);
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error; // Re-throw to let modal handle the error
        }
    };

    return <div className="flex flex-col gap-4">
        {hasChanges && (
            <SettingsSaveBar
                onPreviewChanges={() => setShowPreviewModal(true)}
                onReset={resetSettings}
                saveSuccess={saveSuccess}
            />
        )}
        <SettingDiffPreviewModal
            isVisible={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            onConfirm={handleSave}
            originalSettings={originalSettings}
            modifiedSettings={modifiedSettings}
        />
        <div className="md:flex bg-white rounded-md border-2 border-gray-100 shadow-sm w-full">
            <ul className="flex-column text-sm font-medium text-gray-500 dark:text-gray-400 md:w-1/3 sm:w-full border-r border-r-gray-100"
                id={tabsID}
                data-tabs-toggle={tabsContentID}
                data-tabs-active-classes="text-primary border-l-2 border-b-0 hover:text-primary border-primary bg-gray-50"
                data-tabs-inactive-classes="text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300"
                role="tablist">
                {tabGroups.map((group, gi) => (
                    <React.Fragment key={group.group}>
                        <li className={`w-full px-4 pt-${gi === 0 ? '3' : '4'} pb-1 pointer-events-none`} aria-hidden="true">
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                {group.group}
                            </span>
                        </li>
                        {group.tabs.map((tab) => (
                            <li key={tab.key} className="w-full" role="presentation">
                                <button className="w-full text-left inline-block py-3 px-4 pl-5 hover:text-primary hover:bg-gray-50 hover:border-l-2 hover:border-l-primary"
                                    id={`${tabsID}-${tab.key}-tab`}
                                    data-tabs-target={`#${tabsID}-${tab.key}`}
                                    type="button"
                                    role="tab"
                                    aria-controls={tab.key}
                                    aria-selected="false">
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </React.Fragment>
                ))}
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
    </div>
};

const IndexSettingsTabs = () => {
    return <IndexSettingsProvider>
        <IndexSettingsContent />
    </IndexSettingsProvider>
}

export default IndexSettingsTabs;