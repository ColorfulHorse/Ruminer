import { AxiosError, AxiosResponse } from 'axios'

export interface ResponseWrapper<T, U> {
  data: T | null
  err: U | null
}

export function awaitTo<T, U = any>(promise: Promise<AxiosResponse<T>>): Promise<ResponseWrapper<T, U>> {
  return promise
    .then<ResponseWrapper<T, U>>(data => {
      return {
        data: data.data,
        err: null
      }
    })
    .catch((err: AxiosError<U>) => {
      const errResp = err.response?.data
      return {
        data: null,
        err: errResp ?? null
      }
    })
}

// export function awaitTo2<T, U = any>(promise: Promise<AxiosResponse<T>>): Promise<[T | null, U | null]> {
//   return promise
//     .then<[T, null]>(data => [data.data, null])
//     .catch<[null, U]>(err => [null, err]);
// }
