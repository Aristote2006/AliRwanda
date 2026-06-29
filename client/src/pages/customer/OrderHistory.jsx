import { useState, useEffect } from 'react'
import { FiShoppingBag, FiEye, FiCalendar, FiMapPin, FiCreditCard, FiTruck } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyOrders } from '../../services/api'
import { toast } from 'react-toastify'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderHistory = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getMyOrders(user.token)
      setOrders(data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-8">
              My Orders
            </h1>

            {orders.length === 0 ? (
              <div className="card p-12 text-center">
                <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start shopping to see your orders here
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="card overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-primary dark:text-white">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{order.orderItems.length} items</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/dashboard/orders/${order._id}`}
                          className="inline-flex items-center space-x-2 px-4 py-2 text-secondary hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <FiEye className="w-5 h-5" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <div key={item._id} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            +{order.orderItems.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <FiMapPin className="w-4 h-4" />
                            <span className="truncate max-w-[150px]">
                              {order.deliveryAddress?.district || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <FiCreditCard className="w-4 h-4" />
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Total
                          </p>
                          <p className="text-xl font-bold text-secondary">
                            RWF {order.totalPrice?.toLocaleString()}
                          </p>
                        </div>
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

export default OrderHistory
