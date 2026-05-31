import React, { createContext, useEffect, useMemo, useReducer, ReactNode } from "react";
import meiliIndexReducer, { MeiliIndexAction, MeiliIndexState, MeiliIndexReducerAction } from "../reducers/meiliIndexReducer";
import { listIndexes } from "../services/meilisearch/indexes";
import useMeiliInstance from "../hooks/useMeiliInstance";

export const _defaultState: MeiliIndexState = {
    selectedIndex: "",
    availableIndexes: [],
}

interface MeiliIndexContextType {
    meiliIndexState: MeiliIndexState;
    dispatch: React.Dispatch<MeiliIndexReducerAction>;
    refreshIndexes: () => Promise<any[] | null>;
}

const MeiliIndexContext = createContext<MeiliIndexContextType>({
    meiliIndexState: _defaultState,
    dispatch: () => {},
    refreshIndexes: () => Promise.resolve(null)
});

export const MeiliIndexProvider = ({ children }: { children: ReactNode }) => {
    const { instanceState } = useMeiliInstance();

    const fetchDefaultState = (): MeiliIndexState => {
        try {
            const stored = localStorage.getItem("indexes");
            return stored ? JSON.parse(stored) : _defaultState;
        } catch (error) {
            console.error('Error parsing meiliIndex state from localStorage:', error);
            return _defaultState;
        }
    }

    const [meiliIndexState, dispatch] = useReducer(meiliIndexReducer, fetchDefaultState());

    const refreshIndexes = async (): Promise<any[] | null> => {
        if (!instanceState.isLoaded || !instanceState.isSet) return null;

        try {
            const response = await listIndexes(instanceState.host, instanceState.key);
            if (response?.results) {
                dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
                return response.results;
            }
        } catch (error) {
            console.error('Failed to refresh indexes:', error);
        }
        return null;
    };

    useEffect(() => {
        if (!instanceState.isLoaded) return;

        const getIndexes = async () => {
            const response = await listIndexes(instanceState.host, instanceState.key);
            if (response?.results) {
                dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
            }
        };

        getIndexes();
    }, [instanceState.isLoaded, instanceState.host, instanceState.key]);

    const value = useMemo(
        () => ({ meiliIndexState, dispatch, refreshIndexes }),
        [meiliIndexState, refreshIndexes]
    );

    return (
        <MeiliIndexContext.Provider value={value}>
            {children}
        </MeiliIndexContext.Provider>
    );
}

export default MeiliIndexContext;
