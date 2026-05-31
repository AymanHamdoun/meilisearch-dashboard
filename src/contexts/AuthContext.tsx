import React, { createContext, useEffect, useReducer, ReactNode } from "react";
import authReducer, { AuthAction, AuthReducerAction } from "../reducers/authReducer";
import { ping } from "../services/auth";

export interface AuthState {
    authenticated: boolean;
    user: Record<string, unknown>;
}

export const _defaultState: AuthState = {
    authenticated: false,
    user: {}
}

interface AuthContextType {
    authState: AuthState;
    dispatch: React.Dispatch<AuthReducerAction>;
}

const AuthContext = createContext<AuthContextType>({
    authState: _defaultState,
    dispatch: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const fetchDefaultState = (): AuthState => {
        try {
            const stored = sessionStorage.getItem("auth");
            return stored ? JSON.parse(stored) : _defaultState;
        } catch (error) {
            console.error('Error parsing auth state from sessionStorage:', error);
            return _defaultState;
        }
    }

    const [authState, dispatch] = useReducer(authReducer, fetchDefaultState());

    useEffect(() => {
        const checkAuthStatus = async () => {
            const response = await ping();
            if (response.data && typeof response.data === 'object') {
                dispatch({ type: AuthAction.Login, payload: response.data });
            } else {
                dispatch({ type: AuthAction.Logout });
            }
        };
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
