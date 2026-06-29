import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, 
  FiCheck, FiX, FiTruck, FiClock, FiPrinter,
  FiDownload, FiMail, FiPhone
} from 'react-icons/fi'
import { getOrderById, updateOrderStatus } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const AdminOrderDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(id, user.token)
      setOrder(data)
    } catch (error) {
      toast.error('Failed to fetch order details')
      navigate('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await updateOrderStatus(id, { status: newStatus }, user.token)
      toast.success('Order status updated successfully')
      fetchOrderDetails()
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="w-5 h-5" />
      case 'Processing':
        return <FiPackage className="w-5 h-5" />
      case 'Shipped':
        return <FiTruck className="w-5 h-5" />
      case 'Delivered':
        return <FiCheck className="w-5 h-5" />
      case 'Cancelled':
        return <FiX className="w-5 h-5" />
      default:
        return <FiClock className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Order not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/orders"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h1>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 hidden lg:block">
        <Link
          to="/admin/orders"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FiPrinter className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FiDownload className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {order.status}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current order status
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate('Pending')}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusUpdate('Processing')}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Processing
                </button>
                <button
                  onClick={() => handleStatusUpdate('Shipped')}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Shipped
                </button>
                <button
                  onClick={() => handleStatusUpdate('Delivered')}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Delivered
                </button>
                <button
                  onClick={() => handleStatusUpdate('Cancelled')}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.qty} × RWF {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    RWF {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Timeline</h3>
            <div className="space-y-4">
              {order.statusHistory?.map((history, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(history.status)}`}>
                    {getStatusIcon(history.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{history.status}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(history.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {order.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{order.user?.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FiPhone className="w-4 h-4" />
                  <span>{order.deliveryAddress?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Delivery Address</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="text-gray-600 dark:text-gray-400">
                  <p>{order.deliveryAddress?.village}</p>
                  <p>{order.deliveryAddress?.cell}</p>
                  <p>{order.deliveryAddress?.sector}</p>
                  <p>{order.deliveryAddress?.district}</p>
                  <p>{order.deliveryAddress?.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiCreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{order.paymentMethod}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                <p className="font-semibold text-green-600 dark:text-green-400">Paid</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>RWF {order.itemsPrice?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>RWF {order.deliveryFee?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Service Fee (3%)</span>
                <span>RWF {order.serviceFee?.toLocaleString() || 0}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    RWF {order.totalPrice?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default AdminOrderDetails
