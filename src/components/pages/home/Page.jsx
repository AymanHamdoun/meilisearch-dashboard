import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

import AuthContext from "../../../contexts/AuthContext.jsx";
import { logout } from "../../../services/auth.js";
import { AuthAction } from "../../../reducers/authReducer.js";

export const PAGE_ID_HOMEPAGE = 'home-page';

const Page = () => {
    const { authState, dispatch } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleLogout = () => {
        logout().then((response) => {
            if (response.success) {
                dispatch({ type: AuthAction.Logout });
            }
        });
    };

    return (
        <div data-testid={PAGE_ID_HOMEPAGE} id="pageHome" className="p-5 flex flex-col items-center">
            <h3 className="font-bold text-4xl text-gray-700">{t('page.home.title')}</h3>
            {(authState.authenticated ?
                <LoggedInSection t={t} authState={authState} handleLogout={handleLogout}/> :
                <LoggedOutSection t={t}/>
            )}
        </div>
    );
};

export default Page;


/**
 * LoggedInSection component for displaying the user's welcome message and a logout button.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.t - Translation function from react-i18next.
 * @param {Object} props.authState - Authentication state object.
 * @param {Object} props.authState.user - User object containing user details.
 * @param {Function} props.handleLogout - Function to handle the logout action.
 * @returns {JSX.Element} The JSX to render the logged-in section.
 */
const LoggedInSection = ({t, authState, handleLogout}) => {
    return (
        <div className="flex flex-col justify-center gap-4">
            <div>{t('auth.welcome')}, {authState.user.name}</div>
            <button
                className="bg-black text-white hover:bg-gray-700 font-bold py-2 px-4 rounded"
                onClick={handleLogout}
            >
                {t('auth.logout')}
            </button>
        </div>
    );
}

LoggedInSection.propTypes = {
    t: PropTypes.func.isRequired,
    authState: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleLogout: PropTypes.func.isRequired,
};

/**
 * LoggedOutSection component for displaying the login link.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.t - Translation function from react-i18next.
 * @returns {JSX.Element} The JSX to render the logged-out section.
 */
const LoggedOutSection = ({t}) => {
    return <div className="flex flex-col justify-center gap-4">
        <Link
            to="/login"
            className="mt-4 bg-black text-white hover:bg-gray-700 font-bold py-2 px-4 rounded"
        >
            {t('auth.login')}
        </Link>
    </div>
}

LoggedOutSection.propTypes = {
    t: PropTypes.func.isRequired,
};