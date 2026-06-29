import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiCreditCard, FiCheck, FiClock, FiPackage, FiTruck, FiHome } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getOrder } from '../../services/api'
import { toast } from 'react-toastify'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrder(id, user.token)
      setOrder(data)
    } catch (error) {
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="w-6 h-6" />
      case 'Processing':
        return <FiPackage className="w-6 h-6" />
      case 'Out for Delivery':
        return <FiTruck className="w-6 h-6" />
      case 'Delivered':
        return <FiCheck className="w-6 h-6" />
      default:
        return <FiClock className="w-6 h-6" />
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            Order not found
          </h2>
          <Link
            to="/dashboard/orders"
            className="text-secondary hover:text-orange-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-secondary mb-6"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Orders</span>
            </Link>

            {/* Order Header */}
            <div className="card p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary dark:text-white mb-2">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">
                    Order Items
                  </h2>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-lg font-semibold text-primary dark:text-white hover:text-secondary"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary">
                            RWF {(item.price * item.qty).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            RWF {item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">
                    Order Timeline
                  </h2>
                  <div className="space-y-4">
                    {order.statusHistory && order.statusHistory.length > 0 ? (
                      order.statusHistory.map((history, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4"
                        >
                          <div
                            className={`p-2 rounded-full ${getStatusColor(
                              history.status
                            )} flex-shrink-0`}
                          >
                            {getStatusIcon(history.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-primary dark:text-white">
                                {history.status}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(history.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {history.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {history.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No timeline updates available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Delivery Address */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">
                    <FiMapPin className="inline w-5 h-5 mr-2" />
                    Delivery Address
                  </h2>
                  {order.deliveryAddress ? (
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <strong>Phone:</strong> {order.deliveryAddress.phone}
                      </p>
                      {order.deliveryAddress.whatsapp && (
                        <p>
                          <strong>WhatsApp:</strong>{' '}
                          {order.deliveryAddress.whatsapp}
                        </p>
                      )}
                      <p>
                        <strong>Country:</strong> {order.deliveryAddress.country}
                      </p>
                      <p>
                        <strong>District:</strong> {order.deliveryAddress.district}
                      </p>
                      <p>
                        <strong>Sector:</strong> {order.deliveryAddress.sector}
                      </p>
                      <p>
                        <strong>Cell:</strong> {order.deliveryAddress.cell}
                      </p>
                      <p>
                        <strong>Village:</strong> {order.deliveryAddress.village}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No delivery address available
                    </p>
                  )}
                </div>

                {/* Payment Info */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">
                    <FiCreditCard className="inline w-5 h-5 mr-2" />
                    Payment Method
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {order.paymentMethod}
                  </p>
                  {order.isPaid && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Paid on {new Date(order.paidAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Items Price</span>
                      <span>RWF {order.itemsPrice?.toLocaleString()}</span>
                    </div>
                    {order.serviceFee && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Service Fee (3%)</span>
                        <span>RWF {order.serviceFee?.toLocaleString()}</span>
                      </div>
                    )}
                    {order.deliveryFee && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Delivery Fee</span>
                        <span>RWF {order.deliveryFee?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between text-lg font-bold text-primary dark:text-white">
                        <span>Total</span>
                        <span className="text-secondary">
                          RWF {order.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default OrderDetails
