import React, {createContext, useEffect, useMemo, useReducer} from "react";
import PropTypes from "prop-types";
import meiliIndexReducer, { MeiliIndexAction } from "../reducers/meiliIndexReducer";
import {listIndexes} from "../services/meilisearch/indexes.ts"
import useMeiliInstance from "../hooks/useMeiliInstance";

/**
 * @typedef {Object} MeiliIndexContextData
 * @property {string} selectedIndex - selected index
 * @property {Array.<string>} availableIndexes - Meilisearch Indexes
 */
/**
 * The form data state.
 * @type {MeiliIndexContextData}
 */
export const _defaultState = {
    selectedIndex: "",
    availableIndexes: [],
}

const MeiliIndexContext = createContext({
    meiliIndexState: _defaultState,
    dispatch: () => {},
    refreshIndexes: () => Promise.resolve(null)
});

/**
 * Provides authentication context to its children components.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the meilisearch indexes context.
 * @returns {JSX.Element} The meili index context provider.
 */
export const MeiliIndexProvider = ({ children }) => {
    const {instanceState} = useMeiliInstance()
    const fetchDefaultState = () => {
        try {
            return localStorage.getItem("indexes") ? JSON.parse(localStorage.getItem("indexes")) : _defaultState;
        } catch (error) {
            console.error('Error parsing meiliIndex state from localStorage:', error);
            return _defaultState;
        }
    }

    const [meiliIndexState, dispatch] = useReducer(meiliIndexReducer, fetchDefaultState());

    // Function to refresh indexes that can be called by components
    const refreshIndexes = async () => {
        if (!instanceState.isLoaded || !instanceState.isSet) {
            return;
        }

        try {
            const response = await listIndexes(instanceState.host, instanceState.key);
            if (response && response.results) {
                dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
                return response.results;
            }
        } catch (error) {
            console.error('Failed to refresh indexes:', error);
        }
        return null;
    };

    useEffect(() => {
        if (!instanceState.isLoaded) {
            return
        }

        const getIndexes = async () => {
            const response = await listIndexes(instanceState.host, instanceState.key);
            if (response.results) {
                dispatch({ type: MeiliIndexAction.SetFromIndexList, payload: response.results });
            }
        };

        getIndexes();
    }, [instanceState.isLoaded, instanceState.host, instanceState.key]);

    const value = useMemo(
        () => ({ meiliIndexState, dispatch, refreshIndexes }),
        [meiliIndexState, refreshIndexes]
    );

    return <MeiliIndexContext.Provider value={value}>
        {children}
    </MeiliIndexContext.Provider>;
}

// Add PropTypes validation
MeiliIndexProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is a React node and is required
};

export default MeiliIndexContext;