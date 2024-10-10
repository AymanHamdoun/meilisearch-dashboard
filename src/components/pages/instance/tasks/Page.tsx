import React, { useEffect, useState } from "react";
import { getTasks, getTaskStats } from "../../../../services/meilisearch/tasks";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { GetTaskResponse, _api_task_object } from "../../../../services/meilisearch/types";



import {DateTime, Duration} from 'luxon'
import { ErrorAccordion, TaskDetails, TaskStatusBadge } from "./Widgets";
import FilterDropdown from "./Filters";

type PaginationData = {
    from: number,
    limit: number,
    next: number,
    total: number
}

const Page = () => {
    const { instanceState } = useMeiliInstance()
    const [tasks, setTasks] = useState<_api_task_object[]>([])
    const [taskStats, setTaskStats] = useState<{ [key: string]: number }>({})
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

        getTaskStats(instanceState).then(data => {
            setTaskStats(data)
        })
    }, [])


    return <div className="px-4 py-5">
        <h1 className="text-3xl font-semibold mb-3">Tasks</h1>
        <div className="flex flex-row justify-between items-end gap-3 mb-3">
            <div>
            <span className={`text-gray-600 px-2 py-1`}>{paginationData.total} Total</span>
            {Object.keys(taskStats).map((status) => {
                return <span className={`text-gray-500 px-2 py-1`}>{taskStats[status]} {status}</span>
            })}
            </div>
            <FilterDropdown applyFilters={(selectedFilters) => {
                // @TODO API CALL 
                console.log(selectedFilters)
            }}/>
        </div>
        <PagePagination pagination={paginationData} setPaginationData={setPaginationData} />
        {tasks.map((task: _api_task_object) => {
            return <div className="p-3 bg-white border border-gray-100 shadow-md rounded-sm mb-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex flex-col md:flex-row gap-2">
                        {task.indexUid !== null ? (
                            <span className="px-2 py-1 border-r border-r-gray-200 font-semibold">{task.indexUid}</span>
                        ) : ""}
                        <span className="bg-gray-100 rounded-sm px-2 py-1 font-semibold">#{task.uid}</span>
                        <span className="bg-gray-100 rounded-sm px-2 py-1">{task.type}</span>
                        <TaskStatusBadge rounded={false} colorClassPrefix={"bg"} status={task.status} label={task.status}/>
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
                            <span className="px-1">
                                {DateTime.fromISO(task.enqueuedAt, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                        <div className="py-1 flex flex-col md:flex-row justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Duration:</span>
                            <span className="px-1">
                                {task.duration ? Duration.fromISO(task.duration).toObject().seconds + ' Seconds' : '-'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="py-1 border-b border-b-gray-200 flex flex-col md:flex-row md:justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Started at:</span>
                            <span className="px-1">
                                {task.startedAt ? DateTime.fromISO(task.startedAt, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss') : '-'}
                            </span>
                        </div>
                        <div className="py-1 flex flex-col md:flex-row justify-stretch">
                            <span className="font-semibold md:w-1/4 w-full">Finished at:</span>
                            <span className="px-1">
                                {task.finishedAt ? DateTime.fromISO(task.finishedAt, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss') : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        })}

        <PagePagination pagination={paginationData} setPaginationData={setPaginationData} />
    </div>
}

export default Page;


type PagePaginationProps = {
    pagination: PaginationData,
    setPaginationData: (p: PaginationData) => void
}

const PagePagination = (props: PagePaginationProps) => {
    return <div className="my-2">
        <div className="flex flex-row gap-2 items-center justify-between">
            <span className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-400">
                Showing
                <span className="text-primary px-1">{props.pagination.from}</span>
                to
                <span className="text-primary px-1">{props.pagination.from + props.pagination.limit}</span>
                of
                <span className="text-primary px-1">{props.pagination.total}</span>
                Entries
            </span>
            <div className="inline-flex xs:mt-0">
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