import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface AuthUser {
  _id: string
  fullname: string
  email: string
  role: 'customer' | 'admin'
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (fullname: string, email: string, password: string) => Promise<void>
  updateProfile: (data: { fullname?: string; password?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const API = 'http://localhost:3001/api'

const TOKEN_KEY = 'artstudio_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount: restore token from storage and verify it
  useEffect(() => {
    const stored =
      localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
    if (stored) {
      setToken(stored)
      fetchMe(stored)
    } else {
      setIsLoading(false)
    }
  }, [])

  async function fetchMe(t: string) {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        clearAuth()
      }
    } catch {
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }

  function persistToken(t: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, t)
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, t)
      localStorage.removeItem(TOKEN_KEY)
    }
    setToken(t)
  }

  function clearAuth() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  }

  async function login(email: string, password: string, rememberMe = false) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Login failed')
    persistToken(data.token, rememberMe)
    setUser(data.user)
  }

  async function register(fullname: string, email: string, password: string) {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Registration failed')
    persistToken(data.token, true)
    setUser(data.user)
  }

  async function updateProfile(updates: { fullname?: string; password?: string }) {
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Update failed')
    setUser(data)
  }

  function logout() {
    clearAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
