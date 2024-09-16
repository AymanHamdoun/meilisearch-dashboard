const API_URL = process.env.API_HOST + "/api/v1/contact";

/**
 * @typedef {Object} ContactFormApiResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {string} [message] - Optional message from the server, e.g., success or error message.
 * @property {Object} [data] - Optional additional data returned from the API.
 */

/**
 * @typedef {Object} ContactFormMessage
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {string} message - The user's email address.
 * */

/**
 * Sends a contact form message to an API
 * @param {ContactFormMessage} data - contains message info
 * @returns Promise<ContactFormApiResponse>
 */
export const send_contact_form_message = (data) => {
    return fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred" };
        });
}

