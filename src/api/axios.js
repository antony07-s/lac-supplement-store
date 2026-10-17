import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const localApiUrl = !configuredApiUrl || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredApiUrl)
const apiBaseUrl = import.meta.env.DEV && localApiUrl
  ? '/api'
  : `${(configuredApiUrl || 'http://localhost:5000').replace(/\/$/, '')}/api`

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'AUTH_REQUIRED') {
      window.dispatchEvent(new Event('ayusydah-auth-expired'))
    }
    return Promise.reject(error)
  },
)

export const setRequestTimeout = (config = {}, timeout = 60000) => ({ ...config, timeout })

const wait = (delay, signal) => new Promise((resolve, reject) => {
  const timeout = window.setTimeout(resolve, delay)
  signal?.addEventListener('abort', () => {
    window.clearTimeout(timeout)
    reject(new axios.CanceledError())
  }, { once: true })
})

// Render may need a moment to wake after inactivity. Retry only temporary failures.
export async function getWithRetry(url, config = {}, retries = 2) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await api.get(url, config)
    } catch (error) {
      const status = error.response?.status
      const temporaryFailure = !status || status === 408 || status === 429 || status >= 500
      if (error.code === 'ERR_CANCELED' || !temporaryFailure || attempt >= retries) throw error
      await wait(1000 * (attempt + 1), config.signal)
    }
  }
}

export default api
