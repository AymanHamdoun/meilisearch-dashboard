const API_URL = process.env.API_HOST + "/api/v1/auth/";

/**
 * @typedef {Object} LoginApiResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {string} [message] - Optional message from the server, e.g., success or error message.
 * @property {Object} [data] - Optional additional data returned from the API.
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * */

/**
 * Sends a login request to an API
 * @param {LoginRequest} data - contains message info
 * @returns Promise<LoginApiResponse>
 */
export const authenticate = (data) => {
    return fetch(API_URL + "login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred"};
        });
}

/**
 * @typedef {Object} PingApiResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {string} [message] - Optional message from the server, e.g., success or error message.
 * @property {Object} [data] - Optional additional data returned from the API.
 */

/**
 * Sends a ping request to an API to check if
 * the user is logged in (since JWT token is in an http-only cookie)
 * @returns Promise<PingApiResponse>
 */
export const ping = () => {
    return fetch(API_URL + "ping", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred"};
        });
}




/**
 * @typedef {Object} LogoutApiResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {string} [message] - Optional message from the server, e.g., success or error message.
 */

/**
 * Sends a logout request to an API
 * @returns Promise<LogoutApiResponse>
 */
export const logout = () => {
    return fetch(API_URL + "logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred"};
        });
}

