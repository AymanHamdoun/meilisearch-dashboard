import React from "react";
import LoginForm from "./Form.jsx";

/**
 * Contact page component that renders the ContactForm.
 * @component
 * @returns {JSX.Element} The rendered contact page.
 */
const Page = () => {
    return <div id="pageHome" className={"p-5 flex flex-col items-center"}>
        <h3 className={"mb-5 font-bold text-4xl text-gray-700"}>Login</h3>
        <div>
            <LoginForm/>
        </div>
    </div>
}

export default Page;