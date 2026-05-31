const API_URL = process.env.API_HOST + "/api/v1/contact";

interface ContactFormMessage {
    name: string;
    email: string;
    message: string;
}

interface ContactFormApiResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

export const send_contact_form_message = (data: ContactFormMessage): Promise<ContactFormApiResponse> => {
    return fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred" };
        });
}
