// @ts-ignore
import React, {createContext, useEffect, useReducer, Dispatch, ReactNode} from "react";
import indexSettingsReducer, { IndexSettingsActions, ReducerAction } from "../reducers/indexSettingsReducer";

import {APISettings} from "../services/meilisearch/types"
import {getIndexSettings, updateIndexSettings} from "../services/meilisearch/settings"
import useIndex from "../hooks/useMeiliIndex";
import useMeiliInstance from "../hooks/useMeiliInstance";

export const _defaultState: APISettings = {
    displayedAttributes: [],
    searchableAttributes: [],
    filterableAttributes: [],
    sortableAttributes: [],
    rankingRules: [],
    stopWords: [],
    nonSeparatorTokens: [],
    separatorTokens: [],
    dictionary: [],
    synonyms: {},
    distinctAttribute: null,
    proximityPrecision: "",
    typoTolerance: {
        enabled: false,
        minWordSizeForTypos: {
            oneTypo: 0,
            twoTypos: 0
        },
        disableOnWords: [],
        disableOnAttributes: []
    },
    faceting: {
        maxValuesPerFacet: 0,
        sortFacetValuesBy: {}
    },
    pagination: {
        maxTotalHits: 0
    },
    searchCutoffMs: null,
    localizedAttributes: null,
    embedders: null,
    facetSearch: true,
    prefixSearch: "indexingTime"
}

type ContextType = {
    settings: APISettings;
    originalSettings: APISettings;
    modifiedSettings: APISettings;
    hasChanges: boolean;
    dispatch: Dispatch<ReducerAction>;
    saveSettings: () => Promise<void>;
    resetSettings: () => void;
}

// Update the Dispatch type
const IndexSettingsContext = createContext<ContextType>({
    settings: _defaultState,
    originalSettings: _defaultState,
    modifiedSettings: _defaultState,
    hasChanges: false,
    dispatch: () => undefined,
    saveSettings: async () => {},
    resetSettings: () => {},
  });

export const IndexSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, dispatch] = useReducer(indexSettingsReducer, _defaultState);
    const [originalSettings, setOriginalSettings] = React.useState<APISettings>(_defaultState);
    const [modifiedSettings, setModifiedSettings] = React.useState<APISettings>(_defaultState);
    const [hasChanges, setHasChanges] = React.useState(false);
    const {meiliIndexState} = useIndex()
    const {instanceState} = useMeiliInstance()

    useEffect(() => {
        if (!instanceState.isLoaded || meiliIndexState.selectedIndex == '') {
            return
        }
        getIndexSettings({
            host: instanceState.host,
            instanceKey: instanceState.key,
            indexName: meiliIndexState.selectedIndex
        }).then((response) => {
            if (Object.keys(response).length == 0) {
              return
            }

            dispatch({ type: IndexSettingsActions.Set, payload: response });
            setOriginalSettings(response);
            setModifiedSettings(response);
        })
    }, [instanceState]); // Empty dependency array ensures this runs only once on component mount

    useEffect(() => {
        // Check if settings have changed
        const changed = JSON.stringify(originalSettings) !== JSON.stringify(modifiedSettings);
        setHasChanges(changed);
    }, [originalSettings, modifiedSettings]);

    const saveSettings = async () => {
        try {
            await updateIndexSettings({
                host: instanceState.host,
                instanceKey: instanceState.key,
                indexName: meiliIndexState.selectedIndex
            }, modifiedSettings);

            // After successful save, update original settings
            setOriginalSettings(modifiedSettings);
            dispatch({ type: IndexSettingsActions.Set, payload: modifiedSettings });
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        }
    };

    const resetSettings = () => {
        setModifiedSettings(originalSettings);
        dispatch({ type: IndexSettingsActions.Set, payload: originalSettings });
    };

    // Update modified settings when reducer state changes
    useEffect(() => {
        setModifiedSettings(settings);
    }, [settings]);

    return <IndexSettingsContext.Provider value={{
        settings,
        originalSettings,
        modifiedSettings,
        hasChanges,
        dispatch,
        saveSettings,
        resetSettings
    }}>
        {children}
    </IndexSettingsContext.Provider>;
}

export default IndexSettingsContext;