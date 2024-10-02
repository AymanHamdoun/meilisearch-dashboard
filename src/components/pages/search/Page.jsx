import React from "react";
import IndexTabs from "./IndexTabs";


const Page = () => {
    return <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
        <IndexStats />
        <IndexTabs/>
    </div>
}


const IndexStats = () => {
    return <div className="mb-8">
        <h3 className="text-3xl font-semibold mb-3">Index</h3>
        <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
                <div className="text-gray-500"># records</div>
                <div className="text-black font-semibold">3.2M</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="text-gray-500">index size</div>
                <div className="text-black font-semibold">2.3 GB</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="text-gray-500">data size</div>
                <div className="text-black font-semibold">1.5 GB</div>
            </div>
        </div>
    </div>
}

export default Page;