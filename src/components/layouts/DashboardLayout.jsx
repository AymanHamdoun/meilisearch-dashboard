import React, {useEffect, useState, createContext, useContext} from "react";
import {Outlet, useNavigate} from "react-router-dom"
import { InstanceProvider } from "../../contexts/InstanceContext"
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext"
import { ExperimentalFeaturesProvider } from "../../contexts/ExperimentalFeaturesContext"
import { ToastProvider } from "../../contexts/ToastContext"
import SideBar from "../commons/SideBar"
import Navbar from "../commons/Navbar"
import InstanceModal from "../commons/InstanceModal"
import ToastContainer from "../commons/Toast"
import useMeiliInstance from "../../hooks/useMeiliInstance.js";
import InstanceErrorBoundary from "../commons/InstanceErrorBoundary";
import IndexCreationModal from "../pages/instance/index-creation/IndexCreationModal";

// Generic modal context for dashboard-wide modals
const DashboardModalContext = createContext({
    showIndexCreationModal: false,
    setShowIndexCreationModal: () => {}
});

export const useDashboardModal = () => useContext(DashboardModalContext);

const DashboardLayout = () => {
    const [showIndexCreationModal, setShowIndexCreationModal] = useState(false);

    return <InstanceProvider>
        <ExperimentalFeaturesProvider>
            <ToastProvider>
                <InstanceErrorBoundary>
                    <InstanceModal/>
                    <DashboardModalContext.Provider value={{
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
                    </DashboardModalContext.Provider>
                    <ToastContainer />
                </InstanceErrorBoundary>
            </ToastProvider>
        </ExperimentalFeaturesProvider>
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