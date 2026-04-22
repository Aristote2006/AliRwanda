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
      toast.success('Login successful!')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
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
