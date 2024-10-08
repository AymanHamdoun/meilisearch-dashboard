import React, { useEffect } from "react";
import { initFlowbite } from 'flowbite';

export const TaskStatusBadge = ({ status, label, colorClassPrefix, rounded }) => {
    const statusClassMap = {
        enqueued: "blue-100",
        processing: "yellow-100",
        succeeded: "green-100",
        failed: "red-100",
        canceled: "orange-100"
    }

    let bgColorClass = "red-100"
    if (statusClassMap[status] !== undefined) {
        bgColorClass = statusClassMap[status]
    }

    bgColorClass = `${colorClassPrefix}-${bgColorClass}`;

    const roundedClass = rounded ? 'rounded-md' : ''

    return <span className={`${bgColorClass} ${roundedClass} px-2 py-1`}>{label}</span>
}

export const TaskDetails = ({ details }) => {
    return <div className="py-2">
        {Object.keys(details).map((key, j) => {
            return <div key={j} className="md:flex sm:flex md:flex-row sm:flex-col p-1 border-b border-b-gray-200 last:border-b-0">
                <div className="md:pr-2 sm:w-full sm:pr-0">{key}</div>
                <div className="md:pl-2 sm:w-full sm:pl-0 text-gray-500">{details[key]}</div>
            </div>
        })}
    </div>
}

export const ErrorAccordion = ({ uid, header, content }) => {
    useEffect(() => {
        initFlowbite()
    }, [])
    return <div data-accordion="collapse">
        <h2 id={"accordion-collapse-heading-" + uid}>
            <button type="button"
                className="flex items-center justify-between w-full p-2 font-medium rtl:text-right bg-gray-100 dark:bg-gray-100 dark:text-black focus:bg-gray-100 focus:text-red-500"
                data-accordion-target={"#accordion-collapse-body-" + uid}
                aria-expanded={"false"}
                aria-controls={"accordion-collapse-body-" + uid}>
                {header}
                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
            </button>
        </h2>
        <div id={"accordion-collapse-body-" + uid}
            className="hidden border border-gray-200"
            aria-labelledby={"accordion-collapse-heading-" + uid}>
            {content}
        </div>
    </div>
}