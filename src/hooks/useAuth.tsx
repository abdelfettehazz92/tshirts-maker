import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User, AuthState } from '../types'
import apiService from '../services/api'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    email: string
    password: string
    firstname: string
    lastname: string
    phone?: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  })

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiService.login(email, password)
      
      if (response.success && response.data) {
        const { user, token } = response.data
        
        localStorage.setItem('token', token)
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    firstname: string
    lastname: string
    phone?: string
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiService.signup(userData)
      
      if (response.success && response.data) {
        const { user, token } = response.data
        
        localStorage.setItem('token', token)
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        throw new Error(response.message || 'Signup failed')
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(userData)
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data,
        }))
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error) {
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.checkAuth()
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        }))
      } else {
        // Token is invalid, logout
        localStorage.removeItem('token')
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        await refreshUser()
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, [])

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  }

  if (authState.isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 