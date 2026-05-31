const API_URL = process.env.API_HOST + "/api/v1/auth/";

interface AuthApiResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

interface LoginRequest {
    email: string;
    password: string;
}

export const authenticate = (data: LoginRequest): Promise<AuthApiResponse> => {
    return fetch(API_URL + "login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email: data.email, password: data.password }),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred" };
        });
}

export const ping = (): Promise<AuthApiResponse> => {
    return fetch(API_URL + "ping", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred" };
        });
}

export const logout = (): Promise<AuthApiResponse> => {
    return fetch(API_URL + "logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error(error);
            return { success: false, message: "An error occurred" };
        });
}
