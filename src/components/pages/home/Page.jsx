import React, {useContext} from "react";
import AuthContext from "../../../contexts/AuthContext.jsx";
import {logout} from "../../../services/auth.js";
import {AuthAction} from "../../../reducers/authReducer.js";
import {Link} from "react-router-dom";

const Page = () => {
    const {authState, dispatch} = useContext(AuthContext)

    let authSpecificPart = <div className={"flex flex-col justify-center gap-4"}>
        <Link to={"/login"}
                className={"mt-4 bg-black text-white hover:bg-gray-700 font-bold py-2 px-4 rounded"}>
            Login
        </Link>
    </div>

    if (authState.authenticated) {
        authSpecificPart = <div className={"flex flex-col justify-center gap-4"}>
            <div>Welcome, {authState.user.name}</div>
            <button
                className={"bg-black text-white hover:bg-gray-700 font-bold py-2 px-4 rounded"}
                onClick={() => {
                logout().then(response => {
                    if (response.success) {
                        dispatch({type: AuthAction.Logout})
                    }
                })
            }}>Logout</button>
        </div>
    }
    return <div id="pageHome" className={"p-5 flex flex-col items-center"}>
        <h3 className={"font-bold text-4xl text-gray-700"}>Home</h3>
        {authSpecificPart}
    </div>
}

export default Page;