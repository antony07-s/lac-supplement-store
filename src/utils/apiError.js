export function apiErrorMessage(error, fallback) {
  const responseMessage = error?.response?.data?.message
  if (typeof responseMessage === 'string' && responseMessage.trim()) return responseMessage

  const status = error?.response?.status
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'Your account does not have permission to do this.'
  if (status >= 500) return 'The server could not complete the request. Please try again shortly.'
  if (!error?.response) return 'Could not reach the server. Check your connection and try again.'
  return fallback
}
