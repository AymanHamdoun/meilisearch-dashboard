import React from "react";
import useMeiliInstance from "../../../hooks/useMeiliInstance";
import HealthWidget from "./overview/HealthWidget.tsx";

const OverviewPage = () => {
    const { instanceState } = useMeiliInstance()

    return <div className="bg-gray-100 bg-opacity-70 min-h-screen p-4">
        <h3 className="text-3xl font-semibold mb-3">Overview</h3>
        <div className="rounded bg-white-100 border bg-white">
            <HealthWidget instanceState={instanceState}/>
        </div>
    </div>
}

export default OverviewPage;