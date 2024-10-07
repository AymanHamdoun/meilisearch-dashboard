import { number, string } from "prop-types"

export interface GetTaskResponse {
    results: _api_task_object[]
    total: number
    limit: number
    from: number
    next: number
  }

export interface _api_task_object {
    uid: number
    indexUid: string
    status: string
    type: string
    canceledBy: any
    details: _api_task_details
    error: _api_task_error
    duration: string
    enqueuedAt: string
    startedAt: string
    finishedAt: string
}

export interface _api_task_details {
    receivedDocuments: number
    indexedDocuments: number
}

export interface _api_task_error {
    message: string
    code: string
    type: string
    link: string
}
