import React from "react";
import LoginForm from "./Form.jsx";

/**
 * Login page component that renders the LoginForm.
 * @component
 * @returns {JSX.Element} The rendered login page.
 */
const Page = () => {
    return (
        <div id="pageHome" className="w-full flex flex-col items-center">
            <div className="p-2 flex flex-col h-lvh w-full items-center justify-center bg-primary-faint">
                <div className="p-5 w-full md:w-1/3 border border-gray-200 shadow-lg rounded flex flex-col justify-center bg-white">
                    <img src="/img/meili-logo.svg" className="h-8 mb-5 self-center" alt="Meilisearch Logo"/>
                    <h3 className="mb-5 font-bold text-2xl text-gray-700 text-center">Login</h3>
                    <LoginForm/>
                </div>
            </div>
        </div>
    );
}

export default Page;