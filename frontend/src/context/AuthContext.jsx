import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')
    const storedUserId = localStorage.getItem('userId')
    const storedEmailVerified = localStorage.getItem('emailVerified')
    if (storedToken && storedRole) {
      setToken(storedToken)
      setRole(storedRole)
      setUserId(storedUserId)
      setEmailVerified(storedEmailVerified === 'true')
    }
    setLoading(false)
  }, [])

  const login = ({ token: newToken, role: newRole, userId: newUserId, emailVerified: newEmailVerified }) => {
    setToken(newToken)
    setRole(newRole)
    setUserId(newUserId)
    setEmailVerified(newEmailVerified)
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
    if (newUserId) localStorage.setItem('userId', newUserId)
    localStorage.setItem('emailVerified', newEmailVerified ? 'true' : 'false')
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    setUserId(null)
    setEmailVerified(false)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('emailVerified')
  }

  const value = { token, role, userId, emailVerified, login, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

