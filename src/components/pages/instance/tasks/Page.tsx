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
    const [isLoading, setIsLoading] = useState(true)
    // taskHistory: Stores task UIDs for pagination back-navigation since Meilisearch uses UIDs not offsets
    const [taskHistory, setTaskHistory] = useState<number[]>([])

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

        if (currentFilters.page <= 1 || taskHistory.length === 0) {
            return
        }
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

    const currentFilters = getFiltersFromParams()

    // Calculate display range for pagination
    const startItem = tasks.length > 0 ? ((currentFilters.page - 1) * paginationData.limit) + 1 : 0
    const endItem = startItem + tasks.length - 1

    return (
        <div className="px-4 py-5">
            <h1 className="text-3xl font-semibold mb-3">Tasks</h1>

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