import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredUser, getStoredUser, setStoredUser, STORAGE_KEY } from './authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setUser(getStoredUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login: (u) => {
        setStoredUser(u)
        setUser(u)
      },
      logout: () => {
        clearStoredUser()
        setUser(null)
      },
      isLoggedIn: Boolean(user),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
