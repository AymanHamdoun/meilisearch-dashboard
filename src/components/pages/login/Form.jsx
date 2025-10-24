import React, {useState} from "react";
import {authenticate} from "../../../services/auth.js";
import {AuthAction} from "../../../reducers/authReducer.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../../../hooks/useAuth.js'

/**
 * @typedef {Object} LoginFormData
 * @property {string} email - The email address of the user.
 * @property {string} password - The user's password.
 */

/**
 * ContactForm component that handles user input and form submission.
 * @component
 * @returns {JSX.Element} The rendered contact form.
 */
const LoginForm = () => {
    /**
     * The form loading state.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isLoading, setIsLoading] = useState(false);

    const {dispatch} = useAuth();

    const navigate = useNavigate()

    /**
     * The form data state.
     * @type {[LoginFormData, React.Dispatch<React.SetStateAction<LoginFormData>>]}
     */
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    /**
     * Handles input change events and updates the form data.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Handles form submission and sends the contact form message.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authenticate(formData);
            if (!response.success) {
                document.getElementById("errorMessage").innerText = response.message;
                return;
            }
            dispatch({type: AuthAction.Login, payload: response.data});
            navigate("/instance/")
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
                    required={true}
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
                    required={true}
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
    )
}

export default LoginForm;