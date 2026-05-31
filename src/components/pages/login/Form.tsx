import React, { useState } from "react";
import { authenticate } from "../../../services/auth";
import { AuthAction } from "../../../reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../hooks/useAuth';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authenticate(formData);
            if (!response.success) {
                const el = document.getElementById("errorMessage");
                if (el) el.innerText = response.message ?? "Login failed";
                return;
            }
            dispatch({ type: AuthAction.Login, payload: response.data });
            navigate("/instance/");
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label className="text-gray-700" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john.smith@gmail.com"
                    required
                    className="p-2 rounded border border-gray-200 w-full focus:border-primary focus:outline-none"
                    onChange={handleChange}
                    value={formData.email}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-gray-700" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    autoComplete="on"
                    className="p-2 rounded border border-gray-200 w-full focus:border-primary focus:outline-none"
                    onChange={handleChange}
                    value={formData.password}
                />
            </div>
            <div className="flex flex-col gap-2">
                <button
                    className="w-full py-3 border border-primary rounded text-primary font-semibold transition-all ease-in-out hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                <span id="errorMessage" className="text-red-500 text-center text-sm"></span>
            </div>
        </form>
    );
}

export default LoginForm;
