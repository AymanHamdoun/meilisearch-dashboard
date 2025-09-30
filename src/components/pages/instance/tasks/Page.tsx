// @ts-ignore
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks, getTaskStats, TaskFilterOptions } from "../../../../services/meilisearch/tasks";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { GetTaskResponse, _api_task_object } from "../../../../services/meilisearch/types";
import { DateTime, Duration } from 'luxon'
import { TaskStatusBadge } from "./Widgets";

type PaginationData = {
    from: number | null,  // This is a task UID, not an offset
    limit: number,
    next: number | null,   // This is also a task UID
    total: number
}

const availableFilters = {
    types: [
        { value: "indexCreation", label: "Index Creation" },
        { value: "indexUpdate", label: "Index Update" },
        { value: "indexDeletion", label: "Index Deletion" },
        { value: "indexSwap", label: "Index Swap" },
        { value: "documentAdditionOrUpdate", label: "Document Addition/Update" },
        { value: "documentDeletion", label: "Document Deletion" },
        { value: "settingsUpdate", label: "Settings Update" },
        { value: "dumpCreation", label: "Dump Creation" },
        { value: "taskCancelation", label: "Task Cancelation" },
        { value: "taskDeletion", label: "Task Deletion" }
    ],
    statuses: [
        { value: "enqueued", label: "Enqueued" },
        { value: "processing", label: "Processing" },
        { value: "succeeded", label: "Succeeded" },
        { value: "failed", label: "Failed" },
        { value: "canceled", label: "Canceled" }
    ]
}

const Page = () => {
    const { instanceState } = useMeiliInstance()
    const [searchParams, setSearchParams] = useSearchParams()
    const [tasks, setTasks] = useState<_api_task_object[]>([])
    const [taskStats, setTaskStats] = useState<{ [key: string]: number }>({})
    const [paginationData, setPaginationData] = useState<PaginationData>({
        from: null,
        limit: 20,
        next: null,
        total: 0
    })
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [taskHistory, setTaskHistory] = useState<number[]>([])  // Store from UIDs for back navigation

    // Parse filters from URL query parameters without side effects
    const getFiltersFromParams = useCallback((): TaskFilterOptions & { page: number } => {
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const from = searchParams.get('from')
        const page = parseInt(searchParams.get('page') || '1')

        return {
            statuses: status ? [status] : [],
            types: type ? [type] : [],
            from: from ? parseInt(from) : undefined,
            limit: 20,
            page
        }
    }, [searchParams])

    const fetchTasks = useCallback((options: TaskFilterOptions) => {
        if (!instanceState.isLoaded) {
            return
        }
        setIsLoading(true)
        getTasks(instanceState, options)
            .then((data: GetTaskResponse) => {
                setTasks(data.results)
                setPaginationData({
                    from: data.from,
                    limit: data.limit,
                    next: data.next,
                    total: data.total
                })
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error)
                // Set empty data on error
                setTasks([])
                setPaginationData({
                    from: null,
                    limit: 20,
                    next: null,
                    total: 0
                })
                setIsLoading(false)
            })
    }, [instanceState])

    // Load tasks whenever URL params or instance state changes
    useEffect(() => {
        if (!instanceState.isLoaded) {
            return
        }

        const filters = getFiltersFromParams()
        fetchTasks(filters)

        getTaskStats(instanceState).then(data => {
            setTaskStats(data)
        }).catch(error => {
            console.error('Error fetching task stats:', error)
        })
    }, [instanceState.isLoaded, searchParams, fetchTasks, getFiltersFromParams])

    const updateUrlParams = (updates: Partial<{statuses: string[], types: string[], from: number | undefined, page: number}>) => {
        const currentFilters = getFiltersFromParams()
        const newParams = new URLSearchParams()

        // Handle status filter
        const statuses = updates.statuses !== undefined ? updates.statuses : currentFilters.statuses
        if (statuses && statuses.length > 0) {
            newParams.set('status', statuses[0])
        }

        // Handle type filter
        const types = updates.types !== undefined ? updates.types : currentFilters.types
        if (types && types.length > 0) {
            newParams.set('type', types[0])
        }

        // Handle pagination
        if (updates.from !== undefined) {
            newParams.set('from', updates.from.toString())
        } else if (currentFilters.from && updates.from === undefined) {
            // Keep current from if not explicitly changing
            newParams.set('from', currentFilters.from.toString())
        }

        // Handle page number (for display purposes)
        if (updates.page !== undefined && updates.page > 1) {
            newParams.set('page', updates.page.toString())
        }

        setSearchParams(newParams)
    }

    const handleFilterChange = (filterType: 'statuses' | 'types', value: string) => {
        // Reset pagination when filters change
        setTaskHistory([])

        const update = {
            [filterType]: value === '' ? [] : [value],
            from: undefined,
            page: 1
        }
        updateUrlParams(update)
    }

    const handleNextPage = () => {
        if (paginationData.next !== null) {
            const currentFilters = getFiltersFromParams()
            // Store current from value in history for back navigation
            if (paginationData.from !== null) {
                setTaskHistory(prev => [...prev, paginationData.from as number])
            }
            const nextPage = currentFilters.page + 1
            updateUrlParams({ from: paginationData.next, page: nextPage })
        }
    }

    const handlePrevPage = () => {
        const currentFilters = getFiltersFromParams()

        if (currentFilters.page > 1) {
            if (taskHistory.length > 0) {
                const newHistory = [...taskHistory]
                const prevFrom = newHistory.pop()
                setTaskHistory(newHistory)
                const prevPage = currentFilters.page - 1

                if (prevPage === 1) {
                    // Going back to first page - remove both from and page params
                    const newParams = new URLSearchParams()

                    // Keep only the filters
                    if (currentFilters.statuses && currentFilters.statuses.length > 0) {
                        newParams.set('status', currentFilters.statuses[0])
                    }
                    if (currentFilters.types && currentFilters.types.length > 0) {
                        newParams.set('type', currentFilters.types[0])
                    }

                    setSearchParams(newParams)
                } else {
                    updateUrlParams({ from: prevFrom, page: prevPage })
                }
            }
        }
    }

    const toggleRowExpand = (taskUid: number) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(taskUid)) {
            newExpanded.delete(taskUid)
        } else {
            newExpanded.add(taskUid)
        }
        setExpandedRows(newExpanded)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-'
        return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss')
    }

    const formatDuration = (duration: string | null) => {
        if (!duration) return '-'
        return Duration.fromISO(duration).toObject().seconds + ' s'
    }

    const currentFilters = getFiltersFromParams()

    // Calculate display range
    const startItem = tasks.length > 0 ? ((currentFilters.page - 1) * paginationData.limit) + 1 : 0
    const endItem = startItem + tasks.length - 1

    return (
        <div className="px-4 py-5">
            <h1 className="text-3xl font-semibold mb-3">Tasks</h1>

            {/* Stats and Filters Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                    <span className="text-gray-600 px-2 py-1 bg-gray-50 rounded">{paginationData.total} Total</span>
                    {Object.keys(taskStats).map((status, i) => (
                        <span key={i} className="text-gray-500 px-2 py-1 bg-gray-50 rounded">
                            {taskStats[status]} {status}
                        </span>
                    ))}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex gap-2">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={currentFilters.statuses?.[0] || ''}
                        onChange={(e) => handleFilterChange('statuses', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {availableFilters.statuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={currentFilters.types?.[0] || ''}
                        onChange={(e) => handleFilterChange('types', e.target.value)}
                    >
                        <option value="">All Types</option>
                        {availableFilters.types.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tasks Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500">Loading tasks...</div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
                    <div className="text-gray-500">No tasks found</div>
                </div>
            ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Index
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Enqueued At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task: _api_task_object) => (
                            <React.Fragment key={task.uid}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{task.uid}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {task.indexUid || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                                            {task.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <TaskStatusBadge rounded={true} status={task.status} label={task.status}/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(task.enqueuedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDuration(task.duration)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-primary hover:text-primary-dark mr-3"
                                            onClick={() => toggleRowExpand(task.uid)}
                                        >
                                            {expandedRows.has(task.uid) ? 'Hide' : 'Details'}
                                        </button>
                                        <button className="text-orange-500 hover:text-orange-600 mr-3">
                                            Cancel
                                        </button>
                                        <button className="text-red-500 hover:text-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {/* Expanded Details Row */}
                                {expandedRows.has(task.uid) && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-semibold">Started at:</span>
                                                        <span className="ml-2 text-gray-600">{formatDate(task.startedAt)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">Finished at:</span>
                                                        <span className="ml-2 text-gray-600">{formatDate(task.finishedAt)}</span>
                                                    </div>
                                                </div>

                                                {task.details && (
                                                    <div className="bg-white p-3 rounded border border-gray-200">
                                                        <span className="font-semibold text-sm">Details:</span>
                                                        <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                                                            {JSON.stringify(task.details, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}

                                                {task.error && (
                                                    <div className="bg-red-50 p-3 rounded border border-red-200">
                                                        <span className="font-semibold text-sm text-red-700">Error:</span>
                                                        <p className="mt-1 text-sm text-red-600">{task.error.message}</p>
                                                        {task.error.code && (
                                                            <p className="mt-1 text-xs text-red-500">Code: {task.error.code}</p>
                                                        )}
                                                        {task.error.type && (
                                                            <p className="text-xs text-red-500">Type: {task.error.type}</p>
                                                        )}
                                                        {task.error.link && (
                                                            <a href={task.error.link} target="_blank" rel="noopener noreferrer"
                                                               className="text-xs text-red-600 underline hover:text-red-700">
                                                                More info
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            )}

            {/* Pagination */}
            {tasks.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                <span className="text-sm text-gray-700 mb-2 sm:mb-0">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span>{' '}
                    of <span className="font-medium">{paginationData.total}</span> results
                    {currentFilters.page > 1 && <span className="ml-2">(Page {currentFilters.page})</span>}
                </span>

                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePrevPage}
                        disabled={currentFilters.page === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={paginationData.next === null}
                    >
                        Next
                    </button>
                </div>
            </div>
            )}
        </div>
    )
}

export default Page;