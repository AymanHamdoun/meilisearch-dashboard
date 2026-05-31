import { _defaultState, AuthState } from "../contexts/AuthContext";

export const AuthAction = {
    Login: 'LOGIN',
    Logout: 'LOGOUT',
} as const;

export interface AuthReducerAction {
    type: string;
    payload?: any;
}

const authReducer = (state: AuthState, action: AuthReducerAction): AuthState => {
    switch (action.type) {
        case AuthAction.Login: {
            const loginState: AuthState = {
                authenticated: true,
                user: action.payload,
            };
            sessionStorage.setItem("auth", JSON.stringify(loginState));
            return loginState;
        }
        case AuthAction.Logout: {
            sessionStorage.setItem("auth", JSON.stringify(_defaultState));
            return _defaultState;
        }
        default:
            return state;
    }
}

export default authReducer;
