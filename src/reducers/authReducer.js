import {_defaultState} from "../contexts/AuthContext.jsx";

/**
 * Enum for auth-state values.
 * @readonly
 * @enum {string}
 */
export const AuthAction = {
    Login: 'LOGIN',
    Logout: 'LOGOUT',
}

/**
 * Reducer function to handle authentication state changes.
 *
 * @param {AuthState} state - The current state of authentication.
 * @param {Object} action - An action object to determine how to update the state.
 * @param {string} action.type - The type of action to perform.
 * @param {Object} [action.payload] - The payload containing additional information, such as user data.
 * @returns {AuthState} The new state after applying the action.
 */
const authReducer = (state, action) => {
    switch (action.type) {
        case AuthAction.Login: {
            /**
             * The form data state.
             * @type {AuthState}
             */
            const loginState = {
                authenticated: true,
                user: action.payload
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