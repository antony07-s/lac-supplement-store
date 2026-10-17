/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    api.post('/auth/logout').catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    const handleExpiredAuth = () => setUser(null)
    window.addEventListener('ayusydah-auth-expired', handleExpiredAuth)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    api.get('/auth/me')
      .then((response) => { if (active) setUser(response.data.user) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setAuthReady(true) })
    return () => { active = false; window.removeEventListener('ayusydah-auth-expired', handleExpiredAuth) }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
