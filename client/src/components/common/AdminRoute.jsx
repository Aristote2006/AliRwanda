import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  console.log('🔐 AdminRoute - Loading:', loading, 'User:', user?.email, 'Role:', user?.role)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!user) {
    console.log('❌ No user found, redirecting to home')
    return <Navigate to="/" replace />
  }

  if (user.role !== 'admin') {
    console.log('❌ User is not admin, redirecting to home. Role:', user.role)
    return <Navigate to="/" replace />
  }

  console.log('✅ Admin access granted')
  return children
}

export default AdminRoute
