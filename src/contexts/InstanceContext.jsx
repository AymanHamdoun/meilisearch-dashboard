import React, {createContext, useEffect, useReducer} from "react";
import PropTypes from "prop-types";
import instanceReducer from "../reducers/instanceReducer";

/**
 * @typedef {Object} InstanceState
 * @property {string} label - label
 * @property {string} host - Meilisearch Host
 * @property {string} key - Meilisearch Key
 */
/**
 * The form data state.
 * @type {InstanceState}
 */
export const _defaultState = {
    label: "anghami",
    host: "https://meilisearch.internal.angha.me",
    key: "3SsjIXd1CvKfpIU-EV7RqkF8J7wM1gOVo4lC1WwnKy8"
}

const InstanceContext = createContext({
    instanceState: _defaultState,
    dispatch: () => {}
});

/**
 * Provides InstanceState context to its children components.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The authentication context provider.
 */
export const InstanceProvider = ({ children }) => {
    const fetchDefaultState = () => {
        try {
            return localStorage.getItem("instance") ? JSON.parse(sessionStorage.getItem("instance")) : _defaultState;
        } catch (error) {
            console.error('Error parsing instance state from localStorage:', error);
            return _defaultState;
        }
    }

    const [instanceState, dispatch] = useReducer(instanceReducer, fetchDefaultState());

    return <InstanceContext.Provider value={{instanceState, dispatch}}>
        {children}
    </InstanceContext.Provider>;
}

// Add PropTypes validation
InstanceProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is a React node and is required
};

export default InstanceContext;