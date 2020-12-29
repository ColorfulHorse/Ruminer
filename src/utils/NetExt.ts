import { AxiosError, AxiosResponse } from 'axios'

export interface ResponseWrapper<T, U> {
  data: T | null
  err: U | null
}

export interface AxiosResponseWrapper<T, U> {
  data: T | null
  err: ErrorResponse<U> | null
}

export interface ErrorResponse<T> {
  code: string | null
  data: T | null
}

export function axiosTask<T, U = any>(promise: Promise<AxiosResponse<T>>): Promise<AxiosResponseWrapper<T, U>> {
  return promise
    .then<AxiosResponseWrapper<T, U>>(data => {
      return {
        data: data.data,
        err: null
      }
    })
    .catch((err: AxiosError<U>) => {
      const errResp = err.response?.data
      return {
        data: null,
        err: {
          code: err.code ?? null,
          data: errResp ?? null
        }
      }
    })
}

export function task<T = any, U = any>(promise: Promise<T>): Promise<ResponseWrapper<T, U>> {
  return promise
    .then<ResponseWrapper<T, U>>(data => {
      return {
        data: data,
        err: null
      }
    })
    .catch((err: U) => {
      return {
        data: null,
        err: err
      }
    })
}
