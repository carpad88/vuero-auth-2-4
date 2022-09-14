import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { interceptorErrors } from '/@src/utils/axios-error'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(undefined, interceptorErrors)

const useAuth = () => {
  const login = async (payload: {
    email: string
    password: string
  }): Promise<AxiosResponse> => {
    await api.get('/sanctum/csrf-cookie')
    return await api.post('/login', payload)
  }

  const resetPassword = async (payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<AxiosResponse> => await api.post('/reset-password', payload)

  const forgotPassword = async (payload: { email: string }): Promise<AxiosResponse> =>
    await api.post('/forgot-password', payload)

  const logout = async (): Promise<AxiosResponse> => await api.post('/logout')

  return {
    login,
    resetPassword,
    forgotPassword,
    logout,
  }
}

export default useAuth
