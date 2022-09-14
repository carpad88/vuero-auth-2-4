export const interceptorErrors = async (error: any) => {
  const { status, data } = error.response

  if (status === 401 || status === 419) {
    const { logoutUser } = useUserSession()
    const router = useRouter()

    await logoutUser()
    await router.push('/')

    return Promise.reject(error)
  }

  if (status === 422) {
    return Promise.reject(data)
  }

  return Promise.reject(error)
}
