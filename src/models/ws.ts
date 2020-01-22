export const wsNotFound = 4404
export const wsUnauthorized = 4401

export const host = 'localhost:8080'

export const ok = 'ok'
export const error = 'error'

export interface Response {
    status: 'ok' | 'error'
    errors?: string[]
    data?: any
}

export interface CommandResponse<T> {
    status: 'ok' | 'error'
    data?: T
    errors?: string[]
}
