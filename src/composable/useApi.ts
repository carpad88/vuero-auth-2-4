import axios, { AxiosInstance } from 'axios'
import { interceptorErrors } from '/@src/utils/axios-error'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    withCredentials: true,
  })

  api.interceptors.response.use(undefined, interceptorErrors)

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
