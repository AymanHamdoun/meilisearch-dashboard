import React, {useState} from "react";
import {authenticate} from "../../../services/auth.js";
import {AuthAction} from "../../../reducers/authReducer.js";
import {Navigate, useNavigate} from "react-router-dom";
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

    return <form onSubmit={handleSubmit}>
        <div className={"flex flex-col"}>
            <input type="email"
                   name={"email"}
                   placeholder={"john.smith@gmail.com"}
                   required={true}
                   className={"mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                   onChange={handleChange}
            />
            <input type="password"
                   name={"password"}
                   placeholder={"**********"}
                   required={true}
                   autoComplete={"on"}
                   className={"mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                   onChange={handleChange}
            />
            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                type={"submit"}
                disabled={isLoading}>Login
            </button>
            <span id="errorMessage" className={"text-red-500"}></span>
        </div>
    </form>
}

export default LoginForm;