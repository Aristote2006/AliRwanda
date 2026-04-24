import { createContext, useState, useEffect, useContext } from 'react'
import { login as loginApi, register as registerApi } from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for user in localStorage on mount
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo)
        setUser(parsedUser)
        console.log('✅ User loaded from localStorage:', parsedUser.email, 'Role:', parsedUser.role)
      } catch (error) {
        console.error('❌ Error parsing userInfo:', error)
        localStorage.removeItem('userInfo')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      // Use the API service (handles production URL automatically)
      const data = await loginApi(email, password)
      
      console.log('✅ Login response received:', data)
      console.log('📋 User role:', data.role)
      console.log('🔑 Token exists:', !!data.token)
      
      // Store complete user data including token
      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      
      // Show role-specific success message
      if (data.role === 'admin') {
        toast.success('✅ Admin login successful! Redirecting to dashboard...')
      } else {
        toast.success('✅ Login successful! Redirecting to your dashboard...')
      }
      
      return true
    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('📋 Error response:', error.response?.data)
      console.error('📋 Error status:', error.response?.status)
      
      const statusCode = error.response?.status
      const message = error.response?.data?.message
      
      // Better error messages based on status code
      if (statusCode === 401) {
        toast.error('❌ Invalid email or password. Please check your credentials and try again.')
      } else if (statusCode === 403) {
        toast.error('❌ Your account has been deactivated. Please contact support.')
      } else if (statusCode === 404) {
        toast.error('❌ No account found with this email. Please register first.')
      } else if (!error.response) {
        toast.error('❌ Cannot connect to server. Please check your internet connection.')
      } else {
        toast.error(`❌ ${message || 'Login failed. Please try again.'}`)
      }
      
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log('📝 Attempting registration for:', email)
      
      // Use the API service
      const data = await registerApi(name, email, password)
      
      console.log('✅ Registration response received:', data)
      
      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Registration successful!')
      return true
    } catch (error) {
      console.error('❌ Registration error:', error)
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userInfo')
    toast.info('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
