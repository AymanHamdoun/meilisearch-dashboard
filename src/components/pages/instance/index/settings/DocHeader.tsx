import React from "react"

const DocHeader = ({title, badge, description, link}) => {
    return <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-row gap-3 items-center">
            <h3 className="font-medium text-xl text-gray-800">{title}</h3>
            <a href={link} target="_blank">
                <span className="bg-primary-midfaint rounded-2xl border border-gray-300 px-5 text-gray-700">{badge}</span>
            </a>
        </div>
        <p className="text-gray-700">{description}</p>
    </div>
}

export default DocHeader;