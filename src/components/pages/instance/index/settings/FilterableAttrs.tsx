// @ts-ignore
import React, { useState } from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"
import { useAttributeValues } from "../../../../../hooks/useAttributeValues"
import useMeiliInstance from "../../../../../hooks/useMeiliInstance"
import useIndex from "../../../../../hooks/useMeiliIndex"

const AttrValuePreview = ({ attrName, cache, fetchValues }: {
    attrName: string;
    cache: Record<string, { values: string[]; loading: boolean; error: string | null }>;
    fetchValues: (attr: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const state = cache[attrName];

    const toggle = () => {
        if (!open && !state) fetchValues(attrName);
        setOpen(o => !o);
    };

    return (
        <div className="text-xs">
            <button
                onClick={toggle}
                className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
            >
                <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                Sample values
            </button>
            {open && (
                <div className="mt-1.5 pl-4">
                    {!state || state.loading ? (
                        <span className="text-gray-300 animate-pulse">Loading…</span>
                    ) : state.error ? (
                        <span className="text-red-400">{state.error}</span>
                    ) : state.values.length === 0 ? (
                        <span className="text-gray-300 italic">No values found</span>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {state.values.map(v => (
                                <span key={v} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                                    {v}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const FilterableAttrs = () => {
    const { settings, dispatch } = useIndexSettings()
    const { instanceState } = useMeiliInstance()
    const { meiliIndexState } = useIndex()
    const { cache, fetchValues } = useAttributeValues(instanceState, meiliIndexState.selectedIndex)

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { filterableAttributes: values }
        });
    };

    const attrs: string[] = Array.isArray(settings.filterableAttributes) ? settings.filterableAttributes : [];

    return <div>
        <DocHeader
            title={"Filterable Attributes"}
            badge={"filterableAttributes"}
            description={"Attributes that can be used as filters and facets. Default value: []"}
            link={"https://www.meilisearch.com/docs/learn/filtering_and_sorting/search_with_filters"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Filterable Attribute"
            initialTextboxValues={attrs}
            onChange={handleChange}
        />
        {attrs.length > 0 && (
            <div className="mt-4 border border-gray-100 rounded p-3 flex flex-col gap-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Value preview</p>
                {attrs.filter(Boolean).map(attr => (
                    <div key={attr}>
                        <p className="text-xs font-mono text-gray-600 mb-0.5">{attr}</p>
                        <AttrValuePreview attrName={attr} cache={cache} fetchValues={fetchValues} />
                    </div>
                ))}
            </div>
        )}
    </div>
}
