import React, {useState} from "react";
import {send_contact_form_message} from '../../../services/contact.js'

/**
 * @typedef {Object} FormData
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} message - The message from the user.
 */

/**
 * ContactForm component that handles user input and form submission.
 * @component
 * @returns {JSX.Element} The rendered contact form.
 */
const ContactForm = () => {
    /**
     * The form loading state.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * The form data state.
     * @type {[FormData, React.Dispatch<React.SetStateAction<FormData>>]}
     */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
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
            const response = await send_contact_form_message(formData);
            document.getElementById("formOutput").innerText = response.message;
            // Handle success
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    return <form onSubmit={handleSubmit}>
        <div className={"flex flex-col"}>
            <input type="text"
                   name={"name"}
                   placeholder={"John Smith"}
                   required={true}
                   className={"mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                   onChange={handleChange}
            />
            <input type="email"
                   name={"email"}
                   placeholder={"john.smith@gmail.com"}
                   required={true}
                   className={"mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                   onChange={handleChange}
            />
            <textarea name="message"
                      cols="30"
                      rows="10"
                      placeholder={"Your Message"}
                      required={true}
                      className={"mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                      onChange={handleChange}
            ></textarea>
            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                type={"submit"}
                disabled={isLoading}>Send</button>
        </div>
        <div id="formOutput"></div>
    </form>
}

export default ContactForm;