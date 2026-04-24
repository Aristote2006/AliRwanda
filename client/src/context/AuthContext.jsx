import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
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
    // Check for user in localStorage
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      })
      
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
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      })
      
      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Registration successful!')
      return true
    } catch (error) {
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
