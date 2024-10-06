import React, { useEffect, useState } from "react";
import { getTasks } from "../../../../services/meilisearch/tasks";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { GetTaskResponse, _api_task_object } from "../../../../services/meilisearch/types";

import { initFlowbite } from 'flowbite';
import { content } from "flowbite-react/tailwind";
import { number } from "prop-types";

type PaginationData = {
    from: number,
    limit: number,
    next: number,
    total: number
}

const Page = () => {
    const { instanceState } = useMeiliInstance()
    const [tasks, setTasks] = useState<_api_task_object[]>([])
    const [paginationData, setPaginationData] = useState<PaginationData>({
        from: 0,
        limit: 0,
        next: 0,
        total: 0
    })

    useEffect(() => {
        getTasks(instanceState, paginationData.from).then((data: GetTaskResponse) => {
            setTasks(data.results)
            setPaginationData({
                from: data.from,
                limit: data.limit,
                next: data.next,
                total: data.total
            })
        })
    }, [])


    return <div className="px-4 py-5">
        <h1 className="text-3xl font-semibold mb-3">Tasks</h1>
        <div className="flex flex-row mb-3">
            <span>Total: {paginationData.total}</span>
        </div>
        {tasks.map((task: _api_task_object) => {
            return <div className="p-3 bg-white border border-gray-100 shadow-md rounded-sm mb-4">
                <div className="flex flex-col md:flex-row gap-2 justify-between">
                    <div>
                        {task.indexUid !== null ? (
                            <span className="px-2 py-1 border-r border-r-gray-200 font-semibold">{task.indexUid}</span>
                        ) : ""}
                        <span className="bg-gray-100 rounded-md px-2 py-1 font-semibold">#{task.uid}</span>
                        <span className="bg-gray-100 rounded-md px-2 py-1">{task.type}</span>
                        <TaskStatusBadge status={task.status} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-1">
                        <button className="bg-transparent hover:bg-orange-500 text-orange-500 font-semibold hover:text-white py-1 px-4 border border-orange-500 hover:border-transparent rounded transition-all ease-in">
                            Cancel
                        </button>
                        <button className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded transition-all ease-in">
                            Delete
                        </button>
                    </div>
                </div>
                {task.details ? (
                    <TaskDetails details={task.details} />
                ) : ""}
                {task.error ? (
                    <ErrorAccordion
                        uid={task.uid}
                        header={"Error"}
                        content={<div>
                            <div className="p-3 bg-red-100 flex flex-col">
                                <span className="">{task.error.message}</span>
                            </div>
                        </div>}
                    />
                ) : ""}
                <div className="flex md:flex-row sm:flex-col w-full p-2">
                    <div className="flex flex-col w-full">
                        <div className="py-1 border-b border-b-gray-200 flex flex-col md:flex-row sm:flex-col sm:justify-start md:justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Enqueued at:</span>
                            <span className="px-1">{task.enqueuedAt}</span>
                        </div>
                        <div className="py-1 flex flex-col md:flex-row justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Duration:</span>
                            <span className="px-1">{task.duration}</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="py-1 border-b border-b-gray-200 flex flex-col md:flex-row md:justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Started at:</span>
                            <span className="px-1">{task.startedAt}</span>
                        </div>
                        <div className="py-1 flex flex-col md:flex-row justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Finished at:</span>
                            <span className="px-1">{task.finishedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        })}

        <PagePagination pagination={paginationData} setPaginationData={setPaginationData} />
    </div>
}

export default Page;

const TaskStatusBadge = ({ status }) => {
    const statusClassMap = {
        enqueued: "bg-blue-100",
        processing: "bg-yellow-100",
        succeeded: "bg-green-100",
        failed: "bg-red-100",
        canceled: "bg-orange-100"
    }

    let bgColorClass = "bg-red-100"
    if (statusClassMap[status] !== undefined) {
        bgColorClass = statusClassMap[status]
    }

    return <span className={`${bgColorClass} rounded-md px-2 py-1`}>{status}</span>
}

const TaskDetails = ({ details }) => {
    return <div className="py-2">
        {Object.keys(details).map((key, j) => {
            return <div key={j} className="md:flex sm:flex md:flex-row sm:flex-col p-1 border-b border-b-gray-200 last:border-b-0">
                <div className="md:pr-2 sm:w-full sm:pr-0">{key}</div>
                <div className="md:pl-2 sm:w-full sm:pl-0 text-gray-500">{details[key]}</div>
            </div>
        })}
    </div>
}

const ErrorAccordion = ({ uid, header, content }) => {
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


type PagePaginationProps = {
    pagination: PaginationData,
    setPaginationData: (p: PaginationData) => void
}

const PagePagination = (props: PagePaginationProps) => {
    return <div>
        <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing
                <span className="text-primary px-1">{props.pagination.from}</span>
                to
                <span className="text-primary px-1">{props.pagination.from + props.pagination.limit}</span>
                of
                <span className="text-primary px-1">{props.pagination.total}</span>
                Entries
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
                <button 
                    className="flex items-center justify-center px-4 h-10 text-base font-medium text-primary bg-white rounded-s hover:bg-primary hover:text-white transition-all ease border border-gray-200 rounded-md rounded-r-none"
                    onClick={() => {props.setPaginationData({...props.pagination, from: props.pagination.from - props.pagination.limit})}}
                    >
                    Prev
                </button>
                <button 
                    className="flex items-center justify-center px-4 h-10 text-base font-medium text-primary bg-white rounded-s hover:bg-primary hover:text-white transition-all ease border border-gray-200 rounded-md rounded-l-none border-l-0"
                    onClick={() => {props.setPaginationData({...props.pagination, from: props.pagination.from + props.pagination.limit})}}
                    >
                    Next
                </button>
            </div>
        </div>
    </div>
}