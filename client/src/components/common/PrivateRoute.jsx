import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  console.log('🔒 PrivateRoute - Loading:', loading, 'User:', user?.email, 'Role:', user?.role)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    console.log('❌ No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ User authenticated, allowing access')
  return children
}

export default PrivateRoute
