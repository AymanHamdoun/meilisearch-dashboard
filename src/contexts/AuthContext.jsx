import React, {createContext, useEffect, useReducer} from "react";
import PropTypes from "prop-types";
import authReducer, {AuthAction} from "../reducers/authReducer.js";
import {ping} from "../services/auth.js";

/**
 * @typedef {Object} AuthState
 * @property {boolean} authenticated - Indicates if user is authenticated
 * @property {Object} [user] - Optional user data
 */
/**
 * The form data state.
 * @type {AuthState}
 */
export const _defaultState = {
    authenticated: false,
    user: {}
}

const AuthContext = createContext({
    authState: _defaultState,
    dispatch: () => {}
});

/**
 * Provides authentication context to its children components.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The authentication context provider.
 */
export const AuthProvider = ({ children }) => {
    const fetchDefaultState = () => {
        try {
            return sessionStorage.getItem("auth") ? JSON.parse(sessionStorage.getItem("auth")) : _defaultState;
        } catch (error) {
            console.error('Error parsing auth state from sessionStorage:', error);
            return _defaultState;
        }
    }

    const [authState, dispatch] = useReducer(authReducer, fetchDefaultState());

    useEffect(() => {
        // Call ping() to check if the user is authenticated
        const checkAuthStatus = async () => {
            const response = await ping();
            if (response.data && typeof response.data === 'object') {
                // User object is present, set the authenticated state
                dispatch({ type: AuthAction.Login, payload: response.data });
            } else {
                // No user object, make sure we are in the unauthenticated state
                dispatch({ type: AuthAction.Logout });
            }
        };

        checkAuthStatus();
    }, []); // Empty dependency array ensures this runs only once on component mount


    return <AuthContext.Provider value={{authState, dispatch}}>
        {children}
    </AuthContext.Provider>;
}

// Add PropTypes validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is a React node and is required
};

export default AuthContext;