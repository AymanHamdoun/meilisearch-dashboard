// @ts-ignore
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks, getTaskStats, TaskFilterOptions } from "../../../../services/meilisearch/tasks";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { GetTaskResponse, _api_task_object } from "../../../../services/meilisearch/types";
import TaskStats from "./TaskStats";
import TaskFilters from "./TaskFilters";
import TasksTable from "./TasksTable";
import TasksPagination from "./TasksPagination";

type PaginationData = {
    from: number | null,  // This is a task UID, not an offset
    limit: number,
    next: number | null,   // This is also a task UID
    total: number
}

const TASKS_PER_PAGE = 20;

const Page = () => {
    const { instanceState } = useMeiliInstance()
    const [searchParams, setSearchParams] = useSearchParams()
    const [tasks, setTasks] = useState<_api_task_object[]>([])
    const [taskStats, setTaskStats] = useState<{ [key: string]: number }>({})
    const [paginationData, setPaginationData] = useState<PaginationData>({
        from: null,
        limit: TASKS_PER_PAGE,
        next: null,
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<{ type: 'network' | 'api', message: string } | null>(null)

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
            limit: TASKS_PER_PAGE,
            page
        }
    }, [searchParams])

    const fetchTasks = useCallback((options: TaskFilterOptions) => {
        if (!instanceState.isLoaded) {
            return
        }
        setIsLoading(true)
        setError(null)
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
                const errorType = error.message?.includes('network') || error.message?.includes('fetch') ? 'network' : 'api'
                setError({
                    type: errorType,
                    message: errorType === 'network'
                        ? 'Unable to connect to Meilisearch. Please check your connection.'
                        : `Failed to load tasks: ${error.message || 'Unknown error'}`
                })
                setTasks([])
                setPaginationData({
                    from: null,
                    limit: TASKS_PER_PAGE,
                    next: null,
                    total: 0
                })
                setIsLoading(false)
            })
    }, [instanceState.isLoaded, instanceState.host, instanceState.key])

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

    const handleRefresh = useCallback(() => {
        const filters = getFiltersFromParams()
        fetchTasks(filters)
        getTaskStats(instanceState).then(data => {
            setTaskStats(data)
        }).catch(error => {
            console.error('Error fetching task stats:', error)
        })
    }, [getFiltersFromParams, fetchTasks, instanceState])

    const handleFilterChange = (filterType: 'statuses' | 'types', value: string) => {
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
            const nextPage = currentFilters.page + 1
            updateUrlParams({ from: paginationData.next, page: nextPage })
        }
    }

    const handlePrevPage = () => {
        // Since Meilisearch doesn't support backward pagination by UID,
        // we can only go back to the first page
        const currentFilters = getFiltersFromParams()
        if (currentFilters.page <= 1) {
            return
        }

        // Reset to first page when going back
        const newParams = new URLSearchParams()

        // Keep only the filters
        if (currentFilters.statuses && currentFilters.statuses.length > 0) {
            newParams.set('status', currentFilters.statuses[0])
        }
        if (currentFilters.types && currentFilters.types.length > 0) {
            newParams.set('type', currentFilters.types[0])
        }

        setSearchParams(newParams)
    }

    const currentFilters = getFiltersFromParams()

    // Calculate display range for pagination
    const startItem = tasks.length > 0 ? ((currentFilters.page - 1) * paginationData.limit) + 1 : 0
    const endItem = startItem + tasks.length - 1

    return (
        <div className="px-4 py-5">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-3xl font-semibold">Tasks</h1>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Refresh tasks"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Error display */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <p className="text-red-700">{error.message}</p>
                    {error.type === 'network' && (
                        <button
                            onClick={handleRefresh}
                            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                        >
                            Try again
                        </button>
                    )}
                </div>
            )}

            {/* Stats and Filters Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                <TaskStats
                    total={paginationData.total}
                    stats={taskStats}
                />

                <TaskFilters
                    selectedStatus={currentFilters.statuses?.[0] || ''}
                    selectedType={currentFilters.types?.[0] || ''}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Tasks Table */}
            <TasksTable
                tasks={tasks}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {tasks.length > 0 && (
                <TasksPagination
                    startItem={startItem}
                    endItem={endItem}
                    total={paginationData.total}
                    currentPage={currentFilters.page}
                    canGoNext={paginationData.next !== null}
                    canGoPrev={currentFilters.page > 1}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                />
            )}
        </div>
    )
}

export default Page;