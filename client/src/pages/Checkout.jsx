import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import { getDeliveryFee, getDistricts } from '../utils/deliveryFees'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    phone: '',
    whatsapp: '',
    country: 'Rwanda',
    district: '',
    sector: '',
    cell: '',
    village: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money')
  const [loading, setLoading] = useState(false)

  const itemsPrice = getCartTotal()
  const serviceFee = itemsPrice * 0.03 // 3% service fee
  const deliveryFee = deliveryAddress.district ? getDeliveryFee(deliveryAddress.district) : 3000
  const total = itemsPrice + serviceFee + deliveryFee

  const handleInputChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
        })),
        deliveryAddress,
        paymentMethod,
        itemsPrice: getCartTotal(),
        serviceFee: serviceFee,
        deliveryFee: deliveryFee,
        totalPrice: total,
      }

      const order = await createOrder(orderData, user.token)
      
      toast.success('Order placed successfully!')
      clearCart()
      navigate('/dashboard/orders')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <h1 className="text-4xl font-bold text-primary dark:text-white mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Delivery Information */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
                Delivery Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={deliveryAddress.whatsapp}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={deliveryAddress.country}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District *
                  </label>
                  <select
                    name="district"
                    value={deliveryAddress.district}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select District</option>
                    {getDistricts().map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sector *
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={deliveryAddress.sector}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cell *
                  </label>
                  <input
                    type="text"
                    name="cell"
                    value={deliveryAddress.cell}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={deliveryAddress.village}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="MTN Mobile Money"
                    checked={paymentMethod === 'MTN Mobile Money'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-secondary focus:ring-secondary"
                  />
                  <div>
                    <p className="font-semibold">MTN Mobile Money</p>
                    <p className="text-sm text-gray-500">Pay with MTN MoMo</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="Airtel Money"
                    checked={paymentMethod === 'Airtel Money'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-secondary focus:ring-secondary"
                  />
                  <div>
                    <p className="font-semibold">Airtel Money</p>
                    <p className="text-sm text-gray-500">Pay with Airtel Money</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="Bank Transfer"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-secondary focus:ring-secondary"
                  />
                  <div>
                    <p className="font-semibold">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Direct bank transfer</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Place Order - RWF ${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold">
                    RWF {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="font-semibold">
                  RWF {getCartTotal().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Delivery
                </span>
                <span className="font-semibold">RWF {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Service Fee (3%)</span>
                <span className="font-semibold">RWF {serviceFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-primary dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-bold text-secondary">
                    RWF {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
