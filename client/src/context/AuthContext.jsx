import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem('samadhan_token')) {
        setLoading(false)
        return
      }
      try {
        const { user: sessionUser } = await api('/auth/me')
        setUser(sessionUser)
      } catch {
        localStorage.removeItem('samadhan_token')
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const signIn = async (payload) => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem('samadhan_token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem('samadhan_token', data.token)
    setUser(data.user)
    return data.user
  }

  const signOut = () => {
    localStorage.removeItem('samadhan_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
