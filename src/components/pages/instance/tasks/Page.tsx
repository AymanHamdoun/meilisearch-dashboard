// @ts-ignore
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks, getTaskStats, getBatches, TaskFilterOptions } from "../../../../services/meilisearch/tasks";
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import { GetTaskResponse, GetBatchResponse, _api_task_object, _api_batch_object } from "../../../../services/meilisearch/types";
import TaskStats from "./TaskStats";
import TaskFilters from "./TaskFilters";
import TasksTable from "./TasksTable";
import TasksPagination from "./TasksPagination";
import ActionsDropdown from "./ActionsDropdown";
import TaskDetailModal from "./TaskDetailModal";
import BatchesTable from "./BatchesTable";

type PaginationData = {
    from: number | null,
    limit: number,
    next: number | null,
    total: number
}

const TASKS_PER_PAGE = 20;
const TASK_HIGHLIGHT_DURATION_MS = 5000;

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
    const [highlightedTaskUid, setHighlightedTaskUid] = useState<number | null>(null)

    // Batches tab state
    const [activeTab, setActiveTab] = useState<'tasks' | 'batches'>('tasks')
    const [batches, setBatches] = useState<_api_batch_object[]>([])
    const [batchesLoading, setBatchesLoading] = useState(false)
    const [batchesPagination, setBatchesPagination] = useState<PaginationData>({ from: null, limit: TASKS_PER_PAGE, next: null, total: 0 })

    // Task detail modal
    const [selectedTask, setSelectedTask] = useState<_api_task_object | null>(null)
    const [showTaskDetail, setShowTaskDetail] = useState(false)

    // Date range filters
    const [afterEnqueuedAt, setAfterEnqueuedAt] = useState('')
    const [beforeEnqueuedAt, setBeforeEnqueuedAt] = useState('')

    const getFiltersFromParams = useCallback((): TaskFilterOptions & { page: number } => {
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const from = searchParams.get('from')
        const page = parseInt(searchParams.get('page') || '1')
        const taskUid = searchParams.get('taskuid')

        const filters: TaskFilterOptions & { page: number } = {
            statuses: status ? [status] : [],
            types: type ? [type] : [],
            from: from ? parseInt(from) : undefined,
            limit: TASKS_PER_PAGE,
            page,
            uids: taskUid ? [parseInt(taskUid)] : undefined
        }

        if (afterEnqueuedAt) filters.afterEnqueuedAt = new Date(afterEnqueuedAt).toISOString()
        if (beforeEnqueuedAt) filters.beforeEnqueuedAt = new Date(beforeEnqueuedAt).toISOString()

        return filters
    }, [searchParams, afterEnqueuedAt, beforeEnqueuedAt])

    const fetchTasks = useCallback((options: TaskFilterOptions) => {
        if (!instanceState.isLoaded) return
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
                setPaginationData({ from: null, limit: TASKS_PER_PAGE, next: null, total: 0 })
                setIsLoading(false)
            })
    }, [instanceState.isLoaded, instanceState.host, instanceState.key])

    const fetchBatches = useCallback(() => {
        if (!instanceState.isLoaded) return
        setBatchesLoading(true)
        getBatches(instanceState, { limit: TASKS_PER_PAGE })
            .then((data: GetBatchResponse) => {
                setBatches(data.results)
                setBatchesPagination({
                    from: data.from,
                    limit: data.limit,
                    next: data.next,
                    total: data.total
                })
                setBatchesLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching batches:', error)
                setBatchesLoading(false)
            })
    }, [instanceState.isLoaded, instanceState.host, instanceState.key])

    useEffect(() => {
        if (!instanceState.isLoaded) return

        let highlightTimer: NodeJS.Timeout | null = null

        const taskUidParam = searchParams.get('taskuid')
        if (taskUidParam) {
            const taskUid = parseInt(taskUidParam)
            if (!isNaN(taskUid)) {
                setHighlightedTaskUid(taskUid)
                highlightTimer = setTimeout(() => setHighlightedTaskUid(null), TASK_HIGHLIGHT_DURATION_MS)
            }
        }

        const filters = getFiltersFromParams()
        fetchTasks(filters)

        getTaskStats(instanceState).then(data => {
            setTaskStats(data)
        }).catch(error => {
            console.error('Error fetching task stats:', error)
        })

        return () => {
            if (highlightTimer) clearTimeout(highlightTimer)
        }
    }, [instanceState.isLoaded, searchParams, fetchTasks, getFiltersFromParams])

    useEffect(() => {
        if (activeTab === 'batches') fetchBatches()
    }, [activeTab, fetchBatches])

    const updateUrlParams = (updates: Partial<{statuses: string[], types: string[], from: number | undefined, page: number}>) => {
        const currentFilters = getFiltersFromParams()
        const newParams = new URLSearchParams()

        const statuses = updates.statuses !== undefined ? updates.statuses : currentFilters.statuses
        if (statuses && statuses.length > 0) newParams.set('status', statuses[0])

        const types = updates.types !== undefined ? updates.types : currentFilters.types
        if (types && types.length > 0) newParams.set('type', types[0])

        if (updates.from !== undefined) {
            newParams.set('from', updates.from.toString())
        } else if (currentFilters.from && updates.from === undefined) {
            newParams.set('from', currentFilters.from.toString())
        }

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
        if (activeTab === 'batches') fetchBatches()
    }, [getFiltersFromParams, fetchTasks, instanceState, activeTab, fetchBatches])

    const handleFilterChange = (filterType: 'statuses' | 'types', value: string) => {
        updateUrlParams({
            [filterType]: value === '' ? [] : [value],
            from: undefined,
            page: 1
        })
    }

    const handleDateFilterChange = (field: string, value: string) => {
        if (field === 'afterEnqueuedAt') setAfterEnqueuedAt(value)
        if (field === 'beforeEnqueuedAt') setBeforeEnqueuedAt(value)
    }

    const handleNextPage = () => {
        if (paginationData.next !== null) {
            const currentFilters = getFiltersFromParams()
            const nextPage = currentFilters.page + 1
            updateUrlParams({ from: paginationData.next, page: nextPage })
        }
    }

    const handlePrevPage = () => {
        const currentFilters = getFiltersFromParams()
        if (currentFilters.page <= 1) return

        const newParams = new URLSearchParams()
        if (currentFilters.statuses && currentFilters.statuses.length > 0) {
            newParams.set('status', currentFilters.statuses[0])
        }
        if (currentFilters.types && currentFilters.types.length > 0) {
            newParams.set('type', currentFilters.types[0])
        }
        setSearchParams(newParams)
    }

    const handleActionError = (error: Error) => {
        setError({
            type: 'api',
            message: `Action failed: ${error.message || 'Unknown error'}`
        })
    }

    const handleClearFilters = () => {
        setAfterEnqueuedAt('')
        setBeforeEnqueuedAt('')
        setSearchParams(new URLSearchParams())
    }

    const handleViewTask = (task: _api_task_object) => {
        setSelectedTask(task)
        setShowTaskDetail(true)
    }

    const currentFilters = getFiltersFromParams()

    const hasActiveFilters =
        (currentFilters.statuses && currentFilters.statuses.length > 0) ||
        (currentFilters.types && currentFilters.types.length > 0) ||
        (currentFilters.uids !== undefined) ||
        (currentFilters.page > 1) ||
        afterEnqueuedAt || beforeEnqueuedAt

    const startItem = tasks.length > 0 ? ((currentFilters.page - 1) * paginationData.limit) + 1 : 0
    const endItem = startItem + tasks.length - 1

    return (
        <div className="px-4 py-5">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-3xl font-semibold">Tasks</h1>
                <div className="flex gap-2">
                    <ActionsDropdown onError={handleActionError} />
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        aria-label="Refresh tasks"
                    >
                        Refresh
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            aria-label="Clear all filters"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-4 border-b border-gray-200">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`pb-2 text-sm font-medium border-b-2 ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('batches')}
                        className={`pb-2 text-sm font-medium border-b-2 ${activeTab === 'batches' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Batches
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <p className="text-red-700">{error.message}</p>
                    {error.type === 'network' && (
                        <button onClick={handleRefresh} className="mt-2 text-sm text-red-600 underline hover:text-red-800">
                            Try again
                        </button>
                    )}
                </div>
            )}

            {activeTab === 'tasks' ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                        <TaskStats total={paginationData.total} stats={taskStats} />
                        <TaskFilters
                            selectedStatus={currentFilters.statuses?.[0] || ''}
                            selectedType={currentFilters.types?.[0] || ''}
                            onFilterChange={handleFilterChange}
                            afterEnqueuedAt={afterEnqueuedAt}
                            beforeEnqueuedAt={beforeEnqueuedAt}
                            onDateFilterChange={handleDateFilterChange}
                        />
                    </div>

                    <TasksTable
                        tasks={tasks}
                        isLoading={isLoading}
                        highlightedTaskUid={highlightedTaskUid}
                    />

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
                </>
            ) : (
                <BatchesTable batches={batches} isLoading={batchesLoading} />
            )}

            <TaskDetailModal
                isVisible={showTaskDetail}
                onClose={() => { setShowTaskDetail(false); setSelectedTask(null); }}
                task={selectedTask}
            />
        </div>
    )
}

export default Page;
