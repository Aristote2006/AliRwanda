import { useState, useEffect } from 'react'
import { FiBell, FiCheck, FiTrash2, FiShoppingBag, FiPackage, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../services/api'
import { toast } from 'react-toastify'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Notifications = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const [data, count] = await Promise.all([
        getNotifications(user.token),
        getUnreadCount(user.token),
      ])
      setNotifications(data)
      setUnreadCount(count)
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, user.token)
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.token)
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, user.token)
      setNotifications(notifications.filter((notif) => notif._id !== id))
      const deletedNotif = notifications.find((n) => n._id === id)
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="w-5 h-5" />
      case 'delivery':
        return <FiPackage className="w-5 h-5" />
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />
      case 'error':
        return <FiXCircle className="w-5 h-5" />
      default:
        return <FiInfo className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
      case 'delivery':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
      case 'success':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
      case 'error':
        return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-primary dark:text-white">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                >
                  <FiCheck className="w-5 h-5" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="card p-12 text-center">
                <FiBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`card p-4 sm:p-6 relative ${
                      !notification.isRead
                        ? 'bg-white dark:bg-gray-800 border-l-4 border-l-secondary'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-full ${getNotificationColor(
                          notification.type
                        )} flex-shrink-0`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-primary dark:text-white">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <FiCheck className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {notification.message}
                        </p>

                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="inline-flex items-center space-x-1 text-secondary hover:text-orange-600 font-medium"
                          >
                            <span>View Details</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Notifications
