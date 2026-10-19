/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import api, { getWithRetry } from '../api/axios.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const authRevision = useRef(0)
  const authReadyRef = useRef(false)

  useEffect(() => { authReadyRef.current = authReady }, [authReady])

  const login = useCallback((userData) => {
    authRevision.current += 1
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    authRevision.current += 1
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    api.post('/auth/logout').catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    const initialRevision = authRevision.current
    const handleExpiredAuth = () => {
      if (authReadyRef.current) {
        authRevision.current += 1
        setUser(null)
      }
    }
    window.addEventListener('ayusydah-auth-expired', handleExpiredAuth)
    getWithRetry('/auth/me')
      .then((response) => { if (active && authRevision.current === initialRevision) setUser(response.data.user) })
      .catch(() => { if (active && authRevision.current === initialRevision) setUser(null) })
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
