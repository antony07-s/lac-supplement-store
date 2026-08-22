import axios from 'axios'

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api`,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('ayusydah-auth-expired'))
    }
    return Promise.reject(error)
  },
)

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
