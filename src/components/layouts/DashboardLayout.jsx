import React, {useEffect, useState, createContext, useContext} from "react";
import {Outlet, useNavigate} from "react-router-dom"
import { InstanceProvider } from "../../contexts/InstanceContext"
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext"
import SideBar from "../commons/SideBar"
import Navbar from "../commons/Navbar"
import InstanceModal from "../commons/InstanceModal"
import useMeiliInstance from "../../hooks/useMeiliInstance.js";
import IndexCreationModal from "../pages/instance/index-creation/IndexCreationModal";
import InstanceErrorBoundary from "../commons/InstanceErrorBoundary";

// Context for modal management
const ModalContext = createContext({
    showIndexCreationModal: false,
    setShowIndexCreationModal: () => {}
});

export const useModal = () => useContext(ModalContext);

const DashboardLayout = () => {
    const [showIndexCreationModal, setShowIndexCreationModal] = useState(false);

    return <InstanceProvider>
        <InstanceErrorBoundary>
            <InstanceModal/>

            <ModalContext.Provider value={{
                showIndexCreationModal,
                setShowIndexCreationModal
            }}>
                <MeiliIndexProvider>
                    <IndexCreationModal
                        isVisible={showIndexCreationModal}
                        onClose={() => setShowIndexCreationModal(false)}
                    />
                    <LayoutContent/>
                </MeiliIndexProvider>
            </ModalContext.Provider>
        </InstanceErrorBoundary>
    </InstanceProvider>
}

export default DashboardLayout;


const LayoutContent = () => {
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate();

    useEffect(() => {
        if (instanceState.isLoaded && !instanceState.isSet) {
            navigate("/instance-form")
        }
    }, [instanceState])

    if (!instanceState.isLoaded) {
        return <div>loading instance config</div>
    }

    return <>
        <SideBar />
        <div className="bg-content sm:ml-64 h-full min-h-lvh">
            <Navbar />
            <Outlet />
        </div>
    </>
}